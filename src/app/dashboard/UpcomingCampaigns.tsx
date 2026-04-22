'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { UPCOMING_CLIENTS } from '@/lib/upcoming-clients'

const STORAGE_KEY = 'hl-upcoming-checklist'

export function UpcomingCampaigns() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setChecked(JSON.parse(saved))
    setMounted(true)
  }, [])

  function isChecked(clientId: string, itemId: string) {
    return !!checked[`${clientId}__${itemId}`]
  }

  function getProgress(client: typeof UPCOMING_CLIENTS[0]) {
    return client.checklist.filter(item => isChecked(client.id, item.id)).length
  }

  if (!mounted) return null

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
          Click a client to open their full campaign brief, research, and ad copy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {UPCOMING_CLIENTS.map(client => {
          const progress = getProgress(client)
          const total = client.checklist.length
          const pct = Math.round((progress / total) * 100)
          const allDone = progress === total

          return (
            <Link key={client.id} href={`/dashboard/upcoming/${client.id}`}>
              <div
                className="rounded-2xl p-6 relative overflow-hidden cursor-pointer group transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${allDone ? client.color + '40' : 'rgba(255,255,255,0.08)'}`,
                  backdropFilter: 'blur(20px)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.borderColor = client.color + '50'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.borderColor = allDone ? client.color + '40' : 'rgba(255,255,255,0.08)'
                }}
              >
                {/* Corner glow */}
                <div
                  className="absolute -top-6 -right-6 w-28 h-28 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                  style={{ background: client.color }}
                />

                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
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
                      <p className="text-xs mt-0.5" style={{ color: '#484D6D' }}>{client.tagline}</p>
                    </div>
                  </div>
                  <span
                    className="text-xs font-black px-3 py-1.5 rounded-full flex-shrink-0"
                    style={allDone
                      ? { background: client.color + '18', color: client.color, border: `1px solid ${client.color}30` }
                      : { background: 'rgba(255,180,0,0.08)', color: '#F59E0B', border: '1px solid rgba(255,180,0,0.2)' }
                    }
                  >
                    {allDone ? 'Ready' : 'Pre-Launch'}
                  </span>
                </div>

                {/* Checklist progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#484D6D' }}>Pre-Launch</p>
                    <span className="text-xs font-black" style={{ color: allDone ? client.color : '#484D6D' }}>
                      {progress}/{total}
                    </span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: '3px', background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: allDone ? client.color : `linear-gradient(90deg, ${client.color}88, ${client.color})`,
                      }}
                    />
                  </div>
                </div>

                {/* Checklist pills */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {client.checklist.map(item => {
                    const done = isChecked(client.id, item.id)
                    return (
                      <span
                        key={item.id}
                        className="text-xs px-2.5 py-1 rounded-full font-bold"
                        style={done
                          ? { background: client.color + '15', color: client.color, border: `1px solid ${client.color}30` }
                          : { background: 'rgba(255,255,255,0.04)', color: '#484D6D', border: '1px solid rgba(255,255,255,0.07)' }
                        }
                      >
                        {item.label}
                      </span>
                    )
                  })}
                </div>

                {/* CTA row */}
                <div className="flex items-center justify-between">
                  <p className="text-xs" style={{ color: '#484D6D' }}>
                    Market research · Competitors · Ad angles · Copy
                  </p>
                  <p className="text-xs font-black transition-all group-hover:translate-x-0.5" style={{ color: client.color }}>
                    Open Brief →
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
