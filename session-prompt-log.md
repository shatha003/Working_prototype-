# Build.Solve.Impact. — Session Prompt Log

> **Format:** Professional prompt engineering documentation
> **Role:** Human (Client) → AI (Agent)
> **Total Prompts:** 18
> **Session Duration:** ~45 minutes
> **Objective:** Working prototype for business request triage

---

## Prompt 001 — Project Brief & Scope Definition

```markdown
## CONTEXT
A busy business receives 5 incoming requests simultaneously. Resources are limited:
2 staff members, 3 appointment slots, and a $200 refund limit requiring manager
approval. A VIP list and knowledge base are available.

## OBJECTIVE
Build a working prototype that helps the business decide:
1. Which request to handle first (priority ordering)
2. Whether AI can resolve, escalate, or assign each request
3. What action should happen next
4. What response to send to the customer
5. Why that decision was made (transparent reasoning)

## DELIVERABLES
- Working decision screen showing: priority, AI confidence, recommended action,
  owner, suggested response, and reason
- At least one automated workflow (system decides + triggers next action)
- One edge case where AI must NOT act and must escalate to a human
- 90-second demo explaining what was built, how it works, and what to build next

## CONSTRAINTS
- 45-minute build time
- Any tools allowed (Lovable, Cursor, Claude, Replit, APIs, code, no-code)
- Golden rule: Build, don't present

## EVALUATION CRITERIA
Smart decisions · Clear thinking · Agentic workflows · Great UX · Speed
Creativity · Execution · Communication
```

**Agent response:** Analyzed the 5 requests, constraints, and deliverables. Proposed a
React + Vite decision dashboard with a deterministic rules engine, confidence scoring,
auto-resolve workflow, and refund-limit escalation edge case. Asked 5 clarifying
questions about tech stack, AI logic approach, UI style, workflow focus, and edge case.

---

## Prompt 002 — Tech Stack & Design Decisions

```markdown
## DECISIONS

### Stack
React + Vite + JS

### AI Logic
Deterministic rules engine with confidence scoring.
Transparent, predictable, fast. Priority scoring weights:
- Urgency (0-30)
- Customer value (0-20)
- Resolution risk (0-20)
- SLA breach risk (0-15)
- Policy fit (0-15)

### Automated Workflow
Auto-assign + auto-respond to low-risk requests.
When AI confidence is high and no manager approval needed,
the system auto-assigns staff and generates the reply.

### Edge Case
Refund above manager-approval limit ($200).
Omar charged twice ($450) — AI detects limit exceeded,
refuses to auto-resolve, routes to manager with context.

### UI Style
Polished dashboard. Dark theme, professional layout.
```

**Implication:** Single-page React app. No backend. No real LLM calls.
Rules engine computes everything transparently.

---

## Prompt 003 — Create OpenCode Skill File

```markdown
## TASK
Create a skill .md file for this project.

## REFERENCE FORMAT
Provide a file with:
- Frontmatter: name, description, triggers (list of activation phrases)
- Body sections: Installation, Core Functionality, Basic Usage, Configuration,
  Advanced Usage Patterns, [domain-specific sections], Environment Variables,
  Common Patterns, Troubleshooting, Best Practices, Integration Examples
- Code blocks referencing the tool's API
- CLI examples using the tool's binary name
- Realistic, runnable code snippets in every section

## SAMPLE
[AutoPentestX skill file provided as reference]

## OUTPUT FILE
build-solve-impact.skill.md
```

**Delivered:** `build-solve-impact.skill.md`

---

## Prompt 004 — Create Prompt Library

```markdown
## TASK
Create a prompt library file (my-prompt-library.txt) with role-based
prompts for the AI agent.

## REFERENCE FORMAT
Each prompt includes:

### Shared Opening Line
"You are an expert engineer in a fast-paced coding competition. Speed,
readability, and functional correctness are my top priorities. Avoid
unnecessary abstractions unless they are critical for the functionality."

### Role-Specific Body
1. **Architect Role** — Strategic thinking, component breakdown, data flow,
   scalability vs. speed tradeoffs. References @tech-specs.md.

2. **Backend Developer Role** — Implementation guidance, Clean Code principles,
   error handling, input validation, step-by-step execution.

3. **Failure Tester & Security Role** — Vulnerability identification, edge case
   analysis, test generation, code patch snippets.

## ADDITIONAL INSTRUCTION
"You can add as many roles as you see necessary or enough."

## OUTPUT FILE
my-prompt-library.txt
```

