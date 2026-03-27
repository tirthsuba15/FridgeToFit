# PROMPT 0 — GITHUB REPOSITORY & BRANCHING
**Run at: 8:45am — Person 1 runs this to initialize the workspace**

---

## WHAT THIS PROMPT PRODUCES
This prompt ensures the repository is set up correctly and all AI coders (Claude Code and Blackbox) understand the branching and pull request strategy.

---

## STEP 1 — INITIALIZATION
*(Paste this into Claude Code or Blackbox CLI in the root directory after creating the repo on GitHub.com)*

```
Goal: Link the local environment to the GitHub repository using 'gh' CLI, establish the branching structure, and initialize core coordination files.

1. Verify 'gh auth status' to ensure the GitHub CLI is logged in.
2. Link this local directory to the existing GitHub repository:
   - gh repo clone [owner]/realhackthon .
   - OR, if directory already exists: gh repo set-default [owner]/realhackthon
3. Create and push the following branches to origin using 'git' and 'gh':
   - main (ensure it's the default branch)
   - p1/setup (Person 1's workspace)
   - p2/backend (Person 2's workspace)
   - p3/frontend (Person 3's workspace)
   - p4/feature (Person 4's workspace)

4. Initialize Core Coordination Files (Scaffold only - P2 and P3 will fill these later):
   - Create 'PROGRESS.md' (copy structure from toolkit)
   - Create 'DECISIONS.md' (copy structure from toolkit)
   - Create 'BLOCKERS.md' (copy structure from toolkit)
   - Create 'ENV.md' (list required environment variables from project idea)
   - Create '.github/workflows/ci.yml' for automated testing.

5. Create a GITHUB.md file in the root with these rules for all AI agents:
   RULE 1: NEVER commit directly to 'main'.
   RULE 2: All work happens on your designated 'p[N]/[name]' branch.
   RULE 3: Every phase MUST end with a 'git commit' and 'git push origin [branch]'.
   RULE 4: When a phase involves parallel components (Agent Teams or /agent-team), each agent should push its own sub-branch (e.g., p3/frontend/nav-component) before merging into the primary role branch using 'gh pr create'.
   RULE 5: Person 1 is the ONLY one authorized to merge into 'main' after a successful Merge Review.

Final deliverable: Pushed branches + GITHUB.md + Scaffolded Memory Files + active GitHub Repo linkage
```

---

## STEP 2 — ROLE ASSIGNMENT
*(Each person pastes this into their Primary Coder session at 9:30am)*

```
You are the primary Git/GitHub owner for this branch.
My role is [P1/P2/P3/P4].
My branch is [p1/setup | p2/backend | p3/frontend | p4/feature].

YOUR RESPONSIBILITIES:
1. Always verify you are on the correct branch before writing code.
2. After every logical sub-task or component build:
   - Stage changes: git add .
   - Commit with a clear message: git commit -m "[feat/fix]: [description]"
   - Push to origin: git push origin [your branch]
3. Use the 'gh' CLI for repo status and pull requests:
   - Check repo status: gh repo view --web
   - Create a PR when a major sub-task is done: gh pr create --title "[feat]: [description]" --body "[details]"
4. If using Agent Teams (Claude Code) or Collaborative Mode (/agent-team in Blackbox):
   - Instruct each sub-agent to push their specific file changes to origin.
5. You are responsible for ensuring the remote repository is always in sync with your local progress.

Acknowledge your role as the Git/GitHub owner and 'gh' CLI operator for this project.
```
