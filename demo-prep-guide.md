# Build.Solve.Impact. — Demo Prep Guide

> Use this to prepare for the 90-second demo. Covers what you built,
> how you solved key problems, and likely questions.

---

## The One-Line Pitch

> "We built an AI-powered triage dashboard that takes 5 incoming customer requests,
> ranks them by priority, auto-resolves the easy ones, and escalates the hard ones
> to a human — all while explaining every decision."

---

## 90-Second Demo Script

### 0:00 – 0:15 | Set the Scene

> "A business gets 5 requests at once. A VIP whose booking was cancelled.
> An angry customer charged twice. A new customer wants the earliest slot.
> Someone threatening a bad review. And a simple pricing question.
> Resources: 2 staff, 3 slots, a $200 refund limit."

**On screen:** The full dashboard with all 5 requests in the sidebar.
Point to the TopBar showing staff=2, slots=3.

### 0:15 – 0:40 | Walk the Sidebar

> "The sidebar shows every request with a priority badge — red for urgent,
> yellow for medium, green for low. The VIP and the angry customer are
> at the top. The pricing question is at the bottom. Each card has a
> confidence bar showing how sure the AI is about what to do."

**On screen:** Mouse over the different sidebar items.
Show the VIP badge, the urgency colors, the confidence bars (visible after triage).

### 0:40 – 1:00 | Run AI Triage

> "Hit 'Run AI Triage'. The engine scores every request on urgency,
> customer value, risk, and policy fit. Two requests get auto-resolved:
> the pricing question is answered from the knowledge base, and the
> new customer gets the earliest slot booked automatically. No human
> needed. Staff and slot counters update live."

**On screen:** Click "Run AI Triage". Point to the Auto-resolved badges.
Point to the trace log on the right showing each step.

### 1:00 – 1:20 | Show the Edge Case

> "Now look at Omar — charged twice, wants a $450 refund. The AI detects
> this exceeds the $200 approval limit. Confidence drops to zero. The
> Send button is disabled. The system escalates to a manager with full
> context. This is the edge case: the AI refuses to act when policy
> says it can't."

**On screen:** Click Omar's request in the sidebar. Point to:
- Confidence gauge showing 0%
- "Blocked by policy" label
- "Awaiting manager approval" badge
- Disabled Send button
- "Why This Decision" panel showing the policy reason

### 1:20 – 1:30 | What's Next

> "What I'd build next: a real manager approval queue with push
> notifications. The engine already drafts the response — just needs
> a one-click sign-off flow."

---

## What You Built — Explained

### The 5 Requests (data/requests.js)

| ID | Customer | Type | Urgency | VIP? | Refund? |
|----|----------|------|---------|------|---------|
| req-1 | Aisha Al-Mansoori | Rebook (cancelled) | high | Yes | No |
| req-2 | Sara | New booking | medium | No | No |
| req-3 | Omar | Refund ($450) | high | No | Yes, > $200 |
| req-4 | Layla | Pricing question | low | No | No |
| req-5 | Khalid | Complaint (bad review) | high | No | No |

### The Triage Engine (engine/triage.js)

Each request is scored on 5 dimensions (total out of 100):

| Dimension | Weight | What it measures |
|-----------|--------|-----------------|
| Urgency | 0-30 | How time-sensitive is this? |
| Customer Value | 0-20 | Is this a VIP? New customer? |
| Resolution Risk | 0-20 | Could auto-resolving cause problems? |
| SLA Breach Risk | 0-15 | Will we lose reputation if we delay? |
| Policy Fit | 0-15 | Does the KB match? Are slots/limits OK? |

After scoring, the engine computes **confidence** — how sure the AI is
that the recommended action is correct. Confidence comes from:
- Whether a KB entry matches the issue
- Whether the request type is low-risk
- Whether any policy limits are exceeded

### The 5 Decisions (what the engine outputs)

| Request | Priority | Score | Confidence | Action | Owner |
|---------|----------|-------|------------|--------|-------|
| Aisha (VIP rebook) | high | 85 | 78% | Assign + rebook attempt | Staff A |
| Sara (new booking) | medium | 62 | 93% | Auto-assign + auto-respond | AI → Staff B |
| Omar (refund $450) | high | 82 | **0% (blocked)** | Escalate to manager | Manager |
| Layla (pricing Q) | low | 38 | **96%** | Auto-respond from KB | AI |
| Khalid (bad review) | high | 78 | 71% | Draft + escalate | Staff A |

### The Automated Workflow

When you click "Run AI Triage":
1. The engine processes all 5 requests
2. Requests with confidence > 85% AND autoResolvable = true are handled automatically
   - Layla's pricing Q → KB answer drafted, no staff needed
   - Sara's booking → slot reserved, staff assigned, confirmation sent
3. Staff and slot counters decrement in the TopBar
4. Each step is logged in the AutomationsPanel as a trace entry

### The Edge Case (Omar's refund)

- Refund $450 > $200 limit → `needsManager = true`
- `confidence.autoResolve = 0.00` — **AI refuses to act**
- Send button disabled with tooltip "Awaiting manager approval"
- Reasoning panel shows the policy violation
- Trace log entry: "Escalated to Manager"

---

## How I Solved the HeroUI Problem

