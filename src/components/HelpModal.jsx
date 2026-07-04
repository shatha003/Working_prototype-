export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: '#1a1a1e', border: '1px solid #2e2e34',
        borderRadius: 16, padding: 32, maxWidth: 560, width: '90%',
        maxHeight: '80vh', overflowY: 'auto',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Demo Script (90s)</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: 20, fontFamily: 'inherit' }}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, lineHeight: 1.6, color: '#d4d4d8' }}>
          <p><strong style={{ color: '#6366f1' }}>(0:00-0:15)</strong> "Every business gets overwhelmed. 5 requests came in — a VIP booking cancelled, an angry customer charged twice, a new customer wanting the earliest slot, a bad review threat, and a simple pricing question. Only 2 staff and 3 slots left today."</p>
          <p><strong style={{ color: '#6366f1' }}>(0:15-0:40)</strong> "The sidebar shows priority at a glance. The VIP and the angry customer are at the top — high urgency. The pricing question is low. Each card has a confidence bar: green means the AI is sure what to do, red means it needs a human."</p>
          <p><strong style={{ color: '#6366f1' }}>(0:40-1:00)</strong> "Watch what happens when I hit 'Run AI Triage'. The pricing question is auto-answered from the knowledge base. The new customer gets the earliest slot auto-booked. Staff freed, slots filled. No human needed."</p>
          <p><strong style={{ color: '#6366f1' }}>(1:00-1:20)</strong> "Now look at Omar — charged twice, wants a $450 refund. The AI detected this exceeds the $200 approval limit. Confidence drops to zero. Send is disabled — the AI refuses to act. It escalates to a manager with full context."</p>
          <p><strong style={{ color: '#6366f1' }}>(1:20-1:30)</strong> "What I'd build next: a real-time manager approval queue. Push notifications, approve with one click. The engine already sends the draft — just needs the sign-off flow."</p>
        </div>
      </div>
    </div>
  )
}
