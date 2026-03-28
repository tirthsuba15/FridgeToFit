# BLOCKERS

*Write a line the moment you're blocked. Delete it when resolved.*
*Format: - [time] P[N]: [what's blocking you] — waiting on [person/thing]*
*When resolved: delete the line + message group chat "UNBLOCKED"*

---

## BUG-001 — Prod DB empty (0 recipes, 0 ingredients)
- **Status:** FIXED — committed seeded DB (871 recipes) to git
- **Owner:** P1/teja (railway config + DB)
- **Severity:** CRITICAL
- **Steps to reproduce:** Hit `GET /api/recipes/match` on prod — returns `{"count":0,"recipes":[]}`; `railway run node -e "db.prepare('SELECT COUNT(*) as c FROM recipes').get()"` → `{c: 0}`
- **Expected:** 871 recipes seeded from scraper
- **Actual:** SQLite DB resets to empty on every Railway deploy
- **Fix hint:** Commit `server/db/fridgetofit.db` to git (remove from .gitignore) so Railway ships the seeded DB

---

## BUG-002 — OpenRouter API key is wrong (401 on all AI calls)
- **Status:** FIXED — correct sk-or-v1-... key set via `railway variables set`
- **Owner:** P1/teja (Railway config)
- **Severity:** CRITICAL
- **Steps to reproduce:** Trigger any AI route (mealplan/generate, workout/generate, ingredients/extract with image) — Railway logs show `[aiCall] HTTP 401: Missing Authentication header`
- **Expected:** Valid OpenRouter key starting with `sk-or-v1-...`
- **Actual:** Railway `OPENROUTER_API_KEY` is set to the USDA key (`SSnOb6...`) — wrong key
- **Fix hint:** Set correct OpenRouter API key in `railway variables set OPENROUTER_API_KEY=<real-key>`

---

## BUG-003 — Frontend never sends Authorization header
- **Status:** FIXED — axios interceptor added to client/src/api/client.js reads sessionToken from Zustand
- **Owner:** aarnav/frontend
- **Severity:** CRITICAL
- **Steps to reproduce:** Complete onboarding → Results page calls `/api/mealplan/generate` — network tab shows no `Authorization` header → 401 response
- **Expected:** After `createUser` returns `session_token`, all subsequent requests include `Authorization: Bearer <session_token>`
- **Actual:** `client/src/api/client.js` has no interceptor to attach the token; session is stored in Zustand but never read by axios client
- **Fix hint:** Add axios request interceptor in `client.js`: `apiClient.interceptors.request.use(cfg => { const token = useUserStore.getState().sessionToken; if (token) cfg.headers.Authorization = \`Bearer \${token}\`; return cfg; })`

---

## BUG-004 — Frontend POST /api/users field names don't match backend
- **Status:** FIXED — OnboardingStep3.jsx now sends height_cm, weight_kg, dietary_flags, cuisine_prefs, weekly_budget_usd, session_token
- **Owner:** aarnav/frontend (primary) + tmoney/backend (secondary)
- **Severity:** CRITICAL
- **Steps to reproduce:** Complete all 3 onboarding steps and hit Submit — network tab shows 400 `{"error":"session_token required"}`
- **Expected:** User created successfully, `session_token` and `user_id` returned
- **Actual:** Frontend sends wrong field names and missing `session_token`:

  | Frontend sends | Backend expects |
  |---|---|
  | `height` | `height_cm` |
  | `weight` | `weight_kg` |
  | `dietary` | `dietary_flags` |
  | `cuisines` | `cuisine_prefs` |
  | `budget` (string preset) | `weekly_budget_usd` (number) |
  | *(missing)* | `session_token` |

- **Fix hint:** In `OnboardingStep3.jsx` generate a UUID for `session_token` (`crypto.randomUUID()`) and rename fields to match backend schema before calling `createUser`

---

## BUG-005 — Photo upload (visionExtract) fails with OpenRouter 401
- **Status:** FIXED — resolved by BUG-002 fix (correct OpenRouter key)
- **Owner:** P1/teja (same root cause as BUG-002)
- **Severity:** CRITICAL
- **Steps to reproduce:** Upload any food photo on Step 1 → spinner spins → returns error
- **Expected:** Ingredients extracted from image
- **Actual:** `[visionExtract] error: OpenRouter error: 401` in Railway logs
- **Fix hint:** Blocked by BUG-002 — fix OpenRouter key first

---

## BUG-006 — Workout generate requires meal_plan_id (not documented)
- **Status:** FIXED — route now accepts user_id alone; Results.jsx generates meal plan first then workout sequentially
- **Owner:** gordon/ai + tmoney/backend
- **Severity:** HIGH
- **Steps to reproduce:** `POST /api/workout/generate` with `{user_id, goal, equipment}` → `{"error":"meal_plan_id required"}`
- **Expected:** Route accepts goal + equipment directly OR frontend passes meal_plan_id
- **Actual:** Route requires `meal_plan_id` but frontend (`generateWorkoutPlan` in endpoints.js) likely doesn't pass one if meal plan generation failed
- **Fix hint:** Either relax route to not require `meal_plan_id`, or ensure Results page waits for meal plan ID before generating workout

---

## BUG-007 — Grocery route missing POST /generate; only GET /:id exists
- **Status:** FIXED — frontend was the issue (Grocery.jsx was a stub); wired up GET /api/grocery/:id + built full grocery page
- **Owner:** tmoney/backend
- **Severity:** HIGH
- **Steps to reproduce:** `POST /api/grocery/generate` → `Cannot POST /api/grocery/generate`
- **Expected:** Endpoint to generate grocery list from a meal plan
- **Actual:** `server/routes/grocery.js` only has `GET /:mealplan_id` and `GET /macro-summary/:mealplan_id`
- **Fix hint:** Grocery list is auto-created on `mealplan/generate` — frontend should use `GET /api/grocery/:meal_plan_id` not a generate endpoint; update `fetchGroceryList` call if needed

---

## BUG-008 — Dietary filter tests return 0 results (blocked by BUG-001)
- **Status:** FIXED — BUG-001 resolved (871 recipes seeded); dietary filter logic in filters.js is correct
- **Owner:** tmoney/backend (filter logic), P1/teja (empty DB)
- **Severity:** HIGH
- **Steps to reproduce:** `GET /api/recipes/match?dietary=vegan` → `{"count":0,"recipes":[]}`
- **Expected:** Filtered recipe list
- **Actual:** 0 recipes because prod DB is empty — can't verify filter logic until BUG-001 resolved
- **Fix hint:** Resolve BUG-001 first, then re-run dietary filter tests

---

---

## BUG-009 — /api/recipes/match returns 0 when user has no saved ingredients (threshold=0.5 hardcoded)
- **Status:** FIXED — threshold now 0 when no ingredients (returns all dietary-filtered recipes)
- **Owner:** P1/teja
- **Severity:** MEDIUM
- **Fix:** server/routes/recipes.js: dynamic threshold (0.3 with ingredients, 0 without)

## KNOWN — Demo account token
- session_token: `demo-token-2024`
- user_id: `f3937e6c-2b8d-486d-8998-d1a732f29aae`
- goal: maintain | budget: $75 | cuisines: italian, mexican | equipment: Dumbbells
