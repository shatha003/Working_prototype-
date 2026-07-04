---
name: build-solve-impact-triage
description: AI-powered request triage prototype for the Build.Solve.Impact. challenge — prioritizes incoming business requests, computes confidence scores, auto-resolves low-risk items, and escalates edge cases to human managers
triggers:
  - triage incoming business requests
  - prioritize customer requests with AI
  - build decision dashboard for customer support
  - run build solve impact prototype
  - auto-resolve customer support tickets
  - escalate edge cases to manager
  - build.solve.impact challenge
  - triage 5 incoming requests
  - demo build solve impact prototype
---

# Build.Solve.Impact. Request Triage Skill

> Skill for the Build.Solve.Impact. coding challenge — Smart decisions · Clear thinking · Agentic workflows · Great UX.

Build.Solve.Impact. is a React + Vite + JS prototype that helps a busy business triage **5 incoming customer requests** with only **2 staff members** and **3 appointment slots** available. It uses a deterministic rules engine with confidence scoring to decide priority, recommended action, owner assignment, and escalation paths.

## Installation

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- OpenCode CLI (for MCP integration)

### Basic Installation

```bash
# Clone or navigate to the project directory
cd working-prototype

# Install dependencies
npm install

# Start the development server
npm run dev
```

### HeroUI MCP Setup (for component development)

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "heroui-react": {
      "type": "local",
      "command": ["npx", "-y", "@heroui/react-mcp@latest"],
      "enabled": true
    }
  }
}
```

## Core Functionality

The prototype provides automated request triage including:

- **Priority Scoring**: Multi-factor urgency + customer value + risk analysis
- **AI Confidence Calculation**: Evidence-based certainty for each recommended action
- **Auto-Resolution**: Automatic assign-and-respond for low-risk requests
- **Manager Escalation**: Policy-driven escalation when constraints are exceeded
- **Workflow Automation**: Live trace log showing each decision step
- **Decision Dashboard**: Polished UI showing priority, confidence, action, owner, response, and reasoning

## Basic Usage

### Initializing the Triage Engine

```javascript
import { triageAll } from './engine/triage.js';
import { requests } from './data/requests.js';

// Run the triage engine on all 5 requests
const decisions = triageAll(requests);

// decisions is an array of:
// { id, priority, priorityScore, confidence, recommendedAction, owner, autoResolvable, needsManager, suggestedResponse, reason, evidence }
```

### Running the Interactive Dashboard

```bash
npm run dev
# Opens at http://localhost:5173
```

Click **"Run AI Triage"** to execute the engine across all requests and watch the automation workflow.

## Configuration

### Triage Engine Configuration

```javascript
// engine/triage.js configuration block
const CONFIG = {
  STAFF_AVAILABLE: 2,
  SLOTS_AVAILABLE: 3,
  REFUND_LIMIT: 200,
  CONFIDENCE_AUTO_RESOLVE_THRESHOLD: 0.85,
  VIP_BOOST: 20,
  REPUTATION_THREAT_BOOST: 15,
};
```

### Request Data Structure

```javascript
// data/requests.js
const request = {
  id: 'req-1',
  type: 'booking',
  customer: 'Aisha Al-Mansoori',
  isVIP: true,
  issue: '2pm booking cancelled by system',
  refundAmount: null,
  urgency: 'high',
  // ...
};
```

## Advanced Usage Patterns

### Custom Triage with Business Rules Override

```javascript
import { createTriageEngine } from './engine/triage.js';

const customEngine = createTriageEngine({
  staffAvailable: 3,          // Override: we have 3 staff today
  slotsAvailable: 5,          // Override: 5 slots available
  refundLimit: 500,           // Higher approval limit
  confidenceThreshold: 0.90,  // Require higher confidence for auto-resolve
});

const decisions = customEngine.triageAll(requests);
```

### Extracting Escalated Requests for Manager Review

```javascript
import { triageAll } from './engine/triage.js';
import { requests } from './data/requests.js';

const decisions = triageAll(requests);

const managerQueue = decisions.filter(d => d.needsManager);
const autoResolved = decisions.filter(d => d.autoResolvable);

console.log(`${autoResolved.length} requests auto-resolved`);
console.log(`${managerQueue.length} requests need manager review`);

managerQueue.forEach(d => {
  console.log(`[ESCALATED] ${d.customer}: ${d.reason}`);
});
```

### Running a Dry Run (Simulation Mode)

```javascript
import { simulateTriage } from './engine/triage.js';

// Simulate with different resource levels to find bottlenecks
const scenarios = [
  { staff: 1, slots: 2 },
  { staff: 2, slots: 3 },
  { staff: 3, slots: 5 },
];