**Delivered:** `my-prompt-library.txt` with 7 roles:
1. System Architect
2. Frontend Developer (React + UI)
3. Rules Engine Developer
4. QA & Edge Case Tester
5. Demo Script Writer
6. Code Reviewer
7. Workflow Automation Developer

---

## Prompt 005 — Create Technical Specifications

```markdown
## TASK
Create a tech-specs.md file with coding standards and technical guidelines.

## REQUIRED SECTIONS
1. Project Core Stack — Language/Framework, AI Tools, Database, etc.
2. Coding Standards — Rules the AI MUST follow (async/await, error handling,
   input validation, modularity, SRP, function length limits)
3. APIs & Documentation & Formatting — Reference links, strict response
   envelope format
4. Security Policy — Secrets management, input sanitization

## SAMPLE
[Tech specs sample provided with Python/FastAPI stack]

## OUTPUT FILE
tech-specs.md
```

**Delivered:** `tech-specs.md` adapted for React + Vite + JS + plain CSS stack.

---

## Prompt 006 — Create Agent Behavior Guidelines

```markdown
## TASK
Create an agent.md file that instructs the AI how to behave during the
entire build process.

## REQUIREMENTS
1. After each task, the agent must suggest 1-3 specific improvements
   if applicable
2. After each phase and each individual task, the agent must verify
   the work is correct before proceeding
3. If a task fails verification: state what failed, fix it immediately,
   re-verify, then proceed

## OUTPUT FILE
agent.md
```

**Delivered:** `agent.md` with post-task improvement loop and phase-gate
verification protocol.

---

## Prompt 007 — Create Progress Tracker

```markdown
## TASK
Create a progress tracker checklist file.

## REQUIREMENTS
- Contains all phases I will go through during implementation
- Each phase has individual task checkboxes
- File must be updated after every completed task
- Serves as a real-time status board for the entire project

## OUTPUT FILE
progress-tracker.md
```

**Delivered:** `progress-tracker.md` with 9 phases and ~60 checkboxes.

---

## Prompt 008 — Add Testing Phase

```markdown
## QUERY
"I see no testing?"

## RESOLUTION
A dedicated testing phase was added to the progress tracker
with:
- Unit tests for the triage engine (all 5 requests)
- Edge case tests (refund limit, no slots + VIP, ambiguous urgency)
- Component smoke tests
- Gate check: all tests must pass before demo prep
```

---

## Prompt 009 — Create Project Plan

```markdown
## TASK
Create an additional file containing the entire project plan.

## OUTPUT FILE
plan.md
```

**Delivered:** `plan.md` with architecture, scoring design, data flow,
expected decisions table, edge case documentation, automated workflow
description, testing strategy, and full 90-second demo script.

---

## Prompt 010 — Integrate HeroUI via MCP

```markdown
## TASK
Configure and use the HeroUI MCP server for the UI.

## MCP CONFIGURATION
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "heroui-react": {
      "type": "local",
      "command": ["npx", "-y", "@heroui/react-mcp@latest"]
    }
  }
}

## EVALUATION REQUEST
"I want to use this library to apply to the dashboard or the page
that will show the result. What do you think?"

## DECISION
Yes, use HeroUI. It provides Card, Badge, Progress, Button components
with built-in dark mode. The MCP server provides on-demand component
examples for faster development.
```

**Delivered:** `opencode.json` with HeroUI MCP configuration.
HeroUI and framer-motion added to package.json dependencies.

---

## Prompt 011 — Sequential File Execution

```markdown
## INSTRUCTION
"Don't start everything together. Let's start with creating the .md files."
```

**Execution order:**
1. `opencode.json`
2. `build-solve-impact.skill.md`
3. `my-prompt-library.txt`
4. `tech-specs.md`
5. `agent.md`
6. `progress-tracker.md`
7. `plan.md`

Each file was created individually and verified before proceeding.

---

## Prompt 012 — Installation Bottleneck

```markdown
## FEEDBACK
"It's taking so much time."
```

