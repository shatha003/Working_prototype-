export default function TopBar({ staff, slots, refundLimit, onHelpClick }) {
  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span className="topbar-title">Build.Solve.Impact.</span>
        <button
          onClick={onHelpClick}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: '999px',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: 11,
            padding: '4px 12px',
            fontFamily: 'inherit',
            fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.target.style.color = 'var(--text-primary)'
            e.target.style.borderColor = 'rgba(255,255,255,0.12)'
          }}
          onMouseLeave={e => {
            e.target.style.color = 'var(--text-muted)'
            e.target.style.borderColor = 'var(--border)'
          }}
        >
          Demo script
        </button>
      </div>
      <div className="topbar-stats">
        <div className="topbar-stat">
          <span className="topbar-stat-label">Staff</span>
          <span className="topbar-stat-value">{staff}/2</span>
        </div>
        <div className="topbar-stat">
          <span className="topbar-stat-label">Slots</span>
          <span className="topbar-stat-value">{slots}/3</span>
        </div>
        <div className="topbar-stat">
          <span className="topbar-stat-label">Refund limit</span>
          <span className="topbar-stat-value">${refundLimit}</span>
        </div>
      </div>
    </header>
  )
}
