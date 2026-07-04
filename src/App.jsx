import { useState, useCallback } from 'react'
import { requests } from './data/requests.js'
import { triageAll } from './engine/triage.js'
import TopBar from './components/TopBar.jsx'
import Sidebar from './components/Sidebar.jsx'
import DetailPanel from './components/DetailPanel.jsx'
import AutomationsPanel from './components/AutomationsPanel.jsx'
import HelpModal from './components/HelpModal.jsx'

export default function App() {
  const [selectedId, setSelectedId] = useState('req-1')
  const [showHelp, setShowHelp] = useState(false)
  const [triageState, setTriageState] = useState({
    decisions: [],
    hasRun: false,
    traceLog: [],
    staffAvailable: 2,
    slotsAvailable: 3,
  })

  const handleRunTriage = useCallback(() => {
    const decisions = triageAll(requests)
    let staff = 2
    let slots = 3
    const traceLog = []

    for (const d of decisions) {
      if (d.autoResolvable && d.confidence.autoResolve > 0.85) {
        if (d.type === 'booking' || d.type === 'rebook') {
          if (slots > 0) slots--
        }
        if (staff > 0 && d.owner !== 'AI') staff--
        traceLog.push({
          timestamp: Date.now(),
          requestId: d.id,
          action: 'auto-resolve',
          detail: `${d.customer}: ${d.reason} → Status: Auto-resolved`,
        })
      } else if (d.needsManager) {
        traceLog.push({
          timestamp: Date.now(),
          requestId: d.id,
          action: 'escalate',
          detail: `${d.customer}: ${d.reason} → Status: Escalated to Manager`,
        })
      } else {
        if (staff > 0) staff--
        traceLog.push({
          timestamp: Date.now(),
          requestId: d.id,
          action: 'assign',
          detail: `${d.customer}: ${d.reason} → Status: Pending human review`,
        })
      }
    }

    setTriageState({ decisions, hasRun: true, traceLog, staffAvailable: staff, slotsAvailable: slots })
  }, [])

  const selected = requests.find(r => r.id === selectedId)
  const decision = triageState.decisions.find(d => d.id === selectedId) || null

  return (
    <div className="layout">
      <TopBar staff={triageState.staffAvailable} slots={triageState.slotsAvailable} refundLimit={200} onHelpClick={() => setShowHelp(true)} />
      <div className="layout-body">
        <Sidebar
          requests={requests}
          decisions={triageState.decisions}
          selectedId={selectedId}
          onSelect={setSelectedId}
          hasRun={triageState.hasRun}
        />
        <DetailPanel request={selected} decision={decision} />
        <AutomationsPanel
          onRunTriage={handleRunTriage}
          traceLog={triageState.traceLog}
          hasRun={triageState.hasRun}
        />
      </div>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  )
}
