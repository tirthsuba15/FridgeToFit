/**
 * Mifflin-St Jeor BMR → TDEE → macro targets
 */

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};

function calculateTDEE({ weight_kg, height_cm, age, sex, activity_level }) {
  // Mifflin-St Jeor BMR
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
    athletic: { carbs: 0.35, protein: 0.35, fat: 0.30 }
  };
  const r = ratios[goal] || ratios.maintain;
  return {
    calories: tdee,
    protein_g: Math.round((tdee * r.protein) / 4),
    carbs_g:   Math.round((tdee * r.carbs) / 4),
    fat_g:     Math.round((tdee * r.fat) / 9)
  };
}

module.exports = { calculateTDEE, getMacroTargets };
