# PROMPT 2 — SUBAGENT GENERATOR
**Run at: 9:15am — one person runs this while others read the idea list**

---

## WHAT THIS PROMPT PRODUCES

Two outputs per person (4 people = 8 total outputs):

1. **LLM REFERENCE DOC** — pasted once into the person's claude.ai chat at 9:30am.
   Orients the LLM to the app, the person's role, and how the two-tool system works.
   The LLM uses this context all day when writing coder prompts.

2. **PHASE CARDS** — pasted one at a time into the LLM chat throughout the day.
   Each card tells the LLM what to build in that phase.
   The LLM responds with: CODER PROMPT + TEST PROMPT + PHYSICAL CHECKLIST.

---

## STEP 1 — INTERVIEW BLOCK
*(Paste this into a fresh Claude chat. Answer all 6 questions at once.)*

```
VIKING HACKS 2026 — SUBAGENT GENERATOR

IDEA: [paste chosen idea name + one sentence]
STACK: React + Node/Express + SQLite + [AI APIs if applicable]
UI STYLE: [paste from Prompt 1]

Ask me all 6 questions at once. Wait for answers.
Do not generate anything until I approve the confirmation block.

QUESTIONS:

1. In one sentence, what does a user actually DO in this app?
   Example: "User pastes a job description and gets a tailored cover letter in 10 seconds"

2. What are the exact screens in order from landing to core feature?
   Example: Landing → Login → Dashboard → Upload → Results

3. What data does the app store? List every SQLite table and its key columns.

4. Does this app use AI? YES or NO.
   If YES: exact input format + exact output format + which model/API.
   If NO: describe the core algorithm or logic.

5. What is absolutely OUT OF SCOPE for today? Be ruthless.

6. Describe the exact 3-minute demo click by click.
   Judges: engineers and founders from Retell AI, Apple, Cisco, Casca, IncidentFox.

After I answer, show this block and wait for YES:

---
CONFIRMATION
App name: [inferred]
What it does: [one sentence]
Screens: [list]
DB tables + columns: [list]
AI: [YES + model + input → output] OR [NO + core logic]
Out of scope: [list]
Demo: [click by click]
Stack: React + Node/Express + SQLite + [AI APIs]
UI Style: [style]
Does this match? Reply YES to generate all outputs.
---
```

---

## STEP 2 — GENERATION BLOCK
*(Paste this AFTER the team replies YES)*

