const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

const MODELS = {
  vision: "google/gemma-3-12b-it:free",
  text: "google/gemma-3-12b-it:free",
  openai: "gpt-4o-mini",
};

const HEADERS = {
  "Content-Type": "application/json",
  "HTTP-Referer": "https://fridgetofit.app",
  "X-Title": "FridgeToFit",
};

function authHeaders() {
  return {
    ...HEADERS,
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  };
}

function openaiHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  };
}

// ── SHARED HELPERS ──────────────────────────────────────────────────────────

function foldSystemMessages(messages) {
  const folded = [];
  let systemText = "";

  for (const msg of messages) {
    if (msg.role === "system") {
      systemText += (systemText ? "\n\n" : "") + msg.content;
    } else if (msg.role === "user" && systemText) {
      const userContent = typeof msg.content === "string"
        ? `[Instructions]\n${systemText}\n\n[User]\n${msg.content}`
        : [
            { type: "text", text: `[Instructions]\n${systemText}\n\n[User]` },
            ...(Array.isArray(msg.content) ? msg.content : [{ type: "text", text: msg.content }]),
          ];
      folded.push({ role: "user", content: userContent });
      systemText = "";
    } else {
      folded.push(msg);
    }
  }

  return folded;
}

async function aiCall(model, messages, attempt = 0) {
  const preparedMessages = foldSystemMessages(messages);

  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: openaiHeaders(),
    body: JSON.stringify({ model: MODELS.openai, messages: preparedMessages }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error(`[aiCall] OpenAI HTTP ${res.status}:`, errBody);
    throw new Error(`OpenAI error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

function parseJSON(raw, label) {
  const cleaned = raw.replace(/```json|```/gi, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try repairing truncated JSON by appending missing closing chars
    for (const suffix of ['}', ']}', '}]}', '}}]}', '}}}]}', '}}}}]}']) {
      try { return JSON.parse(cleaned + suffix); } catch {}
    }
    console.error(`[${label}] JSON parse failed. Raw:`, raw);
    return null;
  }
}

const RETRY_MSG = "Return ONLY valid JSON. No explanation, no backticks, no preamble.";

// ── FUNCTION 1: visionExtract ───────────────────────────────────────────────

async function visionExtract(base64Image) {
  const system =
    "You are a kitchen inventory scanner. Identify all visible food items in the image.\n" +
    "Return ONLY a valid JSON array of ingredient name strings. Use generic names\n" +
    "(e.g. 'chicken breast' not 'Tyson chicken').\n" +
    'Example: ["chicken breast","broccoli","cheddar cheese","eggs"]\n' +
    "No preamble, no explanation, no markdown fences. Only the JSON array.";

  const messages = [
    { role: "system", content: system },
    {
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${base64Image}` },
        },
        { type: "text", text: "What food items are visible in this image?" },
      ],
    },
  ];

  try {
    const raw = await aiCall(MODELS.vision, messages);
    const parsed = parseJSON(raw, "visionExtract");

    if (parsed !== null) {
      return { ingredients: parsed };
    }

    const retryMessages = [
      ...messages,
      { role: "assistant", content: raw },
      { role: "user", content: RETRY_MSG },
    ];
    const raw2 = await aiCall(MODELS.vision, retryMessages);
    const parsed2 = parseJSON(raw2, "visionExtract-retry");

    if (parsed2 === null) {
      throw new Error(`AI parse error in visionExtract: ${raw2}`);
    }

    return { ingredients: parsed2 };
  } catch (err) {
    console.error("[visionExtract] error:", err);
    throw err;
  }
}

// ── FUNCTION 2: generateMealPlan ────────────────────────────────────────────

