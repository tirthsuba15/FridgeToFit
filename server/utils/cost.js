const PRICE_PER_G = {
  // Produce
  'broccoli': 0.003, 'spinach': 0.004, 'kale': 0.004, 'carrot': 0.002,
  'onion': 0.002, 'garlic': 0.008, 'tomato': 0.004, 'potato': 0.002,
  'sweet potato': 0.003, 'bell pepper': 0.006, 'cucumber': 0.003,
  'lettuce': 0.004, 'avocado': 0.010, 'lemon': 0.006, 'lime': 0.006,
  'banana': 0.002, 'apple': 0.003, 'blueberry': 0.012, 'strawberry': 0.008,
  // Meat & Fish
  'chicken breast': 0.011, 'chicken thigh': 0.008, 'ground beef': 0.012,
  'beef steak': 0.020, 'pork chop': 0.010, 'bacon': 0.015,
  'salmon': 0.018, 'tuna': 0.009, 'shrimp': 0.016, 'tilapia': 0.010,
  'turkey': 0.009, 'ground turkey': 0.010,
  // Dairy
  'milk': 0.001, 'cheese': 0.014, 'butter': 0.012, 'yogurt': 0.004,
  'cream cheese': 0.010, 'heavy cream': 0.006, 'egg': 0.004, 'eggs': 0.004,
  // Dry Goods
  'rice': 0.002, 'pasta': 0.003, 'oats': 0.002, 'quinoa': 0.006,
  'bread': 0.004, 'flour': 0.001, 'lentils': 0.003, 'chickpeas': 0.003,
  'black beans': 0.003, 'kidney beans': 0.003, 'tofu': 0.006,
  'almonds': 0.016, 'peanut butter': 0.008, 'olive oil': 0.010,
  // Condiments & Spices
  'soy sauce': 0.004, 'hot sauce': 0.005, 'ketchup': 0.003,
  'mustard': 0.004, 'mayonnaise': 0.006, 'salt': 0.001, 'pepper': 0.020,
  'cumin': 0.015, 'paprika': 0.015, 'turmeric': 0.018, 'cinnamon': 0.015
};

const DEFAULT_PRICE_PER_G = 0.005;

const AISLE_MAP = {
  produce: ['broccoli','spinach','kale','carrot','onion','garlic','tomato',
    'potato','sweet potato','bell pepper','cucumber','lettuce','avocado',
    'lemon','lime','banana','apple','blueberry','strawberry'],
  meat_and_fish: ['chicken breast','chicken thigh','ground beef','beef steak',
    'pork chop','bacon','salmon','tuna','shrimp','tilapia','turkey','ground turkey'],
  dairy: ['milk','cheese','butter','yogurt','cream cheese','heavy cream','egg','eggs'],
  dry_goods: ['rice','pasta','oats','quinoa','bread','flour','lentils','chickpeas',
    'black beans','kidney beans','tofu','almonds','peanut butter','olive oil'],
  condiments_and_spices: ['soy sauce','hot sauce','ketchup','mustard','mayonnaise',
    'salt','pepper','cumin','paprika','turmeric','cinnamon']
};

function estimateCost(ingredient_name, quantity_g) {
  const key = ingredient_name.toLowerCase().trim();
  const price = PRICE_PER_G[key] || DEFAULT_PRICE_PER_G;
  return Math.round(price * quantity_g * 100) / 100;
}

function getAisle(ingredient_name) {
  const key = ingredient_name.toLowerCase().trim();
  for (const [aisle, items] of Object.entries(AISLE_MAP)) {
    if (items.some(item => key.includes(item) || item.includes(key))) {
      return aisle;
    }
  }
  return 'other';
}

module.exports = { estimateCost, getAisle, PRICE_PER_G };
