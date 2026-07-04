export const knowledgeBase = [
  {
    keywords: ['basic cut', 'haircut', 'price', 'cost', 'how much'],
    answer: 'A basic cut is $40. Includes wash, cut, and style. Takes about 30 minutes.',
    category: 'pricing',
  },
  {
    keywords: ['booking', 'appointment', 'slot', 'schedule', 'book'],
    answer: 'Earliest available slot today is at 3:00 PM. We have 3 slots remaining.',
    category: 'booking',
  },
  {
    keywords: ['vip', 'priority', 'premium', 'special'],
    answer: 'VIP customers get priority rebooking. Escalate to senior staff for manual handling.',
    category: 'vip',
  },
]

export function findKBEntry(query) {
  const q = query.toLowerCase()
  return knowledgeBase.find(entry =>
    entry.keywords.some(kw => q.includes(kw))
  ) || null
}
