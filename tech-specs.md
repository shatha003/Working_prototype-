# Tech Specifications & Coding Standards

## 1. Project Core Stack
- **Language/Framework:** React 19, Vite 6, JavaScript (no TypeScript)
- **UI Library:** None — custom plain CSS with dark theme (CSS variables)
- **State Management:** React useState / useCallback only — no external state library
- **Routing:** None — single-page dashboard
- **Testing:** Vitest (runs in Vite pipeline)
- **Styling:** Custom CSS with dark theme via CSS variables (--bg-base, --accent, --success, etc.)

## 2. Coding Standards (Rules the AI MUST follow)
- **Pure Functions:** The triage engine must use pure functions only. No classes. No side effects.
- **Function Length:** Maximum 30 lines per function. Single Responsibility Principle (SRP).
- **File Size:** Maximum 200 lines per source file. Split into `data/`, `engine/`, `components/`.
- **Naming:** camelCase for variables/functions, PascalCase for components. No abbreviations except common ones (KB, VIP, SLA).
- **Imports:** Absolute imports preferred (e.g., `import { triageAll } from 'engine/triage'`).
- **Error Handling:** All engine functions must return valid decision objects. No thrown exceptions from the engine — use return values for error states.
- **No Console Leaks:** Remove console.log before demo. Use a dedicated logger utility if needed.
- **No Hardcoded Strings in UI:** Use constant objects for labels, statuses, and messages.

## 3. UI & Formatting Rules
- **Dark Mode:** Built into CSS variables — no library dependency.
- **Layout:** TopBar full-width → main area split into Sidebar (left, 320px) + DetailPanel (center, flex) + AutomationsPanel (right, 320px).
- **Response Format (data layer):** Every decision object from the engine MUST follow this structure:
  ```
  {
    id: string,               // unique request ID
    customer: string,          // customer name
    type: string,              // request type (booking, refund, info, rebook, complaint)
    priority: 'low'|'medium'|'high',  // priority label
    priorityScore: number,     // 0-100 raw score
    recommendedAction: string, // 'auto-respond'|'assign+respond'|'escalate'|'draft+escalate'
    owner: string,             // assigned owner
    autoResolvable: boolean,   // can AI handle end-to-end?
    needsManager: boolean,     // requires manager approval
    suggestedResponse: string, // template response text
    reason: string,            // one-line summary of why this decision
    evidence: string[],        // key evidence points
  }
  ```
- **Confidence Object (in component state):** Must include both `autoResolve` and `escalateToManager` values when applicable.
- **Trace Log Format (workflow):** Each entry: `{ timestamp: number, action: string, detail: string, requestId: string }`.

## 4. Component Design Rules
- **TopBar:** Must display staff count, slots remaining, and refund limit. Counts must decrement reactively when automation runs.
- **Sidebar:** Each request card must show: customer name, priority badge (color-coded: high=red, medium=yellow, low=green), status chip, mini confidence bar (green > 0.85, yellow 0.70-0.85, red < 0.70). Clicking a card selects it in DetailPanel.
- **DetailPanel:** Must have these sections vertically:
  1. Customer header (name + request type + priority badge)
  2. Confidence gauge (big circular or bar progress, color-coded)
  3. "Recommended Action" card (icon + action text)
  4. "Owner" card (chip with avatar placeholder)
  5. "Suggested Response" textarea (editable, disabled if needsManager, with tooltip)
  6. "Why This Decision" collapsible panel (Accordion) showing reason + evidence list
- **AutomationsPanel:** Must have a prominent "Run AI Triage" button (HeroUI Button with color="primary") at top, then a scrollable trace log below showing workflow steps in chronological order.

## 5. Triage Engine Rules
- The engine must respect the `CONFIG` object: `{ STAFF_AVAILABLE: 2, SLOTS_AVAILABLE: 3, REFUND_LIMIT: 200, CONFIDENCE_AUTO_RESOLVE_THRESHOLD: 0.85 }`
- **Refund edge case:** If `request.refundAmount > CONFIG.REFUND_LIMIT`, the engine MUST set `autoResolvable = false`, `needsManager = true`, and `confidence.autoResolve = 0.00`. This is non-negotiable.
- **Confidence must be a computed value**, not hardcoded. It should reflect evidence clarity, intent certainty, constraint clearance, and risk of being wrong.
- Priority and confidence are independent: a request can be high-priority but low-confidence (e.g., ambiguous bad-review threat), or low-priority but high-confidence (e.g., clear pricing question).

## 6. Security Policy
- **Secrets:** Never hardcode API keys. Use environment variables via VITE_ prefixed vars in `.env` files.
- **Validation:** The engine must validate input requests before processing. Invalid or missing fields should result in a decision with `needsManager: true` and a clear reason.
- **Safe Rendering:** All customer-provided text (names, issue descriptions) must be rendered as text, not HTML.
- **No localStorage for sensitive data:** In this prototype, state is ephemeral (React state only). If persistence is added, use sessionStorage with clear user consent.

## 7. Reference Docs
- **HeroUI Docs:** https://heroui.com/docs
- **React Docs:** https://react.dev
- **Vite Docs:** https://vite.dev
- **Vitest Docs:** https://vitest.dev