async function generateMealPlan(params) {
  const { recipes, tdee, macros, cuisines, dietary, budget, owned_ingredients } = params;

  const filteredRecipes = recipes.length > 0 ? recipes : [];
  const freeMode = filteredRecipes.length === 0;

  const ownedList = owned_ingredients && owned_ingredients.length > 0
    ? owned_ingredients.join(', ')
    : null;

  // Build explicit dietary enforcement lines
  const dietaryList = Array.isArray(dietary) ? dietary : (dietary ? [dietary] : []);
  const dietaryRules = [];
  if (dietaryList.includes('vegetarian')) dietaryRules.push('VEGETARIAN: NO meat, poultry, or seafood in any meal. Eggs and dairy are allowed.');
  if (dietaryList.includes('vegan')) dietaryRules.push('VEGAN: NO animal products — no meat, poultry, seafood, dairy, eggs, or honey.');
  if (dietaryList.includes('gluten_free')) dietaryRules.push('GLUTEN-FREE: NO wheat, barley, rye, or gluten-containing ingredients.');
  if (dietaryList.includes('halal')) dietaryRules.push('HALAL: No pork or pork derivatives, no alcohol.');
  if (dietaryList.includes('kosher')) dietaryRules.push('KOSHER: No pork, no shellfish, do not mix meat and dairy.');
  const dietaryBlock = dietaryRules.length > 0
    ? `\nMANDATORY DIETARY RULES — every single meal must comply:\n${dietaryRules.map(r => `  - ${r}`).join('\n')}\n`
    : '';

  const system = freeMode
    ? "You are a creative meal planning assistant. Generate a diverse, realistic 7-day meal plan." +
      dietaryBlock + "\n" +
      "STRICT RULES:\n" +
      "1. Create 21 unique, realistic meals — varied across breakfast, lunch, and dinner.\n" +
      "2. No meal should repeat more than twice across the whole week.\n" +
      `3. Preferred cuisines: ${JSON.stringify(cuisines)}. Vary cuisines day to day.\n` +
      "4. Each day has exactly 3 slots: breakfast, lunch, dinner.\n" +
      `5. Balance daily calories to approximately ${tdee} kcal/day.\n` +
      `6. Stay within weekly budget: $${budget}.\n` +
      "7. Use recipe_id: null for all meals (no DB recipes). Make up realistic recipe names.\n" +
      "8. Include estimated macros for each meal: calories, protein_g, carbs_g, fat_g.\n" +
      (ownedList ? `9. The user already has these ingredients: ${ownedList}. Prioritize meals that use them.\n` : "") +
      "Return ONLY valid JSON. No preamble, no explanation, no markdown fences.\n" +
      'Output format: {"days":[{"day":"Monday","meals":[{"slot":"breakfast","recipe_id":null,"recipe_name":"Avocado Toast with Poached Eggs","prep_time_min":15,"macros":{"calories":420,"protein":14,"carbs":48,"fat":18}},{"slot":"lunch","recipe_id":null,"recipe_name":"Grilled Chicken Caesar Salad","prep_time_min":20,"macros":{"calories":510,"protein":42,"carbs":22,"fat":28}},{"slot":"dinner","recipe_id":null,"recipe_name":"Salmon with Roasted Vegetables","prep_time_min":30,"macros":{"calories":580,"protein":45,"carbs":35,"fat":24}}]}]}'
    : "You are a meal planning assistant. Generate a 7-day meal plan using ONLY recipes from the provided list.\n" +
      "STRICT RULES:\n" +
      `1. The ONLY valid recipe_ids you may use are: [${filteredRecipes.map(r => r.recipe_id).join(",")}]. Do NOT invent or use any other IDs.\n` +
      `2. No recipe repeats more than ${filteredRecipes.length >= 11 ? 2 : filteredRecipes.length >= 7 ? 3 : Math.ceil(21 / filteredRecipes.length)} times across the 7-day plan.\n` +
      "3. Vary cuisines — do not use the same cuisine_tag more than 2 days in a row.\n" +
      "4. Each day has 3 slots: breakfast, lunch, dinner.\n" +
      `5. Balance daily calories to approximately ${tdee} kcal/day.\n` +
      `6. All recipes in the provided list already comply with dietary restrictions: ${dietary}. Only use recipes from this list.\n` +
      `7. Stay within weekly budget: $${budget}.\n` +
      "8. Return ONLY valid JSON. No preamble, no explanation, no markdown fences.\n" +
      'Output format: {"days":[{"day":"Monday","meals":[{"slot":"breakfast","recipe_id":1,"recipe_name":"Oatmeal Bowl","prep_time_min":10}]}]}';

  const userMsg = freeMode
    ? `User profile: TDEE=${tdee} kcal, macros=${JSON.stringify(macros)},\n` +
      `preferred cuisines=${JSON.stringify(cuisines)}, dietary restrictions=${dietary},\n` +
      `weekly budget=$${budget}.\n` +
      "Generate a creative, diverse 7-day meal plan now."
    : `Recipe list (all dietary-compliant): ${JSON.stringify(filteredRecipes)}\n` +
      `User profile: TDEE=${tdee} kcal, macros=${JSON.stringify(macros)},\n` +
      `preferred cuisines=${cuisines}, dietary restrictions=${dietary},\n` +
      `weekly budget=$${budget}.\n` +
      "Generate the 7-day meal plan now.";

  const messages = [
    { role: "system", content: system },
    { role: "user", content: userMsg },
  ];

  try {
    const raw = await aiCall(MODELS.text, messages);
    const parsed = parseJSON(raw, "generateMealPlan");

    if (parsed !== null) {
      return parsed;
    }

    const retryMessages = [
      ...messages,
      { role: "assistant", content: raw },
      { role: "user", content: RETRY_MSG },
    ];
    const raw2 = await aiCall(MODELS.text, retryMessages);
    const parsed2 = parseJSON(raw2, "generateMealPlan-retry");

    if (parsed2 === null) {
      throw new Error(`AI parse error in generateMealPlan: ${raw2}`);
    }

    return parsed2;
  } catch (err) {
    console.error("[generateMealPlan] error:", err);
    throw err;
  }
}

