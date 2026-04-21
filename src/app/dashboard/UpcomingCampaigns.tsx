'use client'

import { useState, useEffect } from 'react'

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

const STORAGE_KEY = 'hl-upcoming-checklist'

export function UpcomingCampaigns() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)

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

  if (!mounted) return null

  return (
    <section className="mt-16">
      {/* Section header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#A78BFA' }}>
          — Pipeline
        </p>
        <h2 className="text-3xl font-black tracking-tight mb-2" style={{ color: '#E8ECFF' }}>
          Upcoming Campaigns
        </h2>
        <p className="text-sm" style={{ color: '#7B82A0' }}>
          Pre-launch checklist and goals for clients launching soon.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {UPCOMING.map(client => {
          const progress = getProgress(client)
          const total = client.checklist.length
          const pct = Math.round((progress / total) * 100)
          const allDone = progress === total

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
                  <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#484D6D' }}>
                    Goals
                  </p>
                  <ul className="space-y-2">
                    {client.goals.map((goal, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: client.color }} />
                        <span className="text-xs leading-relaxed" style={{ color: '#7B82A0' }}>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

                {/* Checklist */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#484D6D' }}>
                      Pre-Launch Checklist
                    </p>
                    <span className="text-xs font-black" style={{ color: progress === total ? client.color : '#484D6D' }}>
                      {progress}/{total}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div
                    className="rounded-full mb-4 overflow-hidden"
                    style={{ height: '3px', background: 'rgba(255,255,255,0.06)' }}
                  >
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
                          <button
                            onClick={() => toggle(client.id, item.id)}
                            className="flex items-center gap-3 w-full text-left group"
                          >
                            {/* Checkbox */}
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
                            <span
                              className="text-sm font-bold transition-all duration-200"
                              style={done
                                ? { color: '#484D6D', textDecoration: 'line-through' }
                                : { color: '#E8ECFF' }
                              }
                            >
                              {item.label}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
