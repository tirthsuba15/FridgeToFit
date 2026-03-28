const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const MODELS = {
  vision: "google/gemma-3-12b-it:free",
  text: "google/gemma-3-12b-it:free",
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
  const maxRetries = 3;
  const preparedMessages = foldSystemMessages(messages);

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ model, messages: preparedMessages }),
  });

  if (res.status === 429) {
    if (attempt < maxRetries) {
      const wait = Math.pow(2, attempt + 1) * 3000;
      console.error(`[aiCall] 429 rate limited, waiting ${wait}ms (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise((r) => setTimeout(r, wait));
      return aiCall(model, messages, attempt + 1);
    }
    throw new Error("Rate limited");
  }

  if (res.status === 500) {
    throw new Error("AI service unavailable");
  }

  if (!res.ok) {
    const errBody = await res.text();
    console.error(`[aiCall] HTTP ${res.status}:`, errBody);
    throw new Error(`OpenRouter error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

function parseJSON(raw, label) {
  const cleaned = raw.replace(/```json|```/gi, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
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
  const { recipes, tdee, macros, cuisines, dietary, budget } = params;

  const hasDietary = Array.isArray(dietary) && dietary.length > 0 &&
    !(dietary.length === 1 && dietary[0] === "none");
  const filteredRecipes = hasDietary
    ? recipes.filter(r =>
        dietary.every(flag => Array.isArray(r.dietary) && r.dietary.includes(flag))
      )
    : recipes;
  const validIds = filteredRecipes.map(r => r.recipe_id);

  const maxRepeats = filteredRecipes.length >= 11 ? 2
    : filteredRecipes.length >= 7 ? 3
    : Math.ceil(21 / filteredRecipes.length);

  const system =
    "You are a meal planning assistant. Generate a 7-day meal plan using ONLY recipes from the provided list.\n" +
    "STRICT RULES:\n" +
    `1. The ONLY valid recipe_ids you may use are: [${validIds.join(",")}]. Do NOT invent or use any other IDs.\n` +
    `2. No recipe repeats more than ${maxRepeats} times across the 7-day plan. Spread recipes as evenly as possible.\n` +
    "3. Vary cuisines — do not use the same cuisine_tag more than 2 days in a row.\n" +
    "4. Each day has 3 slots: breakfast, lunch, dinner.\n" +
    `5. Balance daily calories to approximately ${tdee} kcal/day.\n` +
    `6. All recipes in the provided list already comply with dietary restrictions: ${dietary}. Only use recipes from this list.\n` +
    `7. Stay within weekly budget: $${budget}.\n` +
    "8. Return ONLY valid JSON. No preamble, no explanation, no markdown fences.\n" +
    'Output format: {"days":[{"day":"Monday","meals":[{"slot":"breakfast","recipe_id":1,"recipe_name":"Oatmeal Bowl","prep_time_min":10}]}]}';

  const userMsg =
    `Recipe list (all dietary-compliant): ${JSON.stringify(filteredRecipes)}\n` +
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

module.exports = {
  visionExtract,
  generateMealPlan,
  swapMeal,
  generateSummary,
  generateWorkoutPlan,
};