// ── FUNCTION 2b: generateRecipe ─────────────────────────────────────────────

async function generateRecipe(mealName) {
  const system =
    "You are a chef. Given a meal name, write a concise recipe.\n" +
    "Return ONLY valid JSON. No preamble, no markdown fences.\n" +
    'Output format: {"ingredients":["2 chicken breasts","1 cup rice","..."],"steps":["Heat oil in pan","Add chicken...","..."]}';
  const userMsg = `Write a recipe for: ${mealName}`;
  const messages = [
    { role: "system", content: system },
    { role: "user", content: userMsg },
  ];
  try {
    const raw = await aiCall(MODELS.openai, messages);
    return parseJSON(raw, "generateRecipe") || { ingredients: [], steps: [] };
  } catch (err) {
    console.error("[generateRecipe] error:", err.message);
    return { ingredients: [], steps: [] };
  }
}

// ── FUNCTION 3b: generateSingleMeal (freeMode swap) ─────────────────────────

async function generateSingleMeal(params) {
  const { slot, current_name, dietary } = params;
  const system =
    "You are a creative meal planning assistant. Generate ONE new meal to replace an existing one.\n" +
    "The replacement must be different from the current meal.\n" +
    "Return ONLY valid JSON. No preamble, no markdown fences.\n" +
    'Output format: {"recipe_name":"Grilled Salmon with Asparagus","prep_time_min":25,"macros":{"calories":520,"protein":42,"carbs":18,"fat":28}}';
  const userMsg =
    `Meal slot: ${slot}\nCurrent meal to replace: ${current_name}\nDietary restrictions: ${JSON.stringify(dietary)}\nGenerate a different meal now.`;
  const messages = [
    { role: "system", content: system },
    { role: "user", content: userMsg },
  ];
  try {
    const raw = await aiCall(MODELS.openai, messages);
    return parseJSON(raw, "generateSingleMeal") || { recipe_name: "Chef's Special", prep_time_min: 20, macros: { calories: 500, protein: 35, carbs: 45, fat: 20 } };
  } catch (err) {
    console.error("[generateSingleMeal] error:", err.message);
    return { recipe_name: "Chef's Special", prep_time_min: 20, macros: { calories: 500, protein: 35, carbs: 45, fat: 20 } };
  }
}

// ── FUNCTION 3: swapMeal ────────────────────────────────────────────────────

async function swapMeal(params) {
  const { current_recipe, slot, user_dietary, macro_remaining, matched_pool } = params;

  const system =
    "You are a meal swap assistant. Select the best replacement meal from the provided pool.\n" +
    "STRICT RULES:\n" +
    "1. ONLY select from the provided matched_pool. Do NOT invent recipes.\n" +
    "2. Replacement must fit the meal slot (breakfast/lunch/dinner).\n" +
    "3. Respect dietary restrictions.\n" +
    "4. Choose the recipe that best fills the remaining macro budget.\n" +
    "5. Return ONLY valid JSON. No preamble, no markdown fences.\n" +
    'Output format: {"recipe_id":14,"recipe_name":"Turkey Lettuce Wraps","prep_time_min":12}';

  const userMsg =
    `Current meal: ${JSON.stringify(current_recipe)}\n` +
    `Slot: ${slot}\n` +
    `Dietary restrictions: ${user_dietary}\n` +
    `Remaining macro budget for today: ${JSON.stringify(macro_remaining)}\n` +
    `Available replacements: ${JSON.stringify(matched_pool)}\n` +
    "Select the best swap.";

  const messages = [
    { role: "system", content: system },
    { role: "user", content: userMsg },
  ];

  try {
    const raw = await aiCall(MODELS.text, messages);
    const parsed = parseJSON(raw, "swapMeal");

    if (parsed !== null) {
      return parsed;
    }

    const retryMessages = [
      ...messages,
      { role: "assistant", content: raw },
      { role: "user", content: RETRY_MSG },
    ];
    const raw2 = await aiCall(MODELS.text, retryMessages);
    const parsed2 = parseJSON(raw2, "swapMeal-retry");

    if (parsed2 === null) {
      throw new Error(`AI parse error in swapMeal: ${raw2}`);
    }

    return parsed2;
  } catch (err) {
    console.error("[swapMeal] error:", err);
    throw err;
  }
}

