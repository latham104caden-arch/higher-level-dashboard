'use client'

import { useState } from 'react'
import type { AdLibraryAd, AdLibraryResult } from '@/app/api/ad-library/route'

function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K'
  return n.toString()
}

function fmtDays(d: number): string {
  if (d >= 365) return Math.floor(d / 365) + 'y ' + (d % 365) + 'd'
  if (d >= 30) return Math.floor(d / 30) + 'mo'
  return d + 'd'
}

function AdCard({ ad }: { ad: AdLibraryAd }) {
  const [expanded, setExpanded] = useState(false)

  const runnerColor =
    ad.days_running >= 60 ? '#21D19F' :
    ad.days_running >= 30 ? '#45B69C' :
    ad.days_running >= 14 ? '#F59E0B' : '#A0A4B8'

  const hasImpressionsData = ad.impressions_upper > 0
  const hasSpendData = ad.spend_upper > 0

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        {/* Badges row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {ad.badges.map((b, i) => (
            <span key={i} className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: '#A0A4B8', border: '1px solid rgba(255,255,255,0.08)' }}>
              {b}
            </span>
          ))}
          <span className="text-xs ml-auto flex-shrink-0" style={{ color: runnerColor }}>
            Running {fmtDays(ad.days_running)}
          </span>
        </div>

        {/* Page name */}
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#484D6D' }}>{ad.page_name}</p>

        {/* Ad title */}
        {ad.title && (
          <p className="font-black text-sm mb-2" style={{ color: '#E8ECFF' }}>{ad.title}</p>
        )}

        {/* Ad body */}
        {ad.body && (
          <div className="relative">
            <p
              className="text-sm leading-relaxed"
              style={{
                color: '#7B82A0',
                display: '-webkit-box',
                WebkitLineClamp: expanded ? undefined : 3,
                WebkitBoxOrient: 'vertical',
                overflow: expanded ? 'visible' : 'hidden',
              }}
            >
              {ad.body}
            </p>
            {ad.body.length > 200 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs font-bold mt-1"
                style={{ color: '#21D19F' }}
              >
                {expanded ? 'Show less' : 'Read more →'}
              </button>
            )}
          </div>
        )}

        {/* Description */}
        {ad.description && (
          <p className="text-xs mt-2 leading-relaxed" style={{ color: '#484D6D' }}>{ad.description}</p>
        )}
      </div>

      {/* Stats + Actions */}
      <div
        className="px-5 py-3 flex items-center gap-4 flex-wrap"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
      >
        {/* Impressions */}
        {hasImpressionsData && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs" style={{ color: '#484D6D' }}>Reach</span>
            <span className="text-xs font-black" style={{ color: '#A0CFFF' }}>
              {fmtNum(ad.impressions_lower)}–{fmtNum(ad.impressions_upper)}
            </span>
          </div>
        )}

        {/* Spend */}
        {hasSpendData && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs" style={{ color: '#484D6D' }}>Spend</span>
            <span className="text-xs font-black" style={{ color: '#F59E0B' }}>
              ${fmtNum(ad.spend_lower)}–${fmtNum(ad.spend_upper)}
            </span>
          </div>
        )}

        {/* Duration bar */}
        <div className="flex items-center gap-1.5 flex-1">
          <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', maxWidth: 80 }}>
            <div
              className="h-1 rounded-full"
              style={{ width: `${Math.min((ad.days_running / 90) * 100, 100)}%`, background: runnerColor }}
            />
          </div>
          <span className="text-xs" style={{ color: runnerColor }}>{fmtDays(ad.days_running)}</span>
        </div>

        {/* View Ad */}
        {ad.snapshot_url && (
          <a
            href={ad.snapshot_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-black px-3 py-1.5 rounded-lg ml-auto flex-shrink-0 transition-all"
            style={{ background: 'rgba(33,209,159,0.1)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }}
          >
            View Ad →
          </a>
        )}
      </div>
    </div>
  )
}

type SortMode = 'relevance' | 'duration' | 'reach'

export default function AdLibraryTool() {
  const [brand, setBrand] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AdLibraryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sort, setSort] = useState<SortMode>('relevance')

  async function search() {
    if (!brand.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/ad-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: brand.trim() }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (e: any) {
      setError(e.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const QUICK_SEARCHES = ['Hydra Hydration', 'Athletic Greens', 'Liquid IV', 'LMNT', 'Nuun']

  const sorted = result
    ? [...result.ads].sort((a, b) => {
        if (sort === 'duration') return b.days_running - a.days_running
        if (sort === 'reach') return b.impressions_upper - a.impressions_upper
        return b.relevance_score - a.relevance_score
      })
    : []

  const longRunners = sorted.filter(a => a.days_running >= 30).length
  const avgDays = sorted.length > 0 ? Math.round(sorted.reduce((s, a) => s + a.days_running, 0) / sorted.length) : 0

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-sm font-bold mb-3" style={{ color: '#E8ECFF' }}>Search any brand on Meta Ad Library</p>
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            value={brand}
            onChange={e => setBrand(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="e.g. Liquid IV, LMNT, Shine Bright..."
            className="flex-1 px-4 py-3 rounded-xl text-sm font-bold outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#E8ECFF' }}
          />
          <button
            onClick={search}
            disabled={loading || !brand.trim()}
            className="px-6 py-3 rounded-xl text-sm font-black transition-all flex-shrink-0"
            style={{
              background: 'rgba(33,209,159,0.12)',
              border: '1px solid rgba(33,209,159,0.3)',
              color: '#21D19F',
              opacity: !brand.trim() ? 0.4 : 1,
              cursor: loading || !brand.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Searching…' : 'Search →'}
          </button>
        </div>

        {/* Quick searches */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs" style={{ color: '#484D6D' }}>Quick:</span>
          {QUICK_SEARCHES.map(q => (
            <button
              key={q}
              onClick={() => { setBrand(q); }}
              className="text-xs px-2.5 py-1 rounded-lg font-bold transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#7B82A0', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl p-10 flex flex-col items-center gap-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-1 rounded-full w-3/5" style={{ background: 'linear-gradient(90deg, #21D19F, #45B69C)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          </div>
          <p className="text-xs" style={{ color: '#484D6D' }}>Searching Meta Ad Library for active ads…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl p-6" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <p className="font-bold text-sm" style={{ color: '#EF4444' }}>⚠ Search failed</p>
          <p className="text-xs mt-1" style={{ color: '#7B82A0' }}>{error}</p>
          {error.toLowerCase().includes('token') || error.toLowerCase().includes('session') || error.toLowerCase().includes('expired') ? (
            <p className="text-xs mt-2 font-bold" style={{ color: '#F59E0B' }}>
              The Meta access token is expired. Refresh it in Meta Business Suite → System Users → Generate Token, then update META_ACCESS_TOKEN in Railway environment variables.
            </p>
          ) : null}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-5">
          {/* Summary bar */}
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <p className="text-xs" style={{ color: '#484D6D' }}>Active ads found</p>
              <p className="text-2xl font-black" style={{ color: '#E8ECFF' }}>{result.total_found}</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: '#484D6D' }}>Showing (ranked)</p>
              <p className="text-2xl font-black" style={{ color: '#21D19F' }}>{sorted.length}</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: '#484D6D' }}>30+ day runners</p>
              <p className="text-2xl font-black" style={{ color: '#45B69C' }}>{longRunners}</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: '#484D6D' }}>Avg. run time</p>
              <p className="text-2xl font-black" style={{ color: '#F59E0B' }}>{fmtDays(avgDays)}</p>
            </div>

            {/* Sort */}
            <div className="ml-auto flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {([['relevance', '⚡ Relevant'], ['duration', '🏆 Longest'], ['reach', '📈 Most Reach']] as [SortMode, string][]).map(([mode, label]) => (
                <button
                  key={mode}
                  onClick={() => setSort(mode)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={sort === mode
                    ? { background: 'rgba(33,209,159,0.12)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }
                    : { color: '#7B82A0', border: '1px solid transparent' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Insight callout */}
          {longRunners > 0 && (
            <div className="rounded-xl px-5 py-4" style={{ background: 'rgba(33,209,159,0.04)', border: '1px solid rgba(33,209,159,0.12)' }}>
              <p className="text-xs font-bold" style={{ color: '#21D19F' }}>
                🏆 {longRunners} ad{longRunners > 1 ? 's have' : ' has'} been running 30+ days — these are proven winners.
                {longRunners > 0 && ' The angle, offer, and hook in these ads are working. Study them first.'}
              </p>
            </div>
          )}

          {/* Ad grid */}
          {sorted.length === 0 ? (
            <div className="rounded-2xl p-10 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="font-black text-sm mb-1" style={{ color: '#E8ECFF' }}>No active ads found</p>
              <p className="text-xs" style={{ color: '#7B82A0' }}>
                This brand may not be running Meta ads, or the search term didn't match their page name. Try their exact brand name.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sorted.map(ad => <AdCard key={ad.id} ad={ad} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
