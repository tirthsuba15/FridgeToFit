require("dotenv").config();

const {
  visionExtract,
  generateMealPlan,
  swapMeal,
  generateSummary,
  generateWorkoutPlan,
} = require("./prompt");

// ── SHARED RECIPE POOL ──────────────────────────────────────────────────────

const RECIPE_POOL = [
  { recipe_id:1,  name:"Oatmeal Bowl",             cuisine_tag:"american",      prep_time_min:10, dietary:["vegan","gluten-free"] },
  { recipe_id:2,  name:"Grilled Chicken Salad",     cuisine_tag:"american",      prep_time_min:15, dietary:[] },
  { recipe_id:3,  name:"Salmon Stir Fry",           cuisine_tag:"asian",         prep_time_min:25, dietary:["gluten-free"] },
  { recipe_id:4,  name:"Black Bean Tacos",          cuisine_tag:"mexican",       prep_time_min:20, dietary:["vegan","gluten-free"] },
  { recipe_id:5,  name:"Greek Yogurt Parfait",      cuisine_tag:"mediterranean", prep_time_min:5,  dietary:["gluten-free"] },
  { recipe_id:6,  name:"Pad Thai",                  cuisine_tag:"thai",          prep_time_min:30, dietary:["vegan"] },
  { recipe_id:7,  name:"Mango Lassi Smoothie",      cuisine_tag:"indian",        prep_time_min:5,  dietary:["vegan","gluten-free"] },
  { recipe_id:8,  name:"Chana Masala",              cuisine_tag:"indian",        prep_time_min:35, dietary:["vegan","gluten-free"] },
  { recipe_id:9,  name:"Lentil Soup",               cuisine_tag:"middle-eastern",prep_time_min:40, dietary:["vegan","halal","gluten-free"] },
  { recipe_id:10, name:"Chicken Shawarma Bowl",     cuisine_tag:"middle-eastern",prep_time_min:30, dietary:["halal","gluten-free"] },
  { recipe_id:11, name:"Beef Kofta Wrap",           cuisine_tag:"middle-eastern",prep_time_min:25, dietary:["halal"] },
  { recipe_id:12, name:"Chicken Burrito Bowl",      cuisine_tag:"mexican",       prep_time_min:20, dietary:["halal","gluten-free"] },
  { recipe_id:13, name:"Miso Soup + Rice",          cuisine_tag:"japanese",      prep_time_min:15, dietary:["vegan","gluten-free"] },
  { recipe_id:14, name:"Korean Bibimbap",           cuisine_tag:"korean",        prep_time_min:30, dietary:["gluten-free"] },
  { recipe_id:15, name:"Tofu Scramble",             cuisine_tag:"american",      prep_time_min:15, dietary:["vegan","gluten-free"] },
  { recipe_id:16, name:"Pasta Primavera",           cuisine_tag:"italian",       prep_time_min:25, dietary:["vegan"] },
  { recipe_id:17, name:"Chicken Parmesan",          cuisine_tag:"italian",       prep_time_min:35, dietary:[] },
  { recipe_id:18, name:"Beef Bolognese",            cuisine_tag:"italian",       prep_time_min:45, dietary:[] },
  { recipe_id:19, name:"Protein Pancakes",          cuisine_tag:"american",      prep_time_min:20, dietary:["gluten-free"] },
  { recipe_id:20, name:"Overnight Oats",            cuisine_tag:"american",      prep_time_min:5,  dietary:["vegan","gluten-free"] },
  { recipe_id:21, name:"Tuna Rice Bowl",            cuisine_tag:"japanese",      prep_time_min:10, dietary:["gluten-free"] },
  { recipe_id:22, name:"Spicy Ramen",               cuisine_tag:"japanese",      prep_time_min:20, dietary:[] },
  { recipe_id:23, name:"Veggie Bibimbap",           cuisine_tag:"korean",        prep_time_min:25, dietary:["vegan","gluten-free"] },
  { recipe_id:24, name:"Kimchi Fried Rice",         cuisine_tag:"korean",        prep_time_min:15, dietary:["vegan"] },
  { recipe_id:25, name:"Chicken Caesar Wrap",       cuisine_tag:"american",      prep_time_min:10, dietary:[] },
  { recipe_id:26, name:"Steak + Sweet Potato",      cuisine_tag:"american",      prep_time_min:30, dietary:["gluten-free"] },
  { recipe_id:27, name:"Barbell Squat Meal Prep",   cuisine_tag:"american",      prep_time_min:40, dietary:["gluten-free"] },
  { recipe_id:28, name:"Smoothie Bowl",             cuisine_tag:"american",      prep_time_min:10, dietary:["vegan","gluten-free"] },
  { recipe_id:29, name:"Egg White Omelette",        cuisine_tag:"american",      prep_time_min:10, dietary:["gluten-free"] },
  { recipe_id:30, name:"Chickpea Curry",            cuisine_tag:"indian",        prep_time_min:35, dietary:["vegan","halal","gluten-free"] },
];

