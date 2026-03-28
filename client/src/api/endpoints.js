import client from './client';

/**
 * Extract ingredients from a fridge photo
 * @param {File} imageFile - The image file to analyze
 * @returns {Promise<{ingredients: string[]}>}
 */
export async function extractIngredients(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  const res = await client.post('/api/ingredients/extract', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data; // expects { ingredients: string[] }
}

/**
 * Create a new user profile
 * @param {Object} profile - User profile data
 * @returns {Promise<{session_token: string, user_id: string}>}
 */
export async function createUser(profile) {
  const res = await client.post('/api/users', profile);
  return res.data; // expects { session_token: string, user_id: string }
}

/**
 * Generate a meal plan
 * @param {Object} payload - Meal plan generation parameters
 * @returns {Promise<{plan_json: object}>}
 */
export async function generateMealPlan(payload) {
  const res = await client.post('/api/mealplan/generate', payload);
  return res.data; // expects { plan_json: object }
}

/**
 * Generate a workout plan
 * @param {Object} payload - Workout plan generation parameters
 * @returns {Promise<{plan_json: object}>}
 */
export async function generateWorkoutPlan(payload) {
  const res = await client.post('/api/workout/generate', payload);
  return res.data; // expects { plan_json: object }
}

/**
 * Swap a meal in the plan
 * @param {Object} payload - Swap parameters (plan_id, day, slot, cuisine_preferences, dietary)
 * @returns {Promise<{meal: object}>}
 */
export async function swapMeal(payload) {
  const res = await client.post('/api/mealplan/swap', payload);
  return res.data; // expects { meal: MealObject }
}

/**
 * Update leftover status for a meal
 * @param {string} planId - The plan ID
 * @param {Object} payload - Leftover update data (day, slot, is_leftover)
 * @returns {Promise<object>}
 */
export async function patchLeftovers(planId, payload) {
  const res = await client.patch(`/api/mealplan/${planId}/leftovers`, payload);
  return res.data;
}

/**
 * Fetch grocery list for a plan
 * @param {string} planId - The plan ID
 * @returns {Promise<{items: array}>}
 */
export async function fetchGroceryList(planId) {
  const res = await client.get(`/api/grocery/${planId}`);
  return res.data; // expects { items: GroceryItem[] }
}