// ── FUNCTION 4: generateSummary ─────────────────────────────────────────────

async function generateSummary(params) {
  const { goal, cuisine_choices, budget, weekly_avg_calories } = params;

  const system =
    "You are a friendly fitness and nutrition coach writing a short personalized summary.\n" +
    "Write exactly 3 sentences explaining why this meal plan suits the user.\n" +
    "Mention: their goal, their cuisine preferences, and how meal prepping saves money vs ordering DoorDash.\n" +
    "Be warm, specific, and motivating. No bullet points.\n" +
    "Return ONLY valid JSON. No preamble, no markdown fences.\n" +
    'Output format: {"summary":"Your 3-sentence summary here."}';

  const userMsg =
    `User goal: ${goal}\n` +
    `Cuisine preferences: ${cuisine_choices}\n` +
    `Weekly budget: $${budget}\n` +
    `Average weekly calories: ${weekly_avg_calories} kcal/day\n` +
    "Generate the summary now.";

  const messages = [
    { role: "system", content: system },
    { role: "user", content: userMsg },
  ];

  try {
    const raw = await aiCall(MODELS.text, messages);
    const parsed = parseJSON(raw, "generateSummary");

    if (parsed !== null) {
      return parsed;
    }

    const retryMessages = [
      ...messages,
      { role: "assistant", content: raw },
      { role: "user", content: RETRY_MSG },
    ];
    const raw2 = await aiCall(MODELS.text, retryMessages);
    const parsed2 = parseJSON(raw2, "generateSummary-retry");

    if (parsed2 === null) {
      throw new Error(`AI parse error in generateSummary: ${raw2}`);
    }

    return parsed2;
  } catch (err) {
    console.error("[generateSummary] error:", err);
    throw err;
  }
}

// ── FUNCTION 5: generateWorkoutPlan ─────────────────────────────────────────

