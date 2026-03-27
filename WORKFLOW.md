# WORKFLOW

---

## THE TWO-TOOL SYSTEM

Every person runs two tools simultaneously:

```
LLM CHAT (claude.ai)          CODERS
─────────────────────         ──────────────────────────────────────────────────
Understands the project       P1, P2, P4 Primary: Claude Code (`claude`)
Reads phase card              P3 Primary: Blackbox CLI
Generates prompts        ──►  1. CODER PROMPT (scaffold + Git operations)
                              2. AGENT TEAM PROMPT (parallel sub-tasks)
                              3. AUTOMATION PROMPT (P3 browser checks)
                              4. LOGIC CHECK PROMPT (P3 non-physical checks)
Adapts if errors pasted  ◄──  Person pastes errors back
Updates memory files          Primary coders handle all Git/GitHub (branch, push)
```

**The LLM chat never writes code directly.**
**The coders never plan — they only execute what the LLM tells them.**

### Tool Ownership
- **Claude Code** = Primary for P1, P2, P4. Spawns Agent Teams to build 2-5 components simultaneously. Handles all Git/GitHub operations.
- **Blackbox CLI** = Primary for P3.
  - **Single Task:** Use standard prompts for core UI logic.
  - **Competitive Mode (`/multi-agent`):** Runs multiple models on the same task. AI Judge selects the best version. Use for algorithms or complex logic.
  - **Collaborative Mode (`/agent-team`):** Team Lead delegates to 2-5 specialists for parallel component building. Use for new feature builds.
  - **Browser Automation:** Handles all physical checks.
- **Step-3.5-Flash** = Secondary for P3. Performs all **non-physical** logic, type, and lint checks for P3.

---

## THE PHASE LOOP — every phase, every person

### Step 1 — Paste the phase card into the LLM chat

### Step 2 — LLM outputs four blocks

**BLOCK 1 — CODER PROMPT**
Primary instructions. Includes logic scaffold AND explicit instructions to **handle Git/GitHub operations** (branch, commit, push, PR).

**BLOCK 2 — AGENT TEAM PROMPT**
Instructions for parallel work. Each agent handles its own file changes and Git pushes.

**BLOCK 3 — AUTOMATION PROMPT (P3 ONLY)**
`blackbox automate` instructions for physical browser checks.

**BLOCK 4 — LOGIC CHECK PROMPT (P3 ONLY)**
Instructions for `stepfun/step-3.5-flash:free` to perform non-physical logic, type, and lint checks.

### Step 3 — Paste BLOCK 1 into Primary Coder

Ensure the coder executes the build AND pushes the changes to GitHub.

### Step 4 — Paste BLOCK 2 into Claude Code (if needed)

### Step 5 — Run Checks

- **Physical Checks (P3):** Paste BLOCK 3 into Blackbox CLI.
- **All Other Checks (P3):** Paste BLOCK 4 into Step-3.5-Flash.
- **P1, P2, P4 Checks:** Claude Code runs automated tests.

---

## CODER TOOLS PER PERSON

| Person | LLM | Primary Coder (Git Owner) | Secondary Agent (Check Engine) |
|--------|-----|--------------------------|-------------------------------|
| P1 | claude.ai | Claude Code | Agent Teams |
| P2 | claude.ai | Claude Code | Agent Teams |
| P3 | claude.ai | Blackbox CLI | Step-3.5-Flash (Logic Check) |
| P4 | claude.ai | Claude Code | Agent Teams |

---

## COORDINATION FILES

| File | Who writes | When | Who reads |
|------|-----------|------|-----------|
| AGENTS.md | P1 coder | Phase 1 | All LLM chats + coders |
| ENV.md | P1 coder | Phase 1 | Everyone |
| SCHEMA.md | P2 coder | Phase 1 | P3 + P4 LLM chats |
| ROUTES.md | P2 coder | Phase 2 | P3 + P4 LLM chats |
| MASTER.md | P3 Step-3.5-Flash | 9:30am | P3 Blackbox prompts |
| docs/merge-review.md | P1 merge team | Before each merge | P1 only |
| PROGRESS.md | All | After each phase | All LLM handoff blocks |
| DECISIONS.md | All | When decisions made | All LLM handoff blocks |
| BLOCKERS.md | All | When blocked | All LLM handoff blocks |

When P2 pushes SCHEMA.md or ROUTES.md: message group chat immediately.
P3 and P4 paste file contents into their LLM chat so the LLM can reference
exact table names and endpoints when writing coder prompts.
