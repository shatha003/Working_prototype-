export default function AutomationsPanel({ onRunTriage, onSimulate, simActive, traceLog, hasRun }) {
  return (
    <aside className="automations-panel">
      <div className="automations-header">
        <h2>Automations</h2>
      </div>
      <div className="automations-actions" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button className="btn-triage" onClick={onRunTriage} disabled={simActive}>
          Run AI Triage
        </button>
        <button
          className="btn-triage"
          onClick={onSimulate}
          disabled={simActive}
          style={{
            background: simActive
              ? 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-hover) 100%)'
              : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            boxShadow: simActive
              ? 'none'
              : '0 4px 16px rgba(16, 185, 129, 0.3)',
          }}
        >
          {simActive ? 'Simulating...' : 'Simulate Live'}
        </button>
      </div>
      {hasRun && (
        <div className="trace-log">
          <p className="trace-log-title">Workflow Trace</p>
          {traceLog.map((entry, i) => (
            <div
              key={i}
              className="trace-entry"
              style={{
                animation: 'traceIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animationDelay: `${i * 0.05}s`,
              }}
            >
              <div className="trace-entry-header">
                <span className={`trace-action ${entry.action}`}>{entry.action}</span>
                <span className="trace-time">{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="trace-detail">{entry.detail}</p>
            </div>
          ))}
        </div>
      )}
      {!hasRun && (
        <div className="trace-log">
          <div className="trace-empty">
            Run AI Triage or Simulate Live to see the automation workflow.
          </div>
        </div>
      )}
    </aside>
  )
}
