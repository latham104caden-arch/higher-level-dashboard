'use client'

import { useState, useEffect } from 'react'

// ─── Research Data ───────────────────────────────────────────────────────────

const RESEARCH = {
  'green-horizon': {
    market: {
      summary: 'The residential irrigation market is booming in Oklahoma. 102+ licensed sprinkler contractors operate statewide, but most rely on Angi, HomeAdvisor, and word-of-mouth — almost none are running aggressive paid social. That\'s the gap. Oklahoma summers are brutal (100°F+), suburban housing growth is strong, and homeowners are increasingly unwilling to babysit a hose. The person who shows up first on their feed with a compelling hook owns the job.',
      stats: [
        { label: 'Avg Sprinkler Install', value: '$2,500–$4,500' },
        { label: 'Avg Water Savings', value: '30–50% vs manual' },
        { label: 'OKC Competitors on Meta', value: '~6 running ads' },
        { label: 'Peak Season', value: 'April – September' },
      ],
    },
    competitors: [
      { name: 'Pelon\'s Irrigation', weakness: 'No visible Meta ads. Website is basic. Relies purely on referrals and Google.' },
      { name: '405 Irrigation', weakness: 'Active online but generic messaging. No strong hook or offer in ads.' },
      { name: 'Excellence Irrigation', weakness: 'Broad landscaping focus — irrigation is just one service. Not specialized.' },
      { name: 'Andy\'s Sprinkler', weakness: 'Long-established but no urgency, no offer. Zero social presence.' },
    ],
    angles: [
      {
        name: 'Water Bill Shock',
        type: 'Pain Point',
        color: '#EF4444',
        description: 'Homeowners overpay on water because they either overwater manually or have a busted system. Hit them with the number.',
        hook: '"The average Oklahoma homeowner wastes $400/year overwatering their lawn. Here\'s how to fix it."',
      },
      {
        name: 'Set It & Forget It',
        type: 'Convenience',
        color: '#4ADE80',
        description: 'Nobody wants to drag hoses or remember to run sprinklers. Automation is the sell — not irrigation.',
        hook: '"You shouldn\'t have to think about your lawn. We set it up once, and your yard handles itself."',
      },
      {
        name: 'Neighbor\'s Lawn',
        type: 'Social Proof / Envy',
        color: '#A78BFA',
        description: 'The classic green-grass-envy angle. Show a lush yard and let the emotion do the work.',
        hook: '"Your neighbor didn\'t get lucky with their lawn. They just called us first."',
      },
      {
        name: 'Oklahoma Heat Urgency',
        type: 'Seasonal Urgency',
        color: '#F59E0B',
        description: 'Summer is coming. Lawns die fast without proper irrigation. Create urgency around booking before peak season.',
        hook: '"Oklahoma summers don\'t wait. Install your system now before your lawn pays the price."',
      },
      {
        name: 'Curb Appeal / Home Value',
        type: 'Investment',
        color: '#45B69C',
        description: 'A green lawn adds real home value. Speak to homeowners thinking long-term about their property.',
        hook: '"A healthy lawn adds up to 15% to your home\'s value. Irrigation systems pay for themselves."',
      },
    ],
    copy: [
      {
        type: 'Primary Hook — Water Bill',
        headline: 'Your water bill is high because your lawn is guessing.',
        body: 'Manual watering means over-watering some zones and killing others. A professionally installed irrigation system waters only what needs it, only when it needs it — and cuts the average Oklahoma homeowner\'s water bill by 30–50%. We install, calibrate, and walk you out the door with a lawn that runs itself. Get a free quote this week.',
        cta: 'Get My Free Quote',
      },
      {
        type: 'Social Proof Hook',
        headline: 'We\'ve installed 200+ systems across the OKC metro.',
        body: 'Green Horizon handles everything — design, installation, and setup. Most jobs done in a single day. Your lawn gets the right water at the right time, and you get your weekends back. Don\'t babysit a hose this summer.',
        cta: 'Book a Free Consultation',
      },
      {
        type: 'Urgency Hook — Seasonal',
        headline: 'Booking fast before summer hits. Here\'s what you need to know.',
        body: 'Once temperatures climb above 90°F, installation gets complicated and slots fill up. Right now, we have openings in your area. A properly zoned irrigation system means a green lawn all summer — without the water waste. Takes about a day to install. Zero hassle.',
        cta: 'Check Availability in My Area',
      },
      {
        type: 'Short-Form / Story Ad',
        headline: 'Spent $180 on my water bill last July. Installed irrigation in August. Paid $94 in July this year.',
        body: 'That\'s a real customer story. Proper irrigation isn\'t a luxury — it\'s the smarter way to have a great lawn. We design the system around your yard, install it clean, and set your schedule. You don\'t touch it again.',
        cta: 'See If It Makes Sense for My Yard',
      },
    ],
    policyNote: null,
  },

  'solas-sciences': {
    market: {
      summary: 'The research peptide market is exploding. The global peptide therapeutics market hit $49.7B in 2025 and is projected to reach $100B by 2034. NAD+, Semax, BPC-157, and GLP-adjacent compounds are driving massive consumer demand — especially in longevity, cognitive performance, and body composition circles. The space is crowded with low-quality vendors, which is exactly why purity credentials and COAs are the primary differentiator. Meta ads require careful navigation — all copy must be framed around research use only.',
      stats: [
        { label: 'Global Market Size', value: '$49.7B (2025)' },
        { label: 'Projected Growth', value: '8.1% CAGR to 2034' },
        { label: 'Primary Buyers', value: 'Researchers, biohackers, longevity clinics' },
        { label: 'Key Risk', value: 'Meta policy — research framing required' },
      ],
    },
    competitors: [
      { name: 'Limitless Biotech', weakness: 'Wide selection but high prices. Not running aggressive Meta. Relies on SEO and community.' },
      { name: 'Peptide Sciences', weakness: 'Established brand but clinical/cold brand voice. No emotional hooks in their ads.' },
      { name: 'Core Peptides', weakness: 'Cheap positioning hurts trust. COA quality questioned in communities.' },
      { name: 'Paradigm Peptides', weakness: 'Decent brand but no standout creative. Easy to differentiate with quality storytelling.' },
    ],
    angles: [
      {
        name: 'Purity Is Everything',
        type: 'Trust / Quality',
        color: '#A78BFA',
        description: 'The #1 fear in this market is getting underdosed or contaminated compounds. Lead with dual third-party COAs. Make trust the product.',
        hook: '"Most suppliers tell you it\'s pure. We show you — every batch, third-party verified."',
      },
      {
        name: 'Research-Grade Credibility',
        type: 'Authority',
        color: '#45B69C',
        description: 'Researchers want confidence that the compound they\'re working with is what it says it is. Lean into the science and documentation.',
        hook: '"≥99% purity. Batch-level COAs. No guesswork. Serious compounds for serious research."',
      },
      {
        name: 'Price vs. Quality',
        type: 'Value',
        color: '#4ADE80',
        description: 'Solas is priced competitively below market averages through direct manufacturing. That\'s a massive angle — quality at a lower cost.',
        hook: '"Premium research compounds. Below-market pricing. No compromises on either."',
      },
      {
        name: 'The Trust Gap',
        type: 'Problem/Solution',
        color: '#EF4444',
        description: 'Most researchers have been burned by underdosed or mislabeled compounds. Name the frustration and offer the solution.',
        hook: '"Tired of ordering compounds you can\'t verify? Every Solas batch ships with third-party lab documentation."',
      },
      {
        name: 'NAD+ / Longevity Wave',
        type: 'Trend',
        color: '#F59E0B',
        description: 'NAD+ is having a massive cultural moment thanks to the longevity space. Ride the wave without making health claims.',
        hook: '"NAD+ is one of the most researched compounds in cellular biology. Start your research with verified supply."',
      },
    ],
    copy: [
      {
        type: 'Trust Hook — COA Angle',
        headline: 'Your research is only as good as your source.',
        body: 'Every compound at Solas Science is synthesized to ≥99% purity and verified by dual third-party labs. Batch-level Certificates of Analysis ship with every order — so you know exactly what you\'re working with before you open the vial. Free shipping over $150. Buy 3, get 10% off.',
        cta: 'View Lab-Verified Compounds',
      },
      {
        type: 'Problem Hook — Burned Before',
        headline: 'You\'ve ordered from vendors who couldn\'t prove their purity. We can.',
        body: 'Low-quality compounds waste your research and your budget. Solas sources through direct manufacturing partnerships — cutting the middleman and the markup — while maintaining strict third-party verification standards. COAs available before you buy.',
        cta: 'See Current Inventory',
      },
      {
        type: 'Value Hook — Pricing',
        headline: 'Research-grade compounds. Below-market pricing. Verified.',
        body: 'Direct manufacturing partnerships mean Solas delivers ≥99% purity at prices consistently below industry averages. NAD+, Semax, BPC-157, and more — all batch-tested and COA-documented. No inflated margins. No shortcuts on quality.',
        cta: 'Shop Research Compounds',
      },
      {
        type: 'Short-Form / Credibility',
        headline: 'If your supplier can\'t show you the COA, find a new supplier.',
        body: 'Every Solas compound ships with dual third-party verification. Synthesized to ≥99% purity. Competitively priced. Fast shipping. This is what research-grade actually means.',
        cta: 'Browse Verified Inventory',
      },
    ],
    policyNote: '⚠️ Meta Policy Flag: Peptides and research compounds are a sensitive category. All ad copy must frame around "research use only" — never imply human consumption, health outcomes, or medical benefits. Avoid before/after framing. Expect higher scrutiny on creative review. Test with broad educational angles first before pushing product-direct.',
  },
}

