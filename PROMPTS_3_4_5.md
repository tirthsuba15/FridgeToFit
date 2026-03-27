# PROMPT 3 — PITCH PREP
**Run at: 5:00pm hard stop — one person runs this while Person 1 deploys**

---

```
VIKING HACKS PITCH PREP

APP NAME: [name]
WHAT IT DOES: [one sentence]
LIVE URL: [paste from Person 1]
DEMO SCENARIO: [paste your 3-minute demo from the interview]
STACK: React + Node/Express + SQLite + [AI APIs if used]
UI STYLE: [UI UX Pro Max style name used]

JUDGES:
- Atharv Deshmukh — Software Engineer, Casca (UIUC)
- Mithil Patil — Software Engineer, Casca (GT)
- Jimmy Wei — IncidentFox AI, YC Startup founder
- Long Yi — IncidentFox AI, YC Startup founder
- Vignesh Ravichandran — MyClone AI, AI Startup founder
- Divyank Shah — Software Engineer, Apple
- Harsha Sanjeeva — Senior Engineer, Cisco
- Nilesh Matai — Software Engineer, Retell AI
- Prabir Vora — Technical Chief of Staff, Retell AI

Technical engineers and startup founders. They probe architecture, scalability,
real-world viability, and whether you understand what you built.

Generate the following. No fluff.

## 1. THREE-MINUTE DEMO SCRIPT

Write exact words to say out loud.

[0:00–0:20] HOOK
One sentence. Start with the pain. Specific and visceral.

[0:20–1:00] PROBLEM
2-3 sentences. Real human scenario. No stats. No buzzwords.

[1:00–2:30] LIVE DEMO
Click-by-click narration. Every sentence = one action.
Tell the speaker what to click, what to say while it loads,
which technical details to point out.

[2:30–3:00] CLOSE
Why it matters. Who benefits. What you'd build next.
Last line should still be in judges' heads 30 minutes later.

## 2. TECHNICAL DEEP DIVE (60 seconds)

Senior engineer level. Cover:
- Architecture decisions and why
- Why Node/Express + SQLite for this app specifically
- The hardest technical problem solved today
- How /octo:factory's multi-model routing (Claude for logic, Codex for tests,
  Gemini for parallel tasks) made this possible in 9 hours
- What changes to scale to 100k users

## 3. JUDGE Q&A PREP

12 hardest questions these judges will ask. 2-3 sentence answers each.

By judge type:
- Casca: system design, architecture tradeoffs, code quality
- YC founders (IncidentFox): market, monetisation, defensibility
- MyClone AI: AI accuracy, model quality, prompt engineering
- Apple: UX, accessibility, privacy
- Cisco: security, enterprise viability, scalability
- Retell AI: AI latency, production reliability, edge cases

Format:
Q: [question]
A: [2-3 sentences — honest, specific, technically credible]

## 4. ONE-SENTENCE PITCHES

3 versions. Under 280 characters. No jargon. No buzzwords.

## 5. DESIGN DECISION TALKING POINTS

2-3 sentences for when a judge asks about design.
Cover: style choice, why it fits this product, what anti-patterns were avoided.
Reference UI UX Pro Max and 21st.dev MCP component generation.

## 6. WHAT WE'D BUILD NEXT

3 bullets. Next 2 weeks if the team continued.
Technically specific. For the "what's your vision" question.
```

---
---

# PROMPT 4 — SUBMISSION CHECKLIST
**Run at: 5:30pm — everyone goes through this together**

---

