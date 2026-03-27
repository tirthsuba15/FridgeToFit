# MEMORY SYSTEM

Context rot happens when a chat fills up and the model loses track of
what was built, why decisions were made, and what's broken.
These three files are the solution. They live in the repo root,
get committed after every phase, and get pasted when you start a new chat.

---

## THE THREE FILES

### PROGRESS.md
What phase you're on, what's done, what's next.
Updated by each person after every phase is complete.
**Update format:** overwrite your person's row — don't append forever.

### DECISIONS.md
Architecture decisions made during the hackathon.
Written once when a decision is made. Never deleted.
Prevents the same debate from happening twice.

### BLOCKERS.md
Current blockers. Written when blocked. Deleted when resolved.
Prevents silent blockers from sitting for 30 minutes.

---

## WHEN TO UPDATE

| File | When |
|------|------|
| PROGRESS.md | After each phase is verified and committed |
| DECISIONS.md | When any tech/architecture decision is made |
| BLOCKERS.md | The moment you're blocked (write it, message group chat) |

---

## HOW TO USE WHEN STARTING A NEW CHAT

When your chat fills up, ask your current LLM to generate this block, then paste it into the new chat:

```
HANDOFF — [App name] — [Your role + branch]

STATE: [paste your row from PROGRESS.md]
DECISIONS: [paste DECISIONS.md — full contents, it stays short]
BLOCKERS: [paste BLOCKERS.md — or write "None"]
JUST FINISHED: [one sentence — what you built in the last phase]
NEXT: [paste the next phase card from your PX_GUIDE.md]
```

This is the minimum needed to resume. Keep it tight — every token you paste is a token you can't use for building.

---

## TEMPLATE FILES

Copy these three files into your repo root tonight.

---

### PROGRESS.md template

```markdown
# PROGRESS

Last updated: [time]

| Person | Current Phase | Done | Next |
|--------|--------------|------|------|
| P1 | Phase 1 | — | Phase 2 |
| P2 | Phase 1 | — | Phase 2 |
| P3 | Phase 1 | — | Phase 2 |
| P4 | Phase 1 | — | Phase 2 |

## Phase Log
<!-- Each person appends a one-liner when they complete a phase -->
<!-- Format: [time] P[N] Phase [N] done — [one sentence what was built] -->
```

---

### DECISIONS.md template

```markdown
# DECISIONS

<!-- Format: ## [topic] — [decision made] — [why, one sentence] -->
<!-- Add entries as decisions are made. Never delete. -->

## Stack — Node/Express + SQLite — fastest setup, zero config, no hosted DB needed
## Auth — [fill in on hack day when decided]
## AI model — [fill in on hack day if AI used]
```

---

### BLOCKERS.md template

```markdown
# BLOCKERS

<!-- Format: - [time] P[N]: [blocker] — waiting on [person/thing] -->
<!-- Delete the line when resolved. Empty file = no blockers. -->

<!-- Example: -->
<!-- - 10:32am P3: ROUTES.md not pushed yet — waiting on P2 -->
```

---

## AGENTS.md TEMPLATE (Person 1 writes this in Phase 1)

```markdown
# AGENTS

## App
Name: [app name]
What it does: [one sentence]
Target user: [specific description]

## Stack
Frontend: React
Backend: Node/Express
Database: SQLite (file: ./db/app.db)
AI: [model + API if used — else "None"]
Deploy: [platform]

## File Structure
/client        React frontend
/server        Express backend
/server/db     SQLite database + migrations
/server/routes API routes
/server/middleware Auth + validation middleware

## Database Tables
[list every table name — filled in after Person 2 writes SCHEMA.md]

## API
Base URL: http://localhost:3001/api
Auth: [JWT / session — decided in Phase 2]

## Environment Variables
PORT=3001
DATABASE_URL=./db/app.db
[AI_API_KEY=... if used]

## Branch Conventions
main          → deployable, Person 1 merges only
p1/setup      → Person 1
p2/backend    → Person 2
p3/frontend   → Person 3
p4/feature    → Person 4

## Commit convention
feat: [description]
fix: [description]
chore: [description]
```
