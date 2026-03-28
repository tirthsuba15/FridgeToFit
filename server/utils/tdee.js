const ACTIVITY_MULTIPLIERS = {
  'Sedentary': 1.2,
  'Lightly Active': 1.375,
  'Moderately Active': 1.55,
  'Very Active': 1.725,
};

function calculateTDEE(user) {
  let bmr;
  if (user.sex === 'male') {
    bmr = 10 * user.weight_kg + 6.25 * user.height_cm - 5 * user.age + 5;
  } else {
    bmr = 10 * user.weight_kg + 6.25 * user.height_cm - 5 * user.age - 161;
  }
  const multiplier = ACTIVITY_MULTIPLIERS[user.activity_level] || 1.375;
  return Math.round(bmr * multiplier);
}

function getMacroTargets(tdee, goal) {
  const ratios = {
    bulk:     { carbs: 0.40, protein: 0.30, fat: 0.30 },
    cut:      { carbs: 0.30, protein: 0.40, fat: 0.30 },
    maintain: { carbs: 0.333, protein: 0.333, fat: 0.334 },
    athletic: { carbs: 0.35, protein: 0.35, fat: 0.30 },
  };
  const r = ratios[goal] || ratios.maintain;
  return {
    calories: tdee,
    protein: Math.round((tdee * r.protein) / 4),
    carbs: Math.round((tdee * r.carbs) / 4),
    fat: Math.round((tdee * r.fat) / 9),
  };
}

module.exports = { calculateTDEE, getMacroTargets };