```
VIKING HACKS SUBMISSION CHECKLIST

APP NAME: [name]
LIVE URL: [url]
GITHUB REPO: [url]
TEAM: [all 4 names]

Go through every item. For each one tell me: ✅ done or ❌ not done.
For every ❌ tell me the exact fix in one sentence.

LIVE APP
□ URL loads on a phone with different WiFi
□ Loads in under 3 seconds
□ Core demo feature works end to end with no errors
□ Demo data seeded — app does not look empty
□ No console errors in browser dev tools
□ Works on mobile (375px)
□ No broken links or 404s
□ cursor:pointer on every clickable element
□ No broken images or placeholder text

UI QUALITY (UI UX Pro Max checklist)
□ All icons are SVG — no emojis as icons
□ Hover states on all interactive elements (150-300ms transition)
□ Text contrast 4.5:1 minimum
□ Focus states visible for keyboard navigation
□ prefers-reduced-motion respected
□ Responsive at 375px, 768px, 1024px, 1440px
□ No AI purple/pink gradients unless style calls for it
□ All form inputs have labels and error states

GITHUB REPO
□ Repo is public
□ README explains the app in 2-3 sentences
□ README includes live URL
□ README includes setup instructions (npm install && npm run dev)
□ All 4 team members have at least one commit
□ No API keys committed
□ .env.example exists with all variable names
□ AGENTS.md in repo root
□ CONTEXT.md in .gitignore (not committed)
□ PROGRESS.md, DECISIONS.md committed (useful for judges to see process)

DEMO READINESS
□ Demo script read aloud at least once
□ Runs under 3 minutes
□ Hook practiced — speaker knows first line cold
□ Backup plan if live URL goes down (screen recording or local)
□ Technical deep dive rehearsed
□ At least 2 people know the Q&A answers

SUBMISSION FORM
□ Form found and opened
□ App name filled in
□ Team names filled in
□ Live URL filled in
□ Repo URL filled in
□ Description written (use one-sentence pitch from Prompt 3)
□ Submitted before 6:00pm

FINAL CHECK
□ Open live URL on your phone and run the full demo right now
□ Would you be proud to show this to a senior engineer at Apple?

End with:
SUBMISSION READY ✅ — submit now
or
SUBMISSION NOT READY ❌ — [list items to fix with exact one-line fixes]
```

---
---

# PROMPT 5 — EMERGENCY SCOPE CUT
**Run at: 4:00pm IF you are behind. Do not wait until 4:30pm.**

---

```
EMERGENCY SCOPE CUT — VIKING HACKS 2026

APP NAME: [name]
CURRENT TIME: [time]

STATUS (each person fills in their row):
P1: Phase [N] done. Currently on Phase [N]. [what's working / what's not]
P2: Phase [N] done. Currently on Phase [N]. [what's working / what's not]
P3: Phase [N] done. Currently on Phase [N]. [what's working / what's not]
P4: Phase [N] done. Currently on Phase [N]. [what's working / what's not]

To get the status, run in your project folder:
  git log --oneline -5
  ls -la server/ client/src/

WORKING: [list everything that works end to end right now]
BROKEN: [list everything broken or unfinished]
ORIGINAL DEMO: [paste your 3-minute demo scenario]

---

You are an emergency triage assistant. Hard stop at 5:00pm.
The team has [X] minutes.

Do this in order:

1. TRIAGE
   Anything not visible in the 3-minute demo: cut it now.
   For each broken thing: fix it (is it possible?) or hardcode it.
   Be ruthless.

2. REVISED DEMO
   Rewrite the demo using only what currently works.
   If core feature is broken: specify hardcoded data, mocked response,
   or pre-recorded video — whichever is fastest.

3. ONE TASK PER PERSON (completable in 60 minutes)
   P1: [exact task] — command: `claude "[exact fix]"`
   P2: [exact task] — command: `claude "[exact fix]"`
   P3: [exact task] — Blackbox prompt: `[paste MASTER.md] + [exact refinement]`
   P4: [exact task] — command: `claude "[exact fix]"`
   
   Use plain `claude` for ALL tasks. No /octo:factory after 4pm — credits are 
   too tight and factory startup time is too slow in the final hour.

4. HARDCODE FALLBACK
   For anything broken that can't be fixed in 60 minutes:
   Write the complete file to hardcode a convincing demo version.
   Full files only. Apply UI UX Pro Max design system — looks polished.

5. ONE SENTENCE
   Are they on track for a demoable product by 5pm?

Nothing else. Team is stressed. Give triage now.
```
