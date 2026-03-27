# P1 GUIDE — PERSON 1: DEVOPS & GLUE

## HOW THIS GUIDE WORKS

You run two tools side by side all day:

- **LLM chat** (claude.ai) — planning and prompt writing.
- **Coder** (Claude Code: `claude --dangerously-skip-permissions`) — executes the build.
- **Speed Engine** (Agent Teams) — used for parallel work.

Flow per phase:
```
Paste phase card → LLM → CODER PROMPT    → paste into Claude Code
                       → TEST PROMPT     → paste into Claude Code
                       → CHECKLIST       → you verify manually
```

---

## PROJECT BRIEF
*(Fill in [FILL IN] from Prompt 2's output. Paste this first into claude.ai at 9:30am.)*

```
You are my LLM assistant for Viking Hacks 2026 — a 9-hour hackathon ending at 6pm today.

My role: Person 1 — DevOps & Glue
My branch: p1/setup
My job: repo scaffold, auth, shared layout, integration merges, deployment

App: [FILL IN — name + one sentence]
Stack: React + Node/Express + SQLite (better-sqlite3) + [AI APIs if used]

HOW WE WORK:
- Claude Code is my PRIMARY coder.
- Agent Teams are my speed engine for complex phases.
- For every phase, output:
  1. CODER PROMPT (Pasted into Claude Code)
  2. TEST PROMPT (Pasted after build)
  3. PHYSICAL CHECKLIST (Manual verification)
- Use Agent Teams for ALL phases with 2+ parallel components.
- No agent teams after 4pm — plain claude only.
- Acknowledge this and wait for my first phase card.
```

---

## PHASE 1 — REPO VALIDATION + AGENTS.md
*(~9:30am — paste this into LLM chat)*

```
PHASE 1: Repo validation and AGENTS.md

Goal: Confirm the scaffolded monorepo from PROMPT0 is correct and add the core AGENTS.md.

What to do:
- Validate the file structure: /client (React/Vite), /server (Express/better-sqlite3).
- Verify the memory files exist: PROGRESS.md, DECISIONS.md, BLOCKERS.md, ENV.md, GITHUB.md.
- Create/Update AGENTS.md in the root — [FILL IN app details from Section 0].
- Add server/index.js — Express on port 3001, GET /health returns {ok:true}.
- Add client/src/App.jsx — renders "App is running".
- Ensure .env.example contains all keys from Section 0 ENV.md.

After coder finishes:
- git add . && git commit -m "feat: validate scaffold + agents" && git push origin p1/setup
- Message group chat: "Repo validated. AGENTS.md pushed. Pull p1/setup."
- Update PROGRESS.md: P1 | Phase 1 ✅ | scaffold + AGENTS.md | Phase 2 next

Generate: CODER PROMPT + TEST PROMPT + PHYSICAL CHECKLIST
```

---

## PHASE 2 — AUTH
*(Paste when Phase 1 checklist passes)*

```
PHASE 2: Auth — JWT signup, login, protected routes

What to build:
- users table SQLite migration (id, email, password_hash, created_at)
- POST /api/auth/register — validate email+password, bcrypt hash, insert user, return JWT
- POST /api/auth/login — find user, compare hash, return JWT
- server/middleware/auth.js — verifies JWT, attaches req.user, returns 401 if invalid
- GET /api/me — protected route, returns req.user

Packages: bcrypt, jsonwebtoken
JWT secret from process.env.JWT_SECRET

After coder finishes:
- git commit -m "feat: auth" && git push
- Update PROGRESS.md
- Add to DECISIONS.md: "Auth — JWT — [reason]"
- Message group: "Auth done on p1/setup. Middleware at server/middleware/auth.js"

Generate: CODER PROMPT + TEST PROMPT + PHYSICAL CHECKLIST
```

---

## PHASE 3 — SHARED LAYOUT + ROUTING
*(Paste when Phase 2 checklist passes)*

```
PHASE 3: React shell, nav, routing

What to build:
- Install react-router-dom
- client/src/Layout.jsx — nav bar with logo + links, main content slot
- Route structure for all screens: [FILL IN from interview — list every screen path]
- Placeholder page components for each route (just renders the route name)
- Auth guard — if no JWT in localStorage, redirect to /login
- Export route config from client/src/routes.js

After coder finishes:
- git commit -m "feat: shell + routing" && git push
- Update PROGRESS.md
- Message group: "Shell done. Routes: [list]. P3 can start screens."

Generate: CODER PROMPT + TEST PROMPT + PHYSICAL CHECKLIST
```

---

## PHASE 4 — INTEGRATION MERGE 1
*(Run at 12:10pm — do not start before)*

```
PHASE 4: Midday integration merge

This phase is different — I am doing the merge manually, not the coder.
Help me prepare and then guide me through it.

Pre-merge steps I need to do (IN ORDER):
1. Check aoe dashboard — all sessions must show idle/waiting
   Fallback: message group "Merging in 5 min — send ✅ when idle"
2. Run the merge review agent team in Claude Code (template in WORKFLOW.md)
   Wait for docs/merge-review.md to be written — read it fully
3. Run the full demo scenario on localhost before touching git

Merge process:
- Merge branches in the order docs/merge-review.md proposed
- For each conflict I'll paste it to you and you give me a FIX PROMPT
- Hard rule: any conflict >20 minutes → hardcode that feature → move on

After merge:
- npm run dev — confirm app runs end to end
- git commit -m "chore: midday merge" && git push origin main
- Update PROGRESS.md for all persons
- Message group: "Merge done. Pull main. Resume phases."

Generate:
- PRE-MERGE CHECKLIST (things to verify before touching git)
- CONFLICT RESOLUTION GUIDE (what to do for common conflict types)
- POST-MERGE PHYSICAL CHECKLIST
```

---

## PHASE 5 — SHARED UTILITIES
*(~1:00pm after lunch)*

```
PHASE 5: Shared utilities, error handling, API helper

What to build:
- client/src/components/ErrorBoundary.jsx — catches React errors, shows fallback UI
- client/src/components/LoadingSpinner.jsx — reusable spinner
- client/src/components/Toast.jsx — success/error notification component
- client/src/lib/api.js — apiCall(endpoint, options) helper:
    reads JWT from localStorage
    sets Authorization: Bearer header
    sets Content-Type: application/json
    parses response, throws on non-2xx
- server/middleware/errorHandler.js — global Express error handler:
    catches unhandled errors, logs them, returns {error: message}
- Mount errorHandler as last middleware in server/index.js

After coder finishes:
- git commit -m "feat: utilities + error handling" && git push
- Update PROGRESS.md
- Message group: "apiCall helper at client/src/lib/api.js — use this for all API calls"

Generate: CODER PROMPT + TEST PROMPT + PHYSICAL CHECKLIST
```

---

## AREA TEST — RUN BEFORE PHASE 6 MERGE
*(After Phase 5 is verified — paste into LLM chat)*

```
My Phase 5 is done. Before I run the merge, generate the area test for my
integration layer. Use my P1 area test card from FINAL_TEST_PHASE.md.

Output one giant CODER PROMPT I paste into Claude Code. It should write and
run tests/area-p1.test.js covering: auth layer, routing/shell, shared utilities,
repo health (npm run build clean, no stray console.logs).

After I paste it into Claude Code and tests run, I'll paste any failures
back here for FIX PROMPTs. All tests must pass before I start the merge.
```

---

## PHASE 6 — INTEGRATION MERGE 2
*(Run at 3:30pm — same process as Phase 4)*

```
PHASE 6: Afternoon integration merge

Same process as Phase 4:
1. Check aoe (or ✅ group chat)
2. Run merge review agent team in Claude Code → read docs/merge-review.md
3. Merge in proposed order

Additional step after merge:
- Run the FULL 3-minute demo scenario from start to finish
- Fix any integration bugs: paste errors to you, you give FIX PROMPTs
- If something is broken and can't be fixed in 15 minutes:
  ask you for a HARDCODE PROMPT — convincing demo version of that feature

After merge:
- git commit -m "chore: afternoon merge" && git push origin main
- Update PROGRESS.md
- Message group: "Merge 2 done. Demo runs. Final push to 5pm."

**Immediately after merge — run combined E2E test:**
```
Merge is complete. Now generate the combined end-to-end test using my
combined E2E card from FINAL_TEST_PHASE.md.

Output one giant CODER PROMPT I paste into Claude Code. It should write and
run tests/e2e-combined.test.js covering the full user journey, cross-area
integration, performance, and demo data. Then run ALL test files: npm test.

I'll paste any failures back here for FIX PROMPTs. Fix priority: auth >
core feature > data display > polish.
```

Generate:
- PRE-MERGE CHECKLIST
- POST-MERGE PHYSICAL CHECKLIST
- DEMO RUN CHECKLIST (step by step demo verification)
```

---

## PHASE 7 — DEPLOY + SEED + CONFIRM
*(~4:30pm)*

```
PHASE 7: Deploy, seed demo data, confirm live URL

What to build:
- server/db/seed.js — inserts realistic demo data:
    [FILL IN from interview — what data makes the app look active on stage]
    Enough rows to look like real usage (5-10 records minimum)
- Deploy to [Vercel/Railway/Render — whichever was set up]
- Set all env vars on deploy platform

After coder finishes seed script:
- node server/db/seed.js — run it
- Deploy
- Run full demo on LIVE URL (not localhost)

After phase:
- Update PROGRESS.md: all phases complete
- Share live URL in group chat

Generate: CODER PROMPT (seed script) + DEPLOY CHECKLIST + PHYSICAL CHECKLIST
```

---

## HANDOFF TEMPLATE
*(Ask LLM to generate this at end of any phase before switching chats)*

```
Write my handoff block for Phase [N]. Format:

HANDOFF — [App name] — P1 DevOps — branch p1/setup

STATE: [my current PROGRESS.md row]
DECISIONS: [current DECISIONS.md]
BLOCKERS: [current BLOCKERS.md or "None"]
JUST FINISHED: [one sentence]
NEXT: [Phase N+1 card]

Keep it tight.
```
