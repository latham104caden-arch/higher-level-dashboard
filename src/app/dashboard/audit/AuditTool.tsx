'use client'

import { useState } from 'react'
import type { AuditResult, Finding, BusinessType } from '@/app/api/audit/route'

const TYPE_CONFIG: Record<BusinessType, { label: string; emoji: string; color: string; desc: string }> = {
  ecommerce: { label: 'Ecommerce', emoji: '🛒', color: '#21D19F', desc: 'Product page, ATC, checkout, deals & offers' },
  service:   { label: 'Local Service', emoji: '🔧', color: '#A0CFFF', desc: 'Lead form quality, local trust, response speed' },
  saas:      { label: 'SaaS / Software', emoji: '💻', color: '#A78BFA', desc: 'Trial CTA, pricing clarity, demo flow' },
  unknown:   { label: 'General', emoji: '🌐', color: '#A0A4B8', desc: 'General website audit' },
}

const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  speed:       { emoji: '⚡', color: '#A0CFFF' },
  seo:         { emoji: '🔍', color: '#45B69C' },
  conversion:  { emoji: '🎯', color: '#21D19F' },
  trust:       { emoji: '🛡️', color: '#F59E0B' },
  tracking:    { emoji: '📡', color: '#A78BFA' },
  adReadiness: { emoji: '🚀', color: '#F97316' },
}

function ScoreRing({ score, grade, color }: { score: number; grade: string; color: string }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div className="relative flex items-center justify-center" style={{ width: 148, height: 148 }}>
      <svg width="148" height="148" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx="74" cy="74" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
        <circle
          cx="74" cy="74" r={r} fill="none"
          stroke={color} strokeWidth="9"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s ease' }}
        />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className="text-5xl font-black leading-none" style={{ color }}>{grade}</span>
        <span className="text-xs font-bold mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{score}/100</span>
      </div>
    </div>
  )
}