// ── VALIDATORS ──────────────────────────────────────────────────────────────

function validateMealPlan(result, profile, label) {
  const errors = [];
  const allMeals = result.days.flatMap(d => d.meals);

  if (result.days.length !== 7)
    errors.push(`Day count: expected 7, got ${result.days.length}`);

  for (const day of result.days) {
    if (day.meals.length !== 3)
      errors.push(`${day.day}: expected 3 meals, got ${day.meals.length}`);
  }

  if (allMeals.length !== 21)
    errors.push(`Total meals: expected 21, got ${allMeals.length}`);

  const validIds = new Set(RECIPE_POOL.map(r => r.recipe_id));
  for (const m of allMeals) {
    if (!validIds.has(m.recipe_id))
      errors.push(`Hallucinated recipe_id: ${m.recipe_id} (${m.recipe_name})`);
  }

  // Dynamic max repeats based on pool size after dietary filtering
  const hasDietary = Array.isArray(profile.dietary) && profile.dietary.length > 0 &&
    !(profile.dietary.length === 1 && profile.dietary[0] === "none");
  const filteredPool = hasDietary
    ? RECIPE_POOL.filter(r => profile.dietary.every(flag => Array.isArray(r.dietary) && r.dietary.includes(flag)))
    : RECIPE_POOL;
  const maxRepeats = filteredPool.length >= 11 ? 2
    : filteredPool.length >= 7 ? 3
    : Math.ceil(21 / filteredPool.length);

  const idCounts = {};
  for (const m of allMeals) {
    idCounts[m.recipe_id] = (idCounts[m.recipe_id] || 0) + 1;
    if (idCounts[m.recipe_id] > maxRepeats)
      errors.push(`Recipe ${m.recipe_id} (${m.recipe_name}) appears ${idCounts[m.recipe_id]} times (max ${maxRepeats})`);
  }

  if (profile.dietary.length > 0) {
    for (const m of allMeals) {
      const recipe = RECIPE_POOL.find(r => r.recipe_id === m.recipe_id);
      if (!recipe) continue;
      for (const flag of profile.dietary) {
        if (!recipe.dietary.includes(flag))
          errors.push(`Dietary violation: ${m.recipe_name} is not ${flag}`);
      }
    }
  }

  if (errors.length === 0) {
    console.log(`  ✅ ${label}: PASS (21 meals, no violations)`);
  } else {
    console.log(`  ❌ ${label}: FAIL`);
    errors.forEach(e => console.log(`     → ${e}`));
  }
  return errors;
}