// ─── Static Data ─────────────────────────────────────────────────────────────

const UPCOMING = [
  {
    id: 'green-horizon',
    name: 'Green Horizon Irrigation',
    initial: 'G',
    type: 'Local Service',
    color: '#4ADE80',
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
    goals: [
      'Hit 2.5x+ ROAS within first 30 days of launch',
      'Test 3+ creative angles to identify winning hooks fast',
      'Build purchase pixel data to unlock Meta\'s full optimization power',
    ],
    checklist: [
      { id: 'pixel', label: 'Connect pixel' },
      { id: 'ads', label: 'Make ads' },
      { id: 'campaign', label: 'Create campaign' },
      { id: 'text', label: 'Text client about going live' },
    ],
  },
]

// ─── Types ────────────────────────────────────────────────────────────────────

type ResearchTab = 'market' | 'competitors' | 'angles' | 'copy'

const STORAGE_KEY = 'hl-upcoming-checklist'

// ─── Sub-components ───────────────────────────────────────────────────────────

function MarketTab({ data }: { data: typeof RESEARCH['green-horizon']['market'] }) {
  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>{data.summary}</p>
      <div className="grid grid-cols-2 gap-3">
        {data.stats.map((s, i) => (
          <div key={i} className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-bold mb-1" style={{ color: '#484D6D' }}>{s.label}</p>
            <p className="text-sm font-black" style={{ color: '#E8ECFF' }}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CompetitorsTab({ data }: { data: typeof RESEARCH['green-horizon']['competitors'] }) {
  return (
    <div className="space-y-3">
      {data.map((c, i) => (
        <div key={i} className="rounded-xl px-4 py-3.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="font-black text-sm mb-1" style={{ color: '#E8ECFF' }}>{c.name}</p>
          <p className="text-xs leading-relaxed" style={{ color: '#7B82A0' }}>
            <span style={{ color: '#EF4444', fontWeight: 700 }}>Gap: </span>{c.weakness}
          </p>
        </div>
      ))}
    </div>
  )
}

function AnglesTab({ data, color }: { data: typeof RESEARCH['green-horizon']['angles'], color: string }) {
  return (
    <div className="space-y-3">
      {data.map((a, i) => (
        <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black px-2.5 py-1 rounded-full" style={{ background: a.color + '18', color: a.color, border: `1px solid ${a.color}30` }}>
              {a.type}
            </span>
            <span className="font-black text-sm" style={{ color: '#E8ECFF' }}>{a.name}</span>
          </div>
          <p className="text-xs leading-relaxed mb-2" style={{ color: '#7B82A0' }}>{a.description}</p>
          <div className="rounded-lg px-3.5 py-2.5" style={{ background: color + '08', border: `1px solid ${color}20` }}>
            <p className="text-xs font-bold italic" style={{ color: color }}>{a.hook}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function CopyTab({ data, policyNote }: { data: typeof RESEARCH['green-horizon']['copy'], policyNote: string | null }) {
  const [copied, setCopied] = useState<number | null>(null)

  function copyText(idx: number, text: string) {
    navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-4">
      {policyNote && (
        <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#F59E0B' }}>{policyNote}</p>
        </div>
      )}
      {data.map((c, i) => (
        <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#484D6D' }}>{c.type}</span>
            <button
              onClick={() => copyText(i, `${c.headline}\n\n${c.body}\n\nCTA: ${c.cta}`)}
              className="text-xs font-bold px-2.5 py-1 rounded-lg transition-all"
              style={copied === i
                ? { background: 'rgba(33,209,159,0.15)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.3)' }
                : { background: 'rgba(255,255,255,0.04)', color: '#7B82A0', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              {copied === i ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <p className="font-black text-sm mb-2" style={{ color: '#E8ECFF' }}>{c.headline}</p>
          <p className="text-xs leading-relaxed mb-3" style={{ color: '#7B82A0' }}>{c.body}</p>
          <div className="rounded-lg px-3 py-2 inline-block" style={{ background: 'rgba(33,209,159,0.08)', border: '1px solid rgba(33,209,159,0.2)' }}>
            <p className="text-xs font-black" style={{ color: '#21D19F' }}>CTA: {c.cta}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UpcomingCampaigns() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)
  const [openResearch, setOpenResearch] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState<Record<string, ResearchTab>>({})

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setChecked(JSON.parse(saved))
    setMounted(true)
  }, [])

  function toggle(clientId: string, itemId: string) {
    const key = `${clientId}__${itemId}`
    const next = { ...checked, [key]: !checked[key] }
    setChecked(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  function isChecked(clientId: string, itemId: string) {
    return !!checked[`${clientId}__${itemId}`]
  }

  function getProgress(client: typeof UPCOMING[0]) {
    return client.checklist.filter(item => isChecked(client.id, item.id)).length
  }

  function toggleResearch(id: string) {
    setOpenResearch(prev => ({ ...prev, [id]: !prev[id] }))
    if (!activeTab[id]) setActiveTab(prev => ({ ...prev, [id]: 'market' }))
  }

  function setTab(id: string, tab: ResearchTab) {
    setActiveTab(prev => ({ ...prev, [id]: tab }))
  }

  if (!mounted) return null

  const TABS: { id: ResearchTab; label: string }[] = [
    { id: 'market', label: 'Market' },
    { id: 'competitors', label: 'Competitors' },
    { id: 'angles', label: 'Angles' },
    { id: 'copy', label: 'Ad Copy' },
  ]

  return (
    <section className="mt-16">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#A78BFA' }}>
          — Pipeline
        </p>
        <h2 className="text-3xl font-black tracking-tight mb-2" style={{ color: '#E8ECFF' }}>
          Upcoming Campaigns
        </h2>
        <p className="text-sm" style={{ color: '#7B82A0' }}>
          Pre-launch checklist, market research, competitors, and ready-to-use ad copy.
        </p>
      </div>

      <div className="space-y-6">
        {UPCOMING.map(client => {
          const progress = getProgress(client)
          const total = client.checklist.length
          const pct = Math.round((progress / total) * 100)
          const allDone = progress === total
          const researchOpen = !!openResearch[client.id]
          const currentTab = activeTab[client.id] || 'market'
          const research = RESEARCH[client.id as keyof typeof RESEARCH]

          return (
            <div
              key={client.id}
              className="rounded-2xl overflow-hidden relative"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${allDone ? client.color + '40' : 'rgba(255,255,255,0.08)'}`,
                backdropFilter: 'blur(20px)',
                transition: 'border-color 0.4s ease',
              }}
            >
              {/* Corner glow */}
              <div
                className="absolute -top-6 -right-6 w-28 h-28 rounded-full blur-3xl opacity-15 pointer-events-none"
                style={{ background: client.color }}
              />

              {/* Card header */}
              <div
                className="px-7 py-5 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${client.color}22, ${client.color}44)`,
                      border: `1px solid ${client.color}44`,
                      color: client.color,
                    }}
                  >
                    {client.initial}
                  </div>
                  <div>
                    <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>{client.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#484D6D' }}>{client.type}</p>
                  </div>
                </div>
                <span
                  className="text-xs font-black px-3 py-1.5 rounded-full"
                  style={allDone
                    ? { background: client.color + '18', color: client.color, border: `1px solid ${client.color}30` }
                    : { background: 'rgba(255,180,0,0.08)', color: '#F59E0B', border: '1px solid rgba(255,180,0,0.2)' }
                  }
                >
                  {allDone ? '✓ Ready to Launch' : 'Pre-Launch'}
                </span>
              </div>

              <div className="px-7 py-6 space-y-6">
                {/* Goals */}
                <div>
                  <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#484D6D' }}>Goals</p>
                  <ul className="space-y-2">
                    {client.goals.map((goal, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: client.color }} />
                        <span className="text-xs leading-relaxed" style={{ color: '#7B82A0' }}>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

                {/* Checklist */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#484D6D' }}>Pre-Launch Checklist</p>
                    <span className="text-xs font-black" style={{ color: progress === total ? client.color : '#484D6D' }}>{progress}/{total}</span>
                  </div>
                  <div className="rounded-full mb-4 overflow-hidden" style={{ height: '3px', background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: allDone ? client.color : `linear-gradient(90deg, ${client.color}88, ${client.color})` }}
                    />
                  </div>
                  <ul className="space-y-2.5">
                    {client.checklist.map(item => {
                      const done = isChecked(client.id, item.id)
                      return (
                        <li key={item.id}>
                          <button onClick={() => toggle(client.id, item.id)} className="flex items-center gap-3 w-full text-left">
                            <div
                              className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200"
                              style={done
                                ? { background: client.color, border: `1.5px solid ${client.color}` }
                                : { background: 'transparent', border: '1.5px solid rgba(255,255,255,0.15)' }
                              }
                            >
                              {done && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                  <path d="M1 4L3.5 6.5L9 1" stroke="#080B14" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm font-bold transition-all duration-200" style={done ? { color: '#484D6D', textDecoration: 'line-through' } : { color: '#E8ECFF' }}>
                              {item.label}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

                {/* Research Toggle */}
                <div>
                  <button
                    onClick={() => toggleResearch(client.id)}
                    className="flex items-center justify-between w-full group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">🧠</span>
                      <div className="text-left">
                        <p className="text-sm font-black" style={{ color: '#E8ECFF' }}>Campaign Intelligence</p>
                        <p className="text-xs" style={{ color: '#484D6D' }}>Market research, competitors, angles & ad copy</p>
                      </div>
                    </div>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0"
                      style={{
                        background: researchOpen ? client.color + '18' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${researchOpen ? client.color + '30' : 'rgba(255,255,255,0.08)'}`,
                        color: researchOpen ? client.color : '#7B82A0',
                        transform: researchOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    >
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </button>

                  {researchOpen && (
                    <div className="mt-5">
                      {/* Tab bar */}
                      <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        {TABS.map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => setTab(client.id, tab.id)}
                            className="flex-1 px-3 py-2 rounded-lg text-xs font-black transition-all duration-200"
                            style={currentTab === tab.id
                              ? { background: client.color + '18', color: client.color, border: `1px solid ${client.color}30` }
                              : { color: '#484D6D', border: '1px solid transparent' }
                            }
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Tab content */}
                      {currentTab === 'market' && <MarketTab data={research.market} />}
                      {currentTab === 'competitors' && <CompetitorsTab data={research.competitors} />}
                      {currentTab === 'angles' && <AnglesTab data={research.angles} color={client.color} />}
                      {currentTab === 'copy' && <CopyTab data={research.copy} policyNote={research.policyNote} />}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
