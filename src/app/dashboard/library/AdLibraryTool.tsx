'use client'

import { useState } from 'react'

// ─── Competitor presets per client ───────────────────────────────────────────
const CLIENT_INTEL = [
  {
    client: 'Hydra Hydration',
    color: '#21D19F',
    emoji: '💧',
    competitors: ['Liquid IV', 'LMNT', 'Athletic Greens', 'Nuun', 'DripDrop', 'Pedialyte', 'Electrolit'],
  },
  {
    client: 'Shine Bright Window Cleaning',
    color: '#A0CFFF',
    emoji: '🪟',
    competitors: ['Fish Window Cleaning', 'Window Genie', 'Squeegee Squad', 'Clear Choice'],
  },
]

// ─── Filter presets ───────────────────────────────────────────────────────────
type Country = 'US' | 'CA' | 'GB' | 'AU'
type AdType = 'ALL' | 'IMAGE' | 'VIDEO' | 'MEME'
type ActiveStatus = 'active' | 'inactive' | 'all'

function buildUrl(
  brand: string,
  country: Country = 'US',
  adType: AdType = 'ALL',
  status: ActiveStatus = 'active',
) {
  const base = 'https://www.facebook.com/ads/library/'
  const params = new URLSearchParams({
    active_status: status,
    ad_type: adType,
    country,
    q: brand,
    search_type: 'keyword_unordered',
  })
  return `${base}?${params}`
}

// ─── Chip component ───────────────────────────────────────────────────────────
function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
      style={
        active
          ? { background: 'rgba(33,209,159,0.14)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.25)' }
          : { background: 'rgba(255,255,255,0.04)', color: '#7B82A0', border: '1px solid rgba(255,255,255,0.08)' }
      }
    >
      {label}
    </button>
  )
}

