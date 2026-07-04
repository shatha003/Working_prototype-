# Build.Solve.Impact. — Project Plan

> A working prototype that helps a busy business triage 5 incoming requests
> with limited staff and resources.

---

## The Challenge

**Scenario:** A business with 5 incoming requests, 2 staff, 3 appointment slots
left today, and a $200 refund limit requiring manager approval.

**The 5 Requests:**
| # | Customer | Type | Detail |
|---|----------|------|--------|
| 1 | Aisha Al-Mansoori (VIP) | Booking cancelled | 2pm slot cancelled by system |
| 2 | Sara (new customer) | Book earliest slot | First-time caller |
| 3 | Omar (angry customer) | Refund $450 | Charged twice, wants refund |
| 4 | Layla | Pricing question | "How much is a basic cut?" |
| 5 | Khalid (urgent) | Bad review threat | Vague issue, threatens bad review |

**Constraints:** 2 staff, 3 slots, $200 refund limit, VIP list, KB available.

---

## Architecture

### Stack
- **Frontend:** React 19 + Vite 6 + JavaScript
- **UI Library:** HeroUI (@heroui/react) with built-in dark mode
- **Testing:** Vitest + jsdom
- **State:** React useState/useCallback (no external state library)
- **AI Logic:** Deterministic rules engine with confidence scoring

### Folder Structure
```
working-prototype/
├─ opencode.json                # HeroUI MCP config
├─ build-solve-impact.skill.md  # OpenCode skill file
├─ my-prompt-library.txt        # Role-based agent prompts
├─ tech-specs.md                # Coding standards
├─ agent.md                     # Agent behavior instructions
├─ progress-tracker.md          # Checklist tracker
├─ plan.md                      # This file
├─ index.html
├─ package.json
├─ vite.config.js
└─ src/
   ├─ main.jsx                  # Entry point + HeroUIProvider
   ├─ App.jsx                   # Root component, state, layout
   ├─ styles.css                # Global overrides
   ├─ data/
   │  └─ requests.js            # 5 mock requests
   ├─ engine/
   │  ├─ knowledgeBase.js       # KB entries
   │  ├─ triage.js              # Priority scoring + confidence + decisions
   │  └─ workflow.js            # Automation workflow logic
   └─ components/
      ├─ TopBar.jsx             # Staff/slots/limit counters
      ├─ Sidebar.jsx            # Request list with badges
      ├─ DetailPanel.jsx        # Decision detail view
      ├─ ConfidenceGauge.jsx    # Reusable confidence indicator
      └─ AutomationsPanel.jsx   # Workflow trace log
```

---

## Data Flow
```
requests.js ──> triage.js ──> decisions[] ──> App.jsx state
                    │                              │
                    │                              ├── TopBar (counters)
                    │                              ├── Sidebar (list)
                    │                              ├── DetailPanel (selected)
                    │                              └── AutomationsPanel (trace)
                    │
               workflow.js  (on "Run AI Triage" click)
                    │
                    ├── auto-resolve → decrement counters → update status
                    ├── escalate     → block Send button → show reason
                    └── log          → push to traceLog[]
```

---

## Decision Engine Design

### Scoring Dimensions (0-100 total)
| Dimension | Weight | Applies To |
|-----------|--------|------------|
| Urgency | 0-30 | Bad review threat, VIP churn, angry = high |
| Customer Value | 0-20 | VIP boost, new customer modest, existing low |
| Resolution Risk | 0-20 | Low risk = higher; refund ambiguous = lower |
| SLA Breach Risk | 0-15 | Reputation threat, time-sensitive |
| Policy Fit | 0-15 | KB match, slots available, refund within limit |

### Expected Decisions
| # | Priority | Score | Conf (auto) | Action | Owner |
|---|----------|-------|-------------|--------|-------|
| 1 | high | 85 | 0.78 | escalate + rebook attempt | Staff A |
| 2 | medium | 62 | 0.93 | auto-assign + auto-respond | AI → Staff B |
| 3 | high | 82 | 0.00 (blocked) / 0.97 (escalate) | escalate to manager | Manager |
| 4 | low | 38 | 0.96 | auto-respond from KB | AI |
| 5 | high | 78 | 0.71 | draft + escalate for review | Staff A |

---

## Edge Case: Refund > Manager Limit

- **Trigger:** Omar's refund ($450) exceeds the $200 limit
- **AI Behavior:** `needsManager = true`, `confidence.autoResolve = 0.00`
- **UI Behavior:** Send button disabled, reason panel shows policy block,
  status = "Escalated to Manager"
- **Rationale:** This demonstrates the AI knows when NOT to act — a critical
  safety feature in agentic systems.

---

## Automated Workflow

When "Run AI Triage" is clicked:
1. Engine runs `triageAll()` producing 5 decisions
2. Workflow processes each:
   - **requests with autoResolvable && confidence > 0.85:**
     - Assign free staff (decrement staff count)
     - If booking request, reserve slot (decrement slot count)
     - Generate response from KB or template
     - Mark status "Auto-resolved"
     - Log: "KB match → Confidence 0.96 → Drafted → Auto-resolved"
   - **requests with needsManager:**
     - Mark "Escalated to Manager"
     - Log: "Refund $450 > limit $200 → Cannot auto-resolve → Escalated"
   - **remaining requests:**
     - Mark "Pending human review"
     - Assign to remaining staff
     - Log: "Assigned to Staff A → Draft ready → Pending review"
3. State updates propagate to all components

---

## Testing Strategy

### Unit Tests (engine/triage.js)
```
✓ All 5 requests return correct priority labels
✓ Refund > limit → needsManager=true, confidence.autoResolve=0.00
✓ KB pricing match → autoResolvable=true, confidence > 0.9
✓ VIP rebook → high priority, partial auto-resolve
✓ Bad review threat → confidence < 0.75
✓ Missing fields → needsManager=true
```

### Component Smoke Tests
```
✓ Sidebar renders 5 items
✓ DetailPanel shows correct data per selection
✓ TopBar shows initial counts (2 staff, 3 slots, $200)
✓ "Run AI Triage" triggers state changes
```

---

## 90-Second Demo Script

```
(0:00-0:15) "Every business gets overwhelmed. 5 requests came in — a VIP
            booking cancelled, an angry customer charged twice, a new customer
            wanting the earliest slot, a bad review threat, and a simple
            pricing question. Only 2 staff and 3 slots left today."

(0:15-0:40) "The sidebar shows priority at a glance. The VIP and the angry
            customer are at the top — high urgency. The pricing question is
            low. Each card has a confidence bar: green means the AI is sure
            what to do, red means it needs a human."

(0:40-1:00) "Watch what happens when I hit 'Run AI Triage'. The pricing
            question is auto-answered from the knowledge base. The new
            customer gets the earliest slot auto-booked. Staff freed,
            slots filled. No human needed."

(1:00-1:20) "Now look at Omar — charged twice, wants a $450 refund. The AI
            detected this exceeds the $200 approval limit. Confidence drops
            to zero. Send is disabled — the AI refuses to act. It escalates
            to a manager with full context attached."

(1:20-1:30) "What I'd build next: a real-time manager approval queue.
            Push notifications, approve with one click. The engine already
            sends the draft — just needs the sign-off flow."
```

---

## Next Steps After Demo

1. Replace deterministic engine with real LLM calls for response drafting
2. Add a persistent manager approval queue (dashboard + notifications)
3. Connect to live CRM/ticketing via webhooks
4. Add historical analytics — how many auto-resolved vs escalated this week?
