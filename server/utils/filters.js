const BLOCKLISTS = {
  vegan: [
    'chicken','beef','pork','lamb','turkey','fish','salmon','tuna','shrimp',
    'bacon','ham','sausage','pepperoni','anchovy','gelatin',
    'milk','cheese','butter','cream','yogurt','egg','eggs','honey','lard','whey'
  ],
  gluten_free: [
    'wheat','flour','bread','pasta','noodle','barley','rye','spelt',
    'couscous','semolina','crouton','breadcrumb','soy sauce','malt'
  ],
  halal: [
    'pork','bacon','ham','lard','gelatin','pepperoni','salami',
    'prosciutto','wine','beer','alcohol','rum','whiskey'
  ],
  kosher: [
    'pork','bacon','ham','shrimp','lobster','crab','shellfish',
    'lard','gelatin','rabbit','catfish'
  ],
  dairy_free: [
    'milk','cheese','butter','cream','yogurt','whey','casein',
    'lactose','ghee','ice cream','half and half','sour cream'
  ]
};

/**
 * filterRecipes(recipes, dietary_flags)
 * recipes: array of recipe objects with ingredient_list (JSON string or array)
 * dietary_flags: array of strings e.g. ['vegan','gluten_free']
 * returns filtered array
 */
function filterRecipes(recipes, dietary_flags) {
  if (!dietary_flags || dietary_flags.length === 0) return recipes;

  return recipes.filter(recipe => {
    let ingredients;
    try {
      ingredients = typeof recipe.ingredient_list === 'string'
        ? JSON.parse(recipe.ingredient_list)
        : recipe.ingredient_list;
    } catch {
      return true; // can't parse, don't filter out
    }

    const ingredientStr = ingredients.join(' ').toLowerCase();

    for (const flag of dietary_flags) {
      const blocklist = BLOCKLISTS[flag];
      if (!blocklist) continue;
      for (const blocked of blocklist) {
        if (ingredientStr.includes(blocked)) return false;
      }
    }
    return true;
  });
}

module.exports = { filterRecipes, BLOCKLISTS };
