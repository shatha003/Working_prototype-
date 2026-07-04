export default function TopBar({ staff, slots, refundLimit, onHelpClick }) {
  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="topbar-title">Build.Solve.Impact.</span>
        <button
          onClick={onHelpClick}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: 11,
            padding: '2px 8px',
            fontFamily: 'inherit',
          }}
        >
          Demo script
        </button>
      </div>
      <div className="topbar-stats">
        <div className="topbar-stat">
          <span className="topbar-stat-label">Staff:</span>
          <span className="topbar-stat-value">{staff}/2 available</span>
        </div>
        <div className="topbar-stat">
          <span className="topbar-stat-label">Slots:</span>
          <span className="topbar-stat-value">{slots}/3 left</span>
        </div>
        <div className="topbar-stat">
          <span className="topbar-stat-label">Refund limit:</span>
          <span className="topbar-stat-value">${refundLimit}</span>
        </div>
      </div>
    </header>
  )
}
