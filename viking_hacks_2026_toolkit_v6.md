╔══════════════════════════════════════════════════════════════════════════╗
║           VIKING HACKS 2026 — COMPLETE HACKATHON TOOLKIT  v6            ║
║                       March 28th · Fremont, CA                          ║
║                                                                          ║
║  Powered by:                                                             ║
║    claude-octopus  (github.com/nyldn/claude-octopus)                    ║
║    UI UX Pro Max   (github.com/nextlevelbuilder/ui-ux-pro-max-skill)    ║
║    21st.dev MCP    (mcp.21st.dev)                                        ║
║    CCS             (npm: @kaitranntt/ccs)  — multi-model routing         ║
║    agent-of-empires (github.com/njbrake/agent-of-empires)               ║
║    awesome-claude-code (github.com/hesreallyhim/awesome-claude-code)    ║
╚══════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT CHANGED IN v6
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  — GSD removed entirely. /octo:factory replaces all planning + execution.
    The discuss-phase + plan-phase loop burned thousands of credits with
    minimal output. /octo:factory reads a one-line CONTEXT.md and goes.

  — Subagents spawn only when needed. /octo:factory self-evaluates
    whether a task requires parallel subagents or a single focused pass.
    No wasted spawns. No wasted credits.

  — Backend stack changed to Node/Express + SQLite.
    No Supabase. No remote DB setup. SQLite runs in-process — zero
    config, zero connection issues, zero time lost on DB ops in a 9hr event.

  — Person 3 completely rewritten.
    Claude Code interface with Nemotron 3 Super 120B as the model.
    Blackbox CLI for frontend execution and web-specific refinement.
    21st.dev MCP + UI UX Pro Max for instant component generation.
    With these three tools, Person 3 finishes frontend fast and pivots
    to helping Persons 1, 2, and 4 in the afternoon.

  — everything-claude-code removed.
    Its commands overlapped with /octo:factory and added coordination
    overhead. Removed from all persons. /octo:factory covers the same
    patterns with less setup and fewer moving parts.

  — Prompt 2 interview cut from 12 to 6 questions.
    Only the decisions that actually change what gets built.

  — Prompt 5 status check fixed.
    No longer references /gsd:progress. Uses a plain file-state check.

  — 12pm merge pushed to 12:10pm with a >20min hardcode rule.

  — aoe group-chat fallback added for sessions aoe can't see.

  — Nemotron model hint added to all Person 3 prompts.

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

  Person 1 — Claude Code Pro + ChatGPT Plus — DevOps & Glue
    Terminal 1: ccs  → Claude + /octo:factory + /octo:embrace
    Terminal 2: ccs codex  → Codex (parallel: git, build health, conflicts)
    Dashboard: aoe  → visual session monitor for all team terminals

  Person 2 — Claude Code Pro + ChatGPT Plus — Backend Dev
    Terminal 1: ccs  → Claude + /octo:factory
    Terminal 2: ccs codex  → Codex (parallel test writing, migrations)
    Pattern: Claude builds each phase, Codex tests the previous phase

  Person 3 — Claude Code interface (Nemotron 3 Super 120B) + Blackbox CLI
    Claude Code UI: Nemotron model — planning, component logic, pivots
    Blackbox CLI: frontend execution, web refinement, component iteration
    21st.dev MCP: instant production-ready component generation
    UI UX Pro Max: design system generated at 9:30am, MASTER.md used in
                   every Blackbox prompt all day
    Finishes frontend fast → pivots to P4 AI wiring, P2 testing, P1 merges

  Person 4 — Claude Code Pro $20 — AI Feature Dev
    Terminal 1: ccs --dangerously-skip-permissions → Claude + /octo:factory
    One terminal only. /octo:factory handles all AI phase scaffolding.
    Subagents spawn inside /octo:factory only when the task genuinely
    requires parallel work — not by default.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRE-HACKATHON SETUP  (do this the night before, March 27th)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Do ALL of this before sleeping. Do not do this at the venue.
WiFi will be slow and you will waste build time.

