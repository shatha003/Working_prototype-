export default function AutomationsPanel({ onRunTriage, traceLog, hasRun }) {
  return (
    <aside className="automations-panel">
      <div className="automations-header">
        <h2>Automations</h2>
      </div>
      <div className="automations-actions">
        <button className="btn-triage" onClick={onRunTriage}>
          Run AI Triage
        </button>
      </div>
      {hasRun && (
        <div className="trace-log">
          <p className="trace-log-title">Workflow Trace</p>
          {traceLog.map((entry, i) => (
            <div key={i} className="trace-entry">
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
            Run AI Triage to see the automation workflow trace.
          </div>
        </div>
      )}
    </aside>
  )
}
