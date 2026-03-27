╔══════════════════════════════════════════════════════════════════════════╗
║           VIKING HACKS 2026 — COMPLETE HACKATHON TOOLKIT  v7            ║
║                       March 28th · Fremont, CA                          ║
║                                                                          ║
║  Powered by:                                                             ║
║    claude-octopus   (github.com/nyldn/claude-octopus)                   ║
║    UI UX Pro Max    (github.com/nextlevelbuilder/ui-ux-pro-max-skill)   ║
║    21st.dev MCP     (mcp.21st.dev)                                       ║
║    agent-of-empires (github.com/njbrake/agent-of-empires)               ║
║    awesome-claude-code (github.com/hesreallyhim/awesome-claude-code)    ║
╚══════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT CHANGED IN v7
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  — CCS removed entirely. Everyone opens Claude Code directly.
    /octo:factory handles all model routing internally — it picks
    Gemini or Codex for subagents based on the task type.
    No routing layer to install, configure, or debug.

  — One terminal per person. No dual-terminal pattern.
    /octo:factory replaces the Codex parallel terminal. When it
    needs a second model it routes internally and invisibly.

  — ALL plugins installed the night before. Nothing installed
    on hackathon day. If it isn't installed tonight, it doesn't exist.

  — GSD removed. /octo:factory replaces all planning + execution.
    Write CONTEXT.md in 60 seconds → run /octo:factory → verify.
    No discuss-phase, no plan-phase, no XML overhead.

  — Subagents spawn only when genuinely needed. /octo:factory
    self-evaluates. Single-file tasks run solo. Complex parallel
    phases spawn subagents routed to Gemini or Codex as appropriate.

  — Backend: Node/Express + SQLite. No Supabase. Zero config.

  — Person 3: Claude Code UI with Nemotron 3 Super 120B + Blackbox CLI
    + 21st.dev MCP + UI UX Pro Max. Finishes frontend fast, pivots
    to help the rest of the team in the afternoon.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROMPTS IN THIS TOOLKIT:
  PROMPT 1 — IDEA FINDER
  PROMPT 2 — SUBAGENT GENERATOR  (octo:factory-powered)
  PROMPT 3 — PITCH PREP
  PROMPT 4 — SUBMISSION CHECKLIST
  PROMPT 5 — EMERGENCY SCOPE CUT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEAM SETUP — WHO USES WHAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Person 1 — Claude Code Pro — DevOps & Glue
    One terminal: claude --dangerously-skip-permissions
    /octo:factory for all phase execution
    /octo:embrace before every merge
    aoe dashboard in a second window (monitor only — no interaction)

  Person 2 — Claude Code Pro — Backend Dev
    One terminal: claude --dangerously-skip-permissions
    /octo:factory for all phase execution
    TDD Guard hook enforces test coverage automatically

  Person 3 — Claude Code UI (Nemotron 3 Super 120B) + Blackbox CLI
    Claude Code interface: Nemotron model, 21st.dev MCP, UI UX Pro Max
    Blackbox CLI: frontend execution, refinement, iteration
    Finishes frontend fast → pivots to help P4, P2, P1 in that order

  Person 4 — Claude Code Pro — AI Feature Dev
    One terminal: claude --dangerously-skip-permissions
    /octo:factory for all AI phase scaffolding and iteration
    /octo:tdd at 4pm to wrap test suite automatically

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRE-HACKATHON SETUP  (do ALL of this the night before — March 27th)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RULE: Nothing gets installed on hackathon day. If it is not installed
and verified tonight, it does not exist tomorrow. Do not skip steps.

── STEP 1: INSTALL CLAUDE CODE (PERSONS 1, 2, AND 4) ───────────────────

  npm install -g @anthropic-ai/claude-code
  claude --version  ← must show a version number

  Set permissions so Claude runs without approval interruptions:
  Create or edit ~/.claude/settings.json:

  {
    "permissions": {
      "allow": [
        "Bash(date:*)", "Bash(echo:*)", "Bash(cat:*)", "Bash(ls:*)",
        "Bash(mkdir:*)", "Bash(wc:*)", "Bash(head:*)", "Bash(tail:*)",
        "Bash(sort:*)", "Bash(grep:*)", "Bash(tr:*)", "Bash(git add:*)",
        "Bash(git commit:*)", "Bash(git status:*)", "Bash(git log:*)",
        "Bash(git diff:*)", "Bash(git tag:*)", "Bash(npm:*)",
        "Bash(node:*)", "Bash(sqlite3:*)"
      ]
    }
  }

── STEP 2: INSTALL CLAUDE-OCTOPUS (PERSONS 1, 2, AND 4) ─────────────────

/octo:factory is the primary build command for all three persons.
It replaces the old discuss-phase + plan-phase + execute-phase loop.
Write CONTEXT.md in 60 seconds → run /octo:factory → verify.

