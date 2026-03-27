# GITHUB RULES — VIKING HACKS 2026

Establish these rules for all AI agents and team members.

---

## RULES
1. **NEVER** commit directly to `main`.
2. All work happens on your designated role branch:
   - `p1/setup` — DevOps & Glue
   - `p2/backend` — Backend Dev
   - `p3/frontend` — Frontend Dev
   - `p4/feature` — AI Feature Dev
3. Every phase **MUST** end with a `git commit` and `git push origin [branch]`.
4. When using Agent Teams or Collaborative Mode, each sub-agent should push its own sub-branch (e.g., `p3/frontend/nav-component`) before merging into the primary branch via `gh pr create`.
5. **Person 1** is the ONLY one authorized to merge into `main` after a successful Merge Review.

---

## WORKFLOW
- `gh repo view --web` — check repo status
- `gh pr create` — create a pull request for your branch
- `gh pr list` — see active pull requests
