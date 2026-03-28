# FridgeToFit — Database Schema

## users

| Column | Type | Description |
|---|---|---|
| id | TEXT PK | Unique user identifier (UUID) |
| session_token | TEXT UNIQUE NOT NULL | Auth token for the current session |
| height_cm | REAL | User's height in centimeters |
| weight_kg | REAL | User's weight in kilograms |
| age | INTEGER | User's age in years |
| sex | TEXT | User's biological sex (used for TDEE calculation) |
| activity_level | TEXT | Activity level descriptor (e.g. sedentary, active) |
| goal | TEXT | Fitness goal: one of `bulk`, `cut`, `maintain`, `athletic` |
| dietary_flags | TEXT DEFAULT '[]' | JSON array of dietary restrictions (e.g. vegan, gluten-free) |
| cuisine_prefs | TEXT DEFAULT '[]' | JSON array of preferred cuisine types |
| equipment | TEXT DEFAULT '[]' | JSON array of available workout equipment strings |
| weekly_budget_usd | REAL | User's weekly grocery budget in USD |
| created_at | TEXT | ISO timestamp when the user record was created |

---

## ingredients

| Column | Type | Description |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | Auto-incrementing ingredient identifier |
| name | TEXT UNIQUE NOT NULL | Common name of the ingredient |
| calories_per_100g | REAL | Caloric content per 100g |
| protein_per_100g | REAL | Protein content per 100g in grams |
| carbs_per_100g | REAL | Carbohydrate content per 100g in grams |
| fat_per_100g | REAL | Fat content per 100g in grams |
| usda_id | TEXT | USDA FoodData Central ID for this ingredient |
| source | TEXT DEFAULT 'usda' | Data source identifier (default: usda) |

---

## recipes

| Column | Type | Description |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | Auto-incrementing recipe identifier |
| name | TEXT NOT NULL | Display name of the recipe |
| cuisine_tag | TEXT | Cuisine category tag (e.g. italian, mexican) |
| ingredient_list | TEXT NOT NULL | JSON array of ingredient names (denormalized for quick display) |
| prep_time_min | INTEGER DEFAULT 25 | Estimated preparation time in minutes |
| instructions_url | TEXT | External URL to step-by-step cooking instructions |
| image_url | TEXT | URL to recipe image |
| source_url | TEXT | Original source URL for the recipe |
| created_at | TEXT | ISO timestamp when the recipe was added |

---

## recipe_ingredients

| Column | Type | Description |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | Auto-incrementing join-table row identifier |
| recipe_id | INTEGER FK → recipes.id | The recipe this entry belongs to |
| ingredient_id | INTEGER FK → ingredients.id | The ingredient used in this recipe |
| quantity_g | REAL | Amount of the ingredient in grams for this recipe |

---

## meal_plans

| Column | Type | Description |
|---|---|---|
| id | TEXT PK | Unique meal plan identifier (UUID) |
| user_id | TEXT FK → users.id | The user this meal plan was generated for |
| plan_json | TEXT NOT NULL | Full meal plan structure as a JSON string |
| generated_at | TEXT | ISO timestamp when the meal plan was generated |

---

## workout_plans

| Column | Type | Description |
|---|---|---|
| id | TEXT PK | Unique workout plan identifier (UUID) |
| meal_plan_id | TEXT FK → meal_plans.id | The meal plan this workout plan is paired with |
| plan_json | TEXT NOT NULL | Full workout plan structure as a JSON string |
| generated_at | TEXT | ISO timestamp when the workout plan was generated |

---

## grocery_lists

| Column | Type | Description |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | Auto-incrementing grocery list identifier |
| meal_plan_id | TEXT FK → meal_plans.id | The meal plan this grocery list was derived from |
| items_json | TEXT NOT NULL | JSON array of grocery items with quantities and costs |
| leftover_overrides | TEXT DEFAULT '[]' | JSON array of ingredient IDs to exclude (user already has them) |
| total_cost_usd | REAL | Estimated total grocery cost in USD |

---

## Relationships

```
users
  └── meal_plans       (meal_plans.user_id → users.id)
        └── workout_plans  (workout_plans.meal_plan_id → meal_plans.id)
        └── grocery_lists  (grocery_lists.meal_plan_id → meal_plans.id)

recipes
  └── recipe_ingredients (recipe_ingredients.recipe_id → recipes.id)

ingredients
  └── recipe_ingredients (recipe_ingredients.ingredient_id → ingredients.id)
```

**Foreign key summary:**

| Table | Column | References |
|---|---|---|
| meal_plans | user_id | users.id |
| workout_plans | meal_plan_id | meal_plans.id |
| grocery_lists | meal_plan_id | meal_plans.id |
| recipe_ingredients | recipe_id | recipes.id |
| recipe_ingredients | ingredient_id | ingredients.id |