── STEP 1: INSTALL CCS (PERSONS 1, 2, AND 4) ────────────────────────────
CCS routes Claude through the official claude binary (ToS-compliant) and
ChatGPT/Codex through CLIProxy OAuth browser auth.

  npm install -g @kaitranntt/ccs

  Authenticate:
    ccs auth        ← Claude Pro OAuth  (Persons 1, 2, and 4)
    ccs codex       ← ChatGPT OAuth     (Persons 1 and 2 only)

  Set Codex model config:
    Open or create ~/.codex/config.toml and add:
      model = "gpt-5.2-codex"
    Delete models cache:
      rm -f ~/.codex/models_cache.json

  Health check tonight:
    ccs cliproxy doctor
    Fix anything that fails. Do not debug this at 9am.

── STEP 2: INSTALL CLAUDE CODE (PERSONS 1, 2, AND 4) ───────────────────
  npm install -g @anthropic-ai/claude-code
  claude --version  ← confirm it works

── STEP 3: INSTALL CLAUDE-OCTOPUS (ALL PERSONS WITH CLAUDE CODE) ────────
/octo:factory replaces GSD's discuss + plan phases entirely.
It reads a one-line CONTEXT.md, scaffolds the phase, self-tests, and
delivers. Subagents spawn inside the factory only when the task requires
genuine parallelism — not by default.

  /plugin install claude-octopus@nyldn-plugins

  Fallback if /plugin unavailable:
    git clone https://github.com/nyldn/claude-octopus
    cp -r claude-octopus/.claude/* ~/.claude/

  Verify:
    Open a ccs session
    Type /octo:help — should show all commands

  Commands used:
    /octo:factory "implement CONTEXT.md"
      → Primary build command for all phases.
        Reads CONTEXT.md (one-line description + pass criteria).
        Decides internally whether to spawn subagents or run solo.
        Runs: context review → scaffold → implement → self-test →
              quality gate → deliver.
        Person 1: used for complex integration phases.
        Person 2: used for schema and route phases.
        Person 4: used for all AI feature phases.

    /octo:embrace
      → Person 1 runs before every integration merge.
        Scans all branches, flags conflicts, proposes merge order,
        summarizes what each person built.

    /octo:tdd
      → Person 4 runs at 4pm. Auto-wraps test suite around all AI code.
        Person 2 uses as backup if Codex test coverage is incomplete.

  CONTEXT.md format (replaces all planning phases — write this in 60 sec):
  ┌─────────────────────────────────────────────────────────────┐
  │ # CONTEXT: [Phase Name]                                     │
  │ Build: [1-2 sentence description of exactly what to build] │
  │ Stack: [relevant parts of stack for this phase]            │
  │ Pass:                                                       │
  │   - [criterion 1 — specific and checkable]                 │
  │   - [criterion 2]                                          │
  │   - [criterion 3]                                          │
  │ Out of scope: [what NOT to build]                          │
  └─────────────────────────────────────────────────────────────┘
  Then run: /octo:factory "implement CONTEXT.md"
  Do not over-specify. The factory handles the rest.

  When does /octo:factory spawn subagents?
  It self-evaluates. Subagents appear when:
    - A phase has 3+ genuinely independent components (e.g. auth +
      schema + seed data simultaneously)
    - A phase has a clear split between build and test work
  Subagents do NOT appear for:
    - Simple single-file phases
    - Wiring tasks (connecting existing components)
    - Any phase that reads as a linear sequence of steps
  You will see a note in the output: "Running solo" or "Spawning N subagents"
  If you see subagents on a simple phase, cancel and re-run with a
  narrower CONTEXT.md. Garbage in = wasted credits.

── STEP 4: INSTALL AGENT-OF-EMPIRES (PERSON 1 ONLY) ─────────────────────
  Install Rust first:
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    source $HOME/.cargo/env

  Install aoe:
    curl -fsSL https://raw.githubusercontent.com/njbrake/agent-of-empires/main/scripts/install.sh | bash

  Verify:
    aoe --version
    aoe  ← should open TUI dashboard

  Fallback (no Rust):
    npx ccmanager
    ccmanager init
    ccmanager status

  aoe status indicators:
    Active  → generating — DO NOT pull this branch
    Waiting → needs human input
    Idle    → phase done — safe to pull

  Group chat fallback (when aoe can't see a session):
    If a team member's session doesn't appear in aoe, they send
    a ✅ in group chat when their phase is done.
    Person 1 waits for all ✅ before pulling for any merge.
    Do not pull without either aoe idle OR a group chat ✅.

── STEP 5: INSTALL UI UX PRO MAX (PERSON 3) ─────────────────────────────
  npm install -g uipro-cli
  uipro init --ai claude  ← run in your project folder

  Verify: .claude/skills/ui-ux-pro-max/ folder exists.

── STEP 6: INSTALL 21ST.DEV MCP (PERSON 3) ──────────────────────────────
21st.dev MCP generates production-ready React/Tailwind components
instantly inside Claude Code. With Nemotron + 21st.dev + Blackbox CLI,
Person 3 can scaffold entire screens in minutes.

  Install via Claude Code MCP settings:
    Open Claude Code → Settings → MCP Servers → Add Server
    URL: https://mcp.21st.dev
    Name: 21st-dev

  Verify: In a Claude Code session, type /mcp 21st-dev — should respond.

  Usage: In the Claude Code interface with Nemotron active:
    "Use 21st.dev to generate a [component name] component"
    Claude (Nemotron) calls the MCP, gets the component, you refine
    in Blackbox CLI.

── STEP 7: PERSON 3 — NEMOTRON SETUP IN CLAUDE CODE ────────────────────
Person 3 uses the Claude Code interface but switches the underlying
model to Nemotron 3 Super 120B. This gives access to all Claude Code
plugins (21st.dev MCP, UI UX Pro Max) while using Nemotron's superior
instruction-following for frontend tasks.

  In Claude Code settings → Model → select Nemotron 3 Super 120B
  Confirm model is active before hackathon day.

  Nemotron model hint — add this to the top of every Claude Code prompt:
    "Skip all preamble. No explanations unless I ask. Output code only."
  This prevents Nemotron from over-explaining and burning context on text
  instead of code.

── STEP 8: BLACKBOX CLI SETUP (PERSON 3) ────────────────────────────────
Blackbox CLI is Person 3's execution engine for frontend work.
Claude Code (Nemotron) plans and generates component logic.
Blackbox CLI refines, iterates, and handles web-specific patterns.

  File handoff between tools:
    1. Claude Code (Nemotron) generates or specifies the component
    2. Save the file to the project directory
    3. Open Blackbox CLI: blackbox chat --file [filename]
    4. Blackbox refines the file in place
    5. Commit from the project directory — one source of truth

  Install:
    npm install -g @useblackbox/cli
    blackbox login
    blackbox --version  ← confirm it works

  Rule: Never have the same file open in both tools at once.
  Claude Code owns planning. Blackbox owns execution and refinement.

── STEP 9: INSTALL RECOMMENDED TOOLS (ALL PERSONS) ──────────────────────
  a) ccusage — track token burn rate  (Persons 1 and 2)
     npm install -g ccusage
     Run every 90 minutes: ccusage
     If burn rate is high, check whether /octo:factory spawned
     unnecessary subagents. Cancel and re-run with narrower CONTEXT.md.

  b) TDD Guard — hooks-based test enforcer  (Person 2's Claude session)
     https://github.com/nizos/tdd-guard
     Drops a hook into .claude/hooks/
     Codex in Terminal 2 writes tests for what Claude just built.
     TDD Guard ensures Claude doesn't ship untested routes.

── STEP 10: GIT SETUP ───────────────────────────────────────────────────
  Create the repo tonight. Don't wait until 9am.

  Person 1 creates all branches:
    git checkout -b p1/setup && git push -u origin p1/setup
    git checkout main && git checkout -b p2/backend && git push -u origin p2/backend
    git checkout main && git checkout -b p3/frontend && git push -u origin p3/frontend
    git checkout main && git checkout -b p4/feature && git push -u origin p4/feature

  Create AGENTS.md in repo root tonight:
    Defines: app name, tech stack, file structure conventions,
    env variable names, API base URL, auth patterns.
    All CCS sessions across the team read from this file.

  Branch structure:
    main        → deployable at all times, Person 1 merges here only
    p1/setup    → Person 1
    p2/backend  → Person 2
    p3/frontend → Person 3
    p4/feature  → Person 4

── STEP 11: PERSON 3 — DESIGN SYSTEM PREP ───────────────────────────────
  Once you know the theme tomorrow morning, run in Claude Code:
    python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
      "[theme keywords]" --design-system -p "realhackthon" --persist

  This creates design-system/MASTER.md.
  Paste the full MASTER.md at the top of every Blackbox CLI prompt
  for the entire day. This is how the design system stays consistent
  across both tools — manual paste, completely effective.

── NIGHT-BEFORE VERIFICATION (everyone, before sleeping) ─────────────────
  Person 1: ccs cliproxy doctor   ✅ all green
             aoe --version         ✅ shows version
             /octo:help            ✅ shows command list
  Person 2: ccs cliproxy doctor   ✅ all green
             /octo:help            ✅ shows command list
  Person 3: uipro --version        ✅ shows version
             blackbox --version    ✅ shows version
             Claude Code → confirm Nemotron model active
             /mcp 21st-dev         ✅ responds in Claude Code session
  Person 4: ccs --dangerously-skip-permissions → type "hello"  ✅ responds
             /octo:help            ✅ shows command list

  If anything fails tonight, fix it tonight.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REAL SCHEDULE — VIKING HACKS 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  7:30am  — Arrive, check in, eat, settle

  8:30am  — Kickoff

  9:00am  — Teams locked → RUN PROMPT 1 (Idea Finder)

  9:15am  — Pick idea → RUN PROMPT 2 (Subagent Generator)

  9:30am  — Everyone splits into sessions → BUILD
             Person 1: T1 = ccs + /octo:factory + /octo:embrace
                       T2 = ccs codex (parallel)
                       Window 3 = aoe (keep open all day)
             Person 2: T1 = ccs + /octo:factory
                       T2 = ccs codex (parallel test writing)
             Person 3: Claude Code (Nemotron) for planning + 21st.dev MCP
                       Blackbox CLI for execution and refinement
                       UI UX Pro Max design system first (15 min)
             Person 4: T1 = ccs --dangerously-skip-permissions + /octo:factory
                       One terminal only

  11:45am — Person 1: check aoe — all sessions must show idle/waiting
             (fallback: all team members send ✅ in group chat)

  12:10pm — MIDDAY SYNC: merge all branches
             Person 1 runs /octo:embrace before pulling anything
             Confirm app runs end to end on Person 1's machine
             Rule: if merge takes >20min, cut feature to hardcoded data
                   and move on. Do not chase the merge.

  12:30pm — Lunch

  1:00pm  — Resume all sessions

  3:15pm  — Person 1: check aoe again — all must show idle/waiting
             (fallback: ✅ in group chat from all)
             Person 3: if frontend done, pivot to P4 AI wiring or P2 testing

  3:30pm  — INTEGRATION MERGE 2 (Person 1 only)
             /octo:embrace before pulling anything
             Rule: same >20min hardcode rule applies here too

  4:00pm  — CHECK: if behind → RUN PROMPT 5 immediately
             Person 4: run /octo:tdd now — no manual test writing

  5:00pm  — HARD STOP on new features
             Person 1: final merge + deploy
             Everyone else: RUN PROMPT 3 (Pitch Prep)

  5:30pm  — RUN PROMPT 4 (Submission Checklist)

  6:00pm  — SUBMIT

  6:30pm  — Present to judges

  8:00pm  — Judging ends

  8:30pm  — Closing ceremony

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WORKFLOW — HOW YOUR TEAM USES THESE TOOLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE PHASE LOOP — PERSONS 1, 2, AND 4:

  For every phase:
    1. Write CONTEXT.md (60 seconds):
         # CONTEXT: [Phase Name]
         Build: [what to build — 1-2 sentences]
         Stack: [relevant stack for this phase only]
         Pass:
           - [criterion 1]
           - [criterion 2]
         Out of scope: [what not to build]

    2. Run: /octo:factory "implement CONTEXT.md"
         Factory reads CONTEXT.md, decides solo vs subagents, runs,
         delivers. Quality gate validates against Pass criteria.
         You do not need to supervise it — step away if it's a long phase.

    3. Verify manually:
         Click through what was built. Does it match the Pass criteria?
         If yes → commit to your branch → push → message group chat.
         If no → fix with: /octo:factory "fix: [specific issue]"
         Do not move to the next phase until this phase passes.

  Ad-hoc fixes: instead of a full factory run, use:
    claude "[specific fix — one sentence]"
    Only use /octo:factory for phases with 3+ deliverables.
    Single-file fixes do not need the factory overhead.

PERSON 1 — THREE WINDOWS ALL DAY:

  Terminal 1 — Claude + /octo:factory + /octo:embrace:
    Owns: architecture decisions, integration merges, deployment,
          conflict resolution, utility layers
    /octo:embrace before every merge:
      Scans all branches → flags risks → proposes merge order →
      summarizes what each person built. Run at 12:10pm and 3:30pm.

  Terminal 2 — Codex (parallel):
    Runs simultaneously with Terminal 1.
    While T1 runs /octo:factory for a phase, T2 handles:
      - Writing AGENTS.md while T1 scaffolds
      - git branch creation and setup
      - Build health monitoring: npm run build, npm test continuously
      - File-level conflict resolution during merges
    Codex reads AGENTS.md for project context automatically.

  Window 3 — aoe (open all day, no interaction needed):
    Check at 11:45am and 3:15pm before every merge.
    Do not pull any branch showing "active".
    If a session is not visible in aoe: wait for ✅ in group chat.

PERSON 2 — TWO TERMINALS, LEAPFROG PATTERN:

  Terminal 1 — Claude + /octo:factory:
    Owns: schema design, route architecture, business logic,
          auth middleware — the thinking-heavy backend work.
    Phase loop: write CONTEXT.md → /octo:factory → verify → commit.

  Terminal 2 — Codex (parallel test writing):
    While T1 executes Phase N, T2 writes tests for Phase N-1.
    They leapfrog all day.
    TDD Guard hook in T1 enforces that Claude can't ship untested routes.

PERSON 3 — CLAUDE CODE (NEMOTRON) + BLACKBOX CLI:

  9:30am — run UI UX Pro Max design system first (15 min):
    python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
      "[app keywords]" --design-system -p "realhackthon" --persist
    Creates design-system/MASTER.md

  Phase loop:
    Claude Code (Nemotron): plan the component, generate structure,
      call 21st.dev MCP for production-ready component scaffolding.
      Always start prompt with: "Skip preamble. Output code only."
    Blackbox CLI: open the generated file, refine, iterate.
      Always paste MASTER.md at the top of every Blackbox prompt.
    Commit from project directory. One source of truth.

  File handoff rule:
    Claude Code generates → save file → close Claude Code for that file
    → open in Blackbox CLI → refine → commit.
    Never have the same file open in both tools simultaneously.

  When frontend is done (target: by 2:30pm):
    First: message group chat "Frontend done, where do you need help?"
    Priority order:
      1. Help Person 4 wire AI feature output to frontend components
      2. Help Person 2 write missing backend tests
      3. Help Person 1 with pre-merge integration checks

PERSON 4 — ONE TERMINAL, /OCTO:FACTORY THROUGHOUT:

  Terminal 1 — Claude + /octo:factory:
    ccs --dangerously-skip-permissions

  Phase loop (same as Persons 1 and 2):
    Write CONTEXT.md → /octo:factory → verify → commit.

  For AI phases: be specific in CONTEXT.md about input/output format.
    The factory uses this to decide whether to spawn AI-specialist
    subagents or run a single focused implementation pass.
    More specific CONTEXT.md = fewer wasted subagent credits.

  At 4pm: run /octo:tdd
    Auto-generates full test suite around all AI feature code.
    No manual test writing. Pass/fail output ready for Person 1's
    final merge at 5pm.

COORDINATION FILES:
  AGENTS.md   — Person 1 writes in Phase 1, all sessions read this
  ENV.md      — Person 1 writes in Phase 1, everyone reads
  SCHEMA.md   — Person 2 writes in Phase 1, push + message group chat
  ROUTES.md   — Person 2 writes in Phase 2, push + message group chat
  design-system/MASTER.md — Person 3 generates at 9:30am

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GOLDEN RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ /octo:factory is the primary build command for all persons with Claude
  ✅ Write CONTEXT.md in 60 seconds before every phase — keep it short
  ✅ Subagents spawn inside the factory when needed — not by default
     If you see subagents on a simple task, cancel + narrow CONTEXT.md
  ✅ Ad-hoc single-file fixes: use claude "[fix]" not /octo:factory
  ✅ Persons 1 and 2: two terminals running simultaneously all day
  ✅ Person 4: one terminal — all work in Claude via CCS
  ✅ Person 3: Claude Code (Nemotron) plans, Blackbox CLI executes
     Never have the same file open in both tools at once
  ✅ Person 3: always start Nemotron prompts with "Skip preamble. Output code only."
  ✅ Person 3: paste MASTER.md at top of every Blackbox CLI prompt
  ✅ Person 3: message group chat when frontend is done — pivot immediately
  ✅ Person 1: keep aoe open in Window 3 all day
  ✅ Person 1: check aoe at 11:45am and 3:15pm — never pull an "active" branch
  ✅ Person 1: group chat ✅ fallback when aoe can't see a session
  ✅ Person 1: run /octo:embrace before EVERY merge — no exceptions
  ✅ 12:10pm merge rule: if it takes >20min, hardcode and move on
  ✅ 3:30pm merge rule: same — hardcode beats a broken merge
  ✅ Never move to the next phase until the current one passes verify
  ✅ Always commit to YOUR branch, never directly to main
  ✅ Message group chat when any coordination file is pushed
  ✅ Check ccusage every 90 minutes — Persons 1 and 2
  ✅ Person 4: run /octo:tdd at 4pm — do not write tests manually
  ✅ Hard stop at 5:00pm — no new features after this point
  ✅ If behind at 4:00pm → run Prompt 5 immediately, do not wait
  ✅ No Supabase. Backend is Node/Express + SQLite. Zero config.
  ✅ Verify ccs cliproxy doctor passes the night before — not at 9am

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


PROMPT 1 — IDEA FINDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RUN AT: 9:00am sharp — one person runs this, others settle in and eat
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HACKATHON IDEA FINDER
━━━━━━━━━━━━━━━━━━━━━

## HACKATHON PROMPT:
7. Automation, Everyday Friction
Find a daily annoyance or inconvenience that you or others face, and create a tool
that eliminates this

## TEAM SIZE: 4

━━━━━━━━━━━━━━━━━━━━━

Search ALL of the following sources for pain points, complaints, unmet needs,
and "I wish someone built..." moments related to the theme above:

── REDDIT (60+ subreddits) ──────────────────────────────────────────────
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
r/financialindependence, r/investing, r/CryptoCurrency,
r/povertyfinance, r/Frugal, r/DebtFree, r/gig_economy,
r/BuyItForLife, r/LifeProTips, r/NoStupidQuestions, r/YouShouldKnow,
r/HomeImprovement, r/DIY, r/CookingForBeginners, r/mealprep,
r/Fitness, r/loseit, r/running, r/graphic_design, r/VideoEditing,
r/podcasting, r/Twitch, r/NewTubers, r/photography, r/writing,
r/worldbuilding, r/musician, r/WeAreTheMusicMakers,
r/mildlyinfuriating, r/FirstWorldProblems, r/assholedes