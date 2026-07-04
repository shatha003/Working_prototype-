import { useState } from 'react'

export default function DetailPanel({ request, decision, simActive, onApprove, onReject }) {
  const [toast, setToast] = useState(null)

  if (!request) return (
    <div className="empty-state">
      {simActive ? 'Requests arriving... select one to inspect' : 'No request selected'}
    </div>
  )

  const confVal = decision?.confidence?.autoResolve ?? 0
  const confClass = confVal >= 0.85 ? 'high' : confVal >= 0.5 ? 'medium' : 'low'
  const gaugeCircumference = 2 * Math.PI * 30
  const gaugeOffset = gaugeCircumference * (1 - confVal)

  const needsApproval = decision?.needsManager && !decision?.managerAction
  const isApproved = decision?.managerAction === 'approved'
  const isRejected = decision?.managerAction === 'rejected'

  const handleSend = () => {
    setToast('Response sent to customer')
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <div className="detail-panel">
      <div className="detail-panel-inner">
        <div>
          <div className="detail-header-top">
            <h1 className="detail-customer-name">{request.customer}</h1>
            {request.isVIP && <span className="badge badge-vip">VIP</span>}
            <span className={`badge badge-${request.urgency}`}>{request.urgency} priority</span>
          </div>
          <p className="detail-issue">{request.issue}</p>
        </div>

        <div className="card">
          <p className="card-label">AI Confidence</p>
          <div className="confidence-gauge">
            <div className="gauge-ring">
              <svg className="gauge-svg" viewBox="0 0 72 72">
                <circle className="gauge-track" cx="36" cy="36" r="30" />
                <circle className={`gauge-fill ${confClass}`} cx="36" cy="36" r="30"
                  strokeDasharray={gaugeCircumference}
                  strokeDashoffset={gaugeOffset}
                />
              </svg>
              <span className={`gauge-value ${confClass}`}>{Math.round(confVal * 100)}%</span>
            </div>
            <div>
              <span className={`gauge-label ${confClass}`}>
                {confVal >= 0.85 ? 'High confidence' :
                 confVal >= 0.5 ? 'Medium confidence' :
                 confVal > 0 ? 'Low confidence' : 'Blocked by policy'}
              </span>
              {decision?.confidence?.escalateToManager > 0 && (
                <p className="gauge-sub">Escalation confidence: {Math.round(decision.confidence.escalateToManager * 100)}%</p>
              )}
            </div>
          </div>
        </div>

        {decision && (
          <>
            <div className="card">
              <p className="card-label">Recommended Action</p>
              <p className="card-value capitalize">{decision.recommendedAction.replace('-', ' + ')}</p>
            </div>

            <div className="card">
              <p className="card-label">Owner</p>
              <p className="card-value">{decision.owner}</p>
            </div>

            {/* Manager Approval Queue — only for escalated requests */}
            {needsApproval && (
              <div className="card approval-card">
                <div className="approval-header">
                  <div className="approval-icon">🔒</div>
                  <div>
                    <p className="approval-title">Manager Approval Required</p>
                    <p className="approval-subtitle">
                      Refund ${request.refundAmount} exceeds the $200 limit.
                      Review the AI-drafted response below.
                    </p>
                  </div>
                </div>
                <div className="approval-actions">
                  <button className="btn btn-approve" onClick={() => onApprove(decision.id)}>
                    ✓ Approve & Send
                  </button>
                  <button className="btn btn-reject" onClick={() => onReject(decision.id)}>
                    ✕ Reject
                  </button>
                </div>
              </div>
            )}

            {/* Approved badge */}
            {isApproved && (
              <div className="card" style={{ borderColor: 'var(--success)', background: 'var(--success-soft)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>✓</span>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--success)', fontSize: 14 }}>Approved by Manager</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Response is ready to send.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Rejected badge */}
            {isRejected && (
              <div className="card" style={{ borderColor: 'var(--danger)', background: 'var(--danger-soft)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>✕</span>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--danger)', fontSize: 14 }}>Rejected by Manager</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Draft rejected. Needs manual rewrite and re-escalation.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <div className="response-area-header">
                <p className="card-label">Suggested Response</p>
                {(decision.needsManager && !decision.managerAction) && (
                  <span className="badge badge-blocked">Awaiting manager approval</span>
                )}
                {isApproved && (
                  <span className="badge badge-auto-resolved">Approved</span>
                )}
                {isRejected && (
                  <span className="badge badge-escalated">Rejected</span>
                )}
              </div>
              <textarea
                key={decision?.id || 'empty'}
                className="response-textarea"
                defaultValue={decision.suggestedResponse}
                disabled={decision.needsManager && !decision.managerAction}
              />
              <div className="response-actions">
                <button
                  className="btn btn-primary"
                  disabled={decision.needsManager && !decision.managerAction}
                  title={
                    needsApproval ? 'Cannot send — awaiting manager approval' :
                    isRejected ? 'Cannot send — rejected by manager' :
                    'Send response'
                  }
                  onClick={handleSend}
                >
                  {needsApproval ? 'Send blocked' :
                   isRejected ? 'Send blocked' :
                   'Send response'}
                </button>
                {toast && (
                  <div style={{
                    position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '12px 24px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    fontSize: 13, fontWeight: 500, zIndex: 9999,
                    animation: 'fadeIn 0.2s ease',
                  }}>
                    <span style={{ color: 'var(--success)', marginRight: 8 }}>✓</span>
                    {toast}
                  </div>
                )}
              </div>
            </div>

            <details className="card reasoning">
              <summary>Why This Decision</summary>
              <div className="reasoning-body">
                <p className="reasoning-text">{decision.reason}</p>
                {decision.evidence.length > 0 && (
                  <div className="evidence-tags">
                    {decision.evidence.map((e, i) => (
                      <span key={i} className="evidence-tag">{e}</span>
                    ))}
                  </div>
                )}
              </div>
            </details>
          </>
        )}
      </div>
    </div>
  )
}
