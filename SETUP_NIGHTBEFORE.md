# SETUP — NIGHT BEFORE (March 27th)

> **Rule:** Nothing gets installed on hackathon day. If it is not installed
> and verified tonight with a ✅, it does not exist tomorrow.

---

## STEP 1 — Claude Code (Persons 1, 2, 4)

```bash
npm install -g @anthropic-ai/claude-code
claude --version   # must print a version number
```

Set permissions to avoid approval interruptions.
Create or edit `~/.claude/settings.json`:

```json
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
```

---

## STEP 2 — Enable Agent Teams (Persons 1, 2, 4)

Agent teams are disabled by default in Claude Code — they are an experimental
feature that must be explicitly turned on per project.

In your project folder, ask Claude Code to enable it:

```
Create a file at .claude/settings.local.json with this content:
{"experimentalAgentTeams": true}
```

Or create it manually:

```bash
mkdir -p .claude
echo '{"experimentalAgentTeams": true}' > .claude/settings.local.json
```

Verify it exists:
```bash
cat .claude/settings.local.json   # must show {"experimentalAgentTeams": true}
```

---

## STEP 3 — Train Claude Code on Agent Teams (Persons 1, 2, 4)

Open a Claude Code session in your project folder and run:

```
Read the agent teams documentation at https://docs.anthropic.com/en/docs/claude-code/agent-teams
and create a master reference guide at docs/agent-teams-reference.md.
```

---

## STEP 4 — agent-of-empires (Person 1 only)

```bash
# Install aoe
curl -fsSL https://raw.githubusercontent.com/njbrake/agent-of-empires/main/scripts/install.sh | bash
```

---

## STEP 5 — UI UX Pro Max (Person 3)

```bash
npm install -g uipro-cli
uipro init --ai claude   # run inside project folder
```

---

## STEP 6 — 21st.dev MCP (Person 3)

In Claude Code → Settings → MCP Servers → Add Server:
```
URL:  https://mcp.21st.dev
Name: 21st-dev
```

Verify in a Claude Code session (Step-3.5-Flash active):
```
/mcp 21st-dev    # must respond
```

---

## STEP 7 — Step-3.5-Flash Model (Person 3 — SECONDARY agent)

In Claude Code → Settings → Model → select **stepfun/step-3.5-flash:free**

---

## STEP 8 — Blackbox CLI & Browser Automation (Person 3 — PRIMARY)

```bash
npm install -g @useblackbox/cli
blackbox login
blackbox --version
```

**Verify Browser Automation:**
```bash
blackbox automate "open localhost:3000 and verify 'App is running' text"
```

---

## STEP 9 — GitHub CLI (Everyone)

```bash
brew install gh
gh auth login
gh auth status   # must show "Logged in to github.com"
```

---

## STEP 10 — Repository Initialization (Person 1 — tonight)

Do not create branches manually. Use **PROMPT0_GITHUB_REPO.md**.

1. Create the repository on GitHub.com.
2. Run **PROMPT0_GITHUB_REPO.md** in your terminal.
3. Use the content from **Prompt 2 Section 0** to scaffold all memory files.

---

## NIGHT-BEFORE VERIFICATION

**Person 1:**
- [ ] `claude --version` ✅
- [ ] `gh auth status` shows logged in ✅
- [ ] `PROMPT0_GITHUB_REPO.md` initialized branches + memory files ✅
- [ ] `aoe --version` ✅
- [ ] `aoe` opens TUI ✅
- [ ] `ccusage` runs ✅

**Person 2:**
- [ ] `claude --version` ✅
- [ ] `gh auth status` shows logged in ✅
- [ ] `ccusage` runs ✅

**Person 3:**
- [ ] `uipro --version` ✅
- [ ] `blackbox --version` ✅
- [ ] `gh auth status` shows logged in ✅
- [ ] Claude Code model header shows stepfun/step-3.5-flash:free ✅

**Person 4:**
- [ ] `claude --version` ✅
- [ ] `gh auth status` shows logged in ✅
- [ ] `ccusage` runs ✅
