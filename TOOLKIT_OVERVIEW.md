# VIKING HACKS 2026 — TOOLKIT v8
**March 28th · Fremont, CA**

---
## FILES IN THIS TOOLKIT

```
TOOLKIT_OVERVIEW.md        ← you are here — read this first
PROMPT0_GITHUB_REPO.md     ← 8:45am — initializes repo and branching structure
SETUP_NIGHTBEFORE.md       ← install everything tonight (March 27th)
```

MEMORY_SYSTEM.md           ← how PROGRESS/DECISIONS/BLOCKERS work
SCHEDULE.md                ← full day schedule with rules
WORKFLOW.md                ← phase loop, /octo:factory rules, coordination
GOLDEN_RULES.md            ← one-page cheat sheet for the day
FINAL_TEST_PHASE.md        ← area test cards (per person when done) + combined E2E (P1 after merge)

PROMPTS/
  PROMPT1_IDEA_FINDER.md   ← run at 9:00am
  PROMPT2_SUBAGENT_GEN.md  ← run at 9:15am
  PROMPTS_3_4_5.md         ← Prompt 3 (5:00pm), 4 (5:30pm), 5 (4:00pm if behind)
                              All three are in one file — scroll to the right section

GUIDES/
  P1_GUIDE.md              ← Person 1 LLM guide (paste phase by phase)
  P2_GUIDE.md              ← Person 2 LLM guide
  P3_GUIDE.md              ← Person 3 LLM guide
  P4_GUIDE.md              ← Person 4 LLM guide

MEMORY/
  PROGRESS.md              ← updated every phase by each person
  DECISIONS.md             ← architecture decisions, updated as made
  BLOCKERS.md              ← current blockers, cleared when resolved
```

---

## WHAT CHANGED IN v8

- **No CCS.** Everyone opens `claude --dangerously-skip-permissions` directly.
- **No GSD.** Replaced by markdown memory files + plain `claude` for most tasks.
- **No claude-octopus.** Replaced entirely by Claude Code Agent Teams — a native Claude Code feature.
- **Agent Teams** handle complex parallel phases and merge review. Simple phases use plain `claude`.
- **Context rot solved** via PROGRESS.md + DECISIONS.md + BLOCKERS.md. These files are the memory that gets pasted when switching chats.
- **Per-person LLM guides** (P1–P4 GUIDE.md) split into phases. Paste the project brief first, then one phase card at a time. Switch chats freely using the handoff block.
- **All installs happen the night before.** Nothing installed on hackathon day.
- **Backend: Node/Express + SQLite.** No Supabase. Zero config.

---

## TOOL ROSTER

| Tool | Who | Role in the two-tool system |
|------|-----|-----------------------------|
| claude.ai | Everyone | **LLM chat** — reads phase cards, writes coder prompts |
| Claude Code | P1, P2, P4 | **Primary Coder** — leads phases and runs Agent Teams |
| Blackbox CLI | P3 | **Primary Coder** — leads phases and handles all **browser automation** for checks |
| Step-3.5-Flash (Claude Code UI) | P3 | **Secondary Agent** — provides fast logic and component help |
| 21st.dev MCP | P3 | Component generation inside Claude Code |
| UI UX Pro Max | P3 | Design system — MASTER.md pasted into Blackbox prompts |
| agent-of-empires (aoe) | P1 | Session monitor for merge windows |
| TDD Guard | P2 | Test enforcement hook |
| ccusage | P1, P2, P4 | Token burn monitoring |

---

## READING ORDER (tonight)

1. `SETUP_NIGHTBEFORE.md` — install everything, run verification
2. `MEMORY_SYSTEM.md` — understand how PROGRESS/DECISIONS/BLOCKERS work
3. Your personal `GUIDES/PX_GUIDE.md` — read your full guide once tonight
4. `GOLDEN_RULES.md` — memorise the one-pagers

On hackathon day, you only need your `PX_GUIDE.md` and the memory files.