When /octo:factory needs parallel subagents, it routes internally:
  — Gemini: used for broad research, UI generation, lightweight tasks
  — Codex: used for test writing, build verification, mechanical tasks
  — Claude: used for architecture decisions and complex logic
  It picks the right model automatically based on the subtask type.
  Subagents only spawn when the task genuinely requires parallelism.
  Single-file and wiring tasks run as a solo Claude pass.

  Open a Claude Code session and run:
    /plugin install claude-octopus@nyldn-plugins

  Fallback if /plugin is unavailable:
    git clone https://github.com/nyldn/claude-octopus
    cp -r claude-octopus/.claude/* ~/.claude/

  Verify tonight (not tomorrow):
    claude  ← open a session
    /octo:help  ← must show all octopus commands
    /octo:factory "hello world test"  ← must respond and complete

  Commands used on hackathon day:
    /octo:factory "implement CONTEXT.md"
      → Primary build command. Reads CONTEXT.md, runs the phase,
        validates output against Pass criteria, delivers.
    /octo:embrace
      → Person 1 only. Run before every integration merge.
        Scans all branches, flags conflicts, proposes merge order.
    /octo:tdd
      → Person 4 at 4pm. Auto-wraps tests around all AI feature code.
        Also available to Person 2 as a backup if coverage is thin.

  CONTEXT.md format — write this before every phase (takes 60 seconds):
  ┌─────────────────────────────────────────────────────────────┐
  │ # CONTEXT: [Phase Name]                                     │
  │ Build: [1-2 sentences — exactly what to build]             │
  │ Stack: [only the parts of the stack relevant to this phase]│
  │ Pass:                                                       │
  │   - [criterion 1 — specific and checkable]                 │
  │   - [criterion 2]                                          │
  │   - [criterion 3]                                          │
  │ Out of scope: [what NOT to build in this phase]            │
  └─────────────────────────────────────────────────────────────┘

  Keep CONTEXT.md short. The factory handles the rest.
  Overly detailed CONTEXT.md → unnecessary subagent spawns → wasted credits.
  If you see subagents on a simple task: cancel, narrow CONTEXT.md, re-run.

  Ad-hoc single-file fixes — do NOT use /octo:factory:
    claude "[specific fix in one sentence]"
    /octo:factory is for phases with 3+ deliverables. Not for typos.

── STEP 3: INSTALL AGENT-OF-EMPIRES (PERSON 1 ONLY) ─────────────────────

  Install Rust first:
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    source $HOME/.cargo/env

  Install aoe:
    curl -fsSL https://raw.githubusercontent.com/njbrake/agent-of-empires/main/scripts/install.sh | bash

  Fallback if Rust is a pain:
    npm install -g ccmanager
    ccmanager init

  Verify tonight:
    aoe --version  ← must show version number
    aoe  ← must open TUI dashboard

  aoe status meanings:
    Active  → /octo:factory is running — DO NOT pull this branch
    Waiting → session needs input
    Idle    → phase complete — safe to pull

  Group chat fallback (when aoe can't see a session):
    Each team member sends ✅ in group chat when their phase is done.
    Person 1 waits for all ✅ OR all-idle in aoe before any merge.
    Never pull without one of these two signals.

── STEP 4: INSTALL UI UX PRO MAX (PERSON 3) ─────────────────────────────

  npm install -g uipro-cli
  uipro init --ai claude  ← run in your project folder

  Verify:
    uipro --version  ← must show version number
    .claude/skills/ui-ux-pro-max/ folder must exist in the project

── STEP 5: INSTALL 21ST.DEV MCP (PERSON 3) ──────────────────────────────

21st.dev MCP generates production-ready React/Tailwind components
inside the Claude Code interface. Combined with Nemotron's instruction-
following and Blackbox CLI refinement, Person 3 can build full screens
in minutes.

  In Claude Code → Settings → MCP Servers → Add Server:
    URL:  https://mcp.21st.dev
    Name: 21st-dev

  Verify tonight:
    Open a Claude Code session (Nemotron model active)
    Type: /mcp 21st-dev  ← must respond

── STEP 6: CONFIGURE NEMOTRON IN CLAUDE CODE (PERSON 3) ─────────────────

Person 3 uses the Claude Code interface for plugin access (21st.dev MCP,
UI UX Pro Max) but runs Nemotron 3 Super 120B as the underlying model.

  In Claude Code → Settings → Model → select Nemotron 3 Super 120B
  Confirm the model name appears in the session header before closing.

  Nemotron prompt rule — add this to the TOP of every Claude Code prompt:
    "Skip all preamble. No explanations unless asked. Output code only."
  Nemotron over-explains without this. The hint keeps it fast and cheap.

── STEP 7: INSTALL BLACKBOX CLI (PERSON 3) ──────────────────────────────

Blackbox CLI is Person 3's execution engine. Claude Code (Nemotron)
generates structure and logic. Blackbox refines and iterates on files.

  npm install -g @useblackbox/cli
  blackbox login
  blackbox --version  ← must show version number

  File handoff rule between tools:
    1. Claude Code (Nemotron) generates the component or file
    2. Save the file to the project directory
    3. Close that file in Claude Code
    4. Open in Blackbox CLI: blackbox chat --file [filename]
    5. Blackbox refines in place
    6. Commit from the project directory
    Never have the same file open in both tools simultaneously.
    One tool owns a file at a time. Commit is the handoff.

── STEP 8: INSTALL RECOMMENDED TOOLS (ALL PERSONS) ──────────────────────

  a) ccusage — track token burn  (Persons 1, 2, and 4)
     npm install -g ccusage
     Run every 90 minutes on hackathon day: ccusage
     High burn = unnecessary subagents. Narrow the CONTEXT.md.

  b) TDD Guard — test enforcer hook  (Person 2)
     https://github.com/nizos/tdd-guard
     Follow README — drops a hook into .claude/hooks/
     Blocks Claude from shipping untested routes automatically.
     Works inside the Claude Code session. No second terminal needed.

── STEP 9: GIT SETUP (PERSON 1 — TONIGHT) ───────────────────────────────

  Create the repo tonight. Do not wait until 9am.

  Person 1 creates all branches:
    git checkout -b p1/setup && git push -u origin p1/setup
    git checkout main && git checkout -b p2/backend && git push -u origin p2/backend
    git checkout main && git checkout -b p3/frontend && git push -u origin p3/frontend
    git checkout main && git checkout -b p4/feature && git push -u origin p4/feature

  Create AGENTS.md in repo root tonight:
    All Claude Code sessions read this file for project context.
    /octo:factory uses it automatically when it's in the repo root.
    Include: app name, tech stack (Node/Express + SQLite), file structure
    conventions, env variable names, API base URL, auth patterns.

  Branch structure:
    main        → deployable at all times. Person 1 merges here only.
    p1/setup    → Person 1
    p2/backend  → Person 2
    p3/frontend → Person 3
    p4/feature  → Person 4

── STEP 10: PERSON 3 — DESIGN SYSTEM PREP ───────────────────────────────

Once you know the hackathon theme tomorrow morning, run in Claude Code:
  python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
    "[theme keywords]" --design-system -p "realhackthon" --persist

This creates design-system/MASTER.md.
Paste the full MASTER.md at the top of every Blackbox CLI prompt all day.
This is how the design system stays consistent — manual paste, always effective.

── NIGHT-BEFORE VERIFICATION CHECKLIST (everyone, before sleeping) ───────

Do not sleep until everything below shows ✅.

  Person 1:
    claude --version                    ✅ shows version
    /octo:help (in a claude session)    ✅ shows command list
    /octo:factory "hello world test"    ✅ completes without error
    aoe --version                       ✅ shows version
    aoe                                 ✅ opens TUI dashboard

  Person 2:
    claude --version                    ✅ shows version
    /octo:help (in a claude session)    ✅ shows command list
    /octo:factory "hello world test"    ✅ completes without error
    TDD Guard hook in .claude/hooks/    ✅ file exists

  Person 3:
    uipro --version                     ✅ shows version
    blackbox --version                  ✅ shows version
    Claude Code → model header          ✅ shows Nemotron 3 Super 120B
    /mcp 21st-dev (in Claude Code)      ✅ responds

  Person 4:
    claude --version                    ✅ shows version
    /octo:help (in a claude session)    ✅ shows command list
    /octo:factory "hello world test"    ✅ completes without error

  If anything fails tonight: fix it tonight.
  If you cannot fix it tonight: tell the team so there's a fallback plan.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REAL SCHEDULE — VIKING HACKS 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  7:30am  — Arrive, check in, eat, settle

  8:30am  — Kickoff

  9:00am  — Teams locked → RUN PROMPT 1 (Idea Finder)

  9:15am  — Pick idea → RUN PROMPT 2 (Subagent Generator)

  9:30am  — Everyone splits → BUILD
             Person 1: claude --dangerously-skip-permissions
                       aoe open in second window (keep open all day)
             Person 2: claude --dangerously-skip-permissions
             Person 3: Claude Code UI (Nemotron active)
                       Run UI UX Pro Max design system first (15 min)
                       Then Blackbox CLI open and ready
             Person 4: claude --dangerously-skip-permissions

  11:45am — Person 1: check aoe — all sessions must show idle/waiting
             Fallback: all team members send ✅ in group chat

  12:10pm — MIDDAY SYNC: Person 1 runs /octo:embrace, then merges
             Confirm app runs end to end on Person 1's machine
             Rule: if merge takes >20min → hardcode the feature,
                   move on. Do not chase the merge.

  12:30pm — Lunch

  1:00pm  — Resume all sessions

  2:30pm  — Person 3 target: frontend complete. Message group chat.
             Pivot to: P4 AI feature wiring → P2 backend testing →
                       P1 integration prep (in that order)

  3:15pm  — Person 1: check aoe again — all must show idle/waiting
             Fallback: ✅ in group chat from everyone

  3:30pm  — INTEGRATION MERGE 2 (Person 1 only)
             /octo:embrace before pulling anything
             Same >20min hardcode rule applies

  4:00pm  — CHECK: if behind → RUN PROMPT 5 immediately
             Person 4: run /octo:tdd now

  5:00pm  — HARD STOP on new features
             Person 1: final merge + deploy
             Everyone else: RUN PROMPT 3 (Pitch Prep)

  5:30pm  — RUN PROMPT 4 (Submission Checklist)

  6:00pm  — SUBMIT

  6:30pm  — Present to judges

  8:00pm  — Judging ends

  8:30pm  — Closing ceremony

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WORKFLOW — HOW YOUR TEAM OPERATES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE PHASE LOOP — PERSONS 1, 2, AND 4:

  Every phase follows the same three steps:

  STEP 1 — Write CONTEXT.md (60 seconds max):
    # CONTEXT: [Phase Name]
    Build: [what to build in 1-2 sentences]
    Stack: [only the stack parts relevant to this phase]
    Pass:
      - [checkable criterion 1]
      - [checkable criterion 2]
      - [checkable criterion 3]
    Out of scope: [what not to build]

    Short = good. Long CONTEXT.md triggers unnecessary subagent spawns.

  STEP 2 — Run the factory:
    /octo:factory "implement CONTEXT.md"

    The factory reads CONTEXT.md and decides:
      Solo run   → single-file or wiring tasks, linear sequences
      Subagents  → 3+ genuinely independent components in one phase
                   routes to Gemini (broad/UI tasks) or Codex (test/
                   build tasks) based on subtask type, automatically

    You will see: "Running solo" or "Spawning N subagents for: [reason]"
    If subagents appear on a simple task: Ctrl+C, narrow CONTEXT.md, retry.

    Quality gate: validates output against Pass criteria before delivering.
    You can step away while a long phase runs.

  STEP 3 — Verify manually:
    Does the output match the Pass criteria? Click through it.
    Yes → commit to your branch → git push → message group chat
    No  → run: /octo:factory "fix: [specific issue]"
    Do not move to the next phase until this one passes.

  Ad-hoc fixes (single file, one issue):
    claude "[fix in one sentence]"
    Do not use /octo:factory for small fixes. It's overkill and wastes credits.

─────────────────────────────────────────────────────────────────────────

PERSON 1 — DEVOPS & GLUE:

  One terminal: claude --dangerously-skip-permissions
  Second window: aoe (monitor only — never needs interaction)

  Owns: repo scaffold, auth, shared layout, integration merges,
        deployment, conflict resolution, utility layers.

  Pre-merge checklist (run before EVERY merge — 12:10pm and 3:30pm):
    1. Check aoe — all sessions idle/waiting (or ✅ in group chat)
    2. Run /octo:embrace — scans branches, flags risks, proposes order
    3. Pull branches in the proposed order
    4. If merge conflict takes >20min → hardcode the conflicting feature
       and continue. Time is finite.

  Phase loop: CONTEXT.md → /octo:factory → verify → commit

─────────────────────────────────────────────────────────────────────────

PERSON 2 — BACKEND DEV:

  One terminal: claude --dangerously-skip-permissions
  TDD Guard hook active in .claude/hooks/ — enforces test coverage

  Owns: Node/Express + SQLite schema, all routes, auth middleware,
        business logic, API validation.

  Phase loop: CONTEXT.md → /octo:factory → verify → commit

  When /octo:factory runs a backend phase it will internally route
  test-writing subtasks to Codex automatically. TDD Guard then
  enforces that those tests pass before Claude moves on.
  No second terminal needed — this happens inside the factory.

  Push SCHEMA.md after Phase 1 → message group chat immediately.
  Push ROUTES.md after Phase 2 → message group chat immediately.
  These files unblock Person 3 (wiring) and Person 4 (AI integration).

─────────────────────────────────────────────────────────────────────────

PERSON 3 — FRONTEND + UI UX PRO MAX + 21ST.DEV:

  Claude Code UI: Nemotron 3 Super 120B model active
  Blackbox CLI: open and ready in a separate terminal

  9:30am — Run UI UX Pro Max design system (do this first, 15 min):
    python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
      "[app keywords]" --design-system -p "realhackthon" --persist
    Creates design-system/MASTER.md. Keep this file open all day.

  Phase loop:
    Claude Code (Nemotron):
      Start every prompt with: "Skip preamble. Output code only."
      Use 21st.dev MCP for component scaffolding:
        "Use 21st.dev to generate a [component] component"
      Review the output, save the file to the project directory.

    Blackbox CLI:
      blackbox chat --file [saved filename]
      Paste MASTER.md at the top of every Blackbox prompt.
      Refine, iterate, polish. Commit when done.

  File ownership rule:
    Claude Code generates → Blackbox refines → commit = handoff.
    Never edit the same file in both tools at the same time.

  Target: all screens done by 2:30pm.
  When done: message group chat → pivot in this order:
    1. Help Person 4 wire AI feature output to frontend components
    2. Help Person 2 write missing backend tests or edge cases
    3. Help Person 1 with pre-merge integration verification

─────────────────────────────────────────────────────────────────────────

PERSON 4 — AI FEATURE DEV:

  One terminal: claude --dangerously-skip-permissions

  Owns: AI feature design, prompt engineering, model integration,
        wiring AI output to DB and frontend.

  Phase loop: CONTEXT.md → /octo:factory → verify → commit

  For AI phases — be precise in CONTEXT.md about input/output format.
  Precise input/output = factory knows to run a focused Claude pass,
  not a broad multi-subagent spawn. Saves credits, runs faster.

  At 4pm: run /octo:tdd
    Auto-generates full test suite around all AI feature code.
    Do not write tests manually. Run this, review the output,
    fix anything that fails, commit.

─────────────────────────────────────────────────────────────────────────

COORDINATION FILES:
  AGENTS.md    — Person 1 writes Phase 1, all sessions read this
  ENV.md       — Person 1 writes Phase 1, everyone reads
  SCHEMA.md    — Person 2 writes Phase 1, push + message group chat
  ROUTES.md    — Person 2 writes Phase 2, push + message group chat
  design-system/MASTER.md — Person 3 generates at 9:30am, paste into
                             every Blackbox prompt all day
  CONTEXT.md   — each person writes before each phase, local only,
                 do NOT commit (add to .gitignore)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GOLDEN RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ Everything installed the night before. Nothing installed on hack day.
  ✅ One terminal per person. /octo:factory handles model routing internally.
  ✅ Every phase: write CONTEXT.md first (60 seconds) → /octo:factory → verify
  ✅ Keep CONTEXT.md short. Long context = unnecessary subagent spawns.
  ✅ Subagents only appear when the task genuinely needs parallel work.
     If you see subagents on a simple task: cancel, narrow CONTEXT.md, retry.
  ✅ Ad-hoc single-file fixes: use claude "[fix]" not /octo:factory
  ✅ Person 1: run /octo:embrace before EVERY merge — no exceptions
  ✅ Person 1: check aoe at 11:45am and 3:15pm before merge windows
  ✅ Person 1: group chat ✅ fallback when aoe can't see a session
  ✅ Person 1: never pull a branch showing "active" in aoe
  ✅ Merge rule: if it takes >20min → hardcode the feature and move on
  ✅ Person 3: start every Nemotron prompt with "Skip preamble. Output code only."
  ✅ Person 3: paste MASTER.md at top of every Blackbox CLI prompt
  ✅ Person 3: never have the same file open in Claude Code and Blackbox at once
  ✅ Person 3: target frontend done by 2:30pm → pivot to P4 → P2 → P1
  ✅ Person 4: run /octo:tdd at 4pm — do not write tests manually
  ✅ Push SCHEMA.md and ROUTES.md immediately after they're written
  ✅ Message group chat every time a coordination file is pushed
  ✅ Never move to the next phase until the current one passes verify
  ✅ Always commit to YOUR branch. Never directly to main.
  ✅ Check ccusage every 90 minutes — Persons 1, 2, and 4
  ✅ Hard stop at 5:00pm — no new features after this point
  ✅ If behind at 4:00pm → run Prompt 5 immediately, do not wait
  ✅ Backend is Node/Express + SQLite. No Supabase. No remote DB config.
  ✅ CONTEXT.md files are never committed — add to .gitignore tonight

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


PROMPT 1 — IDEA FINDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RUN AT: 9:00am sharp — one person runs this, others settle in and eat
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HACKATHON IDEA FINDER
━━━━━━━━━━━━━━━━━━━━━

## HACKATHON PROMPT:
[PASTE THEME HERE]

## TEAM SIZE: 4

━━━━━━━━━━━━━━━━━━━━━

Search ALL of the following sources for pain points, complaints, unmet needs,
and "I wish someone built..." moments related to the theme above:

── REDDIT ───────────────────────────────────────────────────────────────
r/SideProject, r/Entrepreneur, r/startups, r/programming, r/hackathon,
r/MachineLearning, r/artificial, r/ChatGPT, r/LocalLLaMA, r/webdev,
r/learnprogramming, r/softwareengineering, r/devops, r/gamedev,
r/androiddev, r/iOSProgramming, r/opensource, r/ProductManagement,
r/productivity, r/GetMotivated, r/RemoteWork, r/freelance,
r/digitalnomad, r/antiwork, r/WorkReform, r/personalfinance,
r/smallbusiness, r/Accounting, r/humanresources, r/managers,
r/HealthIT, r/mentalhealth, r/anxiety, r/depression, r/disability,
r/ChronicPain, r/HealthInsurance, r/nursing, r/medicine,
r/medicalschool, r/careerguidance, r/therapy, r/education,
r/Teachers, r/college, r/GradSchool, r/learnmath, r/HomeworkHelp,
r/languagelearning, r/edtech, r/textbooks, r/StudentLoans,
r/OnlineLearning, r/CasualConversation, r/TrueOffMyChest, r/AITA,
r/relationship_advice, r/Parenting, r/SingleParents, r/Adulting,
r/MentalHealthSupport, r/socialskills, r/lonely, r/dating_advice,
r/environment, r/ZeroWaste, r/sustainability, r/climate,
r/urbanplanning, r/cycling, r/nonprofit, r/volunteering, r/food,
r/financialindependence, r/investing, r/povertyfinance, r/Frugal,
r/DebtFree, r/gig_economy, r/BuyItForLife, r/LifeProTips,
r/NoStupidQuestions, r/YouShouldKnow, r/HomeImprovement, r/DIY,
r/CookingForBeginners, r/mealprep, r/Fitness, r/loseit, r/running,
r/graphic_design, r/VideoEditing, r/podcasting, r/Twitch, r/NewTubers,
r/photography, r/writing, r/worldbuilding, r/musician,
r/WeAreTheMusicMakers, r/mildlyinfuriating, r/FirstWorldProblems,
r/assholedesign, r/softwaregore, r/talesfromtechsupport,
r/talesfromcustomerservice, r/ProgrammerHumor, r/cscareerquestions,
r/recruitinghell, r/interviews, r/resumes, r/jobs

── PRODUCT & STARTUP COMMUNITIES ────────────────────────────────────────
Product Hunt (recent launches with low ratings or missing features)
Hacker News (Ask HN: "What problem do you wish was solved?")
Indie Hackers (pain point threads, failed startup postmortems)
Y Combinator Requests for Startups
a16z and Sequoia trend reports

── APP STORE & REVIEW MINING ────────────────────────────────────────────
Apple App Store 1-3 star reviews in relevant categories
Google Play Store 1-3 star reviews in relevant categories
G2, Capterra, and Trustpilot reviews (recurring complaints)

── SOCIAL & COMMUNITY PLATFORMS ─────────────────────────────────────────
Twitter/X: "I hate that there's no app for", "why is there no tool that",
           "someone should build", "I can't believe there's no"
LinkedIn posts about workplace frustrations
GitHub Issues on popular repos (recurring feature requests)
Stack Overflow unanswered questions

── TREND SIGNALS ────────────────────────────────────────────────────────
Google Trends (rising searches)
Exploding Topics (emerging problem spaces)
AnswerThePublic (what people are desperately Googling)

Give me 10 hackathon project ideas ranked #1 (best) to #10 (worst).

Context:
- 9-HOUR hackathon (9:00am to 6:00pm), 4-person team
- Stack: React frontend + Node/Express backend + SQLite database + AI APIs
- Tools: claude-octopus (/octo:factory) for all build phases,
  Nemotron + 21st.dev MCP + Blackbox CLI for frontend,
  Node/Express + SQLite for backend (no Supabase, no hosted DB)
- Judges are technical engineers and founders from Retell AI, Apple,
  Cisco, Casca, and IncidentFox — impress with depth, not just UI

For each idea use this exact format:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#[RANK]. [IDEA NAME] — [Score: X/50]
Found on: [source + where exactly]

[4-6 sentences: the problem it solves, who it helps, how it works,
why it fits the theme, what makes it stand out from existing solutions.]

Tech Stack: React + Node/Express + SQLite + [AI/APIs if needed]
Reasoning: [One sentence — why this is the fastest stack for a live demo]
UI Style: [One of the 67 styles from UI UX Pro Max — e.g. "Glassmorphism",
           "AI-Native UI", "Bento Box Grid" — match to the product category]

MINUTE-BY-MINUTE TASK BOARD:
Table: [Time] | [Person] | [Task] | [Deliverable]
- Cover 9:00am to 6:00pm across all 4 people
- Include 30-min lunch at 12:30pm and 12:10pm midday sync
- Person 1: note when /octo:embrace runs (before merges),
  when aoe is checked (11:45am and 3:15pm), and when CONTEXT.md
  is written before each /octo:factory call
- Person 2: note when SCHEMA.md and ROUTES.md are pushed,
  when /octo:factory runs for each backend phase, and when
  TDD Guard enforces test coverage automatically
- Person 3: UI UX Pro Max design system at 9:30am, then Claude Code
  (Nemotron) + 21st.dev MCP for component generation, Blackbox CLI
  for refinement. Target done by 2:30pm then pivot to P4/P2/P1.
- Person 4: note when /octo:factory runs for AI phases, when
  CONTEXT.md is written with input/output format, and when
  /octo:tdd runs at 4pm
- Hard stop at 5:00pm for pitch and submission prep
- Every task ends with a concrete checkable deliverable
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nothing else. No intro, no closing. Just the 10 ranked ideas.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


PROMPT 2 — SUBAGENT GENERATOR  (octo:factory-powered)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RUN AT: 9:15am — one person runs this while others read the ranked list
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VIKING HACKS SUBAGENT GENERATOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## HACKATHON IDEA:
[PASTE CHOSEN IDEA HERE]

## TECH STACK:
React + Node/Express + SQLite + [AI APIs if applicable]

## UI STYLE:
[PASTE UI STYLE FROM PROMPT 1]

## TEAM SIZE: 4

## TOOL SETUP:
  Person 1 — Claude Code Pro — DevOps & Glue
    One terminal: claude --dangerously-skip-permissions
    /octo:factory for all phase execution
    /octo:embrace before every merge (12:10pm and 3:30pm)
    aoe in second window for session monitoring

  Person 2 — Claude Code Pro — Backend Dev
    One terminal: claude --dangerously-skip-permissions
    /octo:factory for all phase execution
    TDD Guard hook enforces test coverage inside the session
    /octo:factory internally routes test-writing to Codex automatically

  Person 3 — Claude Code UI (Nemotron 3 Super 120B) + Blackbox CLI
    Claude Code: Nemotron model, 21st.dev MCP for components,
                 UI UX Pro Max for design system
    Blackbox CLI: execution and refinement of all frontend files
    Every Nemotron prompt starts with: "Skip preamble. Output code only."
    Every Blackbox prompt starts with: [MASTER.md contents]
    Target: frontend done by 2:30pm → pivot to P4 → P2 → P1

  Person 4 — Claude Code Pro — AI Feature Dev
    One terminal: claude --dangerously-skip-permissions
    /octo:factory for all AI phase scaffolding
    /octo:tdd at 4pm for automatic test generation

## WORKFLOW:
  All persons with Claude Code:
    Per phase: write CONTEXT.md (60 sec) → /octo:factory "implement
    CONTEXT.md" → verify manually → commit to branch → push → group chat

  /octo:factory model routing (automatic, no config needed):
    Gemini: broad research, UI generation, lightweight parallel tasks
    Codex: test writing, build verification, mechanical tasks
    Claude: architecture decisions, complex logic, AI feature work
    Subagents spawn only when the task has 3+ independent components.
    Solo run for linear sequences, single files, and wiring tasks.

  Person 1 additionally:
    /octo:embrace before every merge
    aoe check at 11:45am and 3:15pm (✅ group chat fallback)
    Merge >20min rule: hardcode and move on

  Person 3:
    Claude Code (Nemotron) → generate → save → Blackbox CLI → refine → commit
    Never edit the same file in both tools simultaneously

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEFORE generating anything, interview the team. Ask ALL 6 questions at
once. Wait for answers. Do not generate anything until all 6 are answered
and the team approves the confirmation block.

════════════════════════════════════════════════════════════════
6 QUESTIONS — ask all at once, wait for answers
════════════════════════════════════════════════════════════════

1. In one sentence, what does a user actually DO in this app?
   (e.g. "A user uploads a resume and gets a ranked list of job matches")

2. What are the exact screens in order from landing to core feature?
   (e.g. "Landing → login → dashboard → upload → results")

3. What data does the app store? List every DB table needed.

4. Does this app use AI? YES or NO.
   If YES: exact input format + exact output format + what model/API.
   If NO: describe the core algorithm or logic instead.

5. What is absolutely OUT OF SCOPE for today?

6. Describe the exact 3-minute demo click by click.
   Judges are engineers and founders from Retell AI, Apple, Cisco,
   Casca, and IncidentFox. Make it technically impressive.

════════════════════════════════════════════════════════════════
CONFIRMATION BLOCK — output this, wait for YES before generating
════════════════════════════════════════════════════════════════

"""
BUILDING CONFIRMATION — APPROVE BEFORE GENERATING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

App name:      [inferred from idea]
What it does:  [one sentence]
Screens:       [from answer 2]
DB tables:     [from answer 3]
AI used:       [YES + model + input/output — OR — NO + core logic]
Out of scope:  [from answer 5]
Demo script:   [from answer 6]
Stack:         React + Node/Express + SQLite + [AI APIs if applicable]
UI Style:      [from above]

Does this match exactly what you want to build?
Reply YES to generate all 4 person sections.
Reply with corrections and I'll update before generating.
"""

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ONLY AFTER THE TEAM REPLIES YES — generate the full output below
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate the following for all 4 persons.

For each person output in this order:

  1. AGENTS.md SEED — the shared context file Person 1 puts in the repo
     root. All Claude Code sessions read this automatically. Include:
     app name, what it does, tech stack, file structure conventions,
     SQLite DB table names, API base URL, auth pattern, env var names.
     (Person 1 generates this. Persons 2, 3, and 4 receive it.)

  2. PROJECT SEED — the text each person pastes when starting their
     Claude Code session to orient the model to the project.
     Include: app name, their role, their tech area, core feature,
     every screen (Person 3), every DB table (Person 2), demo scenario,
     out of scope, stack. Keep it under 200 words. Claude Code reads
     AGENTS.md for deeper context — this is just the session opener.

  3. ROADMAP — exact phases for this person.
     Format: Phase N: [name] — [one sentence description]
     Person 1: 7 phases (DevOps & Glue)
     Person 2: 6 phases (Backend Dev)
     Person 3: 6 phases (Frontend + UI)
     Person 4: 6 phases (AI Feature Dev if AI used — else best fit below)
     Every phase is 40-50 minutes maximum.
     All phases stop at 12:00pm (midday sync) and 5:00pm (hard stop).

  4. CONTEXT.md TEMPLATES — for each phase, the pre-filled CONTEXT.md
     to write before running /octo:factory. Format:

     Phase N: [name]
     ┌─────────────────────────────────────────────────────────────┐
     │ # CONTEXT: [Phase Name]                                     │
     │ Build: [exact 1-2 sentence description for this phase]     │
     │ Stack: [only the relevant stack parts]                     │
     │ Pass:                                                       │
     │   - [specific checkable criterion]                         │
     │   - [specific checkable criterion]                         │
     │   - [specific checkable criterion]                         │
     │ Out of scope: [what not to build in this phase]            │
     └─────────────────────────────────────────────────────────────┘
     Then: /octo:factory "implement CONTEXT.md"

     For Person 3: every phase also includes the Blackbox CLI prompt
     that follows after Claude Code generates the component.
     Format: [paste MASTER.md here] + [refinement instructions]

     For Person 4 AI phases: CONTEXT.md must include exact input format
     and exact output format in the Build section. This prevents
     unnecessary subagent spawns by giving the factory a focused spec.

     Note whether this phase is expected to run solo or spawn subagents,
     and why. If subagents: which models (Gemini/Codex) and for what.
     If the phase does not need subagents, say "Solo run — single model."

  5. VERIFY CHECKLIST — for each phase, what to manually check.
     Format: Phase N: [bullet list of exactly what to click or test]
     These are human actions, not automated checks.

  6. COORDINATION NOTES — exact files this person produces for others,
     exact files they wait for, what to message the group chat.
     Include when /octo:embrace runs for Person 1.
     Include when SCHEMA.md and ROUTES.md are pushed for Person 2.
     Include when Person 3 pivots and to which person.

  7. AD-HOC FIX TEMPLATES — 4 ready-to-paste prompts for quick fixes.
     Persons 1, 2, 4: claude "[fix]" format (single-line, no factory)
     Person 3: Blackbox CLI prompt format with MASTER.md paste reminder

─────────────────────────────────────────────────────────────────────────

ROLES:

PERSON 1 — DEVOPS & GLUE — 7 phases
  Phase 1:  Repo scaffold + AGENTS.md + ENV.md + git branches + SQLite init
  Phase 2:  Auth — signup, login, session, protected routes
  Phase 3:  Shared layout, nav, shell components, routing
  Phase 4:  INTEGRATION MERGE 1 — 12:10pm
    Pre-merge: aoe check (or ✅ group chat) → /octo:embrace → merge
    If conflict >20min: hardcode and move on
  Phase 5:  Shared utilities, error boundaries, loading states
  Phase 6:  INTEGRATION MERGE 2 — 3:30pm
    Pre-merge: aoe check (or ✅ group chat) → /octo:embrace → merge
    Run full demo scenario end to end, fix integration bugs
  Phase 7:  Final merge + deploy + seed demo data + confirm live URL

PERSON 2 — BACKEND DEV — 6 phases
  Phase 1:  SQLite schema + migrations + SCHEMA.md (push immediately)
    /octo:factory routes migration-running to Codex internally
  Phase 2:  All tables confirmed + ROUTES.md written (push immediately)
  Phase 3:  Core CRUD routes + auth middleware + error handling
    TDD Guard enforces test coverage. /octo:factory routes test-writing
    to Codex automatically for this phase.
  Phase 4:  External API integration or core business logic
  Phase 5:  Advanced routes for core feature + validation
  Phase 6:  Full API test pass — every route with real data + edge cases
    /octo:tdd available as backup if Codex coverage is thin

PERSON 3 — FRONTEND DEV + UI UX PRO MAX + 21ST.DEV — 6 phases
  BEFORE Phase 1 (9:30am, 15 minutes):
    python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
      "[app keywords]" --design-system -p "realhackthon" --persist
    Creates design-system/MASTER.md. Keep open all day.

  Phase 1:  Landing page + app shell (design system applied)
    Claude Code (Nemotron) + 21st.dev MCP → Blackbox CLI refinement
  Phase 2:  Core screen 1 + core screen 2 (hardcoded data, pixel perfect)
  Phase 3:  All remaining screens (hardcoded, design system consistent)
  Phase 4:  Wire real API calls using ROUTES.md — all screens live
  Phase 5:  Loading, error, empty states + skeleton screens
  Phase 6:  Responsive pass + UI UX Pro Max pre-delivery checklist:
              ✓ No emojis as icons (SVG only: Heroicons or Lucide)
              ✓ cursor-pointer on all clickable elements
              ✓ Hover states with smooth transitions (150-300ms)
              ✓ Text contrast 4.5:1 minimum
              ✓ Focus states visible for keyboard navigation
              ✓ prefers-reduced-motion respected
              ✓ Responsive at 375px, 768px, 1024px, 1440px
              ✓ No AI purple/pink gradients (unless style calls for it)
              ✓ All buttons have visible disabled states
    After Phase 6: message group chat → pivot to P4 → P2 → P1

PERSON 4 — ROLE DETERMINED BY ANSWER 4 (AI YES/NO):

  IF AI USED → AI FEATURE DEV — 6 phases
    All phases use: write CONTEXT.md → /octo:factory → verify → commit
    CONTEXT.md for AI phases must always include exact input/output format.
    This keeps /octo:factory running as a focused solo Claude pass.
    Subagents only spawn if the phase has 3+ genuinely independent parts.

    Phase 1:  AI prompt design + testing in isolation
    Phase 2:  AI feature scaffold + raw API call working end to end
    Phase 3:  Input pipeline (format + send) + output pipeline (parse)
    Phase 4:  AI feature wired to SQLite DB using SCHEMA.md
    Phase 5:  AI feature wired to frontend — results displayed live
    Phase 6:  Error handling, fallbacks, prompt tuning, seed data
      /octo:tdd at 4pm → auto test suite around all AI code
      Run 10 real demo scenarios to confirm quality

  IF NO AI → choose best fit:

  Option A — REALTIME & INTEGRATIONS DEV
  Use if: app needs websockets, live updates, or heavy 3rd party APIs
    Phase 1:  Realtime infrastructure (websocket or polling setup)
    Phase 2:  Realtime events — server side + client side
    Phase 3:  Third party integration 1 — full end to end
    Phase 4:  Third party integration 2 — full end to end
    Phase 5:  Notifications/alerts + edge case handling
    Phase 6:  /octo:tdd + stress test 10 live scenarios

  Option B — DATA & LOGIC DEV
  Use if: app has complex algorithms, scoring, ranking, or search
    Phase 1:  Core algorithm design + first working implementation
    Phase 2:  /octo:factory with precise CONTEXT.md — autonomous scaffold
    Phase 3:  Search or filter logic + ranking display layer
    Phase 4:  Algorithm wired to SQLite DB and frontend
    Phase 5:  Performance optimization + accuracy pass
    Phase 6:  /octo:tdd + seed data + 10 real demo scenarios

  Option C — FEATURES & POLISH DEV
  Use if: many distinct features that Persons 1-3 can't cover
    Generate 6 phases specific to this exact app.
    Include /octo:tdd at Phase 6.
    No generic placeholders.

─────────────────────────────────────────────────────────────────────────

Rules for generating everything above:
- Every seed document and CONTEXT.md is hyper-specific to this app
- No placeholders — every field filled in for the actual app
- If AI is not used, never mention AI in any document or plan
- Person 3 CONTEXT.md entries include both the Nemotron Claude Code
  prompt AND the Blackbox CLI follow-up prompt (with MASTER.md paste)
- Person 4 AI phase CONTEXT.md always includes exact input/output format
- Every CONTEXT.md note whether /octo:factory runs solo or spawns
  subagents, and which models (Gemini/Codex) for what reason
- Coordination notes specify exact group chat messages to send
- Verify checklists are click-by-click human actions only
- Ad-hoc fix templates are single claude "[fix]" lines, ready to paste
- All phases are 40-50 minutes maximum
- Person 1 Phase 4 and Phase 6 include aoe check + /octo:embrace steps
- No person waits on another for more than 20 minutes without a fallback
- Everything is copy-pasteable. Zero editing required on hackathon day.
- CONTEXT.md files are never committed — remind in coordination notes

Nothing else. No intro, no closing. Just the 4 person sections.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


PROMPT 3 — PITCH PREP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RUN AT: 5:00pm HARD STOP — one person runs this while Person 1 deploys
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VIKING HACKS PITCH PREP
━━━━━━━━━━━━━━━━━━━━━━━━

## APP NAME: [NAME]
## WHAT IT DOES: [ONE SENTENCE]
## LIVE URL: [PASTE URL FROM PERSON 1]
## DEMO SCENARIO: [PASTE YOUR DEMO SCENARIO FROM THE INTERVIEW]
## TECH STACK: React + Node/Express + SQLite + [AI APIs if used]
## UI STYLE USED: [UI UX PRO MAX STYLE NAME]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The judges at Viking Hacks 2026 are:
  - Atharv Deshmukh — Software Engineer at Casca (UIUC)
  - Mithil Patil — Software Engineer at Casca (GT)
  - Jimmy Wei — IncidentFox AI, YC Startup founder
  - Long Yi — IncidentFox AI, YC Startup founder
  - Vignesh Ravichandran — MyClone AI, AI Startup founder
  - Divyank Shah — Software Engineer at Apple
  - Harsha Sanjeeva — Senior Engineer at Cisco
  - Nilesh Matai — Software Engineer at Retell AI
  - Prabir Vora — Technical Chief of Staff at Retell AI

These are technical engineers and startup founders. They will probe
architecture decisions, scalability, real-world viability, and whether
the team understands what they actually built. Do not pad answers.

Generate the following pitch materials now. No fluff.

── 1. THREE-MINUTE SPOKEN DEMO SCRIPT ──────────────────────────────────

Write the exact words to say out loud. Structure:

[0:00-0:20] HOOK
One sentence that makes every judge lean forward.
Start with the pain, not the product. Specific and visceral.

[0:20-1:00] THE PROBLEM
2-3 sentences. A real human scenario. No statistics. No buzzwords.
Make the judges feel the frustration.

[1:00-2:30] THE LIVE DEMO
Exact click-by-click narration tied to what's on screen.
Every sentence = one specific action in the app.
Tell the speaker what to click, what to say as it loads,
and what technical details to point out that will impress engineers.

[2:30-3:00] THE CLOSE
Why this matters. Who benefits. One sentence on what you'd build next.
End with a line the judges will still remember 30 minutes later.

── 2. TECHNICAL DEEP DIVE ──────────────────────────────────────────────

60-second explanation a senior engineer would respect. Cover:
  - Architecture decisions and why
  - Why Node/Express + SQLite for this specific app
  - The hardest technical problem solved today
  - What /octo:factory's internal model routing (Claude for logic,
    Codex for tests, Gemini for broad tasks) enabled that a single-
    model approach could not have achieved in 9 hours
  - What changes to scale to 100,000 users

── 3. JUDGE Q&A PREP ───────────────────────────────────────────────────

Generate the 12 hardest questions these specific judges will ask.
Sharp 2-3 sentence answers for each. No padding.

Calibrate by judge type:
  - Casca engineers: system design, code quality, architecture tradeoffs
  - YC founders (IncidentFox): market size, monetization, defensibility
  - MyClone AI founder: AI implementation, model quality, accuracy
  - Apple engineer: UX, accessibility, privacy, platform thinking
  - Cisco engineer: enterprise viability, security, scalability
  - Retell AI team: AI implementation, latency, production reliability

Format:
  Q: [question]
  A: [2-3 sentence answer — honest, specific, technically credible]

── 4. ONE-SENTENCE PITCHES ─────────────────────────────────────────────

Write 3 versions. Under 280 characters. No jargon. No buzzwords.
Make someone want to use it immediately.

── 5. DESIGN DECISIONS TO HIGHLIGHT ────────────────────────────────────

The team used UI UX Pro Max to generate a professional design system
and 21st.dev MCP for production-ready component generation.
Write 2-3 sentences the speaker can say when a judge asks about design
decisions — explain the style choice, why it fits the product category,
and what anti-patterns were avoided.

── 6. WHAT WE'D BUILD NEXT ─────────────────────────────────────────────

3 bullet points on the next 2 weeks if the team kept going.
Specific and technically credible. For when judges ask about the vision.

Nothing else. No intro. Just the 6 sections.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


PROMPT 4 — SUBMISSION CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RUN AT: 5:30pm — everyone runs through this together
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VIKING HACKS SUBMISSION CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## APP NAME: [NAME]
## LIVE URL: [URL]
## GITHUB REPO: [URL]
## TEAM MEMBERS: [ALL 4 NAMES]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run through every item. Tell me status of each.
For anything NOT done, tell me exactly what to do right now.

── LIVE APP ─────────────────────────────────────────────────────────────
□ Live URL is accessible from a phone on a different WiFi network
□ App loads in under 3 seconds
□ Core demo feature works end to end with no errors
□ Demo data is seeded — app does not look empty
□ No console errors in browser dev tools
□ App works on mobile screen size (375px)
□ All buttons and links work — nothing goes to a 404
□ All hover states work — cursor:pointer on every clickable element
□ No broken images or placeholder text visible

── UI UX PRO MAX PRE-DELIVERY CHECKLIST ─────────────────────────────────
□ No emojis used as icons — all icons are SVG (Heroicons or Lucide)
□ cursor-pointer on all clickable elements
□ Hover states present with smooth transitions (150-300ms)
□ Text contrast meets 4.5:1 minimum
□ Focus states are visible for keyboard navigation
□ prefers-reduced-motion is respected
□ Responsive at 375px, 768px, 1024px, 1440px
□ No AI purple/pink gradients (unless style explicitly calls for it)
□ No emojis in UI components
□ All form inputs have visible labels and error states

── GITHUB REPO ──────────────────────────────────────────────────────────
□ Repo is public
□ README.md exists, explains the app in 2-3 sentences
□ README includes the live URL
□ README includes setup instructions (npm install && npm run dev)
□ All 4 team members have at least one commit in the repo
□ No API keys or secrets committed to the repo
□ .env.example file exists with all required variable names
□ AGENTS.md is in repo root
□ CONTEXT.md files are NOT committed (.gitignore entry exists)
□ design-system/MASTER.md is committed (used for design reference)

── DEMO READINESS ───────────────────────────────────────────────────────
□ Demo script from Prompt 3 has been read aloud at least once
□ Demo scenario runs in under 3 minutes from open to close
□ The hook has been practiced — speaker knows first line cold
□ A backup plan exists if the live URL goes down
  (screen recording, or local version running on a laptop)
□ Technical deep dive answer has been rehearsed
□ At least 2 team members know the Q&A answers

── SUBMISSION FORM ──────────────────────────────────────────────────────
□ Submission form has been found and opened
□ App name filled in
□ Team member names filled in
□ Live URL filled in
□ GitHub repo URL filled in
□ Project description written (use one-sentence pitch from Prompt 3)
□ Form submitted before 6:00pm

── FINAL SANITY CHECK ───────────────────────────────────────────────────
□ Open the live URL on your phone right now and run the full demo
□ Everything works
□ You would be proud to show this to a senior engineer at Apple

For each unchecked item:
  ❌ [ITEM] — Do this right now: [exact fix in one sentence]

For each checked item:
  ✅ [ITEM]

At the end, output one of:
  SUBMISSION READY ✅ — submit now
  SUBMISSION NOT READY ❌ — fix the items above before submitting


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


PROMPT 5 — EMERGENCY SCOPE CUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RUN AT: 4:00pm IF you are behind schedule. Do not wait until 4:30pm.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EMERGENCY SCOPE CUT
━━━━━━━━━━━━━━━━━━━

## APP NAME: [NAME]
## CURRENT TIME: [TIME]
## STATUS CHECK: [Each person pastes their current phase + what's done
##               and what's not. Format: "P1: Phase 5 done. Phase 6
##               not started." Run: ls -la && git log --oneline -5
##               in your project folder and paste the output here.]
## WHAT IS WORKING: [List everything that currently works end to end]
## WHAT IS NOT WORKING: [List everything broken or unfinished]
## ORIGINAL DEMO SCENARIO: [Paste from interview]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are an emergency hackathon triage assistant. It is [TIME].
Submissions are due at 6:00pm at Viking Hacks 2026.
The team has approximately [X] minutes before the 5:00pm hard stop.

Do the following right now:

1. TRIAGE
   Look at the status check and the working/not-working lists.
   Make a ruthless call on what to cut. Anything not visible in the
   3-minute demo gets cut immediately. No exceptions.
   For any broken feature decide: fix it (possible in time?) or hardcode.

2. REVISED DEMO SCENARIO
   Rewrite the demo using only what currently works.
   Make it still look impressive. If the core feature is broken, specify
   whether to use hardcoded data, a mocked response, or pre-recorded video.

3. REVISED TASK LIST — one task per person, completable in 60 minutes
   Person 1: [exact single task — use claude "[fix]" for fast fixes,
              /octo:factory only if 3+ deliverables remain,
              check aoe before any final merge]
   Person 2: [exact single task — claude "[fix]" format]
   Person 3: [exact single task — Blackbox CLI prompt with MASTER.md]
   Person 4: [exact single task — claude "[fix]" or minimal
              /octo:factory with tight CONTEXT.md]

   For each task include the exact command to run — no editing needed.

4. HARDCODING FALLBACK
   For any critical feature broken and unfixable in 60 minutes:
   Write the exact code to hardcode a convincing demo version.
   Complete files only. No partial snippets.
   Apply UI UX Pro Max design system — correct colors, fonts,
   no anti-patterns. Hardcoded should still look polished.

5. HONEST ASSESSMENT
   One sentence: are they on track for a demoable product by 5:00pm?

Nothing else. The team is stressed. Give them triage right now.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


REFERENCE: EVERY TOOL AND WHERE IT IS USED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLAUDE CODE — npm: @anthropic-ai/claude-code
  Install:    npm install -g @anthropic-ai/claude-code  (night before)
  Used by:    Persons 1, 2, and 4 (terminal) + Person 3 (UI with Nemotron)
  Start:      claude --dangerously-skip-permissions  (Persons 1, 2, 4)
  Config:     ~/.claude/settings.json with permissions allow list
  Context:    AGENTS.md in repo root is read automatically by all sessions

CLAUDE-OCTOPUS — github.com/nyldn/claude-octopus
  Install:    /plugin install claude-octopus@nyldn-plugins  (night before)
  Used by:    Persons 1, 2, and 4
  Verify:     /octo:help in a claude session
  Commands:
    /octo:factory "implement CONTEXT.md"
      Primary build command for all phases.
      Reads CONTEXT.md → decides solo vs subagents → builds → validates.
      Model routing (automatic, no config):
        Claude  → architecture, complex logic, AI features
        Gemini  → broad research, UI tasks, lightweight parallel work
        Codex   → test writing, build verification, mechanical tasks
      Spawns subagents only when task has 3+ independent components.
      Solo run for linear sequences, wiring tasks, single files.
      Watch for: "Running solo" vs "Spawning N subagents for: [reason]"
      If subagents on a simple task: Ctrl+C → narrow CONTEXT.md → retry.

    /octo:embrace
      Person 1 only. Before every merge.
      Scans all branches, flags conflicts, proposes merge order.

    /octo:tdd
      Person 4 at 4pm. Person 2 as backup.
      Auto-generates full test suite. No manual test writing.

  CONTEXT.md format (60 seconds to write):
    # CONTEXT: [Phase Name]
    Build: [1-2 sentences]
    Stack: [relevant parts only]
    Pass:
      - [criterion]
      - [criterion]
    Out of scope: [what not to build]
  Add CONTEXT.md to .gitignore — never commit these files.

UI UX PRO MAX — github.com/nextlevelbuilder/ui-ux-pro-max-skill
  Install:    npm install -g uipro-cli && uipro init --ai claude  (night before)
  Used by:    Person 3
  Run:        python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
                "[keywords]" --design-system -p "realhackthon" --persist
  Output:     design-system/MASTER.md
  Usage:      Paste full MASTER.md at top of every Blackbox CLI prompt.
  Checklist:  10-item pre-delivery checklist in Prompt 4.

21ST.DEV MCP — mcp.21st.dev
  Install:    Claude Code → Settings → MCP Servers → Add → https://mcp.21st.dev
  Used by:    Person 3 (inside Claude Code UI with Nemotron)
  Usage:      "Use 21st.dev to generate a [component] component"
  Output:     Production-ready React/Tailwind component
  Handoff:    Save file → open in Blackbox CLI for refinement

BLACKBOX CLI — npm: @useblackbox/cli
  Install:    npm install -g @useblackbox/cli && blackbox login  (night before)
  Used by:    Person 3
  Usage:      blackbox chat --file [filename]
  Rule:       Never edit same file in Claude Code and Blackbox simultaneously.
              Claude Code generates → save → Blackbox refines → commit.
  Every prompt: paste MASTER.md at top, then refinement instructions.

NEMOTRON 3 SUPER 120B — in Claude Code UI
  Setup:      Claude Code → Settings → Model → Nemotron 3 Super 120B
  Used by:    Person 3 (replaces Claude Sonnet/Opus in the Claude Code UI)
  Rule:       Start every prompt with "Skip preamble. Output code only."
              Without this, Nemotron over-explains and burns context.
  Strength:   Strong instruction-following for frontend component tasks.
              Pairs well with 21st.dev MCP and Blackbox CLI.

AGENT-OF-EMPIRES — github.com/njbrake/agent-of-empires
  Install:    Rust + aoe install script  (night before)
  Fallback:   npm install -g ccmanager
  Used by:    Person 1 only (second window, open all day)
  Check:      11:45am before 12:10pm merge
              3:15pm before 3:30pm merge
  Status:     Active = generating (do not pull)
              Waiting = needs input
              Idle = safe to pull
  Fallback:   If session not visible in aoe → wait for ✅ in group chat

AWESOME-CLAUDE-CODE — github.com/hesreallyhim/awesome-claude-code
  Tools used:
    ccusage:    npm install -g ccusage → run every 90 min (Persons 1, 2, 4)
                High burn = unnecessary subagents → narrow CONTEXT.md
    TDD Guard:  github.com/nizos/tdd-guard → Person 2's .claude/hooks/
                Blocks Claude from shipping untested routes.
                Works inside Claude Code session — no second terminal.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END OF VIKING HACKS 2026 TOOLKIT v7
Good luck. Ship something real.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
