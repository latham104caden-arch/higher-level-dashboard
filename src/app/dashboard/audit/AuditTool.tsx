'use client'

import { useState } from 'react'
import type { AuditResult, Finding } from '@/app/api/audit/route'

const CATEGORY_META: Record<string, { emoji: string; weight: string; color: string }> = {
  speed:       { emoji: '⚡', weight: '20%', color: '#A0CFFF' },
  seo:         { emoji: '🔍', weight: '15%', color: '#45B69C' },
  conversion:  { emoji: '🎯', weight: '25%', color: '#21D19F' },
  trust:       { emoji: '🛡️', weight: '20%', color: '#F59E0B' },
  tracking:    { emoji: '📡', weight: '10%', color: '#A78BFA' },
  adReadiness: { emoji: '🚀', weight: '10%', color: '#F97316' },
}

function ScoreRing({ score, grade, color }: { score: number; grade: string; color: string }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
      <svg width="160" height="160" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="80" cy="80" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className="text-5xl font-black" style={{ color }}>{grade}</span>
        <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{score}/100</span>
      </div>
    </div>
  )
}

function CategoryCard({
  categoryKey,
  score,
  label,
  findings,
  expanded,
  onToggle,
}: {
  categoryKey: string
  score: number
  label: string
  findings: Finding[]
  expanded: boolean
  onToggle: () => void
}) {
  const meta = CATEGORY_META[categoryKey]
  const { color, emoji, weight } = meta
  const passes = findings.filter(f => f.status === 'pass').length
  const fails = findings.filter(f => f.status === 'fail').length
  const warns = findings.filter(f => f.status === 'warn').length

  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      onClick={onToggle}
    >
      <div className="p-5 flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>{label}</p>
            <span className="text-xs" style={{ color: '#484D6D' }}>{weight} weight</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }}
              />
            </div>
            <span className="text-sm font-black" style={{ color }}>{score}</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            {passes > 0 && <span className="text-xs" style={{ color: '#21D19F' }}>✓ {passes} pass</span>}
            {warns > 0 && <span className="text-xs" style={{ color: '#F59E0B' }}>⚠ {warns} warn</span>}
            {fails > 0 && <span className="text-xs" style={{ color: '#EF4444' }}>✗ {fails} fail</span>}
          </div>
        </div>
        <div style={{ color: '#484D6D', fontSize: 12 }}>{expanded ? '▲' : '▼'}</div>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {findings.map((f, i) => (
            <div
              key={i}
              className="px-5 py-4 flex items-start gap-3"
              style={{ borderBottom: i < findings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : undefined }}
            >
              <span
                className="text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                style={
                  f.status === 'pass'
                    ? { background: 'rgba(33,209,159,0.1)', color: '#21D19F' }
                    : f.status === 'warn'
                    ? { background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }
                    : { background: 'rgba(239,68,68,0.1)', color: '#EF4444' }
                }
              >
                {f.status === 'pass' ? '✓' : f.status === 'warn' ? '⚠' : '✗'}
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold mb-0.5" style={{ color: '#E8ECFF' }}>{f.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#7B82A0' }}>{f.detail}</p>
                <div className="mt-1.5 flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {Array.from({ length: f.maxPoints / 5 }).map((_, j) => (
                      <div
                        key={j}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: j < f.points / 5 ? color : 'rgba(255,255,255,0.1)' }}
                      />
                    ))}
                  </div>
                  <span className="text-xs ml-1" style={{ color: '#484D6D' }}>{f.points}/{f.maxPoints} pts</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AuditTool() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AuditResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>('conversion')

  async function runAudit() {
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
      setExpanded('conversion')
    } catch (e: any) {
      setError(e.message || 'Audit failed. Check the URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  const categoryOrder = ['conversion', 'trust', 'speed', 'seo', 'tracking', 'adReadiness'] as const

  return (
    <div className="space-y-8">
      {/* URL Input */}
      <div
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <p className="text-sm font-bold mb-3" style={{ color: '#E8ECFF' }}>Enter a website or landing page URL</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && runAudit()}
            placeholder="https://thehydrashop.com"
            className="flex-1 px-4 py-3 rounded-xl text-sm font-bold outline-none"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#E8ECFF',
            }}
          />
          <button
            onClick={runAudit}
            disabled={loading || !url.trim()}
            className="px-6 py-3 rounded-xl text-sm font-black transition-all"
            style={{
              background: loading ? 'rgba(33,209,159,0.1)' : 'rgba(33,209,159,0.15)',
              border: '1px solid rgba(33,209,159,0.3)',
              color: '#21D19F',
              opacity: !url.trim() ? 0.5 : 1,
              cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Auditing…' : 'Audit Site'}
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: '#484D6D' }}>
          Analyzes speed, SEO, conversion setup, trust signals, tracking, and ad readiness. Takes 10–20 seconds.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div
          className="rounded-2xl p-10 flex flex-col items-center gap-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex gap-1.5">
            {['Fetching page…', 'Analyzing HTML…', 'Running speed test…', 'Scoring…'].map((step, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: '#484D6D' }}>
                {i > 0 && <span style={{ color: '#2A2F4A' }}>→</span>}
                <span>{step}</span>
              </div>
            ))}
          </div>
          <div className="w-64 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-1 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #21D19F, #45B69C)',
                animation: 'pulse 1.5s ease-in-out infinite',
                width: '60%',
              }}
            />
          </div>
          <p className="text-xs" style={{ color: '#484D6D' }}>This takes 10–20 seconds while we check your PageSpeed score</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="rounded-2xl p-6"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <p className="font-bold text-sm" style={{ color: '#EF4444' }}>⚠ Audit failed</p>
          <p className="text-xs mt-1" style={{ color: '#7B82A0' }}>{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div
            className="rounded-2xl p-8 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-10"
              style={{ background: result.gradeColor }}
            />
            <div className="flex items-center gap-8 relative">
              <ScoreRing score={result.scores.overall} grade={result.grade} color={result.gradeColor} />
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#484D6D' }}>Overall Score</p>
                <h2 className="text-2xl font-black mb-1" style={{ color: '#E8ECFF' }}>
                  {result.pageTitle}
                </h2>
                <p className="text-sm mb-4" style={{ color: '#7B82A0' }}>{result.url}</p>
                <div className="grid grid-cols-3 gap-4">
                  {categoryOrder.map(key => {
                    const cat = result.categories[key]
                    const meta = CATEGORY_META[key]
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-sm">{meta.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs" style={{ color: '#7B82A0' }}>{cat.label}</span>
                            <span className="text-xs font-black" style={{ color: meta.color }}>{cat.score}</span>
                          </div>
                          <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div
                              className="h-1 rounded-full"
                              style={{ width: `${cat.score}%`, background: meta.color }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Priority Fixes */}
          {result.topFixes.length > 0 && (
            <div
              className="rounded-2xl p-7"
              style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}
            >
              <p className="font-black text-sm mb-4" style={{ color: '#EF4444' }}>🔥 Priority Fixes — Highest Impact</p>
              <div className="space-y-3">
                {result.topFixes.map((fix, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className="text-xs font-black w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: fix.priority === 1 ? 'rgba(239,68,68,0.15)' : fix.priority === 2 ? 'rgba(245,158,11,0.15)' : 'rgba(160,164,184,0.1)',
                        color: fix.priority === 1 ? '#EF4444' : fix.priority === 2 ? '#F59E0B' : '#A0A4B8',
                      }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#E8ECFF' }}>{fix.fix}</p>
                      <p className="text-xs leading-relaxed mt-0.5" style={{ color: '#7B82A0' }}>{fix.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Breakdown */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#484D6D' }}>Category Breakdown</p>
            <div className="space-y-3">
              {categoryOrder.map(key => (
                <CategoryCard
                  key={key}
                  categoryKey={key}
                  score={result.categories[key].score}
                  label={result.categories[key].label}
                  findings={result.categories[key].findings}
                  expanded={expanded === key}
                  onToggle={() => setExpanded(expanded === key ? null : key)}
                />
              ))}
            </div>
          </div>

          {/* Ad Impact Callout */}
          <div
            className="rounded-2xl p-7"
            style={{ background: 'rgba(33,209,159,0.04)', border: '1px solid rgba(33,209,159,0.12)' }}
          >
            <p className="font-black text-sm mb-3" style={{ color: '#21D19F' }}>🚀 What This Means for Your Ads</p>
            {result.scores.adReadiness >= 80 ? (
              <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>
                This site is <span style={{ color: '#21D19F', fontWeight: 700 }}>ad-ready</span>. Meta Pixel is installed, load speed is solid, and there's a clear CTA. Your ad budget will convert efficiently here.
              </p>
            ) : result.scores.adReadiness >= 60 ? (
              <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>
                This site is <span style={{ color: '#F59E0B', fontWeight: 700 }}>partially ready for ads</span>. Fix the priority issues above before scaling spend — especially tracking and CTA. Budget spent on a leaky funnel is budget wasted.
              </p>
            ) : (
              <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>
                <span style={{ color: '#EF4444', fontWeight: 700 }}>Don't run ads to this page yet.</span> Critical gaps (pixel, SSL, or CTA) will cause poor results. Fix the Priority Fixes above first — the difference in ROAS will be dramatic.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