function FindingRow({ f, color }: { f: Finding; color: string }) {
  const statusStyle =
    f.status === 'pass'
      ? { bg: 'rgba(33,209,159,0.1)', color: '#21D19F', icon: '✓' }
      : f.status === 'warn'
      ? { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', icon: '⚠' }
      : { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', icon: '✗' }

  return (
    <div className="px-5 py-4 flex items-start gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span
        className="text-xs font-black w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: statusStyle.bg, color: statusStyle.color }}
      >
        {statusStyle.icon}
      </span>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-sm font-bold" style={{ color: '#E8ECFF' }}>{f.label}</p>
          <span className="text-xs font-bold ml-3 flex-shrink-0" style={{ color: f.points === f.maxPoints ? color : f.points > 0 ? '#F59E0B' : '#EF4444' }}>
            {f.points}/{f.maxPoints}
          </span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: '#7B82A0' }}>{f.detail}</p>
        <div className="mt-1.5 flex gap-0.5">
          {Array.from({ length: f.maxPoints }).map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full"
              style={{ background: i < f.points ? color : 'rgba(255,255,255,0.08)', maxWidth: 8 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function CategoryCard({
  categoryKey, score, label, description, findings, expanded, onToggle,
}: {
  categoryKey: string; score: number; label: string; description: string; findings: Finding[]; expanded: boolean; onToggle: () => void
}) {
  const { emoji, color } = CATEGORY_META[categoryKey] || { emoji: '📊', color: '#A0A4B8' }
  const passes = findings.filter(f => f.status === 'pass').length
  const fails = findings.filter(f => f.status === 'fail').length
  const warns = findings.filter(f => f.status === 'warn').length

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="p-5 flex items-center gap-4 cursor-pointer" onClick={onToggle}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>{label}</p>
          </div>
          <p className="text-xs mb-2" style={{ color: '#484D6D' }}>{description}</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }} />
            </div>
            <span className="text-sm font-black flex-shrink-0" style={{ color }}>{score}</span>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            {passes > 0 && <span className="text-xs" style={{ color: '#21D19F' }}>✓ {passes} pass</span>}
            {warns > 0 && <span className="text-xs" style={{ color: '#F59E0B' }}>⚠ {warns} warn</span>}
            {fails > 0 && <span className="text-xs" style={{ color: '#EF4444' }}>✗ {fails} fail</span>}
          </div>
        </div>
        <span style={{ color: '#2A2F4A', fontSize: 11 }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {findings.map((f, i) => <FindingRow key={i} f={f} color={color} />)}
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

  const typeConf = result ? TYPE_CONFIG[result.businessType] : null

  return (
    <div className="space-y-8">
      {/* URL Input */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-sm font-bold mb-3" style={{ color: '#E8ECFF' }}>Enter a website or landing page URL</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && runAudit()}
            placeholder="https://thehydrashop.com"
            className="flex-1 px-4 py-3 rounded-xl text-sm font-bold outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#E8ECFF' }}
          />
          <button
            onClick={runAudit}
            disabled={loading || !url.trim()}
            className="px-6 py-3 rounded-xl text-sm font-black transition-all"
            style={{
              background: 'rgba(33,209,159,0.12)',
              border: '1px solid rgba(33,209,159,0.3)',
              color: '#21D19F',
              opacity: !url.trim() ? 0.4 : 1,
              cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Auditing…' : 'Audit Site →'}
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: '#484D6D' }}>
          Auto-detects business type (Ecommerce / Service / SaaS) and runs a tailored audit. Takes 10–20 seconds.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl p-10 flex flex-col items-center gap-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            {['Fetching page', 'Detecting business type', 'Analyzing HTML', 'Running PageSpeed', 'Scoring'].map((step, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {i > 0 && <span style={{ color: '#2A2F4A' }}>→</span>}
                <span className="text-xs" style={{ color: '#484D6D' }}>{step}</span>
              </div>
            ))}
          </div>
          <div className="w-64 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-1 rounded-full w-3/5" style={{ background: 'linear-gradient(90deg, #21D19F, #45B69C)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          </div>
          <p className="text-xs" style={{ color: '#484D6D' }}>Checking PageSpeed API — takes 10–20 seconds</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl p-6" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <p className="font-bold text-sm" style={{ color: '#EF4444' }}>⚠ Audit failed</p>
          <p className="text-xs mt-1" style={{ color: '#7B82A0' }}>{error}</p>
        </div>
      )}

      {/* Results */}
      {result && typeConf && (
        <div className="space-y-6">

          {/* Business Type + Overall Score */}
          <div className="rounded-2xl p-8 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full blur-3xl opacity-8" style={{ background: result.gradeColor }} />

            {/* Type badge */}
            <div className="flex items-center gap-2 mb-6 relative">
              <span
                className="text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-2"
                style={{ background: `${typeConf.color}15`, color: typeConf.color, border: `1px solid ${typeConf.color}30` }}
              >
                {typeConf.emoji} {typeConf.label} Detected
              </span>
              <span className="text-xs" style={{ color: '#484D6D' }}>{result.businessTypeConfidence} · {typeConf.desc}</span>
            </div>

            <div className="flex items-center gap-8 relative">
              <ScoreRing score={result.scores.overall} grade={result.grade} color={result.gradeColor} />
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#484D6D' }}>Overall Score</p>
                <h2 className="text-xl font-black mb-0.5 truncate" style={{ color: '#E8ECFF' }}>{result.pageTitle}</h2>
                <p className="text-xs mb-4 truncate" style={{ color: '#484D6D' }}>{result.url}</p>
                <div className="grid grid-cols-3 gap-3">
                  {categoryOrder.map(key => {
                    const cat = result.categories[key]
                    const meta = CATEGORY_META[key]
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-sm flex-shrink-0">{meta.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs truncate" style={{ color: '#7B82A0' }}>{cat.label}</span>
                            <span className="text-xs font-black ml-1 flex-shrink-0" style={{ color: meta.color }}>{cat.score}</span>
                          </div>
                          <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-1 rounded-full transition-all duration-700" style={{ width: `${cat.score}%`, background: meta.color }} />
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
            <div className="rounded-2xl p-7" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}>
              <p className="font-black text-sm mb-4" style={{ color: '#EF4444' }}>🔥 Priority Fixes — Ranked by Impact</p>
              <div className="space-y-4">
                {result.topFixes.map((fix, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className="text-xs font-black w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: fix.priority === 1 ? 'rgba(239,68,68,0.2)' : fix.priority === 2 ? 'rgba(245,158,11,0.15)' : 'rgba(160,164,184,0.1)',
                        color: fix.priority === 1 ? '#EF4444' : fix.priority === 2 ? '#F59E0B' : '#A0A4B8',
                      }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-black" style={{ color: '#E8ECFF' }}>{fix.fix}</p>
                      <p className="text-xs leading-relaxed mt-0.5" style={{ color: '#7B82A0' }}>{fix.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Breakdown */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#484D6D' }}>
              {typeConf.label} Audit — Category Breakdown
            </p>
            <div className="space-y-3">
              {categoryOrder.map(key => (
                <CategoryCard
                  key={key}
                  categoryKey={key}
                  score={result.categories[key].score}
                  label={result.categories[key].label}
                  description={result.categories[key].description}
                  findings={result.categories[key].findings}
                  expanded={expanded === key}
                  onToggle={() => setExpanded(expanded === key ? null : key)}
                />
              ))}
            </div>
          </div>

          {/* Ad Impact Callout */}
          <div className="rounded-2xl p-7" style={{ background: 'rgba(33,209,159,0.04)', border: '1px solid rgba(33,209,159,0.12)' }}>
            <p className="font-black text-sm mb-3" style={{ color: '#21D19F' }}>
              🚀 Should You Run Ads to This {typeConf.label} Site?
            </p>
            {result.scores.adReadiness >= 80 ? (
              <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>
                <span style={{ color: '#21D19F', fontWeight: 700 }}>Yes — this site is ad-ready.</span>{' '}
                {result.businessType === 'ecommerce' && 'Pixel is installed, product page has deals and trust signals, and checkout is set up to convert. Scale spend confidently.'}
                {result.businessType === 'service' && 'Pixel is installed, the form is simple, and trust signals are strong. Cold ad traffic should convert well here.'}
                {result.businessType === 'saas' && 'Pixel is installed, there\'s a clear trial offer, and the page builds credibility. Ready for paid traffic.'}
                {result.businessType === 'unknown' && 'Core requirements are in place. Run traffic and watch the data.'}
              </p>
            ) : result.scores.adReadiness >= 60 ? (
              <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>
                <span style={{ color: '#F59E0B', fontWeight: 700 }}>Run ads carefully — fix the priority issues first.</span>{' '}
                {result.businessType === 'ecommerce' && 'The page can convert but is leaving money on the table. Fix the top issues (deals, reviews, trust badges) and you\'ll see ROAS improve immediately.'}
                {result.businessType === 'service' && 'The page will get some leads but gaps in trust or form quality are causing drop-off. Fix before scaling spend.'}
                {result.businessType === 'saas' && 'The page has a CTA but gaps in proof or trial clarity will hurt conversion rates. Fix before scaling.'}
                {result.businessType === 'unknown' && 'Some gaps exist. Fix the priority issues before scaling spend.'}
              </p>
            ) : (
              <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>
                <span style={{ color: '#EF4444', fontWeight: 700 }}>Don&apos;t run ads to this page yet.</span>{' '}
                {result.businessType === 'ecommerce' && 'Critical gaps (pixel, deals, or trust) will cause poor ROAS. Every dollar spent now is wasted. Fix the Priority Fixes first.'}
                {result.businessType === 'service' && 'No pixel, no form, or no trust signals means ad traffic bounces with zero conversions. Fix this before spending a dollar.'}
                {result.businessType === 'saas' && 'Missing pixel, trial offer, or trust signals will result in near-zero conversion from paid traffic.'}
                {result.businessType === 'unknown' && 'Too many critical gaps. Fix Priority Fixes before running any ad traffic.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
