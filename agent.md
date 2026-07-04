# AGENT.md — Build.Solve.Impact. Agent Instructions

This file defines how the AI agent should behave during the entire
build process. The agent MUST follow these instructions for every task.

---

## Core Behavior

### 1. Post-Task Improvement Suggestions
After completing ANY task (file creation, code implementation, test, etc.),
the agent MUST:
a) Briefly state what was just completed
b) Suggest 1-3 specific improvements if applicable (e.g., "Could extract X
   into its own file for SRP", "This function could be optimized by caching Y")
c) If no improvement is needed, state: "No improvements needed."

### 2. Phase-Gate Verification
Before marking a task as complete and moving to the next, the agent MUST:
a) Verify the task works as intended
   - For code: check syntax, run `npm run lint` or `npx vitest run` if applicable
   - For files: verify the file exists, content is complete, format is correct
   - For UI: verify the component renders without errors
b) Update the progress-tracker.md file (check off the completed task)
c) Only then proceed to the next task

### 3. If a Task Fails Verification
- Do NOT proceed to the next task
- State what failed and why
- Fix the issue immediately
- Re-verify after the fix
- Then update progress-tracker.md

---

## Phase Definitions & Gates

### Phase 1: Planning Files
Files: opencode.json, skill.md, my-prompt-library.txt, tech-specs.md,
       agent.md, progress-tracker.md, plan.md

Gate check: All 7 files exist in the working directory. Each file is
non-empty. opencode.json is valid JSON. Markdown files have correct headers.

### Phase 2: Project Scaffolding
Tasks: npm create vite, install deps (HeroUI, tailwindcss, vitest, jsdom),
       configure vite.config.js, set up HeroUIProvider in main.jsx,
       create folder structure (data/, engine/, components/)

Gate check: `npm run dev` starts without errors. Browser shows a blank
page with dark background. No console errors.

### Phase 3: Data Layer
Tasks: Create requests.js (5 requests), knowledgeBase.js (KB entries)

Gate check: Both files exist with correct structure. Each request has
all required fields (id, customer, type, issue, isVIP, refundAmount,
urgency). KB has at least 3 entries.

### Phase 4: Triage Engine
Tasks: Implement triage.js with scoring, confidence, decision logic,
       enforce refund-limit edge case, export triageAll() and triageOne()

Gate check: triageAll(requests) returns 5 valid decision objects. Each
has: id, priority, priorityScore, confidence (object with autoResolve
and/or escalateToManager), recommendedAction, owner, autoResolvable,
needsManager, suggestedResponse, reason, evidence. The refund edge case
(req-3) has needsManager=true, confidence.autoResolve=0.00.

### Phase 5: Dashboard UI Components
Tasks: Build TopBar, Sidebar, DetailPanel, AutomationsPanel using HeroUI

Gate check: Each component renders without errors. Sidebar shows 5 items.
DetailPanel updates when clicking different sidebar items. TopBar shows
correct counts.

### Phase 6: Workflow Automation
Tasks: Wire "Run AI Triage" button, implement runWorkflow() in
       engine/workflow.js, connect trace log to AutomationsPanel

Gate check: Clicking "Run AI Triage" runs the engine, updates all
decision cards, decrements staff/slot counters for auto-resolved items,
shows trace log entries. Omar's request shows escalated with disabled
Send button.

### Phase 7: Testing
Tasks: Write Vitest unit tests for triage engine (all 5 requests),
       edge case tests (refund > limit, no slots + VIP, ambiguous urgency),
       component smoke tests

Gate check: `npx vitest run` passes all tests with 0 failures.

### Phase 8: Polish & Demo Prep
Tasks: Add help modal with demo script, final review, verify no console
       errors, ensure all 5 requests display correctly

Gate check: `npm run dev` runs clean. No console errors in browser.
All UI elements readable. Demo script covers all required points.

---

## Verification Commands Reference

```bash
# Check file exists
Test-Path "path/to/file"

# Check syntax (JS files)
node -e "require('path/to/file')"  # or for ESM: node --input-type=module -e ...

# Run tests
npx vitest run

# Start dev server
npm run dev

# Check for lint issues
npx eslint src/  # if configured
```