function validateWorkoutPlan(result, params, label) {
  const errors = [];

  if (result.days.length !== 7)
    errors.push(`Day count: expected 7, got ${result.days.length}`);

  const dayNames = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  for (const name of dayNames) {
    if (!result.days.find(d => d.day === name))
      errors.push(`Missing day: ${name}`);
  }

  const restDays = result.days.filter(d => d.rest === true).length;
  const activityRestMap = {
    "Sedentary": [3, 4, 5], "Lightly Active": [2, 3, 4],
    "Moderately Active": [2, 3], "Very Active": [1, 2],
  };
  const expected = activityRestMap[params.activity_level];
  const restOk = expected.includes(restDays);
  if (!restOk)
    errors.push(`Rest days: expected one of ${JSON.stringify(expected)}, got ${restDays}`);

  for (const day of result.days.filter(d => d.rest)) {
    if (day.exercises.length > 0)
      errors.push(`${day.day} is rest but has exercises`);
  }

  const hasBodyweightOnly = params.equipment.length === 1 &&
    params.equipment[0] === "Bodyweight Only";
  const hasFullGym = params.equipment.includes("Full Gym");

  const barbellKeywords = ["barbell", "squat rack"];
  const dumbbellKeywords = ["dumbbell", "db "];

  for (const day of result.days.filter(d => !d.rest)) {
    for (const ex of day.exercises) {
      const nameLower = ex.name.toLowerCase();
      if (hasBodyweightOnly) {
        if (barbellKeywords.some(k => nameLower.includes(k)))
          errors.push(`Bodyweight-only violation: barbell exercise "${ex.name}" on ${day.day}`);
        if (dumbbellKeywords.some(k => nameLower.includes(k)))
          errors.push(`Bodyweight-only violation: dumbbell exercise "${ex.name}" on ${day.day}`);
      }
      if (!hasFullGym && !hasBodyweightOnly) {
        if (barbellKeywords.some(k => nameLower.includes(k)))
          errors.push(`Equipment violation: barbell exercise "${ex.name}" but no Full Gym`);
      }
    }
  }

  const timeKeywords = ["second", "sec", "minute", "min", "hold"];
  for (const day of result.days.filter(d => !d.rest)) {
    for (const ex of day.exercises) {
      const repsStr = String(ex.reps || "");
      // Skip time-based exercises (planks, holds, etc.)
      if (timeKeywords.some(k => repsStr.toLowerCase().includes(k))) continue;
      const nums = repsStr.match(/\d+/g);
      if (!nums || nums.length === 0) continue;

      if (params.goal === "bulk") {
        const maxRep = parseInt(nums[nums.length - 1]);
        if (maxRep > 10)
          errors.push(`Bulk goal: "${ex.name}" has high rep range "${ex.reps}" (expected ≤10)`);
      }
      if (params.goal === "cut") {
        const minRep = parseInt(nums[0]);
        if (minRep < 10)
          errors.push(`Cut goal: "${ex.name}" has low rep range "${ex.reps}" (expected ≥10)`);
      }
    }
  }

  if (errors.length === 0) {
    console.log(`  ✅ ${label}: PASS`);
  } else {
    console.log(`  ❌ ${label}: FAIL`);
    errors.forEach(e => console.log(`     → ${e}`));
  }
  return errors;
}

// ── MEAL PLAN PROFILES ──────────────────────────────────────────────────────

const MEAL_PROFILES = [
  {
    label: "Profile 1 — Vegan college student",
    params: {
      recipes: RECIPE_POOL,
      tdee: 1800,
      macros: { protein: 90, carbs: 225, fat: 60 },
      cuisines: ["thai", "indian"],
      dietary: ["vegan"],
      budget: 50,
    },
  },
  {
    label: "Profile 2 — Halal family cook",
    params: {
      recipes: RECIPE_POOL,
      tdee: 2800,
      macros: { protein: 210, carbs: 280, fat: 93 },
      cuisines: ["middle-eastern", "mexican"],
      dietary: ["halal"],
      budget: 100,
    },
  },
  {
    label: "Profile 3 — Gluten-free runner",
    params: {
      recipes: RECIPE_POOL,
      tdee: 2100,
      macros: { protein: 130, carbs: 262, fat: 70 },
      cuisines: ["japanese", "korean"],
      dietary: ["gluten-free"],
      budget: 75,
    },
  },
  {
    label: "Profile 4 — Bulking athlete",
    params: {
      recipes: RECIPE_POOL,
      tdee: 3200,
      macros: { protein: 240, carbs: 320, fat: 107 },
      cuisines: ["italian", "american"],
      dietary: [],
      budget: 120,
    },
  },
  {
    label: "Profile 5 — Budget student",
    params: {
      recipes: RECIPE_POOL,
      tdee: 2000,
      macros: { protein: 100, carbs: 250, fat: 67 },
      cuisines: ["american"],
      dietary: [],
      budget: 45,
    },
  },
];