async function generateWorkoutPlan(params) {
  const { goal, activity_level, equipment, tdee } = params;

  const system =
    "You are an expert personal trainer. Generate a 7-day workout plan tailored to the user's goal, " +
    "activity level, and available equipment.\n\n" +
    "EQUIPMENT RULES (STRICT — never violate):\n" +
    "- If equipment contains ONLY 'Bodyweight Only': use ONLY bodyweight exercises " +
    "(push-ups, pull-ups, squats, lunges, planks, burpees, mountain climbers, dips). Zero barbell or dumbbell movements.\n" +
    "- If equipment includes 'Dumbbells': use dumbbell variants (DB bench press, DB rows, DB Romanian deadlift, DB shoulder press, etc.).\n" +
    "- If equipment includes 'Resistance Bands': include band pull-aparts, banded squats, banded rows, etc.\n" +
    "- If equipment includes 'Full Gym': barbell compound lifts are allowed (squat, deadlift, bench press, barbell row).\n" +
    "- Never recommend equipment not in the user's list.\n\n" +
    "GOAL RULES (CRITICAL — apply rep ranges to EVERY exercise with ZERO exceptions):\n" +
    "- bulk: EVERY exercise must use 4-8 reps. No exercise may exceed 8 reps. This includes isolation exercises like calf raises (4x8), lateral raises (4x8), face pulls (4x8), curls (3x6), russian twists (3x8), ab exercises (3x8). Use 3-5 sets. 1-2 rest days. Add progressive overload notes.\n" +
    "- cut: EVERY exercise must use 12-15 reps. No exercise may go below 12 reps. Use 3 sets. Include HIIT finisher notes on training days. 1 rest day.\n" +
    "- maintain: EVERY exercise must use 8-12 reps. Use 3-4 sets. 2 rest days.\n" +
    "- athletic: functional movements (box jumps, jump squats if no sled). 2 rest days.\n\n" +
    "ACTIVITY LEVEL RULES (STRICT — you MUST match the exact rest day count):\n" +
    "- Sedentary: exactly 3 training days and exactly 4 rest days.\n" +
    "- Lightly Active: exactly 4 training days and exactly 3 rest days.\n" +
    "- Moderately Active: 4-5 training days and 2-3 rest days.\n" +
    "- Very Active: 5-6 training days and 1-2 rest days.\n" +
    "Count your training and rest days before responding to ensure they match.\n\n" +
    "STRUCTURE RULES:\n" +
    "- Output all 7 days: Monday through Sunday.\n" +
    "- Rest days: rest=true, focus='Rest', exercises=[].\n" +
    "- Training days: rest=false, focus=one of [Push, Pull, Legs, Full Body, Upper, Lower, Cardio, Core].\n" +
    "- Never repeat the same focus on consecutive training days.\n" +
    "- Return ONLY valid JSON. No preamble, no explanation, no markdown fences.\n\n" +
    'Output format: {"days":[{"day":"Monday","focus":"Push","rest":false,"exercises":[{"name":"Dumbbell Bench Press","sets":3,"reps":"8-10","notes":"Control the descent"}]},' +
    '{"day":"Tuesday","focus":"Rest","rest":true,"exercises":[]}]}';

  const userMsg =
    `Goal: ${goal}\n` +
    `Activity level: ${activity_level}\n` +
    `Equipment available: ${JSON.stringify(equipment)}\n` +
    `TDEE: ${tdee} kcal/day\n` +
    "Generate the 7-day workout plan now.";

  const messages = [
    { role: "system", content: system },
    { role: "user", content: userMsg },
  ];

  try {
    const raw = await aiCall(MODELS.text, messages);
    let parsed = parseJSON(raw, "generateWorkoutPlan");

    if (parsed === null) {
      const retryMessages = [
        ...messages,
        { role: "assistant", content: raw },
        { role: "user", content: RETRY_MSG },
      ];
      const raw2 = await aiCall(MODELS.text, retryMessages);
      parsed = parseJSON(raw2, "generateWorkoutPlan-retry");

      if (parsed === null) {
        throw new Error(`AI parse error in generateWorkoutPlan: ${raw2}`);
      }
    }

    if (!parsed.days || parsed.days.length !== 7) {
      const fixMessages = [
        ...messages,
        { role: "assistant", content: JSON.stringify(parsed) },
        {
          role: "user",
          content:
            "Your response did not contain exactly 7 days. Return ONLY valid JSON with exactly " +
            "7 days (Monday-Sunday). No preamble, no backticks.",
        },
      ];
      const raw3 = await aiCall(MODELS.text, fixMessages);
      const parsed3 = parseJSON(raw3, "generateWorkoutPlan-7day-fix");

      if (parsed3 === null || !parsed3.days || parsed3.days.length !== 7) {
        throw new Error(`AI returned invalid workout plan (not 7 days): ${raw3}`);
      }

      return { days: parsed3.days };
    }

    return { days: parsed.days };
  } catch (err) {
    console.error("[generateWorkoutPlan] error:", err);
    throw err;
  }
}

// ── FUNCTION 6: generateGroceryList ─────────────────────────────────────────

async function generateGroceryList(mealNames) {
  const system =
    "You are a grocery planning assistant. Given a list of meal names, generate a realistic weekly grocery list.\n" +
    "Group items by aisle: produce, protein, dairy, grains, pantry, frozen.\n" +
    "For each item use REAL grocery store quantities (e.g. '1 bunch', '2 lbs', '1 dozen', '1 can (15oz)', '2 cups', '1 loaf', '3 fillets') — NOT grams.\n" +
    "Estimate a realistic cost in USD per that store quantity.\n" +
    "Return ONLY valid JSON. No preamble, no markdown fences.\n" +
    'Output format: {"produce":[{"name":"Spinach","quantity":"1 bag (5oz)","estimated_cost_usd":3.49}],"protein":[{"name":"Chicken Breast","quantity":"2 lbs","estimated_cost_usd":8.99}],"dairy":[...],"grains":[...],"pantry":[...],"frozen":[]}';

  const userMsg = `Meals for this week:\n${mealNames.join('\n')}\n\nGenerate the grocery list now.`;

  const messages = [
    { role: "system", content: system },
    { role: "user", content: userMsg },
  ];

  try {
    const raw = await aiCall(MODELS.openai, messages);
    const parsed = parseJSON(raw, "generateGroceryList");
    return parsed || {};
  } catch (err) {
    console.error("[generateGroceryList] error:", err.message);
    return {};
  }
}

module.exports = {
  visionExtract,
  generateMealPlan,
  generateRecipe,
  swapMeal,
  generateSingleMeal,
  generateSummary,
  generateWorkoutPlan,
  generateGroceryList,
};
