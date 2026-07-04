import { findKBEntry } from './knowledgeBase.js'

const CONFIG = {
  STAFF_AVAILABLE: 2,
  SLOTS_AVAILABLE: 3,
  REFUND_LIMIT: 200,
  CONFIDENCE_AUTO_RESOLVE_THRESHOLD: 0.85,
}

function scoreRequest(req) {
  const urgencyMap = { high: 25, medium: 15, low: 5 }
  const urgency = urgencyMap[req.urgency] || 10
  const customerValue = req.isVIP ? 20 : req.type === 'booking' ? 10 : 5
  const resolutionRisk = req.type === 'refund' ? 5 : req.type === 'complaint' ? 8 : 18
  const slaBreachRisk = req.urgency === 'high' ? 12 : req.urgency === 'medium' ? 8 : 2
  const kbMatch = findKBEntry(req.issue)
  const policyFit = kbMatch ? 15 : req.type === 'refund' && req.refundAmount > CONFIG.REFUND_LIMIT ? 2 : 10
  const total = urgency + customerValue + resolutionRisk + slaBreachRisk + policyFit
  return Math.min(total, 100)
}

function computeConfidence(req) {
  const kbMatch = findKBEntry(req.issue)
  let evidence = 0
  if (kbMatch) evidence += 0.4
  if (req.urgency !== 'high') evidence += 0.15
  if (req.type === 'booking') evidence += 0.2
  if (req.type === 'refund' && req.refundAmount <= CONFIG.REFUND_LIMIT) evidence += 0.25
  if (req.type === 'refund' && req.refundAmount > CONFIG.REFUND_LIMIT) {
    return { autoResolve: 0.00, escalateToManager: 0.97 }
  }
  if (req.type === 'complaint') evidence += 0.1
  if (req.isVIP) evidence += 0.05
  const autoResolve = Math.min(evidence + 0.3, 0.96)
  return { autoResolve, escalateToManager: 0.0 }
}

function decideAction(req, score, confidence) {
  if (req.type === 'refund' && req.refundAmount > CONFIG.REFUND_LIMIT) {
    return {
      recommendedAction: 'escalate',
      owner: 'Manager (pending approval)',
      autoResolvable: false,
      needsManager: true,
      suggestedResponse: `Dear ${req.customer}, I understand you were charged twice. A refund of $${req.refundAmount} requires manager approval. A manager will review your case within 2 hours. We apologize for the inconvenience.`,
      reason: `Refund $${req.refundAmount} exceeds approval limit $${CONFIG.REFUND_LIMIT}. AI policy: do not auto-resolve refunds above limit. Routed to manager with full context.`,
      evidence: [`refund_amount: ${req.refundAmount}`, `limit: ${CONFIG.REFUND_LIMIT}`, 'customer: angry'],
    }
  }
  if (confidence.autoResolve > CONFIG.CONFIDENCE_AUTO_RESOLVE_THRESHOLD) {
    const kbMatch = findKBEntry(req.issue)
    const response = kbMatch
      ? `Hi ${req.customer}, ${kbMatch.answer} Let me know if you need anything else!`
      : `Hi ${req.customer}, we've received your request and are handling it now.`
    return {
      recommendedAction: kbMatch ? 'auto-respond' : 'assign+respond',
      owner: kbMatch ? 'AI' : 'Staff A',
      autoResolvable: true,
      needsManager: false,
      suggestedResponse: response,
      reason: kbMatch
        ? `KB match found for "${req.issue}". Confidence high. Auto-responding with KB answer.`
        : `Low-risk request. Assigned to available staff for handling.`,
      evidence: kbMatch ? ['kb_match: true'] : ['risk: low'],
    }
  }
  return {
    recommendedAction: req.type === 'complaint' ? 'draft+escalate' : 'assign+respond',
    owner: 'Staff A',
    autoResolvable: false,
    needsManager: false,
    suggestedResponse: `Hi ${req.customer}, we've received your request and a team member will follow up shortly.`,
    reason: req.type === 'complaint'
      ? 'Urgent but ambiguous issue. AI drafted holding response. Requires human review before sending.'
      : 'Moderate confidence. Assigned to staff for review and action.',
    evidence: ['confidence_below_threshold: true'],
  }
}

function priorityLabel(score) {
  if (score >= 70) return 'high'
  if (score >= 50) return 'medium'
  return 'low'
}

export function triageOne(req) {
  const priorityScore = scoreRequest(req)
  const confidence = computeConfidence(req)
  const action = decideAction(req, req, confidence)
  return {
    id: req.id,
    customer: req.customer,
    type: req.type,
    priority: priorityLabel(priorityScore),
    priorityScore,
    confidence: confidence.autoResolve !== undefined
      ? { autoResolve: confidence.autoResolve, escalateToManager: confidence.escalateToManager }
      : { autoResolve: confidence },
    ...action,
  }
}

export function triageAll(requests) {
  return requests.map(triageOne)
}
