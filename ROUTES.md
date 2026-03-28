# FridgeToFit — API Routes

All routes are prefixed with `/api`. No authentication required for any endpoint.

---

## Auth

### `POST /api/users`
Create or retrieve a user session.

| Field | Value |
|---|---|
| **Method** | POST |
| **Path** | `/api/users` |
| **Request Body** | `{ height_cm, weight_kg, age, sex, activity_level, goal, dietary_flags, cuisine_prefs, equipment, weekly_budget_usd }` |
| **Response Body** | `{ id, session_token }` |
| **Auth Required** | No |

---

## Ingredients

### `POST /api/ingredients/extract`
Extract and parse ingredients from a fridge photo or text input.

| Field | Value |
|---|---|
| **Method** | POST |
| **Path** | `/api/ingredients/extract` |
| **Request Body** | `{ image_base64? , text? }` |
| **Response Body** | `{ ingredients: [{ name, quantity_g }] }` |
| **Auth Required** | No |

### `GET /api/ingredients`
List all ingredients in the database.

| Field | Value |
|---|---|
| **Method** | GET |
| **Path** | `/api/ingredients` |
| **Request Body** | — |
| **Response Body** | `[{ id, name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g }]` |
| **Auth Required** | No |

---

## Recipes

### `GET /api/recipes/match`
Return recipes that can be made from available ingredients.

| Field | Value |
|---|---|
| **Method** | GET |
| **Path** | `/api/recipes/match` |
| **Request Body** | — |
| **Query Params** | `ingredient_ids` (comma-separated), `cuisine_tag?`, `dietary_flags?` |
| **Response Body** | `[{ id, name, cuisine_tag, prep_time_min, ingredient_list }]` |
| **Auth Required** | No |

---

## Meal Plan

### `POST /api/mealplan/generate`
Generate a 7-day meal plan for a user based on their profile and available ingredients.

| Field | Value |
|---|---|
| **Method** | POST |
| **Path** | `/api/mealplan/generate` |
| **Request Body** | `{ user_id, ingredient_ids: [], cuisine_prefs?, dietary_flags? }` |
| **Response Body** | `{ id, user_id, plan_json, generated_at }` |
| **Auth Required** | No |

### `POST /api/mealplan/swap`
Swap a specific meal slot in an existing meal plan.

| Field | Value |
|---|---|
| **Method** | POST |
| **Path** | `/api/mealplan/swap` |
| **Request Body** | `{ meal_plan_id, day, slot, reason? }` |
| **Response Body** | `{ meal_plan_id, day, slot, new_recipe: { id, name } }` |
| **Auth Required** | No |

### `GET /api/mealplan/:id`
Retrieve a meal plan by ID.

| Field | Value |
|---|---|
| **Method** | GET |
| **Path** | `/api/mealplan/:id` |
| **Request Body** | — |
| **Response Body** | `{ id, user_id, plan_json, generated_at }` |
| **Auth Required** | No |

### `PATCH /api/mealplan/:id/leftovers`
Mark a meal slot as a leftover (or undo it).

| Field | Value |
|---|---|
| **Method** | PATCH |
| **Path** | `/api/mealplan/:id/leftovers` |
| **Request Body** | `{ day, slot, is_leftover: bool }` |
| **Response Body** | `{ updated: true }` |
| **Auth Required** | No |

---

## Workout

### `POST /api/workout/generate`
Generate a workout plan paired to an existing meal plan.

| Field | Value |
|---|---|
| **Method** | POST |
| **Path** | `/api/workout/generate` |
| **Request Body** | `{ meal_plan_id, user_id, equipment? }` |
| **Response Body** | `{ id, meal_plan_id, plan_json, generated_at }` |
| **Auth Required** | No |

### `GET /api/workout/:meal_plan_id`
Retrieve the workout plan associated with a meal plan.

| Field | Value |
|---|---|
| **Method** | GET |
| **Path** | `/api/workout/:meal_plan_id` |
| **Request Body** | — |
| **Response Body** | `{ id, meal_plan_id, plan_json, generated_at }` |
| **Auth Required** | No |

---

## Grocery

### `GET /api/grocery/:mealplan_id`
Get the grocery list for a meal plan (respects leftover overrides).

| Field | Value |
|---|---|
| **Method** | GET |
| **Path** | `/api/grocery/:mealplan_id` |
| **Request Body** | — |
| **Response Body** | `{ id, meal_plan_id, items_json, leftover_overrides, total_cost_usd }` |
| **Auth Required** | No |

### `GET /api/grocery/macro-summary/:mealplan_id`
Get aggregated macro totals for the week from a meal plan's grocery list.

| Field | Value |
|---|---|
| **Method** | GET |
| **Path** | `/api/grocery/macro-summary/:mealplan_id` |
| **Request Body** | — |
| **Response Body** | `{ calories, protein_g, carbs_g, fat_g, per_day: { calories, protein_g, carbs_g, fat_g } }` |
| **Auth Required** | No |

---

## Summary Table

| Method | Path | Auth |
|---|---|---|
| POST | `/api/users` | No |
| POST | `/api/ingredients/extract` | No |
| GET | `/api/ingredients` | No |
| GET | `/api/recipes/match` | No |
| POST | `/api/mealplan/generate` | No |
| POST | `/api/mealplan/swap` | No |
| GET | `/api/mealplan/:id` | No |
| PATCH | `/api/mealplan/:id/leftovers` | No |
| POST | `/api/workout/generate` | No |
| GET | `/api/workout/:meal_plan_id` | No |
| GET | `/api/grocery/:mealplan_id` | No |
| GET | `/api/grocery/macro-summary/:mealplan_id` | No |