**What happened:** I chose HeroUI for the polished dashboard. It installed
but the dev server threw 400+ errors.

**Root cause:** HeroUI v3 depends on `react-aria`, which uses a feature
called "wildcard exports" in its package.json:
```
"./*": { "import": "./dist/exports/*.mjs" }
```
This tells bundlers: "when someone imports `react-aria/useButton`,
resolve it to `dist/exports/useButton.mjs`." But the package ships
`.js` files (not `.mjs`), so Vite's esbuild couldn't find them.

**What I tried first:** Added Vite resolve aliases to map the imports
to the actual `.js` files. It worked — the server started with zero errors.

**What I did instead:** Dropped HeroUI entirely and built a custom dark
theme with plain CSS variables. This was faster, removed the dependency
overhead, and made the prototype self-contained with zero external UI
dependencies.

**Why this was the right call:** The 45-minute timer was running. Debugging
a package resolution issue is a time sink. Plain CSS gave full control
and eliminated the risk of more dependency issues during deployment.

---

## Likely Questions & Answers

### Q: Why did you use a rules engine instead of a real LLM?

> "For this challenge, transparency and speed mattered more than generative
> capability. A deterministic engine lets me explain exactly why each decision
> was made — the evidence tags, the confidence score, the policy check.
> With an LLM, the reasoning is opaque. That said, the next iteration would
> use an LLM for drafting responses while keeping the rules engine for
> priority and policy enforcement."

### Q: What's the confidence score actually measuring?

> "Confidence is 'how sure the AI is that the recommended action is correct.'
> It's a combination of evidence clarity, KB match strength, constraint
> clearance, and risk of being wrong. A pricing question with a direct KB
> match gets 96%. A refund over the limit gets 0% on auto-resolve — the
> AI is certain it should NOT act."

### Q: What happens if all 3 slots are taken?

> "The engine checks slot availability. If no slots remain, the new customer
> booking and VIP rebook would both escalate rather than auto-resolve.
> The trace log would show 'No available slots — escalating.'"

### Q: Can this handle more than 5 requests?

> "Yes. The engine processes an array — it scales to any number. The
> scoring dimensions are generic. You'd just need to add the requests
> to `requests.js` and the KB entries to `knowledgeBase.js`."

### Q: Why plain CSS instead of Tailwind or a component library?

> "HeroUI had a package resolution issue on this environment. I pivoted
> to plain CSS with custom properties — it's zero-dependency, fully
> controllable, and the dark theme is defined in one file. For a 45-minute
> prototype, reliability matters more than having 100 pre-built components."

### Q: What would you add with more time?

> "Three things: (1) A real-time manager approval queue with notifications.
> (2) An LLM integration for drafting responses — the engine already decides
> what to do, the LLM would write how to say it. (3) Historical analytics —
> how many requests were auto-resolved vs escalated this week."

### Q: How did you handle the 45-minute time constraint?

> "By being ruthless about scope. The rules engine and the decision screen
> were non-negotiable. The automated workflow and edge case were required.
> Everything else — component library, animations, responsive breakpoints —
> was optional. I also kept all the planning files (skill, prompts, specs)
> concise so I could spend time on the actual prototype."

### Q: How is this different from a simple if/else ladder?

> "It IS a rules engine under the hood, but the architecture is designed
> for extensibility. The scoring function is modular — add a new dimension
> and the priorities shift automatically. The confidence calculation is
> evidence-based, not hardcoded. And the workflow system is decoupled
> from the engine, so you can swap in ML models later without rewriting
> the decision logic."

---

## Key Terms to Use in the Demo

| Term | When to use it |
|------|----------------|
| **Triage engine** | The core decision-making system |
| **Confidence scoring** | How sure the AI is (separate from priority) |
| **Evidence-based reasoning** | Why the AI made each decision (the tags in the panel) |
| **Auto-resolve** | Requests handled without human intervention |
| **Policy enforcement** | The AI knowing when NOT to act (the edge case) |
| **Trace log** | The step-by-step audit trail in the right panel |
| **Knowledge base (KB)** | Pre-written answers for common questions |
| **Phase-gate verification** | The process of checking each task before moving on |

---

## Quick Reference — What to Point At

During the demo, navigate to these elements in order:

1. **TopBar** — "Staff 2/2, Slots 3/3, Refund limit $200"
2. **Sidebar** — "5 requests, each with priority badge"
3. **"Run AI Triage" button** — "This triggers the engine"
4. **Auto-resolved badges** — Layla and Sara turn green
5. **Trace log** — Shows each decision step
6. **Omar's card** — "Click to see the edge case"
7. **Confidence gauge** — "0% — blocked by policy"
8. **Disabled Send button** — "AI won't act"
9. **"Why This Decision" panel** — "Full reasoning"

---

## File Locations Reference

| What they might ask about | Where it lives |
|---------------------------|----------------|
| The 5 requests | `src/data/requests.js` |
| The knowledge base | `src/engine/knowledgeBase.js` |
| The scoring/decision logic | `src/engine/triage.js` |
| The workflow automation | `src/App.jsx` (handleRunTriage) |
| The CSS theme | `src/styles.css` |
| The tests | `src/test/triage.test.js` |
| The planning files | Root directory (.skill.md, .txt, etc.) |
