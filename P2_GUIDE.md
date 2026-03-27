# P2 GUIDE — PERSON 2: BACKEND DEV

## HOW THIS GUIDE WORKS

Two tools running side by side:

- **LLM chat** (claude.ai) — planning and prompt writing.
- **Coder** (Claude Code: `claude --dangerously-skip-permissions`) — executes the build.
- **Speed Engine** (Agent Teams) — used for parallel work.

Error loop: if coder produces an error, paste it back to LLM → LLM outputs FIX PROMPT → paste to coder.

---

## PROJECT BRIEF
*(Fill in [FILL IN] from Prompt 2's output. Paste first into claude.ai at 9:30am.)*

```
You are my LLM assistant for Viking Hacks 2026 — a 9-hour hackathon ending at 6pm today.

My role: Person 2 — Backend Dev
My branch: p2/backend
My job: SQLite schema, all Express routes, auth middleware wiring, business logic, validation

App: [FILL IN — name + one sentence]
Stack: Node/Express + SQLite (better-sqlite3)

HOW WE WORK:
- Claude Code is my PRIMARY coder.
- Agent Teams are my speed engine for complex phases.
- TDD Guard hook is active in my Claude Code session — it will block untested routes.
- For every phase, output:
  1. CODER PROMPT (Pasted into Claude Code)
  2. TEST PROMPT (Pasted after build)
  3. PHYSICAL CHECKLIST (Manual verification)
- Acknowledge and wait for Phase 1.
```

---

## PHASE 1 — SCHEMA + MIGRATIONS + SCHEMA.md
*(9:30am — most important phase, start immediately)*

```
PHASE 1: SQLite schema, migrations, SCHEMA.md

What to build:
- server/db/migrations/ — one migration file per table
- Tables needed: [FILL IN from interview — every table name + columns]
- server/db/index.js:
    opens SQLite connection to ./db/app.db
    runs all migrations on startup in order
    exports db instance
- Wire db into server/index.js (import and call db init before routes)
- SCHEMA.md in repo root — documents every table, every column, types, constraints, relationships

After coder finishes:
- git commit -m "feat: schema + migrations" && git push origin p2/backend
- Update PROGRESS.md
- Message group: "SCHEMA.md pushed on p2/backend — pull now. P3 and P4 need this."
- Add to DECISIONS.md any schema design choices made

Generate: CODER PROMPT + TEST PROMPT + PHYSICAL CHECKLIST
```

---

## PHASE 2 — ROUTE STUBS + ROUTES.md
*(Immediately after Phase 1 checklist passes)*

```
PHASE 2: All API route stubs + ROUTES.md

What to build:
- server/routes/ — one file per resource: [FILL IN from interview]
- Every endpoint stubbed — returns placeholder data for now, real logic in Phase 3
- Stubs format:
    router.get('/path', authMiddleware, (req, res) => res.json({stub: true}))
- Mount all routers on Express in server/index.js under /api/[resource]
- Wire in auth middleware from server/middleware/auth.js (P1 built this)
- ROUTES.md in repo root:
    every endpoint: METHOD /api/path — auth required (Y/N) — request body — response shape

Auth middleware location: server/middleware/auth.js (from p1/setup — pull it)

After coder finishes:
- git commit -m "feat: route stubs + ROUTES.md" && git push
- Update PROGRESS.md
- Message group: "ROUTES.md pushed — pull now. Every endpoint stubbed."

Generate: CODER PROMPT + TEST PROMPT + PHYSICAL CHECKLIST
```

---

## PHASE 3 — CORE CRUD ROUTES
*(After Phase 2 checklist passes)*

```
PHASE 3: Replace stubs with real SQLite queries — core CRUD

What to build:
- Replace every stub in server/routes/ with real better-sqlite3 prepared statements
- For each route: validate required input fields → return {error, field} if missing
- For each route: try/catch → return {error: message} on DB failure, never crash
- Apply auth middleware to all protected routes
- TDD Guard is active — tests must be written alongside each route

Tables and columns: [FILL IN from SCHEMA.md after P2 pushes it]

For routes with 3+ independent resource files to implement simultaneously,
the LLM's coder prompt will include an agent team invocation. Example:

  Goal: Implement CRUD routes for [resource1], [resource2], [resource3] in parallel.
  Create a team of 3 agents using Sonnet.
  Agent 1 — [resource1] Dev: implements server/routes/[resource1].js, owns that file only.
  Agent 2 — [resource2] Dev: implements server/routes/[resource2].js, owns that file only.
  Agent 3 — QA: when both agents done, run npm test and report any failures back to them.
  Final deliverable: all 3 route files implemented with passing tests.

After coder finishes:
- git commit -m "feat: CRUD routes" && git push
- Update PROGRESS.md + DECISIONS.md

Generate: CODER PROMPT + TEST PROMPT + PHYSICAL CHECKLIST
```

---

## PHASE 4 — EXTERNAL API OR CORE BUSINESS LOGIC
*(~11:15am)*

```
PHASE 4: [FILL IN — external API integration OR core business logic]

What to build: [FILL IN from interview — what third-party APIs or complex logic]

If external API:
- server/services/[name].js — wraps all API calls, exports clean functions
- Handle API errors: rate limit → 429, unavailable → 503 {error: 'Service unavailable'}
- Wire service into relevant routes

If core business logic:
- server/services/[name].js — pure logic functions, no Express dependency
- Wire into routes

After coder finishes:
- git commit -m "feat: [name] integration" && git push
- Update PROGRESS.md + DECISIONS.md

Generate: CODER PROMPT + TEST PROMPT + PHYSICAL CHECKLIST
```

---

## PHASE 5 — ADVANCED ROUTES + VALIDATION + INDEXES
*(~12:00pm — pause at 12:00pm for merge, resume at 1:00pm)*

```
PHASE 5: Advanced routes for core feature + input validation + SQLite indexes

What to build:
- Any remaining routes the core feature needs: [FILL IN]
- Comprehensive validation middleware for all routes:
    checks all required fields, returns {error: "field is required", field: "fieldname"}
- SQLite indexes on columns used in WHERE clauses:
    [FILL IN from SCHEMA.md — which columns get queried most]
- Run full manual test of every route with real data

Pause at 12:00pm. Do not start this phase after 11:30am.
Resume at 1:00pm after the midday merge.

After coder finishes:
- git commit -m "feat: advanced routes + validation + indexes" && git push
- Update PROGRESS.md

Generate: CODER PROMPT + TEST PROMPT + PHYSICAL CHECKLIST
```

---

## PHASE 6 — FULL API TEST PASS
*(~1:00pm after lunch)*

```
PHASE 6: Full API test pass — every route covered

What to build:
- Run all existing tests: npm test — list anything failing
- For any route without a test: write one now
- Edge cases to cover per route: missing required fields, invalid IDs,
  unauthenticated requests, duplicate records
- Fix any bugs found during testing

If test coverage is thin after coder runs, the LLM's coder prompt will include
a 2-agent team: one agent writes missing tests, one agent runs them and reports failures.
This replaces the old /octo:tdd command — the agent team does the same job.

After coder finishes:
- git commit -m "test: full API test pass" && git push
- Update PROGRESS.md: "P2 backend complete"
- After 2:30pm: check if P3 has pivoted to help — coordinate directly

Generate: CODER PROMPT + TEST PROMPT + PHYSICAL CHECKLIST
```

---

## AREA TEST — RUN WHEN ALL PHASES DONE
*(Paste into LLM chat after Phase 6 is verified)*

```
All my backend phases are complete. Generate the area test for the entire
backend using my P2 area test card from FINAL_TEST_PHASE.md.

Output one giant CODER PROMPT I paste into Claude Code. It should write and
run tests/area-p2.test.js covering: schema/migrations, every route in
ROUTES.md (happy path + auth + validation + edge cases), business logic,
external API error handling, and indexes.

I'll paste any failures back here for FIX PROMPTs.
All tests must pass and I message group chat "P2 area tests ✅" when done.
```

---

## HANDOFF TEMPLATE

```
Write my handoff block for Phase [N]. Format:

HANDOFF — [App name] — P2 Backend — branch p2/backend

STATE: [my PROGRESS.md row]
DECISIONS: [current DECISIONS.md]
BLOCKERS: [BLOCKERS.md or "None"]
JUST FINISHED: [one sentence]
NEXT: [Phase N+1 card]

Keep it tight.
```