scenarios.forEach(s => {
  const results = simulateTriage(requests, s);
  const autoCount = results.filter(r => r.autoResolvable).length;
  console.log(`Staff=${s.staff}, Slots=${s.slots}: ${autoCount} auto-resolved`);
});
```

## Decision Output Format

```javascript
{
  id: 'req-3',
  customer: 'Omar',
  priority: 'high',
  priorityScore: 82,
  confidence: {
    autoResolve: 0.00,     // Blocked by policy
    escalateToManager: 0.97
  },
  recommendedAction: 'escalate',
  owner: 'Manager (pending approval)',
  autoResolvable: false,
  needsManager: true,
  suggestedResponse: 'Dear Omar, I understand you were charged twice... A manager will review this within 2 hours.',
  reason: 'Refund $450 exceeds approval limit $200. AI policy: do not auto-resolve refunds above limit. Routed to manager.',
  evidence: ['refund_amount: 450', 'limit: 200', 'exceeds_by: 250', 'customer: angry']
}
```

## Environment Variables

```bash
# Set development port
VITE_PORT=3000

# Triage configuration overrides
VITE_STAFF_COUNT=2
VITE_SLOTS_AVAILABLE=3
VITE_REFUND_LIMIT=200
```

## Common Patterns

### Integrating with External Ticket Systems

```javascript
import { triageAll } from './engine/triage.js';

async function triageFromCRM(tickets) {
  const mapped = tickets.map(t => ({
    id: t.ticketId,
    type: t.category,
    customer: t.contactName,
    isVIP: t.tags.includes('vip'),
    issue: t.subject,
    refundAmount: t.customFields?.refundAmount || 0,
    urgency: t.priority,
  }));

  return triageAll(mapped);
}
```

### Batch Processing with Error Handling

```javascript
import { triageAll } from './engine/triage.js';

try {
  const decisions = triageAll(requests);
  decisions.forEach(d => {
    if (d.autoResolvable) {
      console.log(`✅ AUTO: ${d.customer} → ${d.owner}`);
    } else if (d.needsManager) {
      console.log(`🔼 ESCALATE: ${d.customer} → ${d.owner}`);
    } else {
      console.log(`⏳ PENDING: ${d.customer} → ${d.owner}`);
    }
  });
} catch (err) {
  console.error('Triage engine failed:', err);
}
```

## Troubleshooting

### "Confidence shows 0 for auto-resolve"

The engine is working correctly — it detected a policy constraint. Check the `reason` field:

```javascript
const decision = triageAll(requests).find(r => r.id === 'req-3');
console.log(decision.reason);
// Expected: "Refund $450 exceeds approval limit $200..."
```

### "Auto-resolve threshold not triggering"

Check the threshold configuration:

```javascript
// Increase to 0.85 to be more aggressive
const CONFIG = { CONFIDENCE_AUTO_RESOLVE_THRESHOLD: 0.85 };
```

### "Components not rendering with HeroUI"

Ensure HeroUIProvider wraps the app:

```jsx
// main.jsx
import { HeroUIProvider } from '@heroui/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <HeroUIProvider>
    <App />
  </HeroUIProvider>
);
```

## Best Practices

1. **Always review escalated items** — the engine is deterministic, not perfect
2. **Test with different resource levels** — staff and slots directly affect auto-resolve rates
3. **Keep the edge case visible** — the refund-limit escalation is intentional, not a bug
4. **Use the trace log** — each step logged in AutomationsPanel helps debug decisions
5. **Run `npm run vitest`** before demos to verify engine logic

## Integration Examples

### Integration with Webhook Notifications

```javascript
async function notifySlackOnEscalation(decisions) {
  const escalated = decisions.filter(d => d.needsManager);

  for (const item of escalated) {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 *Escalation: ${item.customer}*\nIssue: ${item.issue}\nAction needed: ${item.recommendedAction}\nResponse: ${item.suggestedResponse}`,
      }),
    });
  }
}
```

### Integration with AI Draft + Human Review Workflow

```javascript
import { triageAll } from './engine/triage.js';

function processDecisions(decisions) {
  const workflow = {
    autoResolve: [],
    humanReview: [],
    managerApproval: [],
  };

  decisions.forEach(d => {
    if (d.autoResolvable && d.confidence > 0.9) {
      workflow.autoResolve.push({ ...d, status: 'sent' });
    } else if (d.needsManager) {
      workflow.managerApproval.push({ ...d, status: 'awaiting_approval' });
    } else {
      workflow.humanReview.push({ ...d, status: 'draft_ready' });
    }
  });

  return workflow;
}
```
