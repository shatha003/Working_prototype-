export default function Sidebar({ requests, decisions, selectedId, onSelect, hasRun }) {
  const statusBadge = (status) => {
    if (status === 'Auto-resolved') return 'badge-auto-resolved'
    if (status === 'Escalated') return 'badge-escalated'
    if (status === 'Pending review') return 'badge-pending-review'
    return 'badge-pending'
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Incoming Requests</h2>
        <p>{requests.length} requests · 2 staff · 3 slots</p>
      </div>
      <div className="sidebar-list">
        {requests.map((req) => {
          const decision = decisions.find(d => d.id === req.id)
          const status = !hasRun ? 'Pending' :
            decision?.autoResolvable ? 'Auto-resolved' :
            decision?.needsManager ? 'Escalated' : 'Pending review'

          const confVal = decision?.confidence?.autoResolve ?? 0
          const confClass = confVal >= 0.85 ? 'high' : confVal >= 0.5 ? 'medium' : 'low'
          const isSelected = req.id === selectedId

          return (
            <button
              key={req.id}
              onClick={() => onSelect(req.id)}
              className={`sidebar-item${isSelected ? ' selected' : ''}`}
            >
              <div className="sidebar-item-row">
                <span className="sidebar-item-name">{req.customer}</span>
                <div className="sidebar-item-tags">
                  {req.isVIP && <span className="badge badge-vip">VIP</span>}
                  <span className={`badge badge-${req.urgency}`}>{req.urgency}</span>
                </div>
              </div>
              <p className="sidebar-item-issue">{req.issue}</p>
              <div className="sidebar-item-footer">
                <span className={`sidebar-item-status ${statusBadge(status)}`}>{status}</span>
                {hasRun && (
                  <div className="sidebar-item-confidence">
                    <div className="confidence-bar">
                      <div className={`confidence-bar-fill ${confClass}`} style={{ width: `${confVal * 100}%` }} />
                    </div>
                    <span className="confidence-text">{Math.round(confVal * 100)}%</span>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
