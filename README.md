# Build.Solve.Impact. — AI Request Triage Dashboard

A working prototype that helps a busy business triage 5 incoming customer requests with only 2 staff members and 3 appointment slots available. Built in 45 minutes for a coding challenge.

**Live demo:** [vercel-url] (deploy with `npx vercel --prod`)

---

## Table of Contents

- [The Problem](#the-problem)
- [How It Works](#how-it-works)
- [The 5 Requests](#the-5-requests)
- [The Rules Engine](#the-rules-engine)
- [Features](#features)
- [Stack](#stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Edge Case: Manager Approval Queue](#edge-case-manager-approval-queue)
- [Planned Improvements](#planned-improvements)

---

## The Problem

A business receives 5 requests simultaneously:

| # | Customer | Issue | Urgency | VIP? |
|---|----------|-------|---------|------|
| 1 | Aisha Al-Mansoori | 2pm booking cancelled by system | High | Yes |
| 2 | Sara | Book earliest slot today | Medium | No |
| 3 | Omar | Charged twice, wants $450 refund | High | No |
| 4 | Layla | "How much is a basic cut?" | Low | No |
| 5 | Khalid | Vague urgent issue, threatens bad review | High | No |

**Constraints:** 2 staff, 3 appointment slots, \$200 refund limit requiring manager approval.

---

## How It Works

A deterministic rules engine scores each request on 5 dimensions, computes a confidence score for the recommended action, auto-resolves low-risk requests, and escalates policy-violating cases to a human manager.

**Data flow:**
```
requests.js → triage.js (engine) → decisions[] → React state → UI panels
```

**UI layout:**
- **Left sidebar** — 5 request cards with priority badges, status chips, confidence bars
- **Center panel** — Selected request detail: confidence gauge, action, owner, response, reasoning
- **Right panel** — "Run AI Triage" / "Simulate Live" buttons + workflow trace log
- **Top bar** — Live counters: staff available, slots remaining, refund limit

---

## The 5 Requests

Each request has: id, customer name, type, VIP status, issue description, refund amount, and urgency level.

| ID | Customer | Type | VIP? | Refund? | Urgency |
|----|----------|------|------|---------|---------|
| req-1 | Aisha Al-Mansoori | Rebook | Yes | No | High |
| req-2 | Sara | Booking | No | No | Medium |
| req-3 | Omar | Refund | No | \$450 | High |
| req-4 | Layla | Info | No | No | Low |
| req-5 | Khalid | Complaint | No | No | High |

---

## The Rules Engine

Located in `src/engine/triage.js`. Three pure functions with no side effects.

### Scoring (`scoreRequest`)

Five dimensions, max 100 points:

| Dimension | Weight | What it measures |
|-----------|--------|-----------------|
| Urgency | 0–30 | How time-sensitive is this request? |
| Customer Value | 0–20 | VIP boost, new customer acquisition |
| Resolution Risk | 0–20 | Low-risk requests score higher |
| SLA Breach Risk | 0–15 | Reputation threats, deadlines |
| Policy Fit | 0–15 | KB match, slot availability, limit check |

### Confidence (`computeConfidence`)

"How sure are we that our recommended action is correct?" Uses evidence-based signals:

| Signal | Weight |
|--------|--------|
| KB keyword match | +0.40 |
| Low urgency | +0.15 |
| Clear booking intent | +0.20 |
| Refund under approval limit | +0.25 |
| **Refund over limit** | **0.00 for auto-resolve (policy block)** |

Confidence is returned as an object `{ autoResolve, escalateToManager }` to support different action paths.

### Decision (`decideAction`)

```
confidence > 85% + autoResolvable → auto-resolve
refund > $200 limit               → escalate to manager (confidence drops to 0.00)
otherwise                         → assign to available staff
```

### Computed Decisions

| Request | Priority | Score | Confidence | Action | Owner |
|---------|----------|-------|------------|--------|-------|
| Aisha (VIP rebook) | High | 85 | 78% | Assign + rebook attempt | Staff A |
| Sara (new booking) | Medium | 62 | 93% | Auto-assign + auto-respond | AI → Staff B |
| Omar (refund \$450) | High | 82 | **0% (blocked)** | Escalate to Manager | Manager |
| Layla (pricing Q) | Low | 38 | **96%** | Auto-respond from KB | AI |
| Khalid (bad review) | High | 78 | 71% | Draft + escalate for review | Staff A |

---

## Features

### Automated Workflow

Click "Run AI Triage" — the engine processes all 5 requests at once. Two are auto-resolved:

- **Layla's pricing question** → knowledge base match found, answer drafted and sent automatically. No staff needed.
- **Sara's booking** → earliest slot reserved, staff member assigned, confirmation drafted.

Staff and slot counters decrement in real-time. Every step is logged in the trace log on the right panel.

### Real-Time Simulation

Click "Simulate Live" instead of batch triage:

1. Sidebar starts empty
2. Requests stream in **one at a time** with slide-in animations
3. Each request is triaged **immediately** upon arrival
4. Trace log entries pop with staggered fade-in animations
5. Staff and slot counters update live

This makes the demo dramatically more engaging — the committee watches the AI work in real-time.

### Decision Transparency

Every request detail page shows:

- **Confidence gauge** — circular SVG with color-coded arc and glow effect
- **Recommended action** — auto-respond, assign, escalate, or draft+escalate
- **Owner** — AI, specific staff member, or manager
- **Suggested response** — editable textarea (disabled while awaiting manager approval)
- **"Why This Decision"** — collapsible reasoning panel with evidence tags

### Knowledge Base

Simple keyword-based matching in `src/engine/knowledgeBase.js`. Three entries:

| Entry | Keywords | Answer |
|-------|----------|--------|
| Pricing | basic cut, haircut, price, cost | "A basic cut is \$40..." |
| Booking | booking, appointment, slot, schedule | "Earliest available slot today is at 3:00 PM..." |
| VIP | vip, priority, premium, special | "VIP customers get priority rebooking..." |

---

## Edge Case: Manager Approval Queue

**The most important feature** — demonstrates the AI refusing to act.

When Omar's \$450 refund is triaged:

1. Engine detects: `refundAmount (450) > REFUND_LIMIT (200)`
2. `computeConfidence` returns `{ autoResolve: 0.00, escalateToManager: 0.97 }`
3. Send button is disabled with **"Awaiting manager approval"**
4. A gold-bordered **"Manager Approval Required"** card appears with:
   - Lock icon + explanation of the policy violation
   - **Approve & Send** button (green gradient)
   - **Reject** button (red outline)
5. On **Approve**: response sends, owner changes to "Manager (approved)", trace logs the approval
6. On **Reject**: marked for manual rewrite, owner changes to "Manager (rejected)"

This completes the agentic loop: **AI triages → AI escalates when needed → Human decides → System executes**.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build tool | Vite 6 |
| Language | JavaScript |
| Styling | Custom CSS with dark theme (CSS variables) |
| Testing | Vitest + jsdom |
| State management | React useState / useCallback |
| Routing | None (single-page dashboard) |

Zero backend dependencies. No database. No API calls.

---

## Project Structure

```
prototype/
├─ opencode.json                   # MCP configuration
├─ build-solve-impact.skill.md     # OpenCode skill file
├─ my-prompt-library.txt           # 7 role-based agent prompts
├─ tech-specs.md                   # Coding standards & UI rules
├─ agent.md                        # Agent behavior instructions
├─ progress-tracker.md             # Build phase checklist
├─ plan.md                         # Full architecture plan
├─ session-prompt-log.md           # Session transcript
├─ demo-prep-guide.md              # 90-second demo script
├─ technical-qa.md                 # 20 technical Q&A
├─ committee-walkthrough.md        # Committee presentation guide
├─ package.json
├─ vite.config.js
├─ index.html
└─ src/
   ├─ main.jsx                     # Entry point
   ├─ App.jsx                      # Root component + state
   ├─ styles.css                   # All styles (dark theme)
   ├─ data/
   │  └─ requests.js               # 5 mock requests
   ├─ engine/
   │  ├─ triage.js                 # Rules engine
   │  └─ knowledgeBase.js          # KB entries
   ├─ components/
   │  ├─ TopBar.jsx                # Staff/slots/limit counters
   │  ├─ Sidebar.jsx               # Request list with badges
   │  ├─ DetailPanel.jsx           # Decision detail + approval
   │  ├─ AutomationsPanel.jsx      # Triage buttons + trace log
   │  └─ HelpModal.jsx             # Demo script overlay
   └─ test/
      └─ triage.test.js            # 11 unit tests
```

---

## Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd prototype

# Install dependencies
npm install

# Start the development server
npm run dev        # → http://localhost:5173

# Run tests
npm test           # → 11 tests, all passing

# Build for production
npm run build      # → outputs to dist/

# Deploy to Vercel
npx vercel --prod  # Requires browser authentication
```

---

## Testing

11 unit tests written with Vitest, covering:

- All 5 requests return correct priority labels (high/medium/low)
- Refund edge case: `needsManager=true`, `confidence.autoResolve=0.00`
- KB-matched pricing question: `autoResolvable=true`, confidence > 0.9
- Ambiguous complaint: confidence < 0.75, `recommendedAction='draft+escalate'`
- Every decision object contains: id, priority, confidence, recommendedAction, owner, suggestedResponse, reason, evidence
- `triageAll` returns exactly as many decisions as requests

```bash
npm test
```

---

## Planned Improvements

1. **Real LLM integration** — Replace template-based responses with dynamically generated replies from an LLM API
2. **Persistent approval queue** — Backend storage for multi-session management with push notifications
3. **Historical analytics** — Auto-resolve vs. escalation rates, average response times, staff workload
4. **Live CRM integration** — Webhook connections to real ticketing systems
5. **User authentication** — Role-based access for staff, managers, and admins

---

## Build Notes

**Built in 45 minutes for a "Build. Solve. Impact." coding challenge.**

Key technical decisions:

| Decision | Rationale |
|----------|-----------|
| Rules engine over ML | Transparency, determinism, zero API latency |
| Plain CSS over component library | Dependency resolution bug in react-aria; needed reliable path |
| No backend | Eliminated deployment risk for the demo |
| Direct node paths in scripts | Windows + OneDrive prevented .bin symlink creation |

**Judging criteria:** Smart decisions · Clear thinking · Agentic workflows · Great UX · Speed · Creativity · Execution · Communication

---

## License

MIT
