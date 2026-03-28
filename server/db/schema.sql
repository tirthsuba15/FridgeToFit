CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  session_token TEXT UNIQUE NOT NULL,
  height_cm REAL, weight_kg REAL, age INTEGER, sex TEXT,
  activity_level TEXT, goal TEXT CHECK(goal IN ('bulk','cut','maintain','athletic')),
  dietary_flags TEXT DEFAULT '[]',
  cuisine_prefs TEXT DEFAULT '[]',
  equipment TEXT DEFAULT '[]',
  weekly_budget_usd REAL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  calories_per_100g REAL, protein_per_100g REAL,
  carbs_per_100g REAL, fat_per_100g REAL,
  usda_id TEXT, source TEXT DEFAULT 'usda'
);
CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, cuisine_tag TEXT,
  ingredient_list TEXT NOT NULL,
  prep_time_min INTEGER DEFAULT 25,
  instructions_url TEXT, image_url TEXT,
  source_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER REFERENCES recipes(id),
  ingredient_id INTEGER REFERENCES ingredients(id),
  quantity_g REAL
);
CREATE TABLE IF NOT EXISTS meal_plans (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  plan_json TEXT NOT NULL,
  generated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS workout_plans (
  id TEXT PRIMARY KEY,
  meal_plan_id TEXT REFERENCES meal_plans(id),
  plan_json TEXT NOT NULL,
  generated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS grocery_lists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  meal_plan_id TEXT REFERENCES meal_plans(id),
  items_json TEXT NOT NULL,
  leftover_overrides TEXT DEFAULT '[]',
  total_cost_usd REAL
);
