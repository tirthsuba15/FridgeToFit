# FridgeToFit

A full-stack app that turns a photo of your fridge into a meal plan matched to your fitness goals. Snap what's inside, the AI extracts the ingredients, and it generates recipes filtered by your goal, diet, cuisine preferences, equipment, and weekly budget.

## How it works

1. Set up a profile — height, weight, age, activity level, goal, dietary flags, cuisine preferences, equipment, weekly budget.
2. Upload a fridge photo (or type ingredients directly) — an AI vision pass extracts and parses the ingredient list.
3. Get recipe suggestions built from what you actually have, matched against your goal and constraints.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind |
| Backend | Node.js + Express |
| Database | SQLite (`better-sqlite3`) |
| AI | OpenRouter (ingredient extraction + recipe generation), `multer` for photo upload |
| Deploy | Railway |

## API

Session-based, no auth required. Key endpoints: `POST /api/users` (create profile), `POST /api/ingredients/extract` (photo/text → ingredient list). Full route list in [`ROUTES.md`](ROUTES.md).

## Run locally

```bash
# server
cd server
npm install
echo "OPENROUTER_API_KEY=your_key_here" > .env
node index.js

# client
cd client
npm install
npm run dev
```
