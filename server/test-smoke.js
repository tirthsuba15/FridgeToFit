require('dotenv').config();
const db = require('./db/index');

const BASE = 'http://localhost:3001';
let USER_ID, SESSION_TOKEN, INGREDIENT_IDS, MEAL_PLAN_ID;

// Seed recipes so swap and meal plan have a pool to draw from
function seedRecipes() {
  const recipes = [
    { name: 'Oatmeal Bowl', cuisine_tag: 'american', prep_time_min: 10, ingredient_list: '["oats","milk","banana"]' },
    { name: 'Grilled Chicken Salad', cuisine_tag: 'american', prep_time_min: 15, ingredient_list: '["chicken breast","lettuce","tomato"]' },
    { name: 'Salmon Stir Fry', cuisine_tag: 'asian', prep_time_min: 25, ingredient_list: '["salmon","broccoli","soy sauce","rice"]' },
    { name: 'Black Bean Tacos', cuisine_tag: 'mexican', prep_time_min: 20, ingredient_list: '["black beans","tortilla","salsa"]' },
    { name: 'Pad Thai', cuisine_tag: 'thai', prep_time_min: 30, ingredient_list: '["rice noodles","tofu","peanuts"]' },
    { name: 'Chana Masala', cuisine_tag: 'indian', prep_time_min: 35, ingredient_list: '["chickpeas","tomato","onion"]' },
    { name: 'Lentil Soup', cuisine_tag: 'middle-eastern', prep_time_min: 40, ingredient_list: '["lentils","carrot","onion"]' },
    { name: 'Chicken Burrito Bowl', cuisine_tag: 'mexican', prep_time_min: 20, ingredient_list: '["chicken breast","rice","beans"]' },
    { name: 'Korean Bibimbap', cuisine_tag: 'korean', prep_time_min: 30, ingredient_list: '["rice","eggs","vegetables"]' },
    { name: 'Pasta Primavera', cuisine_tag: 'italian', prep_time_min: 25, ingredient_list: '["pasta","zucchini","bell pepper"]' },
    { name: 'Egg White Omelette', cuisine_tag: 'american', prep_time_min: 10, ingredient_list: '["eggs","spinach","cheese"]' },
    { name: 'Tuna Rice Bowl', cuisine_tag: 'japanese', prep_time_min: 10, ingredient_list: '["tuna","rice","avocado"]' },
  ];
  const insert = db.prepare('INSERT OR IGNORE INTO recipes (name, cuisine_tag, prep_time_min, ingredient_list) VALUES (?, ?, ?, ?)');
  for (const r of recipes) {
    insert.run(r.name, r.cuisine_tag, r.prep_time_min, r.ingredient_list);
  }
  // Also seed recipe_ingredients links for the ingredients we'll extract
  const chickenRecipe = db.prepare("SELECT id FROM recipes WHERE name = 'Grilled Chicken Salad'").get();
  const riceRecipe = db.prepare("SELECT id FROM recipes WHERE name = 'Salmon Stir Fry'").get();
  const eggRecipe = db.prepare("SELECT id FROM recipes WHERE name = 'Egg White Omelette'").get();
  // These will be linked after ingredient extraction
  console.log(`  Seeded ${recipes.length} recipes`);
}

