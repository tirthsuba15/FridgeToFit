const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const MODELS = {
  vision: "google/gemini-2.0-flash-exp:free",
  text: "mistralai/mistral-7b-instruct:free",
};

const HEADERS = {
  "Content-Type": "application/json",
  "HTTP-Referer": "https://fridgetofit.app",
};

function authHeaders() {
  return {
    ...HEADERS,
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  };
}

function stripFences(raw) {
  return raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
}

async function chatCompletion(model, systemPrompt, userContent) {
  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
  };

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter HTTP ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

function safeParse(raw, fnName) {
  const cleaned = stripFences(raw);
  try {
    return JSON.parse(cleaned);
  } catch {
    console.error(`[${fnName}] raw response:`, raw);
    throw new Error(`AI parse error in ${fnName}: ${raw}`);
  }
}

// ── FUNCTION 1 ──────────────────────────────────────────────────────────────

async function visionExtract(base64Image) {
  const system =
    "You are a kitchen inventory scanner. Identify all visible food items in the image. " +
    "Return ONLY a valid JSON array of ingredient name strings. Use generic names " +
    '(e.g. \'chicken breast\' not \'Tyson chicken\'). Example: ["chicken breast","broccoli","cheddar cheese","eggs"]. ' +
    "No preamble, no explanation, no markdown fences. Only the JSON array.";

  const userContent = [
    {
      type: "image_url",
      image_url: { url: `data:image/jpeg;base64,${base64Image}` },
    },
    { type: "text", text: "What food items are visible in this image?" },
  ];

  const body = {
    model: MODELS.vision,
    messages: [
      { role: "system", content: system },
      { role: "user", content: userContent },
    ],
  };

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenRouter HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();
    const raw = data.choices[0].message.content;
    const parsed = safeParse(raw, "visionExtract");
    return { ingredients: parsed };
  } catch (err) {
    console.error("[visionExtract] error:", err);
    throw err;
  }
}

// ── FUNCTION 2 ──────────────────────────────────────────────────────────────

async function generateMealPlan({ recipes, tdee, macros, cuisines, dietary, budget }) {
  const system =
    "You are a meal planning assistant. You will receive a list of recipes and user profile data. " +
    "Generate a 7-day meal plan using ONLY recipes from the provided list. " +
    "STRICT RULES: " +
    "1. You MUST only select recipe_ids from the provided JSON recipe list. Do NOT invent recipe names or IDs. " +
    "2. No recipe should repeat more than twice across the 7-day plan. " +
    "3. Vary cuisines across days — do not use the same cuisine_tag more than 2 days in a row. " +
    "4. Each day has 3 slots: breakfast, lunch, dinner. " +
    `5. Balance daily calories to approximately ${tdee} kcal/day. ` +
    `6. Respect all dietary restrictions: ${dietary}. ` +
    `7. Stay within weekly budget: ${budget}. ` +
    "8. Return ONLY valid JSON. No preamble, no explanation, no markdown fences. " +
    'Output format: {"days":[{"day":"Monday","meals":[{"slot":"breakfast","recipe_id":1,"recipe_name":"Oatmeal Bowl","prep_time_min":10}]}]}';

  const recipesJSON = JSON.stringify(recipes);
  const user =
    `Recipe list: ${recipesJSON}\n` +
    `User profile: TDEE=${tdee} kcal, macros=${macros}, preferred cuisines=${cuisines}, ` +
    `dietary restrictions=${dietary}, weekly budget=$${budget}.\n` +
    "Generate the 7-day meal plan now.";

  try {
    const raw = await chatCompletion(MODELS.text, system, user);
    return safeParse(raw, "generateMealPlan");
  } catch (err) {
    console.error("[generateMealPlan] error:", err);
    throw err;
  }
}

// ── FUNCTION 3 ──────────────────────────────────────────────────────────────

async function swapMeal({ current_recipe, slot, user_dietary, macro_remaining, matched_pool }) {
  const system =
    "You are a meal swap assistant. A user wants to replace one meal in their plan. " +
    "Select the best replacement from the provided pool of recipes. " +
    "STRICT RULES: " +
    "1. ONLY select from the provided matched_pool. Do NOT invent recipes. " +
    "2. The replacement must fit the meal slot (breakfast/lunch/dinner). " +
    "3. Respect the user's dietary restrictions. " +
    "4. Choose the recipe that best fills the remaining macro budget for that day. " +
    "5. Return ONLY valid JSON. No preamble, no markdown fences. " +
    'Output format: {"recipe_id":14,"recipe_name":"Turkey Lettuce Wraps","prep_time_min":12}';

  const user =
    `Current meal: ${JSON.stringify(current_recipe)}\n` +
    `Slot: ${slot}\n` +
    `Dietary restrictions: ${user_dietary}\n` +
    `Remaining macro budget for today: ${JSON.stringify(macro_remaining)}\n` +
    `Available replacements: ${JSON.stringify(matched_pool)}\n` +
    "Select the best swap.";

  try {
    const raw = await chatCompletion(MODELS.text, system, user);
    return safeParse(raw, "swapMeal");
  } catch (err) {
    console.error("[swapMeal] error:", err);
    throw err;
  }
}

