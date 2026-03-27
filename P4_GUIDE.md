# P4 GUIDE — PERSON 4: AI FEATURE DEV

## HOW THIS GUIDE WORKS

Two tools running side by side:

- **LLM chat** (claude.ai) — planning and prompt writing.
- **Coder** (Claude Code: `claude --dangerously-skip-permissions`) — executes the build.
- **Speed Engine** (Agent Teams) — used for parallel work.

Error loop: paste coder errors back to LLM → LLM outputs FIX PROMPT → paste to coder.

---

## PROJECT BRIEF
*(Fill in [FILL IN] from Prompt 2's output. Paste first into claude.ai at 9:30am.)*

```
You are my LLM assistant for Viking Hacks 2026 — a 9-hour hackathon ending at 6pm today.

My role: Person 4 — AI Feature Dev
My branch: p4/feature
My job: AI prompt design, model integration, input/output pipeline, DB + frontend wiring

App: [FILL IN — name + one sentence]
AI feature: [FILL IN]
Stack: Node/Express + SQLite

HOW WE WORK:
- Claude Code is my PRIMARY coder.
- Agent Teams are my speed engine for complex phases.
- For every phase, output:
  1. CODER PROMPT (Pasted into Claude Code)
  2. TEST PROMPT (Pasted after build)
  3. PHYSICAL CHECKLIST (Manual verification)
- Acknowledge and wait for Phase 1.
```

---

## PHASE 1 — AI PROMPT DESIGN
*(9:30am — no code dependencies, start immediately)*

```
PHASE 1: Design and validate the AI prompt before writing any code

This phase is entirely in this LLM chat — no coder involved yet.
Help me design a prompt that reliably produces the right output.

AI task: [FILL IN — exact description of what the AI needs to do]
Input format: [FILL IN — what data goes in, exact shape]
Expected output format: [FILL IN — JSON? Plain text? Specific structure?]

Steps:
1. Write 3 candidate system prompts + user message templates
2. Test each against these 5 realistic inputs: [FILL IN — 5 real test cases]
3. Pick the best one — explain why
4. Write the final prompt as an exported JS constant

Output format for the chosen prompt:
  export const SYSTEM_PROMPT = `...`
  export const userPrompt = (input) => `...`

After we validate the prompt in this chat:
Generate: CODER PROMPT (writes server/ai/prompt.js) + PHYSICAL CHECKLIST

Then:
- git commit -m "feat: AI prompt" && git push origin p4/feature
- Update PROGRESS.md
- Add to DECISIONS.md: "AI prompt — [model] — [one sentence why]"
```

---

## PHASE 2 — AI SCAFFOLD + RAW API CALL
*(~10:15am)*

```
PHASE 2: AI client, service, test route — raw API call working end to end

What to build:
- Install AI SDK: [FILL IN — openai / @anthropic-ai/sdk / etc]
- server/ai/client.js — initialise AI client using process.env.[API_KEY_VAR]
- server/ai/service.js — processAIRequest(rawInput):
    imports prompt from server/ai/prompt.js
    calls AI API
    returns parsed output or {error: message}
- POST /api/ai/test — accepts input, calls processAIRequest, returns result
- Handle API errors: rate limit → 429, bad key → 500 {error: "AI service unavailable"}

This phase has 3+ independent parts (client + service + route + error handling).
The LLM's coder prompt will include an agent team invocation. Example pattern:

  Goal: Scaffold the AI feature — client, service, and test route in parallel.
  Create a team of 3 agents using Sonnet.
  Agent 1 — AI Client: creates server/ai/client.js only. Initialises [model] client.
    When done message Agent 2.
  Agent 2 — AI Service: wait for Agent 1's message. Creates server/ai/service.js only.
    Imports prompt from server/ai/prompt.js. Calls AI, returns parsed output.
    When done message Agent 3.
  Agent 3 — Route Builder: wait for Agent 2's message. Creates POST /api/ai/test in
    server/routes/ai.js and mounts it in server/index.js. Owns those two files only.
  Final deliverable: all three files exist, POST /api/ai/test returns real AI response.

After coder finishes:
- git commit -m "feat: AI service + test route" && git push
- Update PROGRESS.md

Generate: CODER PROMPT + TEST PROMPT + PHYSICAL CHECKLIST
```

---

## PHASE 3 — INPUT + OUTPUT PIPELINE
*(~11:00am)*

```
PHASE 3: Production-grade input/output pipeline

What to build (improvements to server/ai/service.js):

Input pipeline:
- Validate required fields: [FILL IN from interview] → return {error, field} if missing
- Format raw user data into exact prompt format (call userPrompt() from prompt.js)

Output pipeline:
- Parse AI response safely — wrap in try/catch
- Extract expected fields: [FILL IN — what fields come out]
- Transform into exact DB/frontend shape: [FILL IN — what shape downstream needs]
- Fallback: if parsing fails → return {error: "Could not process response", raw: response}

Final exported signature: async processAIRequest(rawInput) → {result} OR {error}

After coder finishes:
- git commit -m "feat: AI pipeline" && git push
- Update PROGRESS.md
- Pause at 12pm for merge. Resume at 1pm.

Generate: CODER PROMPT + TEST PROMPT + PHYSICAL CHECKLIST
```

---

## PHASE 4 — WIRE AI TO DATABASE
*(~1:00pm — after merge. Pull main first. Need SCHEMA.md)*

```
PHASE 4: Wire AI feature to SQLite — save and retrieve results

Dependency: SCHEMA.md must be available. Paste it to me now so I can
reference exact table/column names in the coder prompt.

SCHEMA.md contents: [paste SCHEMA.md here when P2 pushes it]

What to build:
- After processAIRequest() returns a result, save it to the DB
- Table to write to: [LLM will fill from SCHEMA.md]
- POST /api/[feature] endpoint:
    validate input → call processAIRequest → save to DB → return result
- GET /api/[feature]/:userId endpoint:
    return all saved results for user, newest first

Use better-sqlite3 prepared statements for all queries.

After coder finishes:
- git commit -m "feat: AI DB persistence" && git push
- Update PROGRESS.md

Generate: CODER PROMPT + TEST PROMPT + PHYSICAL CHECKLIST
```

---

## PHASE 5 — WIRE AI TO FRONTEND
*(~1:45pm — need ROUTES.md. P3 may help here)*

```
PHASE 5: Wire AI feature to frontend — user triggers it, sees results

Dependency: ROUTES.md should be available. Paste relevant routes:
[paste P2's ROUTES.md entries for the AI endpoints]

If P3 is available: hand this phase to P3.
Tell them: "AI endpoint is POST /api/[feature], expects [input shape], returns [output shape].
Component to update is [component name]."

If doing it yourself:
What to build:
- Update [component name] to call POST /api/[feature] via apiCall() helper
  (apiCall is at client/src/lib/api.js — handles JWT automatically)
- Loading state while AI processes (AI can take 2-10 seconds — show clear indicator)
- Display result: [FILL IN — exactly how result should look on screen]
- Error state: friendly message + retry button

After coder finishes:
- git commit -m "feat: AI frontend wiring" && git push
- Update PROGRESS.md

Generate: CODER PROMPT + TEST PROMPT + PHYSICAL CHECKLIST
```

---

## PHASE 6 — HARDEN + SEED + TESTS
*(~2:30pm — agent test team at 4pm)*

```
PHASE 6: Harden AI feature for demo day

What to build:
- Rate limiting: reject if same user makes >1 request per 3 seconds
  Simple: store lastRequestTime in memory per userId, check on each request
- server/db/seedAI.js — inserts 3-5 realistic example AI results:
    [FILL IN — what results look impressive for this app on stage]
- Run 10 real demo scenarios through the full pipeline

After coder finishes seed script:
- node server/db/seedAI.js
- Run the 10 scenarios manually
- If output quality is poor on any scenario: paste result to me, I'll improve the prompt

At 4:00pm — ask your LLM to generate a test generation coder prompt:
```
Generate a CODER PROMPT that spins up a 2-agent test team in Claude Code:
Agent 1 writes comprehensive tests for all AI feature code.
Agent 2 runs the tests and sends any failures back to Agent 1 to fix.
Final deliverable: tests/area-p4.test.js passing.
```
Paste that coder prompt into Claude Code. The agent team writes and runs the tests.
No more agent teams after 4pm — plain claude only for the final hour.

After phase:
- git commit -m "feat: AI hardening + seed + tests" && git push
- Update PROGRESS.md: "P4 all phases complete"

Generate: CODER PROMPT (rate limit + seed) + TEST PROMPT + PHYSICAL CHECKLIST
```

---

## AREA TEST — RUN WHEN ALL PHASES DONE
*(Paste into LLM chat after Phase 6 hardening is verified — before the 4pm test team)*

```
All my AI feature phases are complete. Generate the area test for the entire
AI feature using my P4 area test card from FINAL_TEST_PHASE.md.

Output one giant CODER PROMPT I paste into Claude Code. It should write and
run tests/area-p4.test.js covering: prompt exports, input pipeline validation,
output pipeline parsing, all AI endpoints (happy path + auth + rate limit + errors),
10 real demo scenario inputs with quality scores, and seed data accessibility.

Mock the AI API client for unit tests so they run fast without burning API credits.
Only the 10 demo scenarios should make real AI calls.

I'll paste any failures or quality score 1s back here for FIX PROMPTs.
Message group chat "P4 area tests ✅" when done.
```

---

## HANDOFF TEMPLATE

```
Write my handoff block for Phase [N]. Format:

HANDOFF — [App name] — P4 AI Feature — branch p4/feature

STATE: [my PROGRESS.md row]
DECISIONS: [DECISIONS.md — especially AI model/prompt decisions]
BLOCKERS: [BLOCKERS.md or "None"]
JUST FINISHED: [one sentence]
NEXT: [Phase N+1 card]

Keep it tight.
```
