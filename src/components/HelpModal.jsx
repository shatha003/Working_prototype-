export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '36px 40px',
          maxWidth: 580,
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
          animation: 'scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Demo Script</h2>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: 14,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease',
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          <p><strong style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>0:00 – 0:15</strong><br />"Every business gets overwhelmed. 5 requests came in — a VIP booking cancelled, an angry customer charged twice, a new customer wanting the earliest slot, a bad review threat, and a simple pricing question. Only 2 staff and 3 slots left today."</p>
          <p><strong style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>0:15 – 0:40</strong><br />"The sidebar shows priority at a glance. The VIP and the angry customer are at the top — high urgency. The pricing question is low. Each card has a confidence bar: green means the AI is sure what to do, red means it needs a human."</p>
          <p><strong style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>0:40 – 1:00</strong><br />"Watch what happens when I hit 'Run AI Triage'. The pricing question is auto-answered from the knowledge base. The new customer gets the earliest slot auto-booked. Staff freed, slots filled. No human needed."</p>
          <p><strong style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>1:00 – 1:20</strong><br />"Now look at Omar — charged twice, wants a $450 refund. The AI detected this exceeds the $200 approval limit. Confidence drops to zero. Send is disabled — the AI refuses to act. It escalates to a manager with full context."</p>
          <p><strong style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>1:20 – 1:30</strong><br />"What I'd build next: a real-time manager approval queue. Push notifications, approve with one click. The engine already sends the draft — just needs the sign-off flow."</p>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>
  )
}