**Context:** npm install was downloading `@heroui/react` and its dependency
tree (react-aria, react-stately, etc.) which took >2 minutes.

---

## Prompt 013 — Dependency Conflict

```markdown
## QUERY
"Why couldn't you use HeroUI React?"
```

**Root cause:** The `react-aria` package (HeroUI v3 dependency) declares
`"import": "./dist/exports/*.mjs"` in its `exports` field but ships `.js`
files (not `.mjs`) in the `dist/exports/` directory. Vite's esbuild
pre-bundler cannot resolve the wildcard pattern to non-existent files.

**Fix applied:** Added Vite `resolve.alias` rules to redirect all
`react-aria/*` and `react-stately/*` imports to the actual `.js` files
on disk. The dev server then launched with zero errors.

---

## Prompt 014 — Pivot to Plain CSS

```markdown
## INSTRUCTION
"Forget it, I don't have time. Go with CSS and do the rest of the phases."
```

**Action taken:**
- Removed `@heroui/react` and `framer-motion` from dependencies
- Built comprehensive dark theme in `styles.css` using CSS custom properties
  (`--bg-base`, `--accent`, `--success`, `--danger`, `--border`, etc.)
- Rewrote all 5 components to use plain CSS class names
- Removed HeroUIProvider from main.jsx
- Updated App.jsx layout to use custom `.layout` / `.layout-body` classes

---

## Prompt 015 — Continue Execution

```markdown
## INSTRUCTION
"Continue."
```

**Action taken:**
- Wrote 11 Vitest unit tests for the triage engine
- All tests passing: priority labels, refund edge case, KB matching,
  confidence thresholds, decision object structure, VIP escalation
- Created HelpModal component with the 90-second demo script
- Wired "Demo script" button into TopBar
- Updated npm scripts to use direct node paths (bypassing missing `.bin`)
- Updated all planning files to reflect plain CSS approach
- Finalized progress-tracker.md (all 15 tasks complete)

---

## Prompt 016 — Compile Session Documentation

```markdown
## TASK
"Write for me all the prompts I used and put them in a .md file.
Make it professional."

## OUTPUT FILE
session-prompt-log.md
```

---

## Prompt 017 — Deploy to Vercel

```markdown
## QUERY
"OK, I want to upload this to Vercel. How do I get the link to it?"
```

**Resolution:** Project builds successfully via `npm run build`.
Two deployment paths provided:
1. **CLI:** `npx vercel --prod` — opens browser for authentication,
   then auto-deploys and returns a `.vercel.app` URL
2. **Web UI:** Drag `dist/` folder to https://vercel.com/new

---

## Prompt 018 — Formatting Revision

```markdown
## FEEDBACK
"The session-prompt-log doesn't look like I wrote the prompts.
Make the user prompts human like I wrote them."

## REVISION REQUEST
"Make the prompts more professional as a prompt engineer."
```

**Action taken:** This file was restructured into professional prompt
engineering documentation — each prompt formatted with clear context,
structured requirements, explicit deliverables, and agent responses.

---

## Appendix: Final Project Structure

```
working-prototype/
├─ opencode.json                   # MCP configuration
├─ build-solve-impact.skill.md     # OpenCode skill file
├─ my-prompt-library.txt           # 7 role-based agent prompts
├─ tech-specs.md                   # Coding standards
├─ agent.md                        # Agent behavior guidelines
├─ progress-tracker.md             # Phase completion checklist
├─ plan.md                         # Full project architecture
├─ session-prompt-log.md           # This document
├─ package.json
├─ vite.config.js
├─ index.html
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   ├─ styles.css
   ├─ data/requests.js
   ├─ engine/knowledgeBase.js
   ├─ engine/triage.js
   ├─ components/TopBar.jsx
   ├─ components/Sidebar.jsx
   ├─ components/DetailPanel.jsx
   ├─ components/AutomationsPanel.jsx
   ├─ components/HelpModal.jsx
   └─ test/triage.test.js
```

## Quick Start

```powershell
npm run dev              # → http://localhost:5173
npm test                 # → 11 tests, all passing
npx vercel --prod        # Deploy to Vercel (requires auth)
```

---

*End of session log — 18 prompts, ~45 minute build time.*
