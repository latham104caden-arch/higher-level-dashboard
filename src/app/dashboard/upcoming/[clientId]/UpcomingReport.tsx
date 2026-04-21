'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { UPCOMING_RESEARCH } from '@/lib/upcoming'
import { UPCOMING_CLIENTS } from '@/app/dashboard/UpcomingCampaigns'

type Tab = 'overview' | 'market' | 'competitors' | 'angles' | 'copy'

const TABS: { label: string; value: Tab }[] = [
  { label: 'Overview', value: 'overview' },
  { label: 'Market', value: 'market' },
  { label: 'Competitors', value: 'competitors' },
  { label: 'Ad Angles', value: 'angles' },
  { label: 'Ad Copy', value: 'copy' },
]

const STORAGE_KEY = 'hl-upcoming-checklist'

// ─── Checklist ────────────────────────────────────────────────────────────────

function OverviewTab({
  client,
  checked,
  toggle,
}: {
  client: typeof UPCOMING_CLIENTS[0]
  checked: Record<string, boolean>
  toggle: (clientId: string, itemId: string) => void
}) {
  const isChecked = (itemId: string) => !!checked[`${client.id}__${itemId}`]
  const progress = client.checklist.filter(i => isChecked(i.id)).length
  const total = client.checklist.length
  const pct = Math.round((progress / total) * 100)
  const allDone = progress === total

  return (
    <div className="space-y-8">
      {/* Goals */}
      <div
        className="rounded-2xl p-7"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
      >
        <p className="text-xs font-black uppercase tracking-widest mb-5" style={{ color: '#484D6D' }}>Campaign Goals</p>
        <ul className="space-y-4">
          {client.goals.map((goal, i) => (
            <li key={i} className="flex items-start gap-4">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5"
                style={{ background: client.color + '18', border: `1px solid ${client.color}30`, color: client.color }}
              >
                {i + 1}
              </div>
              <p className="text-sm leading-relaxed pt-1" style={{ color: '#A0A4B8' }}>{goal}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Checklist */}
      <div
        className="rounded-2xl p-7"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#484D6D' }}>Pre-Launch Checklist</p>
          <span className="text-xs font-black" style={{ color: allDone ? client.color : '#484D6D' }}>{progress}/{total}</span>
        </div>

        {/* Progress bar */}
        <div className="rounded-full mb-6 overflow-hidden" style={{ height: '3px', background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: allDone ? client.color : `linear-gradient(90deg, ${client.color}88, ${client.color})`,
            }}
          />
        </div>

        <ul className="space-y-3">
          {client.checklist.map(item => {
            const done = isChecked(item.id)
            return (
              <li key={item.id}>
                <button
                  onClick={() => toggle(client.id, item.id)}
                  className="flex items-center gap-4 w-full text-left group"
                >
                  <div
                    className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-200"
                    style={done
                      ? { background: client.color, border: `1.5px solid ${client.color}` }
                      : { background: 'transparent', border: '1.5px solid rgba(255,255,255,0.15)' }
                    }
                  >
                    {done && (
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path d="M1 4.5L4 7.5L10 1" stroke="#080B14" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-sm font-bold transition-all duration-200"
                    style={done ? { color: '#484D6D', textDecoration: 'line-through' } : { color: '#E8ECFF' }}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {allDone && (
          <div
            className="mt-6 rounded-xl px-4 py-3 text-center"
            style={{ background: client.color + '10', border: `1px solid ${client.color}25` }}
          >
            <p className="text-sm font-black" style={{ color: client.color }}>✓ All pre-launch tasks complete — ready to go live</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Market ──────────────────────────────────────────────────────────────────

function MarketTab({ data, color }: { data: { summary: string; stats: { label: string; value: string }[] }; color: string }) {
  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl p-7"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
      >
        <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: '#484D6D' }}>Market Overview</p>
        <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>{data.summary}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.stats.map((s, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
          >
            <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full blur-2xl opacity-20" style={{ background: color }} />
            <p className="text-xs font-bold mb-2" style={{ color: '#484D6D' }}>{s.label}</p>
            <p className="text-lg font-black" style={{ color: '#E8ECFF' }}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Competitors ──────────────────────────────────────────────────────────────

function CompetitorsTab({ data }: { data: { name: string; weakness: string }[] }) {
  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(33,209,159,0.04)', border: '1px solid rgba(33,209,159,0.12)', backdropFilter: 'blur(20px)' }}
      >
        <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#21D19F' }}>The Opportunity</p>
        <p className="text-sm" style={{ color: '#7B82A0' }}>
          Every competitor below has a gap. The goal is to identify which gap aligns with this client's strengths and make it the core of our ads.
        </p>
      </div>
      {data.map((c, i) => (
        <div
          key={i}
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>{c.name}</p>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              Gap
            </span>
          </div>
          <p className="text-sm leading-relaxed mt-2" style={{ color: '#7B82A0' }}>{c.weakness}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Angles ──────────────────────────────────────────────────────────────────

function AnglesTab({ data, color }: {
  data: { name: string; type: string; color: string; description: string; hook: string }[]
  color: string
}) {
  return (
    <div className="space-y-4">
      {data.map((a, i) => (
        <div
          key={i}
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-xs font-black px-2.5 py-1 rounded-full"
              style={{ background: a.color + '18', color: a.color, border: `1px solid ${a.color}30` }}
            >
              {a.type}
            </span>
            <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>{a.name}</p>
          </div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#7B82A0' }}>{a.description}</p>
          <div
            className="rounded-xl px-5 py-4"
            style={{ background: color + '08', border: `1px solid ${color}20` }}
          >
            <p className="text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: color + 'aa' }}>Hook</p>
            <p className="text-sm font-bold italic" style={{ color: '#E8ECFF' }}>{a.hook}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

function CopyTab({ data, policyNote }: {
  data: { type: string; headline: string; body: string; cta: string }[]
  policyNote: string | null
}) {
  const [copied, setCopied] = useState<number | null>(null)

  function copyText(idx: number, text: string) {
    navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-5">
      {policyNote && (
        <div className="rounded-2xl px-5 py-4" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <p className="text-sm leading-relaxed" style={{ color: '#F59E0B' }}>{policyNote}</p>
        </div>
      )}
      {data.map((c, i) => (
        <div
          key={i}
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#484D6D' }}>{c.type}</span>
            <button
              onClick={() => copyText(i, `${c.headline}\n\n${c.body}\n\nCTA: ${c.cta}`)}
              className="text-xs font-black px-3 py-1.5 rounded-lg transition-all"
              style={copied === i
                ? { background: 'rgba(33,209,159,0.15)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.3)' }
                : { background: 'rgba(255,255,255,0.05)', color: '#7B82A0', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              {copied === i ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <p className="font-black text-base mb-3" style={{ color: '#E8ECFF' }}>{c.headline}</p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#7B82A0' }}>{c.body}</p>
          <div
            className="rounded-xl px-4 py-2.5 inline-block"
            style={{ background: 'rgba(33,209,159,0.08)', border: '1px solid rgba(33,209,159,0.2)' }}
          >
            <p className="text-xs font-black" style={{ color: '#21D19F' }}>CTA: {c.cta}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UpcomingReport({ client }: { client: typeof UPCOMING_CLIENTS[0] }) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
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

  const research = UPCOMING_RESEARCH[client.id]
  const progress = client.checklist.filter(i => !!checked[`${client.id}__${i.id}`]).length
  const total = client.checklist.length
  const allDone = progress === total

  if (!mounted) return null

  return (
    <div className="min-h-screen" style={{ background: '#080B14' }}>
      <div className="bg-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Ghost initial */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-end pr-8 opacity-100">
        <span className="ghost-text" style={{ fontSize: '28vw', position: 'absolute', right: '-2vw', bottom: '-4vw' }}>
          {client.initial}
        </span>
      </div>

      <div className="page-content">
        {/* Header */}
        <header
          className="px-6 py-4 sticky top-0 z-20"
          style={{
            background: 'rgba(8,11,20,0.85)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-xs transition-colors" style={{ color: '#484D6D' }}>
                ← Back
              </Link>
              <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
                style={{
                  background: `linear-gradient(135deg, ${client.color}22, ${client.color}44)`,
                  border: `1px solid ${client.color}44`,
                  color: client.color,
                }}
              >
                {client.initial}
              </div>
              <div>
                <p className="font-black text-sm tracking-tight" style={{ color: '#E8ECFF' }}>{client.name}</p>
                <p className="text-xs" style={{ color: '#484D6D' }}>{client.type} · Pre-Launch Brief</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Progress pill */}
              <span
                className="text-xs font-black px-3 py-1.5 rounded-full"
                style={allDone
                  ? { background: client.color + '18', color: client.color, border: `1px solid ${client.color}30` }
                  : { background: 'rgba(255,180,0,0.08)', color: '#F59E0B', border: '1px solid rgba(255,180,0,0.2)' }
                }
              >
                {allDone ? '✓ Ready to Launch' : `Pre-Launch ${progress}/${total}`}
              </span>

              {/* Tab bar */}
              <div
                className="flex gap-1 p-1 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {TABS.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setActiveTab(t.value)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={activeTab === t.value
                      ? { background: client.color + '18', color: client.color, border: `1px solid ${client.color}30` }
                      : { color: '#7B82A0', border: '1px solid transparent' }
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-8 py-10 space-y-6">
          {/* Page title */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: client.color }}>
              — {TABS.find(t => t.value === activeTab)?.label}
            </p>
            <h1 className="text-4xl font-black tracking-tight mb-2" style={{ color: '#E8ECFF' }}>
              {client.name}
            </h1>
            <p className="text-base" style={{ color: '#7B82A0' }}>
              {activeTab === 'overview' && 'Launch goals and pre-launch checklist.'}
              {activeTab === 'market' && 'Market size, trends, and where the money is.'}
              {activeTab === 'competitors' && 'Who you\'re up against and where their gaps are.'}
              {activeTab === 'angles' && 'Proven creative angles and hook variations ready to build.'}
              {activeTab === 'copy' && 'Ready-to-use ad copy. Click copy to grab it straight into Meta.'}
            </p>
          </div>

          {/* Tab content */}
          {activeTab === 'overview' && (
            <OverviewTab client={client} checked={checked} toggle={toggle} />
          )}
          {activeTab === 'market' && research && (
            <MarketTab data={research.market} color={client.color} />
          )}
          {activeTab === 'competitors' && research && (
            <CompetitorsTab data={research.competitors} />
          )}
          {activeTab === 'angles' && research && (
            <AnglesTab data={research.angles} color={client.color} />
          )}
          {activeTab === 'copy' && research && (
            <CopyTab data={research.copy} policyNote={research.policyNote} />
          )}
        </main>
      </div>
    </div>
  )
}