// ── FUNCTION 4 ──────────────────────────────────────────────────────────────

async function generateSummary({ goal, cuisine_choices, budget, weekly_avg_calories }) {
  const system =
    "You are a friendly fitness and nutrition coach writing a short personalized summary. " +
    "Write exactly 3 sentences explaining why this meal plan suits the user. " +
    "Mention: their goal, their cuisine preferences, and how meal prepping saves money vs ordering DoorDash. " +
    "Be warm, specific, and motivating. Do not use bullet points. " +
    "Return ONLY valid JSON. No preamble, no markdown fences. " +
    'Output format: {"summary":"Your 3-sentence summary here."}';

  const user =
    `User goal: ${goal}\n` +
    `Cuisine preferences: ${cuisine_choices}\n` +
    `Weekly budget: $${budget}\n` +
    `Average weekly calories: ${weekly_avg_calories} kcal/day\n` +
    "Generate the summary now.";

  try {
    const raw = await chatCompletion(MODELS.text, system, user);
    return safeParse(raw, "generateSummary");
  } catch (err) {
    console.error("[generateSummary] error:", err);
    throw err;
  }
}

// ── FUNCTION 5 ──────────────────────────────────────────────────────────────

async function generateWorkoutPlan({ goal, activity_level, equipment, tdee }) {
  const system =
    "You are an expert personal trainer. Generate a 7-day workout plan tailored to the user's goal, " +
    "activity level, and available equipment.\n\n" +
    "EQUIPMENT RULES (STRICT — never violate):\n" +
    "- If equipment list contains ONLY 'Bodyweight Only': use ONLY bodyweight exercises " +
    "(push-ups, pull-ups, squats, lunges, planks, burpees, mountain climbers, dips). Zero barbell or dumbbell movements.\n" +
    "- If equipment includes 'Dumbbells': use dumbbell variants (DB bench press, DB rows, DB Romanian deadlift, DB shoulder press, etc.).\n" +
    "- If equipment includes 'Resistance Bands': include band pull-aparts, banded squats, banded rows, etc.\n" +
    "- If equipment includes 'Full Gym': barbell compound lifts are allowed (squat, deadlift, bench press, barbell row).\n" +
    "- Never recommend equipment not in the user's list.\n\n" +
    "GOAL RULES:\n" +
    "- bulk: heavy compound lifts, 3-5 sets of 4-8 reps, 1-2 rest days, prioritize progressive overload notes.\n" +
    "- cut: circuit-style, 3 sets of 12-15 reps, include HIIT finisher notes on training days, 1 rest day.\n" +
    "- maintain: moderate volume, 3-4 sets of 8-12 reps, 2 rest days.\n" +
    "- athletic: functional movements (box jumps — if no equipment for sled, substitute jump squats), 2 rest days.\n\n" +
    "ACTIVITY LEVEL RULES:\n" +
    "- Sedentary: 3 training days, 4 rest days.\n" +
    "- Lightly Active: 4 training days, 3 rest days.\n" +
    "- Moderately Active: 4-5 training days, 2-3 rest days.\n" +
    "- Very Active: 5-6 training days, 1-2 rest days.\n\n" +
    "STRUCTURE RULES:\n" +
    "- Always output all 7 days (Monday through Sunday).\n" +
    "- Rest days: set rest=true, focus='Rest', exercises=[].\n" +
    "- Training days: rest=false, focus=one of [Push, Pull, Legs, Full Body, Upper, Lower, Cardio, Core].\n" +
    "- Vary focus across training days — do not repeat the same focus 2 days in a row.\n" +
    "- Return ONLY valid JSON. No preamble, no explanation, no markdown fences.\n\n" +
    'Output format: {"days":[{"day":"Monday","focus":"Push","rest":false,"exercises":[{"name":"Dumbbell Bench Press","sets":3,"reps":"8-10","notes":"Control the descent"}]},' +
    '{"day":"Tuesday","focus":"Rest","rest":true,"exercises":[]}]}';

  const user =
    `Goal: ${goal}\n` +
    `Activity level: ${activity_level}\n` +
    `Equipment available: ${JSON.stringify(equipment)}\n` +
    `TDEE: ${tdee} kcal/day\n` +
    "Generate the 7-day workout plan now.";

  try {
    const raw = await chatCompletion(MODELS.text, system, user);
    const parsed = safeParse(raw, "generateWorkoutPlan");
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
