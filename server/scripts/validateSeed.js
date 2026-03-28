const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../db/fridgetofit.db');
const db = new Database(DB_PATH);

const recipes = db.prepare('SELECT * FROM recipes').all();
console.log(`Total recipes in DB: ${recipes.length}`);

// --- CUISINE COUNTS ---
const cuisineCounts = {};
for (const r of recipes) {
  const tag = r.cuisine_tag || '(empty)';
  cuisineCounts[tag] = (cuisineCounts[tag] || 0) + 1;
}
console.log('\nPer-cuisine counts (sorted descending):');
Object.entries(cuisineCounts).sort((a, b) => b[1] - a[1]).forEach(([tag, c]) => {
  console.log(`  ${tag}: ${c}`);
});

// --- PREP TIME DISTRIBUTION ---
const buckets = { '0–15': 0, '16–30': 0, '31–45': 0, '46–60': 0, '60+': 0 };
for (const r of recipes) {
  const t = r.prep_time_min;
  if (t <= 15) buckets['0–15']++;
  else if (t <= 30) buckets['16–30']++;
  else if (t <= 45) buckets['31–45']++;
  else if (t <= 60) buckets['46–60']++;
  else buckets['60+']++;
}
console.log('\nprep_time_min distribution:');
for (const [label, count] of Object.entries(buckets)) {
  console.log(`  ${label} min: ${count} recipes`);
}

const fallbackCount = recipes.filter(r => r.prep_time_min === 15 || r.prep_time_min === 25 || r.prep_time_min === 40).length;
console.log(`\nRecipes with fallback prep_time_min (estimated): ${fallbackCount}`);

// --- STEP 3: INGREDIENTS TABLE ---
try {
  const res = db.prepare('SELECT COUNT(*) as c FROM ingredients').get();
  if (res.c === 0) console.log('\nWARNING: ingredients table exists but has 0 rows');
  else console.log(`\nIngredients table rows: ${res.c}`);
} catch (_) {
  console.log('\nWARNING: ingredients table does not exist yet (enrichment not run)');
}

// --- STEP 5: CRITICAL CHECKS ---
const failures = [];
for (const r of recipes) {
  if (!r.name || r.name.trim() === '') failures.push({ id: r.id, name: r.name, field: 'name', value: r.name });
  if (!r.cuisine_tag || r.cuisine_tag.trim() === '') failures.push({ id: r.id, name: r.name, field: 'cuisine_tag', value: r.cuisine_tag });
  if (!r.instructions_url || r.instructions_url.trim() === '') failures.push({ id: r.id, name: r.name, field: 'instructions_url', value: r.instructions_url });
  if (r.prep_time_min == null || typeof r.prep_time_min !== 'number') failures.push({ id: r.id, name: r.name, field: 'prep_time_min', value: r.prep_time_min });
  try {
    const arr = JSON.parse(r.ingredient_list);
    if (!Array.isArray(arr) || arr.length < 1) failures.push({ id: r.id, name: r.name, field: 'ingredient_list', value: r.ingredient_list });
  } catch (_) {
    failures.push({ id: r.id, name: r.name, field: 'ingredient_list', value: r.ingredient_list });
  }
}

if (failures.length > 0) {
  console.log(`\nValidation failures (${failures.length}):`);
  failures.forEach(f => console.log(`  id=${f.id} field=${f.field} value=${JSON.stringify(f.value)} name=${f.name}`));
}

const missingCuisine = recipes.filter(r => !r.cuisine_tag || r.cuisine_tag.trim() === '').length;
const missingIngredients = recipes.filter(r => {
  try { return JSON.parse(r.ingredient_list).length < 1; }
  catch { return true; }
}).length;
const missingPrepTime = recipes.filter(r => r.prep_time_min == null).length;

console.log('\n--- Critical Thresholds ---');
console.log(`Missing cuisine_tag: ${missingCuisine} (threshold: 20)`);
console.log(`Missing/empty ingredient_list: ${missingIngredients} (threshold: 50)`);
console.log(`Missing prep_time_min: ${missingPrepTime} (must be 0)`);

let exitCode = 0;

if (missingCuisine > 20) {
  console.error(`CRITICAL: ${missingCuisine} recipes missing cuisine_tag (threshold: 20)`);
  exitCode = 1;
}
if (missingIngredients > 50) {
  console.error(`CRITICAL: ${missingIngredients} recipes missing ingredient_list (threshold: 50)`);
  exitCode = 1;
}
if (missingPrepTime > 0) {
  console.error(`CRITICAL: ${missingPrepTime} recipes missing prep_time_min — must be 0`);
  exitCode = 1;
}

if (exitCode === 0) console.log('\n✅ VALIDATION PASSED — 0 critical errors');

db.close();
process.exit(exitCode);
