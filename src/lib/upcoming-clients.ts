export const UPCOMING_CLIENTS = [
  {
    id: 'green-horizon',
    name: 'Green Horizon Irrigation',
    initial: 'G',
    type: 'Local Service',
    color: '#4ADE80',
    tagline: 'OKC residential irrigation — launching soon',
    goals: [
      'Generate consistent inbound leads at under $30 CPL',
      'Establish brand presence in local service area',
      'Build a retargeting audience of 1,000+ warm prospects within 60 days',
    ],
    checklist: [
      { id: 'pixel', label: 'Connect pixel' },
      { id: 'ads', label: 'Make ads' },
      { id: 'campaign', label: 'Create campaign' },
      { id: 'text', label: 'Text client about going live' },
    ],
  },
  {
    id: 'solas-sciences',
    name: 'Solas Sciences',
    initial: 'S',
    type: 'Ecommerce',
    color: '#A78BFA',
    tagline: 'Research-grade peptides — launching soon',
    goals: [
      'Hit 2.5x+ ROAS within first 30 days of launch',
      'Test 3+ creative angles to identify winning hooks fast',
      "Build purchase pixel data to unlock Meta's full optimization power",
    ],
    checklist: [
      { id: 'pixel', label: 'Connect pixel' },
      { id: 'ads', label: 'Make ads' },
      { id: 'campaign', label: 'Create campaign' },
      { id: 'text', label: 'Text client about going live' },
    ],
  },
]

export type UpcomingClient = typeof UPCOMING_CLIENTS[0]
