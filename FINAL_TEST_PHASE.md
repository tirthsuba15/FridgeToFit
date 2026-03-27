# FINAL TEST PHASE

Two test runs happen today:

**RUN 1 — Per-person area test** (~when each person finishes their last phase)
Each person pastes their area test card into their LLM chat.
LLM outputs one giant CODER PROMPT covering their whole area.
Paste into Claude Code — it writes and runs all tests for that area.
Fix any failures before signalling ready for the merge.

**RUN 2 — Full end-to-end test** (after 3:30pm merge, run by Person 1)
Person 1 pastes the combined test card into their LLM chat.
LLM outputs one giant CODER PROMPT covering the entire merged app.
Paste into Claude Code — it writes and runs the full test suite.
Any failures at this stage get the FIX PROMPT treatment before deploy.

---

## PERSON 1 — AREA TEST CARD
*(Paste into LLM chat when Phase 5 utilities is done — before Phase 6 merge)*

```
AREA TEST: Person 1 — DevOps & Glue

Before the final merge, generate one giant CODER PROMPT that writes and runs
a comprehensive test suite covering everything I built. Paste into Claude Code.

Areas to test:

AUTH LAYER:
- POST /api/auth/register — valid input creates user, returns JWT
- POST /api/auth/register — duplicate email returns 409
- POST /api/auth/register — missing fields return 400
- POST /api/auth/login — correct credentials return JWT
- POST /api/auth/login — wrong password returns 401
- POST /api/auth/login — unknown email returns 401
- GET /api/me — valid JWT returns user
- GET /api/me — no token returns 401
- GET /api/me — expired/invalid token returns 401

ROUTING + SHELL:
- All defined routes return 200 (not 404)
- Unauthenticated requests to protected routes redirect to /login
- Layout renders consistently — nav present on all authenticated routes

SHARED UTILITIES:
- apiCall helper attaches Authorization header when token exists
- apiCall helper throws on non-2xx responses
- ErrorBoundary catches React render errors and shows fallback
- Global Express error handler returns {error: message} on unhandled exceptions

REPO HEALTH:
- npm run build completes with no errors
- No console.log statements left in server code
- All env vars referenced in code exist in .env.example

Test framework: jest + supertest for backend, React Testing Library for frontend.
Output: single test file at tests/area-p1.test.js.
Run it. Report pass/fail per test. Fix any failures.
```

---

## PERSON 2 — AREA TEST CARD
*(Paste into LLM chat when Phase 6 test pass is done)*

```
AREA TEST: Person 2 — Backend

Generate one giant CODER PROMPT that writes and runs a comprehensive test suite
covering the entire backend. Paste into Claude Code.

Areas to test:

SCHEMA + MIGRATIONS:
- server starts cleanly and all tables exist
- All expected columns present with correct types
- Migrations are idempotent (can run twice without error)

ROUTES — for EVERY endpoint in ROUTES.md:
- Happy path: valid input + valid auth → correct response shape + status
- Missing auth: no token → 401
- Invalid auth: bad token → 401
- Missing required fields → 400 with {error, field}
- Invalid IDs (non-existent record) → 404
- Duplicate records (where applicable) → 409

BUSINESS LOGIC / EXTERNAL API:
- Core logic function returns correct output for known inputs
- External API errors (simulate with mock) return graceful {error} not crash
- Rate limit or timeout scenarios handled gracefully

VALIDATION:
- Every route with required fields returns {error, field} for each missing field
- Type mismatches handled (string where number expected, etc.)

INDEXES:
- Query performance: key queries run without full table scan (EXPLAIN QUERY PLAN)

Test framework: jest + supertest.
Output: single test file at tests/area-p2.test.js.
Run it. Report pass/fail per test. Fix any failures before the merge.
```

---

## PERSON 3 — AREA TEST CARD
*(Paste into LLM chat when Phase 6 polish is done)*

```
AREA TEST: Person 3 — Frontend

Generate one giant CODER PROMPT that writes and runs a comprehensive test suite
covering all frontend components and screens. Paste into Claude Code.

Areas to test:

ROUTING:
- All defined routes render without crashing
- Unauthenticated user on protected route gets redirected to /login
- Nav links point to correct paths

SCREENS (for every screen):
- Renders with hardcoded/mock data without crashing
- Loading state renders when data is fetching
- Error state renders when API returns error
- Empty state renders when API returns empty array
- Key interactive elements are present (buttons, forms, inputs)

COMPONENTS:
- LoadingSpinner renders
- ErrorMessage renders with message prop
- EmptyState renders with action CTA
- Toast shows and auto-dismisses

UI QUALITY (automated where possible):
- No img elements missing alt attributes
- All buttons have accessible labels
- No elements with onClick missing cursor:pointer style
- No console errors during render

API WIRING:
- apiCall is called with correct endpoint for each screen's data fetch
- Auth header is included in all protected API calls
- Error from API is caught and shown in error state (not unhandled)

Test framework: React Testing Library + jest + jest-axe for accessibility.
Output: single test file at tests/area-p3.test.js.
Run it. Report pass/fail per test. Fix any failures.
```

