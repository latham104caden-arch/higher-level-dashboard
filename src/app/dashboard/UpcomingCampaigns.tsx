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
        <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Pipeline</p>
        <h2 className="font-serif italic text-2xl sm:text-3xl tracking-tight mb-2" style={{ color: '#F4F5F8' }}>
          Upcoming Campaigns
        </h2>
        <p className="text-sm" style={{ color: '#8A8F98' }}>
          Click a client to open their full campaign brief, research, and ad copy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {UPCOMING_CLIENTS.map(client => {
          const progress = getProgress(client)
          const total = client.checklist.length
          const pct = Math.round((progress / total) * 100)
          const allDone = progress === total
          const accent = allDone ? '#21D19F' : '#F59E0B'

          return (
            <Link key={client.id} href={`/dashboard/upcoming/${client.id}`} className="card card-hover p-5 block">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-md flex items-center justify-center font-semibold text-sm flex-shrink-0"
                    style={{
                      background: '#1A1B20',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#F4F5F8',
                    }}
                  >
                    {client.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#F4F5F8' }}>{client.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#5C606C' }}>{client.tagline}</p>
                  </div>
                </div>
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded flex-shrink-0"
                  style={{ background: `${accent}10`, color: accent, border: `1px solid ${accent}28` }}
                >
                  {allDone ? 'Ready' : 'Pre-launch'}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-medium" style={{ color: '#5C606C' }}>Pre-launch</p>
                  <span className="text-xs font-medium tnum" style={{ color: allDone ? accent : '#8A8F98' }}>
                    {progress}/{total}
                  </span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: '2px', background: 'rgba(255,255,255,0.05)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: accent }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {client.checklist.map(item => {
                  const done = isChecked(client.id, item.id)
                  return (
                    <span
                      key={item.id}
                      className="text-[10px] px-2 py-0.5 rounded font-medium"
                      style={done
                        ? { background: 'rgba(33,209,159,0.08)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.18)' }
                        : { background: '#1A1B20', color: '#5C606C', border: '1px solid rgba(255,255,255,0.06)' }
                      }
                    >
                      {item.label}
                    </span>
                  )
                })}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs" style={{ color: '#5C606C' }}>
                  Market research · Competitors · Ad angles · Copy
                </p>
                <p className="text-xs font-medium" style={{ color: '#5E6AD2' }}>
                  Open Brief →
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
