const { filterRecipes } = require('./filters');

/**
 * scoreRecipe: % of recipe ingredients found in userIngredients
 */
function scoreRecipe(recipe, userIngredientNames) {
  let ingredients;
  try {
    ingredients = typeof recipe.ingredient_list === 'string'
      ? JSON.parse(recipe.ingredient_list)
      : recipe.ingredient_list;
  } catch { return 0; }

  if (!ingredients.length) return 0;
  const matched = ingredients.filter(ing =>
    userIngredientNames.some(u => ing.toLowerCase().includes(u.toLowerCase()))
  );
  return matched.length / ingredients.length;
}

/**
 * matchRecipes({ recipes, userIngredientNames, dietary_flags, cuisine_prefs, threshold })
 * Returns top 30 filtered + scored recipes
 */
function matchRecipes({ recipes, userIngredientNames, dietary_flags, cuisine_prefs, threshold = 0.5 }) {
  let pool = filterRecipes(recipes, dietary_flags);

  // Filter by cuisine_prefs if provided
  if (cuisine_prefs && cuisine_prefs.length > 0) {
    const prefFiltered = pool.filter(r =>
      cuisine_prefs.includes(r.cuisine_tag)
    );
    // Fall back to full pool if cuisine filter yields < 10 results
    if (prefFiltered.length >= 10) pool = prefFiltered;
  }

  // Score + threshold filter
  const scored = pool
    .map(r => ({ ...r, match_score: scoreRecipe(r, userIngredientNames) }))
    .filter(r => r.match_score >= threshold)
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 30)
    .map(r => ({
      ...r,
      ingredient_list: JSON.parse(r.ingredient_list || '[]').slice(0, 6)
    }));

  return scored;
}

module.exports = { matchRecipes, scoreRecipe };
