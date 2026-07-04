import { describe, it, expect } from 'vitest'
import { triageOne, triageAll } from '../engine/triage.js'

const mockRequests = [
  { id: 'req-1', type: 'rebook', customer: 'Aisha', isVIP: true, issue: '2pm booking cancelled', refundAmount: null, urgency: 'high' },
  { id: 'req-2', type: 'booking', customer: 'Sara', isVIP: false, issue: 'Book earliest slot today', refundAmount: null, urgency: 'medium' },
  { id: 'req-3', type: 'refund', customer: 'Omar', isVIP: false, issue: 'Charged twice, wants $450 refund', refundAmount: 450, urgency: 'high' },
  { id: 'req-4', type: 'info', customer: 'Layla', isVIP: false, issue: 'How much is a basic cut?', refundAmount: null, urgency: 'low' },
  { id: 'req-5', type: 'complaint', customer: 'Khalid', isVIP: false, issue: 'Vague issue, threatens bad review', refundAmount: null, urgency: 'high' },
]

describe('triageOne', () => {
  it('returns a valid decision object for any request', () => {
    const d = triageOne(mockRequests[0])
    expect(d).toHaveProperty('id')
    expect(d).toHaveProperty('priority')
    expect(d).toHaveProperty('priorityScore')
    expect(d).toHaveProperty('confidence')
    expect(d).toHaveProperty('recommendedAction')
    expect(d).toHaveProperty('owner')
    expect(d).toHaveProperty('autoResolvable')
    expect(d).toHaveProperty('needsManager')
    expect(d).toHaveProperty('suggestedResponse')
    expect(d).toHaveProperty('reason')
    expect(d).toHaveProperty('evidence')
  })

  it('assigns high priority to VIP rebooking (req-1)', () => {
    const d = triageOne(mockRequests[0])
    expect(d.priority).toBe('high')
    expect(d.priorityScore).toBeGreaterThanOrEqual(70)
  })

  it('assigns medium priority to new booking (req-2)', () => {
    const d = triageOne(mockRequests[1])
    expect(d.priority).toBe('medium')
  })

  it('sets needsManager=true for refund exceeding $200 limit (req-3)', () => {
    const d = triageOne(mockRequests[2])
    expect(d.needsManager).toBe(true)
    expect(d.autoResolvable).toBe(false)
    expect(d.confidence.autoResolve).toBe(0.00)
    expect(d.recommendedAction).toBe('escalate')
  })

  it('assigns low priority to simple pricing question (req-4)', () => {
    const d = triageOne(mockRequests[3])
    expect(d.priority).toBe('low')
  })

  it('sets high confidence for KB-matching pricing question (req-4)', () => {
    const d = triageOne(mockRequests[3])
    expect(d.confidence.autoResolve).toBeGreaterThan(0.85)
    expect(d.autoResolvable).toBe(true)
    expect(d.recommendedAction).toBe('auto-respond')
  })

  it('sets confidence < 0.75 for ambiguous complaint (req-5)', () => {
    const d = triageOne(mockRequests[4])
    expect(d.confidence.autoResolve).toBeLessThan(0.75)
    expect(d.recommendedAction).toBe('draft+escalate')
  })

  it('includes reason text for every decision', () => {
    for (const req of mockRequests) {
      const d = triageOne(req)
      expect(d.reason).toBeTruthy()
      expect(typeof d.reason).toBe('string')
      expect(d.reason.length).toBeGreaterThan(10)
    }
  })

  it('includes evidence array for every decision', () => {
    for (const req of mockRequests) {
      const d = triageOne(req)
      expect(Array.isArray(d.evidence)).toBe(true)
    }
  })
})

describe('triageAll', () => {
  it('returns one decision per request', () => {
    const results = triageAll(mockRequests)
    expect(results).toHaveLength(mockRequests.length)
  })

  it('sorts results to match request order', () => {
    const results = triageAll(mockRequests)
    results.forEach((d, i) => {
      expect(d.id).toBe(mockRequests[i].id)
    })
  })
})