```
Generate outputs for all 4 persons.

THE TWO-TOOL SYSTEM (apply this understanding to everything you generate):
- P1, P2, P4: Primary coder is Claude Code (`claude`). It handles all build AND **Git/GitHub operations** (branch, commit, push, PR).
- P3: Primary coder is Blackbox CLI. It handles all UI build AND **browser automation** for physical checks AND **Git/GitHub operations**.
- The LLM chat (claude.ai) receives phase cards and generates prompts for the respective coders.
- For P3, the LLM outputs:
    1. **BLACKBOX PROMPT** (build + Git)
    2. **AUTOMATION PROMPT** (physical browser checks via `blackbox automate`)
    3. **STEP-3.5-FLASH PROMPT** (non-physical logic, type, and lint checks)
- For P1, P2, P4, the LLM outputs:
    1. **CODER PROMPT** (scaffold + Git)
    2. **AGENT TEAM PROMPT** (parallel sub-tasks)

CODER TOOLS:
- P1, P2, P4: Claude Code (claude --dangerously-skip-permissions)
  Claude Code Agent Teams for complex phases with 2+ independent components.
  Agent teams are invoked naturally in the coder prompt and handle their own Git pushes.
- P3: Blackbox CLI (primary coder + physical checks + Git) + Claude Code UI with stepfun/step-3.5-flash:free (secondary agent for logic checks)
  **Competitive Mode (`/multi-agent`):** Used to compare implementations and pick the best one. AI Judge decides.
  **Collaborative Mode (`/agent-team`):** Used for parallel component building. Team Lead delegates sub-tasks.
  **UI Consistency:** All Blackbox prompts MUST start with "Read MASTER.md to follow the design system."
  Every Step-3.5-Flash prompt starts with "Skip preamble. Output code only."
  LLM outputs BLACKBOX PROMPT + AUTOMATION PROMPT + STEP-3.5-FLASH PROMPT.

FOR EACH PERSON, OUTPUT IN THIS ORDER:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 0 — REPO INITIALIZATION FILES (P1 ONLY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The exact content for Person 1 to use when running PROMPT0_GITHUB_REPO.md.
These files must be tailored to the specific app idea and stack.
Generate:
- **AGENTS.md**: Full content defining roles, branches, and stack.
- **PROGRESS.md**: Initial table with all phases for P1, P2, P3, P4.
- **DECISIONS.md**: Log the initial tech stack and design system decisions.
- **BLOCKERS.md**: Empty template.
- **ENV.md**: List of all required keys (.env.example style).
- **GITHUB.md**: Rule set for AI agents (Link branches to roles).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION A — LLM REFERENCE DOC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The text this person pastes ONCE into claude.ai at 9:30am.
This orients the LLM to the project and the two-tool workflow.
Must include:
- App name and one sentence description
- Person's role and branch
- Person's exact responsibilities
- Full stack with file structure conventions
- All SQLite tables and key columns (P2 and P4 especially)
- All screen names and paths (P1 and P3 especially)
- Out of scope list
- The two-tool workflow explanation (LLM outputs prompts, coder executes)
- Which tools the coder uses (Claude Code / Step-3.5-Flash / Blackbox CLI)
- **Git/GitHub Rule:** Coders MUST handle all branching, committing, and pushing.
- Agent teams rule: Claude Code Agent Teams for phases with 2+ independent parallel parts; plain claude for everything else; no teams after 4pm
- Key dependencies (what this person waits for from others)
- "Acknowledge this and wait for my first phase card."
Under 250 words. Dense, not verbose.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION B — PHASE CARDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
One card per phase. Each card gets pasted into the LLM chat individually.
The LLM reads the card and generates the three blocks for that phase.

Person 1: 7 phases (scaffold, auth, shell, merge1, utilities, merge2, deploy)
Person 2: 6 phases (schema, route stubs, CRUD, external API/logic, advanced routes, test pass)
Person 3: 6 phases (shell+landing, core screens, remaining screens, API wiring, states, polish)
Person 4: 6 phases (prompt design, AI scaffold, pipeline, DB wiring, frontend wiring, harden)

Each phase card format:
## PHASE [N] — [NAME]
**Time:** [approximate start time]
**Goal:** [one sentence — what is done when this phase is complete]

**Build:**
[Bullet list of exactly what to build — specific file names, function names, behaviors]
[Include exact input/output shapes for AI phases]
**Git:** Instruct the coder to branch, commit, and push.
[If this is a complex phase with 2+ independent parallel parts: include an agent team invocation block.]

**After coder finishes:**
- git commit -m "[message]" && git push origin [branch]
- Update PROGRESS.md: [exact row update]
- [any group chat message]
- [any DECISIONS.md entry]

**Ask LLM:** "Generate prompts and checklists for Phase [N]."

Special cases:
- Person 3: cards say "Generate BLACKBOX PROMPT + AUTOMATION PROMPT + STEP-3.5-FLASH PROMPT + PHYSICAL CHECKLIST"
  BLACKBOX PROMPT handles the build logic and Git.
  AUTOMATION PROMPT provides the `blackbox automate` command to verify UI/UX (physical checks).
  STEP-3.5-FLASH PROMPT provides non-physical logic, type, and lint checks.
- Person 1 merge phases: cards include full pre-merge checklist and say
  "Generate PRE-MERGE CHECKLIST + CONFLICT GUIDE + POST-MERGE CHECKLIST"
- Person 4 Phase 1 (prompt design): card says "Work through prompt design with me in
  this chat first, then generate CODER PROMPT for server/ai/prompt.js"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION C — AGENTS.md (Person 1 only)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Full AGENTS.md content for the repo root. Person 1 pastes this as the
coder prompt in Phase 1. All Claude Code sessions read this automatically.
Include: app name, what it does, full stack, file structure, SQLite table
names + columns, API base URL, auth pattern, env var names, branch conventions.

GENERATION RULES:
- Every phase card is hyper-specific to this exact app — no placeholders
- Section 0 must provide READY-TO-PASTE file content for the 8:45am repo setup.
- Person 2 Phase 1 and 2 cards explicitly say to push SCHEMA.md and ROUTES.md
  and message group chat immediately — these unblock P3 and P4
- Person 3 every card starts with "Read MASTER.md to follow the design system" in the Blackbox prompt. All physical checks for P3 are automated via Blackbox browser automation. All other checks are handled by Step-3.5-Flash.
- Person 4 Phase 1 is prompt-design-in-chat first, then CODER PROMPT for the file.
- Coders handle all Git/GitHub operations.
- For complex phases with 2+ parallel parts: LLM includes agent team invocation in the coder prompt.
- For simple phases: coder prompt is a plain claude command — no agent team
- P1 merge phases: coder prompt includes the merge review 2-agent team
- Agent teams: 2-5 agents max, each owns specific files, named message recipients
- All phases max 45 minutes
```
