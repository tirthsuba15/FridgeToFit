# SCHEDULE — VIKING HACKS 2026

| Time | What |
|------|------|
| 7:30am | Arrive, check in, eat, settle |
| 8:30am | Kickoff |
| 9:00am | Teams locked → run PROMPT1_IDEA_FINDER.md |
| 9:15am | Pick idea → run PROMPT2_SUBAGENT_GEN.md |
| 9:30am | Everyone starts → see below |
| 10:00am | All: pull AGENTS.md + SCHEMA.md when pushed by P1/P2 |
| 11:45am | P1: check aoe — all idle/waiting (or ✅ group chat) |
| 12:10pm | **MIDDAY MERGE** — P1 runs merge review agent team, reads docs/merge-review.md, then merges |
| 12:30pm | Lunch |
| 1:00pm | Resume. Update PROGRESS.md. |
| 2:30pm | P3 target: frontend done → **run P3 area test** → message "P3 area tests ✅" → pivot |
| ~3:00pm | P2 target: backend done → **run P2 area test** → message "P2 area tests ✅" |
| ~3:00pm | P4 target: AI phases done → **run P4 area test** → message "P4 area tests ✅" |
| 3:15pm | P1: check aoe (or wait for all area test ✅ in group chat) |
| 3:15pm | P1: **run P1 area test** while waiting for others |
| 3:30pm | **MERGE 2** — P1 runs merge review agent team, reads docs/merge-review.md, then merges |
| 3:30pm | After merge: P1 **runs combined E2E test** → paste failures to LLM → fix |
| 4:00pm | Check progress. If behind → run PROMPT5_SCOPE_CUT.md NOW |
| 4:00pm | P4: ask LLM to generate 2-agent test team coder prompt → paste into Claude Code |
| 5:00pm | **HARD STOP** — no new features |
| 5:00pm | P1: final merge + deploy |
| 5:00pm | P2, P3, P4: run PROMPT3_PITCH_PREP.md |
| 5:30pm | All: run PROMPT4_CHECKLIST.md together |
| 6:00pm | **SUBMIT** |
| 6:30pm | Present to judges |
| 8:00pm | Judging ends |
| 8:30pm | Closing ceremony |

---

## 9:30am STARTUP

**Person 1:**
```bash
claude --dangerously-skip-permissions
# Open aoe in second window — keep open all day
aoe
```

**Person 2:**
```bash
claude --dangerously-skip-permissions
```

**Person 3:**
```
Open Claude Code UI (confirm Step-3.5-Flash model active)
Run UI UX Pro Max design system first (15 min):
  python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
    "[app keywords]" --design-system -p "realhackthon" --persist
Open Blackbox CLI in separate terminal
```

**Person 4:**
```bash
claude --dangerously-skip-permissions
```

---

## MERGE RULES

**Before every merge (12:10pm and 3:30pm):**
1. Check aoe — all sessions idle/waiting
   Fallback: every team member sends ✅ in group chat
2. Run the merge review agent team in Claude Code (template in WORKFLOW.md)
   Wait for docs/merge-review.md — read it fully before touching git
3. Merge in the order docs/merge-review.md proposes
4. **If merge conflict takes >20 min → hardcode that feature and move on.**

---

## MEMORY FILE UPDATE SCHEDULE

| Time | Action |
|------|--------|
| After each phase | Update your row in PROGRESS.md, commit, push |
| When any tech decision is made | Add to DECISIONS.md immediately |
| When blocked | Add to BLOCKERS.md + message group chat |
| When unblocked | Delete your line from BLOCKERS.md |
| 12:10pm and 3:30pm | P1 confirms all memory files are current before merge |

---

## GROUP CHAT MESSAGES (send these at the right times)

```
P2 after Phase 1:  "SCHEMA.md pushed — pull now"
P2 after Phase 2:  "ROUTES.md pushed — pull now"
P3 when pivoting:  "Frontend done — where do you need help? P4 first"
P1 before merge:   "Merging in 5 min — confirm you're idle or ✅"
Anyone blocked:    "BLOCKED: [what] — need [person/thing]"
Anyone unblocked:  "UNBLOCKED — continuing Phase [N]"
```