---

## PERSON 4 — AREA TEST CARD
*(Paste into LLM chat when Phase 6 hardening is done — before /octo:tdd at 4pm)*

```
AREA TEST: Person 4 — AI Feature

Generate one giant CODER PROMPT that writes and runs a comprehensive test suite
covering the entire AI feature. Paste into Claude Code.

Areas to test:

PROMPT + AI CLIENT:
- SYSTEM_PROMPT is exported from server/ai/prompt.js
- userPrompt() function returns a non-empty string for valid input
- AI client initialises without error when API key is set

INPUT PIPELINE (server/ai/service.js):
- Valid input → processAIRequest resolves with {result}
- Missing required field → returns {error, field} before calling AI
- Each required field tested individually

OUTPUT PIPELINE:
- Well-formed AI response → parsed correctly into expected shape
- Malformed AI response (invalid JSON) → returns {error: "Could not process response"}
- Empty AI response → returns {error} not crash

API ENDPOINTS:
- POST /api/[feature] — valid input → saves to DB → returns result
- POST /api/[feature] — missing fields → 400
- POST /api/[feature] — no auth → 401
- POST /api/[feature] — rate limit (2nd request within 3s) → 429
- GET /api/[feature]/:userId — returns array of saved results
- GET /api/[feature]/:userId — no auth → 401

DEMO SCENARIOS (10 real inputs):
- Run these 10 realistic inputs through the full pipeline end to end:
  [FILL IN — 10 inputs that represent real user scenarios for this app]
- Each must return a non-error result with correct output shape
- Log quality score: rate each output 1-3 (1=poor, 2=ok, 3=good)
  Any score of 1 means prompt needs tuning before demo

SEED DATA:
- node server/db/seedAI.js runs without error
- Seeded records are retrievable via GET /api/[feature]/:userId

Test framework: jest + supertest. Mock the AI API client for unit tests.
Output: single test file at tests/area-p4.test.js.
Run it. Report pass/fail + quality scores for demo scenarios.
Fix all failures. If quality scores have 1s: paste results to LLM for prompt tuning.
```

---

## COMBINED END-TO-END TEST CARD — PERSON 1 ONLY
*(Paste into LLM chat after the 3:30pm merge is complete)*

```
COMBINED END-TO-END TEST: Full app after merge

All 4 branches are now merged into main.
Generate one giant CODER PROMPT that writes and runs a full end-to-end test suite
covering the entire app as a single integrated system. Paste into Claude Code.

The individual area test files already exist:
- tests/area-p1.test.js
- tests/area-p2.test.js
- tests/area-p3.test.js
- tests/area-p4.test.js

This combined test goes further — it tests the INTEGRATION between areas.

FULL USER JOURNEY TESTS (simulate the 3-minute demo scenario click by click):
Test each step of the demo as a sequence:
1. New user registers → receives JWT
2. Logs in with same credentials → receives JWT
3. JWT used to access main screen → returns correct data
4. [FILL IN — each step of the demo flow as an API call sequence]
5. Core feature triggered → result returned and saved
6. Results page loads → saved result visible
7. Logout / session end → protected routes return 401

CROSS-AREA INTEGRATION:
- Auth middleware (P1) correctly protects all P2 routes
- P2 routes return data in the exact shape P3 components expect
- P4 AI results saved to P2 schema and retrievable by P3 frontend
- P1 apiCall helper works with every P2 endpoint
- Error states from P2 (404, 400, 401) render correctly in P3 components

PERFORMANCE:
- Full demo flow completes in under 5 seconds (not including AI call)
- AI endpoint responds in under 15 seconds on real inputs
- No memory leaks: server handles 10 sequential requests without crashing

BUILD HEALTH:
- npm run build (client) completes with no errors
- npm test (all test files) passes with no failures
- No TypeScript/lint errors if applicable

DEMO DATA:
- Seed data exists and all seeded records are accessible via the demo flow
- App does not look empty on any screen during the demo scenario

Output: single test file at tests/e2e-combined.test.js.
Run ALL test files: npm test
Report full pass/fail summary grouped by area.
For any failure: output a FIX PROMPT targeting that specific failure.
Priority order for fixes: auth > core feature > data display > polish.
```

---

## WHERE THESE CARDS APPEAR IN EACH GUIDE

| Person | When to run area test | Card to paste |
|--------|--------------------|---------------|
| P1 | After Phase 5 (before Phase 6 merge) | P1 area test card above |
| P2 | After Phase 6 (full API test pass done) | P2 area test card above |
| P3 | After Phase 6 (polish done, 2:30pm) | P3 area test card above |
| P4 | After Phase 6 hardening (before /octo:tdd) | P4 area test card above |
| P1 | After Phase 6 merge (3:30pm) | Combined E2E card above |

**Fix loop:**
LLM outputs giant CODER PROMPT → paste into Claude Code → tests run → failures appear
→ paste failures back into LLM → LLM outputs FIX PROMPT → paste into Claude Code
→ re-run npm test → repeat until all pass
