# GOLDEN RULES — VIKING HACKS 2026

Print this or keep it open all day.

---

## THE TWO-TOOL SYSTEM
- [ ] LLM chat (claude.ai) = planning and prompt writing — never writes code
- [ ] Primary Coder (Claude Code for P1, P2, P4; Blackbox for P3) = handles all code and GitHub/Git operations (branch, commit, push, PR)
- [ ] Physical Checks (P3) = Blackbox CLI browser automation
- [ ] All Other Checks (Logic, Types, Lint, Non-physical) = `stepfun/step-3.5-flash:free`
- [ ] One phase card into LLM → LLM outputs CODER PROMPT + AGENT TEAM PROMPT + AUTOMATION PROMPT (P3) + LOGIC CHECK PROMPT (P3)
- [ ] Paste CODER PROMPT into Primary Coder → include GitHub instructions in the prompt
- [ ] Paste AUTOMATION PROMPT into Blackbox (P3) → paste LOGIC CHECK PROMPT into Step-3.5-Flash (P3)
- [ ] If coder errors → paste error to LLM → paste FIX PROMPT to coder

## AGENT TEAM RULES
- [ ] Complexity is the goal → Always use Agent Teams in Claude Code for phases with 2+ components to work faster
- [ ] Coders handle Git → Ensure agents commit and push their own branches before merging
- [ ] Each agent owns specific files — never let two agents edit the same file

## PERSON 3 RULES
- [ ] Blackbox CLI is PRIMARY — paste BLACKBOX PROMPT here first every phase
- [ ] **Competitive Mode (`/multi-agent`):** Use for tricky logic or algorithms. It runs multiple models (Claude, Gemini, etc.) on the same task. An **AI Judge** selects the best implementation and puts it on a branch.
- [ ] **Collaborative Mode (`/agent-team`):** Use for phases with 2+ independent components. A **Team Lead** delegates to specialist agents (UI, Logic, API) who work in parallel.
- [ ] UI/UX Consistency — Blackbox has codebase awareness; instead of pasting MASTER.md, ensure your prompt says "Read MASTER.md and adhere to the design system."
- [ ] GitHub Ownership — Blackbox CLI handles all branching, commits, and pushes for P3. Multi-agent/Agent-team modes handle branch isolation automatically.
- [ ] Physical Checks = Blackbox CLI browser automation
- [ ] All Other Logic Checks = `stepfun/step-3.5-flash:free`
- [ ] Claude Code (Step-3.5-Flash) is SECONDARY — used for logic planning or parallel generation
- [ ] Start every Step-3.5-Flash prompt with "Skip preamble. Output code only."
- [ ] Use 21st.dev MCP for instant component generation inside Claude Code
- [ ] Never edit the same file in Blackbox and Claude Code simultaneously
- [ ] Target done by 2:30pm → message group → pivot to P4 → P2 → P1

## MEMORY RULES
- [ ] Update PROGRESS.md after every single phase
- [ ] Write DECISIONS.md the moment a tech decision is made
- [ ] Write BLOCKERS.md the moment you're blocked + message group chat
- [ ] docs/merge-review.md is written by the agent team — never commit it manually

## HARD RULES
- [ ] 5:00pm hard stop — no new features after this
- [ ] 4:00pm: if behind → run PROMPT5_SCOPE_CUT.md immediately
- [ ] Never commit to main directly
- [ ] No Supabase — backend is Node/Express + SQLite only
- [ ] All tools installed the night before — nothing installed day-of

---

## COMMAND QUICK REFERENCE

```bash
# LLM chat (claude.ai) — ask this for each phase:
"Generate CODER PROMPT + TEST PROMPT + PHYSICAL CHECKLIST for Phase [N]"
"FIX PROMPT — coder produced this error: [paste error]"
"Write my handoff block for Phase [N]"

# Coder — Claude Code (P1, P2, P4):
claude --dangerously-skip-permissions
# Paste whatever the LLM gave you — it includes agent team invocation if needed

# Merge review team — P1 only, before every merge (paste into Claude Code):
# See WORKFLOW.md for the full merge review team prompt
# Result lands in docs/merge-review.md

# Token check — every 90 min:
ccusage

# Person 3 — coder tools:
# Blackbox (primary): leads phase + handles browser automation for checks
#   Always include "Read MASTER.md and follow the design system" in prompts
# Step-3.5-Flash (secondary): paste "Skip preamble. Output code only." prepended
#   Pasted directly into Claude Code UI for logic/component help
```

## AGENT TEAM RULES
- [ ] Simple task → plain `claude "[task]"` — never use a team for this
- [ ] Complex phase with 3+ parallel parts → LLM includes team in coder prompt
- [ ] Each agent owns specific files — never let two agents edit the same file
- [ ] Name message recipients explicitly — "message the QA agent" not "message a teammate"
- [ ] Watch agents in VS Code — message any agent that goes off track
- [ ] Wait for all agents to confirm shutdown before committing
- [ ] No agent teams after 4pm — plain claude only in the final hour

---

## IF THINGS GO WRONG

| Problem | Fix |
|---------|-----|
| LLM chat context full | Generate handoff block → new claude.ai chat → paste it |
| Coder produced an error | Paste error into LLM chat → paste FIX PROMPT into coder |
| Coder asked a clarifying question | Paste question into LLM → LLM rewrites the prompt |
| Blocked on someone else's file | Write BLOCKERS.md + message group chat immediately |
| Agent team going off track | Message that specific agent in VS Code to correct it |
| Agent team too expensive | Kill team, use plain `claude` for each step sequentially |
| Merge conflict >20min | Paste conflict to LLM → get FIX PROMPT → if still stuck: hardcode |
| Behind at 4pm | Run PROMPT5_SCOPE_CUT.md immediately — plain claude only from here |
| Live URL down at demo | Screen recording or local version as backup |
