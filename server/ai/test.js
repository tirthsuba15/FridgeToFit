require("dotenv").config();

const {
  visionExtract,
  generateMealPlan,
  swapMeal,
  generateSummary,
  generateWorkoutPlan,
} = require("./prompt");

const IMAGE_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/800px-Good_Food_Display_-_NCI_Visuals_Online.jpg";

const TEST_RECIPES = [
  { recipe_id: 1, name: "Oatmeal Bowl", cuisine_tag: "american", prep_time_min: 10 },
  { recipe_id: 2, name: "Grilled Chicken Salad", cuisine_tag: "american", prep_time_min: 15 },
  { recipe_id: 3, name: "Salmon Stir Fry", cuisine_tag: "asian", prep_time_min: 25 },
  { recipe_id: 4, name: "Black Bean Tacos", cuisine_tag: "mexican", prep_time_min: 20 },
  { recipe_id: 5, name: "Greek Yogurt Parfait", cuisine_tag: "mediterranean", prep_time_min: 5 },
];

async function test1_visionExtract() {
  console.log("=== TEST 1: visionExtract ===");
  const res = await fetch(IMAGE_URL);
  const arrayBuffer = await res.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const result = await visionExtract(base64);
  console.log(JSON.stringify(result, null, 2));
}

async function test2_generateMealPlan() {
  console.log("\n=== TEST 2: generateMealPlan ===");
  const result = await generateMealPlan({
    recipes: TEST_RECIPES,
    tdee: 2200,
    macros: { protein: 150, carbs: 220, fat: 73 },
    cuisines: ["american", "asian"],
    dietary: ["none"],
    budget: 80,
  });
  console.log(JSON.stringify(result, null, 2));
}

async function test3_swapMeal() {
  console.log("\n=== TEST 3: swapMeal ===");
  const result = await swapMeal({
    current_recipe: { recipe_id: 2, name: "Grilled Chicken Salad", prep_time_min: 15 },
    slot: "lunch",
    user_dietary: ["none"],
    macro_remaining: { protein: 40, carbs: 60, fat: 20 },
    matched_pool: [
      { recipe_id: 3, name: "Salmon Stir Fry", prep_time_min: 25 },
      { recipe_id: 4, name: "Black Bean Tacos", prep_time_min: 20 },
    ],
  });
  console.log(JSON.stringify(result, null, 2));
}

async function test4_generateSummary() {
  console.log("\n=== TEST 4: generateSummary ===");
  const result = await generateSummary({
    goal: "cut",
    cuisine_choices: ["asian", "mediterranean"],
    budget: 75,
    weekly_avg_calories: 1900,
  });
  console.log(JSON.stringify(result, null, 2));
}

async function test5a_workoutDumbbellsCut() {
  console.log("\n=== TEST 5a: generateWorkoutPlan (Dumbbells + cut) ===");
  const result = await generateWorkoutPlan({
    goal: "cut",
    activity_level: "Moderately Active",
    equipment: ["Dumbbells"],
    tdee: 2000,
  });
  console.log(JSON.stringify(result, null, 2));
}

async function test5b_workoutBodyweightBulk() {
  console.log("\n=== TEST 5b: generateWorkoutPlan (Bodyweight Only + bulk) ===");
  const result = await generateWorkoutPlan({
    goal: "bulk",
    activity_level: "Sedentary",
    equipment: ["Bodyweight Only"],
    tdee: 2800,
  });
  console.log(JSON.stringify(result, null, 2));
}

async function runAll() {
  const tests = [
    test1_visionExtract,
    test2_generateMealPlan,
    test3_swapMeal,
    test4_generateSummary,
    test5a_workoutDumbbellsCut,
    test5b_workoutBodyweightBulk,
  ];

  for (const test of tests) {
    try {
      await test();
    } catch (err) {
      console.error(`[FAIL] ${test.name}:`, err.message);
    }
  }

  console.log("\n=== ALL TESTS COMPLETE ===");
}

runAll();
