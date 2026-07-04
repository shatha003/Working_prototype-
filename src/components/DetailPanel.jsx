export default function DetailPanel({ request, decision }) {
  if (!request) return <div className="empty-state">No request selected</div>

  const confVal = decision?.confidence?.autoResolve ?? 0
  const confClass = confVal >= 0.85 ? 'high' : confVal >= 0.5 ? 'medium' : 'low'
  const gaugeCircumference = 2 * Math.PI * 30
  const gaugeOffset = gaugeCircumference * (1 - confVal)

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

            <div className="card">
              <div className="response-area-header">
                <p className="card-label">Suggested Response</p>
                {decision.needsManager && (
                  <span className="badge badge-blocked">Awaiting manager approval</span>
                )}
              </div>
              <textarea
                className="response-textarea"
                defaultValue={decision.suggestedResponse}
                disabled={decision.needsManager}
              />
              <div className="response-actions">
                <button
                  className="btn btn-primary"
                  disabled={decision.needsManager}
                  title={decision.needsManager ? 'Cannot send — awaiting manager approval' : 'Send response'}
                >
                  {decision.needsManager ? 'Send blocked' : 'Send response'}
                </button>
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