// ── WORKOUT CONFIGS ─────────────────────────────────────────────────────────

const WORKOUT_CONFIGS = [
  { label: "WK1 — Bodyweight cut",          params: { goal: "cut",      activity_level: "Moderately Active", equipment: ["Bodyweight Only"],              tdee: 1900 } },
  { label: "WK2 — Dumbbells+Bands maintain", params: { goal: "maintain", activity_level: "Lightly Active",    equipment: ["Dumbbells", "Resistance Bands"], tdee: 2200 } },
  { label: "WK3 — Full Gym bulk",            params: { goal: "bulk",     activity_level: "Very Active",       equipment: ["Full Gym"],                     tdee: 3200 } },
  { label: "WK4 — Dumbbells bulk",           params: { goal: "bulk",     activity_level: "Moderately Active", equipment: ["Dumbbells"],                    tdee: 3000 } },
  { label: "WK5 — Dumbbells cut",            params: { goal: "cut",      activity_level: "Moderately Active", equipment: ["Dumbbells"],                    tdee: 1800 } },
  { label: "WK6 — Full Gym athletic",        params: { goal: "athletic", activity_level: "Very Active",       equipment: ["Full Gym"],                     tdee: 2800 } },
];

// ── TEST RUNNER ─────────────────────────────────────────────────────────────

const DELAY_MS = 12000;
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runMealPlanTests() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║     MEAL PLAN TEST SUITE (5 profiles)    ║");
  console.log("╚══════════════════════════════════════════╝\n");

  let passed = 0;

  for (let i = 0; i < MEAL_PROFILES.length; i++) {
    const { label, params } = MEAL_PROFILES[i];
    if (i > 0) await delay(DELAY_MS);
    console.log(`\n--- ${label} ---`);
    try {
      const result = await generateMealPlan(params);
      console.log(JSON.stringify(result, null, 2));
      const errors = validateMealPlan(result, params, label);
      if (errors.length === 0) passed++;
    } catch (err) {
      console.log(`  ❌ ${label}: ERROR — ${err.message}`);
    }
  }

  console.log(`\nMeal plan results: ${passed}/5 passed`);
  return passed;
}

async function runWorkoutTests() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║    WORKOUT PLAN TEST SUITE (6 configs)   ║");
  console.log("╚══════════════════════════════════════════╝\n");

  let passed = 0;

  for (let i = 0; i < WORKOUT_CONFIGS.length; i++) {
    const { label, params } = WORKOUT_CONFIGS[i];
    if (i > 0) await delay(DELAY_MS);
    console.log(`\n--- ${label} ---`);
    try {
      const result = await generateWorkoutPlan(params);
      console.log(JSON.stringify(result, null, 2));
      const errors = validateWorkoutPlan(result, params, label);
      if (errors.length === 0) passed++;
    } catch (err) {
      console.log(`  ❌ ${label}: ERROR — ${err.message}`);
    }
  }

  console.log(`\nWorkout results: ${passed}/6 passed`);
  return passed;
}

async function runAll() {
  console.log("=== PHASE 3 — E2E PIPELINE TESTS ===\n");

  const mealPassed = await runMealPlanTests();
  const workoutPassed = await runWorkoutTests();

  console.log("\n=== PHASE 3 SUMMARY ===");
  console.log(`Meal plan profiles: ${mealPassed}/5 passed`);
  console.log(`Workout configs: ${workoutPassed}/6 passed`);
}

runAll();
