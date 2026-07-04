import { useState, useCallback, useRef } from 'react'
import { requests } from './data/requests.js'
import { triageOne, triageAll } from './engine/triage.js'
import TopBar from './components/TopBar.jsx'
import Sidebar from './components/Sidebar.jsx'
import DetailPanel from './components/DetailPanel.jsx'
import AutomationsPanel from './components/AutomationsPanel.jsx'
import HelpModal from './components/HelpModal.jsx'

const delay = ms => new Promise(r => setTimeout(r, ms))

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
  const [simActive, setSimActive] = useState(false)
  const [visibleIds, setVisibleIds] = useState(requests.map(r => r.id))
  const simRef = useRef(false)

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
          detail: `${d.customer}: ${d.reason} → Auto-resolved`,
        })
      } else if (d.needsManager) {
        traceLog.push({
          timestamp: Date.now(),
          requestId: d.id,
          action: 'escalate',
          detail: `${d.customer}: ${d.reason} → Escalated to Manager`,
        })
      } else {
        if (staff > 0) staff--
        traceLog.push({
          timestamp: Date.now(),
          requestId: d.id,
          action: 'assign',
          detail: `${d.customer}: ${d.reason} → Pending review`,
        })
      }
    }

    setTriageState({ decisions, hasRun: true, traceLog, staffAvailable: staff, slotsAvailable: slots })
    setVisibleIds(requests.map(r => r.id))
  }, [])

  const handleSimulate = useCallback(async () => {
    if (simRef.current) return
    simRef.current = true
    setSimActive(true)
    setVisibleIds([])
    setTriageState({ decisions: [], hasRun: false, traceLog: [], staffAvailable: 2, slotsAvailable: 3 })
    setSelectedId(null)

    const acc = { decisions: [], traceLog: [], staff: 2, slots: 3 }

    for (const req of requests) {
      await delay(400)
      setVisibleIds(prev => [...prev, req.id])
      await delay(300)

      const decision = triageOne(req)
      acc.decisions.push(decision)

      let traceEntry
      if (decision.autoResolvable && decision.confidence.autoResolve > 0.85) {
        if (decision.type === 'booking' || decision.type === 'rebook') {
          if (acc.slots > 0) acc.slots--
        }
        if (acc.staff > 0 && decision.owner !== 'AI') acc.staff--
        traceEntry = {
          timestamp: Date.now(),
          requestId: req.id,
          action: 'auto-resolve',
          detail: `${req.customer}: ${decision.reason} → Auto-resolved`,
        }
      } else if (decision.needsManager) {
        traceEntry = {
          timestamp: Date.now(),
          requestId: req.id,
          action: 'escalate',
          detail: `${req.customer}: ${decision.reason} → Escalated to Manager`,
        }
      } else {
        if (acc.staff > 0) acc.staff--
        traceEntry = {
          timestamp: Date.now(),
          requestId: req.id,
          action: 'assign',
          detail: `${req.customer}: ${decision.reason} → Pending review`,
        }
      }
      acc.traceLog.push(traceEntry)

      setTriageState({
        decisions: [...acc.decisions],
        hasRun: true,
        traceLog: [...acc.traceLog],
        staffAvailable: acc.staff,
        slotsAvailable: acc.slots,
      })

      await delay(1000)
    }

    setSelectedId(requests[0].id)
    simRef.current = false
    setSimActive(false)
  }, [])

  const handleApprove = useCallback((id) => {
    setTriageState(prev => ({
      ...prev,
      decisions: prev.decisions.map(d =>
        d.id === id
          ? { ...d, needsManager: false, managerAction: 'approved', owner: 'Manager (approved)' }
          : d
      ),
      traceLog: [
        ...prev.traceLog,
        {
          timestamp: Date.now(),
          requestId: id,
          action: 'approved',
          detail: `Manager approved response for ${requests.find(r => r.id === id)?.customer}. Ready to send.`,
        },
      ],
    }))
  }, [])

  const handleReject = useCallback((id) => {
    setTriageState(prev => ({
      ...prev,
      decisions: prev.decisions.map(d =>
        d.id === id
          ? { ...d, needsManager: false, managerAction: 'rejected', owner: 'Manager (rejected)' }
          : d
      ),
      traceLog: [
        ...prev.traceLog,
        {
          timestamp: Date.now(),
          requestId: id,
          action: 'rejected',
          detail: `Manager rejected auto-generated response for ${requests.find(r => r.id === id)?.customer}. Needs manual rewrite.`,
        },
      ],
    }))
  }, [])

  const selected = visibleIds.includes(selectedId) ? requests.find(r => r.id === selectedId) : null
  const decision = selected ? (triageState.decisions.find(d => d.id === selected.id) || null) : null

  return (
    <div className="layout">
      <TopBar staff={triageState.staffAvailable} slots={triageState.slotsAvailable} refundLimit={200} onHelpClick={() => setShowHelp(true)} />
      <div className="layout-body">
        <Sidebar
          requests={requests}
          visibleIds={visibleIds}
          decisions={triageState.decisions}
          selectedId={selectedId}
          onSelect={setSelectedId}
          hasRun={triageState.hasRun}
          simActive={simActive}
        />
        <DetailPanel
          request={selected}
          decision={decision}
          simActive={simActive}
          onApprove={handleApprove}
          onReject={handleReject}
        />
        <AutomationsPanel
          onRunTriage={handleRunTriage}
          onSimulate={handleSimulate}
          simActive={simActive}
          traceLog={triageState.traceLog}
          hasRun={triageState.hasRun}
        />
      </div>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  )
}
