/**
 * Mifflin-St Jeor BMR → TDEE → macro targets
 */

// Supports both lowercase keys (tmoney) and capitalized keys (gordon/frontend)
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
  'Sedentary': 1.2,
  'Lightly Active': 1.375,
  'Moderately Active': 1.55,
  'Very Active': 1.725,
};

function calculateTDEE(user) {
  const { weight_kg, height_cm, age, sex, activity_level } = user;
  let bmr;
  if (sex === 'male') {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  } else {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
  }
  const multiplier = ACTIVITY_MULTIPLIERS[activity_level] || 1.55;
  return Math.round(bmr * multiplier);
}

function getMacroTargets(tdee, goal) {
  // Ratios: [carbs%, protein%, fat%]
  const ratios = {
    bulk:     { carbs: 0.40, protein: 0.30, fat: 0.30 },
    cut:      { carbs: 0.30, protein: 0.40, fat: 0.30 },
    maintain: { carbs: 0.333, protein: 0.333, fat: 0.334 },
    athletic: { carbs: 0.35, protein: 0.35, fat: 0.30 },
  };
  const r = ratios[goal] || ratios.maintain;
  const protein = Math.round((tdee * r.protein) / 4);
  const carbs   = Math.round((tdee * r.carbs) / 4);
  const fat     = Math.round((tdee * r.fat) / 9);
  return {
    calories: tdee,
    // Both naming conventions supported
    protein_g: protein, protein,
    carbs_g: carbs,     carbs,
    fat_g: fat,         fat,
  };
}

module.exports = { calculateTDEE, getMacroTargets };
