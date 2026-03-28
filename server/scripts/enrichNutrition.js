/**
 * For each unique ingredient in the ingredients table:
 * 1. Try USDA FoodData Central API
 * 2. Fallback: Open Food Facts
 * 3. Store macros back to ingredients table
 * Never re-fetch an ingredient that already has calories_per_100g set.
 */

const db = require('../db/index');
const https = require('https');

const USDA_API_KEY = process.env.USDA_API_KEY || 'DEMO_KEY';

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(null); }
      });
    }).on('error', reject);
  });
}

async function fetchUSDA(name) {
  try {
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(name)}&pageSize=1&api_key=${USDA_API_KEY}`;
    const data = await httpsGet(url);
    const food = data?.foods?.[0];
    if (!food) return null;

    const get = (nutrientId) => {
      const n = food.foodNutrients?.find(n => n.nutrientId === nutrientId);
      return n ? Math.round(n.value * 10) / 10 : null;
    };

    return {
      calories_per_100g: get(1008),  // Energy
      protein_per_100g:  get(1003),  // Protein
      carbs_per_100g:    get(1005),  // Carbohydrate
      fat_per_100g:      get(1004),  // Total fat
      usda_id:           String(food.fdcId),
      source:            'usda'
    };
  } catch { return null; }
}

async function fetchOFF(name) {
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(name)}&search_simple=1&action=process&json=1&page_size=1`;
    const data = await httpsGet(url);
    const product = data?.products?.[0]?.nutriments;
    if (!product) return null;
    return {
      calories_per_100g: product['energy-kcal_100g'] || null,
      protein_per_100g:  product['proteins_100g'] || null,
      carbs_per_100g:    product['carbohydrates_100g'] || null,
      fat_per_100g:      product['fat_100g'] || null,
      usda_id:           null,
      source:            'openfoodfacts'
    };
  } catch { return null; }
}

async function enrichNutrition() {
  const ingredients = db.prepare(
    'SELECT * FROM ingredients WHERE calories_per_100g IS NULL'
  ).all();

  console.log(`Enriching ${ingredients.length} ingredients...`);

  const update = db.prepare(`
    UPDATE ingredients SET
      calories_per_100g = ?, protein_per_100g = ?,
      carbs_per_100g = ?, fat_per_100g = ?,
      usda_id = ?, source = ?
    WHERE id = ?
  `);

  for (const ing of ingredients) {
    let macros = await fetchUSDA(ing.name);
    if (!macros) {
      console.log(`  USDA miss for "${ing.name}", trying OFF...`);
      macros = await fetchOFF(ing.name);
    }
    if (macros) {
      update.run(
        macros.calories_per_100g, macros.protein_per_100g,
        macros.carbs_per_100g, macros.fat_per_100g,
        macros.usda_id, macros.source,
        ing.id
      );
      console.log(`  ✓ ${ing.name} (${macros.source})`);
    } else {
      console.log(`  ✗ ${ing.name} — no data found`);
    }
    // Rate limit: 200ms between calls
    await new Promise(r => setTimeout(r, 200));
  }
  console.log('Nutrition enrichment complete.');
}

module.exports = { enrichNutrition };

if (require.main === module) enrichNutrition();