async function post(path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function step(label, fn) {
  try {
    const result = await fn();
    console.log(`  ✅ ${label}: PASS`);
    return result;
  } catch (err) {
    console.log(`  ❌ ${label}: FAIL — ${err.message}`);
    return null;
  }
}

async function runSmoke() {
  console.log('\n=== PHASE 4 — SMOKE TEST ===\n');

  // Seed DB with recipes
  seedRecipes();

  // Step 1: Create user
  await step('Step 1: Create user', async () => {
    const { status, data } = await post('/api/users', {
      session_token: 'smoke-test-' + Date.now(),
      height_cm: 175,
      weight_kg: 75,
      age: 20,
      sex: 'male',
      activity_level: 'Moderately Active',
      goal: 'cut',
      dietary_flags: ['none'],
      cuisine_prefs: ['asian', 'american'],
      equipment: ['Dumbbells'],
      weekly_budget_usd: 75,
    });
    if (status !== 200) throw new Error(`HTTP ${status}: ${JSON.stringify(data)}`);
    if (!data.id) throw new Error('No user id returned');
    USER_ID = data.id;
    SESSION_TOKEN = data.session_token;
    console.log(`     user_id: ${USER_ID}`);
  });

  // Step 2: Extract ingredients (text mode)
  await step('Step 2: Extract ingredients (text)', async () => {
    const { status, data } = await post('/api/ingredients/extract', {
      text: 'chicken breast, broccoli, eggs, rice, olive oil',
    });
    if (status !== 200) throw new Error(`HTTP ${status}: ${JSON.stringify(data)}`);
    if (!data.ingredients || data.ingredients.length === 0) throw new Error('No ingredients returned');
    INGREDIENT_IDS = data.ingredients.map(i => i.id);
    console.log(`     ingredients: ${data.ingredients.map(i => i.name).join(', ')}`);

    // Link ingredients to recipes via recipe_ingredients
    const allRecipes = db.prepare('SELECT id, ingredient_list FROM recipes').all();
    const insertRI = db.prepare('INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity_g) VALUES (?, ?, ?)');
    for (const recipe of allRecipes) {
      const ingList = JSON.parse(recipe.ingredient_list);
      for (const ingName of ingList) {
        for (const ing of data.ingredients) {
          if (ingName.toLowerCase().includes(ing.name.toLowerCase()) ||
              ing.name.toLowerCase().includes(ingName.toLowerCase())) {
            insertRI.run(recipe.id, ing.id, 100);
          }
        }
      }
    }
  });

  // Step 3: Generate meal plan (this calls AI — may take 30-60s)
  console.log('     (Step 3 calls AI — may take 30-60s...)');
  await step('Step 3: Generate meal plan', async () => {
    const { status, data } = await post('/api/mealplan/generate', {
      user_id: USER_ID,
      ingredient_ids: INGREDIENT_IDS,
    });
    if (status !== 200) throw new Error(`HTTP ${status}: ${JSON.stringify(data)}`);
    if (!data.plan_json || !data.plan_json.days) throw new Error('No plan_json.days returned');
    if (data.plan_json.days.length !== 7) throw new Error(`Expected 7 days, got ${data.plan_json.days.length}`);
    MEAL_PLAN_ID = data.id;
    console.log(`     meal_plan_id: ${MEAL_PLAN_ID}`);
    console.log(`     days: ${data.plan_json.days.length}, summary: ${data.plan_json.summary ? 'present' : 'missing'}`);
  });

  if (!MEAL_PLAN_ID) {
    console.log('\n  ⚠️  Skipping steps 4-5 (no meal plan)\n');
    return;
  }

  // Step 4: Swap a meal
  console.log('     (Step 4 calls AI — may take 15-30s...)');
  await step('Step 4: Swap a meal', async () => {
    const { status, data } = await post('/api/mealplan/swap', {
      meal_plan_id: MEAL_PLAN_ID,
      day: 'Monday',
      slot: 'lunch',
    });
    if (status !== 200) throw new Error(`HTTP ${status}: ${JSON.stringify(data)}`);
    if (!data.new_recipe) throw new Error('No new_recipe returned');
    console.log(`     swapped to: ${data.new_recipe.name || 'unknown'} (id: ${data.new_recipe.id || 'null'})`);
  });

  // Step 5: Generate workout
  console.log('     (Step 5 calls AI — may take 30-60s...)');
  await step('Step 5: Generate workout', async () => {
    const { status, data } = await post('/api/workout/generate', {
      meal_plan_id: MEAL_PLAN_ID,
      user_id: USER_ID,
    });
    if (status !== 200) throw new Error(`HTTP ${status}: ${JSON.stringify(data)}`);
    if (!data.plan_json || !data.plan_json.days) throw new Error('No plan_json.days returned');
    if (data.plan_json.days.length !== 7) throw new Error(`Expected 7 days, got ${data.plan_json.days.length}`);
    console.log(`     workout days: ${data.plan_json.days.length}`);
  });

  console.log('\n=== SMOKE TEST COMPLETE ===\n');
}

runSmoke().catch(err => {
  console.error('Smoke test crashed:', err);
  process.exit(1);
});