// ─── Launch button ────────────────────────────────────────────────────────────
function LaunchButton({ href, label, sub }: { href: string; label: string; sub?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-0.5 px-4 py-3 rounded-xl transition-all group"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <span className="text-xs font-black group-hover:text-white transition-colors" style={{ color: '#E8ECFF' }}>
        {label} →
      </span>
      {sub && <span className="text-xs" style={{ color: '#484D6D' }}>{sub}</span>}
    </a>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdLibraryTool() {
  const [brand, setBrand] = useState('')
  const [country, setCountry] = useState<Country>('US')
  const [activeTab, setActiveTab] = useState<'search' | 'clients'>('search')

  const trimmed = brand.trim()

  const QUICK_BRANDS = ['Liquid IV', 'LMNT', 'Athletic Greens', 'Nuun', 'Hims', 'Purple', 'Grammarly']
  const COUNTRIES: Country[] = ['US', 'CA', 'GB', 'AU']
  const COUNTRY_LABELS: Record<Country, string> = { US: '🇺🇸 US', CA: '🇨🇦 CA', GB: '🇬🇧 UK', AU: '🇦🇺 AU' }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {(['search', 'clients'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-2 rounded-lg text-xs font-black transition-all capitalize"
            style={
              activeTab === tab
                ? { background: 'rgba(33,209,159,0.12)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }
                : { color: '#7B82A0', border: '1px solid transparent' }
            }
          >
            {tab === 'search' ? '🔍 Brand Search' : '🎯 Client Intel'}
          </button>
        ))}
      </div>

      {/* ── SEARCH TAB ── */}
      {activeTab === 'search' && (
        <div className="space-y-5">
          {/* Search card */}
          <div
            className="rounded-2xl p-6 space-y-4"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div>
              <p className="text-sm font-black mb-1" style={{ color: '#E8ECFF' }}>Search any brand</p>
              <p className="text-xs" style={{ color: '#7B82A0' }}>
                Type a brand name, pick your filters, and launch straight into Meta Ad Library with everything pre-filled.
              </p>
            </div>

            {/* Input row */}
            <div className="flex gap-3">
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && trimmed) {
                    window.open(buildUrl(trimmed, country), '_blank')
                  }
                }}
                placeholder="e.g. Liquid IV, LMNT, Shine Bright..."
                className="flex-1 px-4 py-3 rounded-xl text-sm font-bold outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#E8ECFF',
                }}
              />
            </div>

            {/* Country filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold" style={{ color: '#484D6D' }}>Country:</span>
              {COUNTRIES.map(c => (
                <Chip
                  key={c}
                  label={COUNTRY_LABELS[c]}
                  active={country === c}
                  onClick={() => setCountry(c)}
                />
              ))}
            </div>

            {/* Quick brands */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold" style={{ color: '#484D6D' }}>Quick:</span>
              {QUICK_BRANDS.map(q => (
                <button
                  key={q}
                  onClick={() => setBrand(q)}
                  className="text-xs px-2.5 py-1 rounded-lg font-bold transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', color: '#7B82A0', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Launch options — only show when there's a brand */}
          {trimmed && (
            <div
              className="rounded-2xl p-6 space-y-4"
              style={{ background: 'rgba(33,209,159,0.04)', border: '1px solid rgba(33,209,159,0.15)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-black" style={{ color: '#21D19F' }}>
                  Research "{trimmed}"
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(33,209,159,0.12)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }}>
                  {COUNTRY_LABELS[country]}
                </span>
              </div>

              {/* Primary CTA */}
              <a
                href={buildUrl(trimmed, country, 'ALL', 'active')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-5 py-4 rounded-xl font-black text-sm transition-all"
                style={{ background: 'rgba(33,209,159,0.12)', border: '1px solid rgba(33,209,159,0.3)', color: '#21D19F' }}
              >
                <span>Open All Active Ads for "{trimmed}"</span>
                <span>→</span>
              </a>

              {/* Specific launch options */}
              <div className="grid grid-cols-2 gap-3">
                <LaunchButton
                  href={buildUrl(trimmed, country, 'VIDEO', 'active')}
                  label="Video Ads Only"
                  sub="See what video hooks are running"
                />
                <LaunchButton
                  href={buildUrl(trimmed, country, 'IMAGE', 'active')}
                  label="Image / Static Ads"
                  sub="Browse static creative"
                />
                <LaunchButton
                  href={buildUrl(trimmed, country, 'ALL', 'inactive')}
                  label="Inactive / Past Ads"
                  sub="See what they killed"
                />
                <LaunchButton
                  href={buildUrl(trimmed, country, 'ALL', 'all')}
                  label="All Ads (Active + Past)"
                  sub="Full history"
                />
              </div>

              {/* Multi-country row */}
              <div>
                <p className="text-xs font-bold mb-2" style={{ color: '#484D6D' }}>Same search, other markets:</p>
                <div className="flex gap-2 flex-wrap">
                  {COUNTRIES.filter(c => c !== country).map(c => (
                    <a
                      key={c}
                      href={buildUrl(trimmed, c, 'ALL', 'active')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-lg font-bold transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', color: '#7B82A0', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      {COUNTRY_LABELS[c]} →
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Strategy tip */}
          <div
            className="rounded-2xl px-5 py-4"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="text-xs font-black mb-2" style={{ color: '#484D6D' }}>📌 What to look for</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: 'Ads running 30+ days', tip: "If it's still live, it's converting. That angle works." },
                { label: 'Hook in the first 3 seconds', tip: 'Note the opening line. That\'s what stopped the scroll.' },
                { label: 'Offer structure', tip: 'Price point, CTA, discount — copy what\'s proven, not what sounds clever.' },
              ].map(({ label, tip }) => (
                <div key={label} className="space-y-1">
                  <p className="text-xs font-black" style={{ color: '#7B82A0' }}>{label}</p>
                  <p className="text-xs" style={{ color: '#484D6D' }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CLIENT INTEL TAB ── */}
      {activeTab === 'clients' && (
        <div className="space-y-5">
          {CLIENT_INTEL.map(({ client, color, emoji, competitors }) => (
            <div
              key={client}
              className="rounded-2xl p-6 space-y-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color }}>
                  {emoji} {client}
                </p>
                <p className="text-xs" style={{ color: '#484D6D' }}>
                  One-click competitor ad research — opens Meta Ad Library pre-filtered
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {competitors.map(comp => (
                  <div
                    key={comp}
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="text-sm font-black" style={{ color: '#E8ECFF' }}>{comp}</span>
                    <div className="flex gap-2">
                      <a
                        href={buildUrl(comp, 'US', 'ALL', 'active')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2.5 py-1 rounded-lg font-bold transition-all"
                        style={{ background: 'rgba(33,209,159,0.1)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }}
                      >
                        Active →
                      </a>
                      <a
                        href={buildUrl(comp, 'US', 'VIDEO', 'active')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2.5 py-1 rounded-lg font-bold transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', color: '#7B82A0', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        Video →
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Full competitor comparison */}
              <a
                href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=${encodeURIComponent(competitors[0])}&search_type=keyword_unordered`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold"
                style={{ color: '#484D6D', textDecoration: 'underline' }}
              >
                Start with top competitor: {competitors[0]} →
              </a>
            </div>
          ))}

          {/* Tip */}
          <div
            className="rounded-2xl px-5 py-4"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="text-xs font-black mb-1" style={{ color: '#484D6D' }}>💡 Research workflow</p>
            <p className="text-xs leading-relaxed" style={{ color: '#484D6D' }}>
              Check each competitor, filter by Video, sort by longest running in the Meta Ad Library interface.
              Ads still live after 30+ days are profitable. Use those hooks, angles, and offers as inspiration — not copying.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
