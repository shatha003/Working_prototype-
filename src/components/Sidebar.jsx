export default function Sidebar({ requests, visibleIds, decisions, selectedId, onSelect, hasRun, simActive }) {
  const statusBadge = (status) => {
    if (status === 'Auto-resolved') return 'badge-auto-resolved'
    if (status === 'Escalated') return 'badge-escalated'
    if (status === 'Approved') return 'badge-auto-resolved'
    if (status === 'Rejected') return 'badge-escalated'
    if (status === 'Pending review') return 'badge-pending-review'
    return 'badge-pending'
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Incoming Requests</h2>
        <p>{visibleIds.length} of {requests.length} received · 2 staff · 3 slots</p>
      </div>
      <div className="sidebar-list">
        {requests.map((req, index) => {
          const isVisible = visibleIds.includes(req.id)
          const decision = decisions.find(d => d.id === req.id)
          const status = !hasRun ? 'Pending' :
            decision?.managerAction === 'approved' ? 'Approved' :
            decision?.managerAction === 'rejected' ? 'Rejected' :
            decision?.autoResolvable ? 'Auto-resolved' :
            decision?.needsManager ? 'Escalated' : 'Pending review'

          const confVal = decision?.confidence?.autoResolve ?? 0
          const confClass = confVal >= 0.85 ? 'high' : confVal >= 0.5 ? 'medium' : 'low'
          const isSelected = req.id === selectedId

          return (
            <button
              key={req.id}
              onClick={() => isVisible && onSelect(req.id)}
              disabled={!isVisible}
              className={`sidebar-item${isSelected ? ' selected' : ''}`}
              style={{
                animation: isVisible && simActive ? 'reqSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                animationDelay: isVisible && simActive ? `${index * 0.05}s` : '0s',
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? 'auto' : 'none',
              }}
            >
              <div className="sidebar-item-row">
                <span className="sidebar-item-name">{req.customer}</span>
                <div className="sidebar-item-tags">
                  {req.isVIP && <span className="badge badge-vip">VIP</span>}
                  {isVisible && <span className={`badge badge-${req.urgency}`}>{req.urgency}</span>}
                </div>
              </div>
              <p className="sidebar-item-issue">{isVisible ? req.issue : ' '}</p>
              <div className="sidebar-item-footer">
                {isVisible && (
                  <span className={`sidebar-item-status ${!hasRun ? 'badge-pending' : statusBadge(status)}`}>
                    {status}
                  </span>
                )}
                {hasRun && isVisible && (
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
      <style>{`
        @keyframes reqSlideIn {
          from {
            opacity: 0;
            transform: translateX(-12px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>
    </aside>
  )
}
