'use client'

import { useState, useEffect } from 'react'
import type { CreatorAdsResponse, CreatorAdStat } from '@/app/api/creator/ads/route'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt$(n: number) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
function fmtR(n: number) { return n.toFixed(2) + 'x' }
function fmtPct(n: number) { return n.toFixed(2) + '%' }

const TIER_CONFIG = {
  winner:   { label: '🏆 Winner',   bg: 'rgba(33,209,159,0.12)',  border: 'rgba(33,209,159,0.25)',  color: '#21D19F' },
  solid:    { label: '✅ Solid',    bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.25)',  color: '#60A5FA' },
  learning: { label: '📊 Learning', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)',  color: '#FBB724' },
  weak:     { label: '⚠ Needs Work',bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)',    color: '#EF4444' },
}

// ─── Script templates ─────────────────────────────────────────────────────────
const SCRIPTS = [
  {
    angle: 'Problem → Solution',
    hook: "I used to feel exhausted after every workout. Turns out I was just chronically dehydrated.",
    body: "I started using [PRODUCT] and within a week I noticed the difference. No crash, no bloat — just actual energy. It's got 200mg of electrolytes and zero sugar. I take one every single morning now.",
    cta: "Link in bio if you want to try it. They have a Subscribe & Save that saves you 20%.",
    why: 'Relatability hook → solution → proof → offer. Longest-running ad format for health products.',
  },
  {
    angle: 'Reaction / Surprise',
    hook: "I was NOT expecting this to actually work.",
    body: "My friend kept pushing these [PRODUCT] on me and I finally caved. Day three, I'm running a 5K and I feel like I took a cheat code. No artificial dyes, no sweeteners — just clean electrolytes. It tastes good too which shocked me.",
    cta: "If you're an athlete or you just move a lot, check these out.",
    why: 'Skepticism → conversion is extremely high-CTR. Feels authentic, not salesy.',
  },
  {
    angle: 'Day in the Life',
    hook: "Here's my actual morning routine — and the one thing I never skip.",
    body: "Wake up, drink water with a [PRODUCT] drop before anything else. It's a sea mineral electrolyte — sounds weird but it works. Less caffeine crashes, better focus, better workouts. I've been doing this for 2 months.",
    cta: "Grab a pack at thehydrashop.com. They ship fast.",
    why: 'Lifestyle integration feels natural — builds trust and product desire simultaneously.',
  },
  {
    angle: 'Compare & Contrast',
    hook: "Liquid IV, LMNT, or [PRODUCT]? I tested all three.",
    body: "LMNT is salty and has 1000mg sodium — that's a lot. Liquid IV has added sugar. [PRODUCT] has none of that. 200mg electrolytes, zero sugar, zero dyes, clean ingredients. And it's cheaper per serving.",
    cta: "I switched. Link below.",
    why: 'Competitor comparison ads outperform single-brand ads by 30%+ CTR. Pre-sold skeptics convert better.',
  },
  {
    angle: 'For a Specific Person',
    hook: "If you're on Ozempic or GLP-1 meds, this is specifically for you.",
    body: "These meds can tank your electrolytes. I've been adding [PRODUCT] drops to my water and it's made a real difference in how I feel day to day. No sugar, no additives, nothing that interferes. Just clean hydration support.",
    cta: "They're called Hydra Drops. Check the link.",
    why: 'Hyper-targeted hooks outperform broad hooks. Smaller audience, much higher intent and conversion.',
  },
]

// ─── Projection calculator ────────────────────────────────────────────────────
function ProjectionCalc({ ratePerVideo, bonusPerPurchase, currentVideos, currentPurchases }: {
  ratePerVideo: number
  bonusPerPurchase: number
  currentVideos: number
  currentPurchases: number
}) {
  const [videos, setVideos] = useState(Math.max(currentVideos + 2, 5))

  const avgPurchasesPerVideo = currentVideos > 0 ? currentPurchases / currentVideos : 8
  const projected_purchases = Math.round(videos * avgPurchasesPerVideo)
  const base = videos * ratePerVideo
  const bonus = projected_purchases * bonusPerPurchase
  const total = base + bonus

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-black" style={{ color: '#E8ECFF' }}>
            How many videos will you deliver?
          </label>
          <span className="text-2xl font-black" style={{ color: '#A78BFA' }}>{videos}</span>
        </div>
        <input
          type="range"
          min={1}
          max={50}
          value={videos}
          onChange={e => setVideos(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: '#A78BFA', background: 'rgba(139,92,246,0.2)' }}
        />
        <div className="flex justify-between text-xs mt-1" style={{ color: '#484D6D' }}>
          <span>1 video</span>
          <span>50 videos</span>
        </div>
      </div>

      {/* Projection breakdown */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs mb-1" style={{ color: '#484D6D' }}>Base pay</p>
          <p className="text-xl font-black" style={{ color: '#E8ECFF' }}>{fmt$(base)}</p>
          <p className="text-xs mt-1" style={{ color: '#484D6D' }}>{fmt$(ratePerVideo)}/video</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs mb-1" style={{ color: '#484D6D' }}>Purchase bonus</p>
          <p className="text-xl font-black" style={{ color: '#A78BFA' }}>{fmt$(bonus)}</p>
          <p className="text-xs mt-1" style={{ color: '#484D6D' }}>~{projected_purchases} purchases</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <p className="text-xs mb-1" style={{ color: '#A78BFA' }}>Total earned</p>
          <p className="text-xl font-black" style={{ color: '#A78BFA' }}>{fmt$(total)}</p>
          <p className="text-xs mt-1" style={{ color: '#484D6D' }}>{fmt$(Math.round(total / videos))}/video avg</p>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-2">
        <p className="text-xs font-black" style={{ color: '#484D6D' }}>Milestones</p>
        {[500, 1000, 2500, 5000].map(target => {
          const vidsNeeded = Math.ceil(target / (ratePerVideo + avgPurchasesPerVideo * bonusPerPurchase))
          const reached = total >= target
          return (
            <div key={target} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: reached ? 'rgba(33,209,159,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${reached ? 'rgba(33,209,159,0.4)' : 'rgba(255,255,255,0.08)'}` }}>
                {reached && <span className="text-xs" style={{ color: '#21D19F' }}>✓</span>}
              </div>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-1.5 rounded-full transition-all" style={{ width: `${Math.min((total / target) * 100, 100)}%`, background: reached ? '#21D19F' : 'rgba(139,92,246,0.5)' }} />
              </div>
              <span className="text-xs font-black w-16 text-right" style={{ color: reached ? '#21D19F' : '#484D6D' }}>
                {fmt$(target)}
              </span>
              {!reached && (
                <span className="text-xs w-20 text-right" style={{ color: '#484D6D' }}>
                  {vidsNeeded - currentVideos > 0 ? `${vidsNeeded - currentVideos} more vids` : 'almost there'}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Ad performance card ──────────────────────────────────────────────────────
function AdCard({ ad }: { ad: CreatorAdStat }) {
  const [open, setOpen] = useState(false)
  const tier = TIER_CONFIG[ad.performance_tier]

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${tier.border}` }}
    >
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm truncate" style={{ color: '#E8ECFF' }}>{ad.name}</p>
            <p className="text-xs mt-0.5" style={{ color: '#484D6D' }}>Running {ad.days_running}d</p>
          </div>
          <span className="flex-shrink-0 text-xs font-black px-2.5 py-1 rounded-full" style={{ background: tier.bg, color: tier.color, border: `1px solid ${tier.border}` }}>
            {tier.label}
          </span>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'ROAS', val: fmtR(ad.roas), highlight: ad.roas >= 2 },
            { label: 'CTR', val: fmtPct(ad.ctr), highlight: ad.ctr >= 2 },
            { label: 'Spend', val: fmt$(ad.spend), highlight: false },
            { label: 'CPM', val: fmt$(ad.cpm), highlight: ad.cpm <= 12 },
          ].map(({ label, val, highlight }) => (
            <div key={label} className="rounded-lg p-2 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs" style={{ color: '#484D6D' }}>{label}</p>
              <p className="text-sm font-black mt-0.5" style={{ color: highlight ? '#21D19F' : '#E8ECFF' }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Why / tips toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="text-xs font-bold"
          style={{ color: '#7B82A0' }}
        >
          {open ? '↑ Hide analysis' : '↓ See analysis'}
        </button>

        {open && (
          <div className="mt-3 space-y-3">
            {ad.why_winning.length > 0 && (
              <div className="rounded-xl p-3" style={{ background: 'rgba(33,209,159,0.06)', border: '1px solid rgba(33,209,159,0.12)' }}>
                <p className="text-xs font-black mb-2" style={{ color: '#21D19F' }}>Why it's working</p>
                {ad.why_winning.map((w, i) => (
                  <p key={i} className="text-xs mb-1" style={{ color: '#7B82A0' }}>• {w}</p>
                ))}
              </div>
            )}
            {ad.improvement_tips.length > 0 && (
              <div className="rounded-xl p-3" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.12)' }}>
                <p className="text-xs font-black mb-2" style={{ color: '#FBB724' }}>How to improve</p>
                {ad.improvement_tips.map((t, i) => (
                  <p key={i} className="text-xs mb-1" style={{ color: '#7B82A0' }}>• {t}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 flex items-center gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <div>
          <span className="text-xs" style={{ color: '#484D6D' }}>Purchases: </span>
          <span className="text-xs font-black" style={{ color: '#A78BFA' }}>{ad.purchases}</span>
        </div>
        <div>
          <span className="text-xs" style={{ color: '#484D6D' }}>Revenue: </span>
          <span className="text-xs font-black" style={{ color: '#21D19F' }}>{fmt$(ad.revenue)}</span>
        </div>
        <div className="ml-auto">
          <span className="text-xs" style={{ color: '#484D6D' }}>Status: </span>
          <span className="text-xs font-black" style={{ color: ad.status === 'ACTIVE' ? '#21D19F' : '#484D6D' }}>{ad.status}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Competitor research panel ────────────────────────────────────────────────
function CompetitorPanel({ niche }: { niche: string }) {
  const competitors = [
    { name: 'Liquid IV',    url: 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Liquid+IV&search_type=keyword_unordered' },
    { name: 'LMNT',         url: 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=LMNT+electrolyte&search_type=keyword_unordered' },
    { name: 'Athletic Greens', url: 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Athletic+Greens&search_type=keyword_unordered' },
    { name: 'Nuun',         url: 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Nuun+hydration&search_type=keyword_unordered' },
    { name: 'DripDrop',     url: 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=DripDrop&search_type=keyword_unordered' },
    { name: 'Pedialyte',    url: 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Pedialyte&search_type=keyword_unordered' },
  ]

  return (
    <div className="space-y-4">
      <div className="rounded-xl px-5 py-4" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
        <p className="text-xs font-black mb-1" style={{ color: '#A78BFA' }}>📌 How to use this</p>
        <p className="text-xs leading-relaxed" style={{ color: '#7B82A0' }}>
          Open a competitor, filter by <strong style={{ color: '#E8ECFF' }}>Video</strong>, sort by longest running.
          Any ad live 30+ days is profitable. Study the hook, the pacing, the offer. Then make your version — don't copy, just learn the pattern.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {competitors.map(c => (
          <div
            key={c.name}
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="font-black text-sm" style={{ color: '#E8ECFF' }}>{c.name}</span>
            <div className="flex gap-2">
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2.5 py-1 rounded-lg font-bold"
                style={{ background: 'rgba(139,92,246,0.1)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.2)' }}
              >
                All ads →
              </a>
              <a
                href={c.url.replace('ad_type=all', 'ad_type=all&media_type=video')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2.5 py-1 rounded-lg font-bold"
                style={{ background: 'rgba(255,255,255,0.04)', color: '#7B82A0', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Video →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Script lab ───────────────────────────────────────────────────────────────
function ScriptLab() {
  const [selected, setSelected] = useState(0)
  const script = SCRIPTS[selected]

  return (
    <div className="space-y-5">
      <div className="rounded-xl px-5 py-4" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
        <p className="text-xs font-black mb-1" style={{ color: '#A78BFA' }}>💡 These scripts are based on what's actually working</p>
        <p className="text-xs" style={{ color: '#7B82A0' }}>
          Each angle below is proven in the health & wellness space. Adapt them — change the product name, make it your voice, film it natural. Don't read it like a script.
        </p>
      </div>

      {/* Angle selector */}
      <div className="flex gap-2 flex-wrap">
        {SCRIPTS.map((s, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className="text-xs px-3 py-1.5 rounded-lg font-bold transition-all"
            style={selected === i
              ? { background: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.3)' }
              : { background: 'rgba(255,255,255,0.04)', color: '#7B82A0', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {s.angle}
          </button>
        ))}
      </div>

      {/* Script card */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.2)' }}>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#A78BFA' }}>ANGLE</p>
          <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>{script.angle}</p>
        </div>

        {[
          { label: '🎬 HOOK (first 3 sec)', val: script.hook, color: '#EF4444' },
          { label: '🗣 BODY', val: script.body, color: '#E8ECFF' },
          { label: '📲 CTA', val: script.cta, color: '#21D19F' },
        ].map(({ label, val, color }) => (
          <div key={label}>
            <p className="text-xs font-bold mb-1.5" style={{ color: '#484D6D' }}>{label}</p>
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-sm leading-relaxed font-bold" style={{ color }}>{val}</p>
            </div>
          </div>
        ))}

        <div className="rounded-xl p-3" style={{ background: 'rgba(33,209,159,0.06)', border: '1px solid rgba(33,209,159,0.12)' }}>
          <p className="text-xs font-black mb-1" style={{ color: '#21D19F' }}>Why this works</p>
          <p className="text-xs" style={{ color: '#7B82A0' }}>{script.why}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyAds() {
  return (
    <div className="rounded-2xl p-10 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="text-4xl mb-4">🎬</div>
      <p className="font-black text-sm mb-2" style={{ color: '#E8ECFF' }}>No ads linked yet</p>
      <p className="text-xs max-w-xs mx-auto" style={{ color: '#7B82A0' }}>
        Once Higher Level links your ad IDs to your profile, your performance data will show up here automatically.
      </p>
    </div>
  )
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
type Tab = 'performance' | 'competitors' | 'scripts' | 'earnings'

interface Props {
  creatorId: string
  creatorName: string
  clientName: string
  ratePerVideo: number
  bonusPerPurchase: number
  niche: string
}

export function CreatorDashboard({ creatorId, creatorName, clientName, ratePerVideo, bonusPerPurchase, niche }: Props) {
  const [tab, setTab] = useState<Tab>('performance')
  const [data, setData] = useState<CreatorAdsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/creator/ads')
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error)
        else setData(d)
      })
      .catch(() => setError('Failed to load your data'))
      .finally(() => setLoading(false))
  }, [])

  const TABS: { id: Tab; label: string }[] = [
    { id: 'performance', label: '📊 My Ads' },
    { id: 'competitors', label: '🔍 Competitor Ads' },
    { id: 'scripts',     label: '📝 Script Lab' },
    { id: 'earnings',    label: '💰 My Earnings' },
  ]

  const winners = data?.ads.filter(a => a.performance_tier === 'winner') || []
  const topAd = winners[0] || data?.ads[0]

  return (
    <div className="space-y-6">
      {/* Stat row — only show when data loaded */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Spend', val: fmt$(data.total_spend), color: '#E8ECFF' },
            { label: 'Revenue Generated', val: fmt$(data.total_revenue), color: '#21D19F' },
            { label: 'Overall ROAS', val: fmtR(data.overall_roas), color: data.overall_roas >= 2 ? '#21D19F' : data.overall_roas >= 1 ? '#FBB724' : '#EF4444' },
            { label: 'Total Earned', val: fmt$(data.earnings.total_earned), color: '#A78BFA' },
          ].map(({ label, val, color }) => (
            <div key={label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs mb-1" style={{ color: '#484D6D' }}>{label}</p>
              <p className="text-xl font-black" style={{ color }}>{val}</p>
            </div>
          ))}
        </div>
      )}

      {/* Winner callout */}
      {topAd && topAd.performance_tier === 'winner' && (
        <div className="rounded-xl px-5 py-4" style={{ background: 'rgba(33,209,159,0.06)', border: '1px solid rgba(33,209,159,0.15)' }}>
          <p className="text-xs font-black" style={{ color: '#21D19F' }}>
            🏆 Your top performer: <span style={{ color: '#E8ECFF' }}>{topAd.name}</span> — {fmtR(topAd.roas)} ROAS, {fmtPct(topAd.ctr)} CTR.
            Make more content in this style.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl flex-wrap" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 px-4 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap"
            style={tab === t.id
              ? { background: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.25)' }
              : { color: '#7B82A0', border: '1px solid transparent' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {loading && (
        <div className="rounded-2xl p-10 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs" style={{ color: '#484D6D' }}>Loading your data…</p>
        </div>
      )}

      {!loading && tab === 'performance' && (
        <div className="space-y-4">
          {error && (
            <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-xs font-bold" style={{ color: '#EF4444' }}>{error}</p>
            </div>
          )}
          {!error && (!data || data.ads.length === 0) ? (
            <EmptyAds />
          ) : (
            data?.ads.map(ad => <AdCard key={ad.id} ad={ad} />)
          )}
        </div>
      )}

      {!loading && tab === 'competitors' && (
        <CompetitorPanel niche={niche} />
      )}

      {!loading && tab === 'scripts' && (
        <ScriptLab />
      )}

      {!loading && tab === 'earnings' && data && (
        <div className="space-y-6">
          {/* Current earnings breakdown */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-sm font-black mb-4" style={{ color: '#E8ECFF' }}>Current Earnings</p>
            <div className="space-y-3">
              {[
                { label: `Base pay (${data.earnings.videos_delivered} videos × ${fmt$(ratePerVideo)})`, val: fmt$(data.earnings.base_earnings), color: '#E8ECFF' },
                { label: `Purchase bonus (${data.earnings.total_purchases} purchases × ${fmt$(bonusPerPurchase)})`, val: fmt$(data.earnings.bonus_earnings), color: '#A78BFA' },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-sm" style={{ color: '#7B82A0' }}>{label}</p>
                  <p className="text-sm font-black" style={{ color }}>{val}</p>
                </div>
              ))}
              <div className="flex items-center justify-between pt-1">
                <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>Total earned</p>
                <p className="text-2xl font-black" style={{ color: '#A78BFA' }}>{fmt$(data.earnings.total_earned)}</p>
              </div>
            </div>
          </div>

          {/* Projection slider */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-sm font-black mb-4" style={{ color: '#E8ECFF' }}>Earnings Projection</p>
            <ProjectionCalc
              ratePerVideo={ratePerVideo}
              bonusPerPurchase={bonusPerPurchase}
              currentVideos={data.earnings.videos_delivered}
              currentPurchases={data.earnings.total_purchases}
            />
          </div>
        </div>
      )}

      {/* Earnings tab empty state */}
      {!loading && tab === 'earnings' && !data && (
        <EmptyAds />
      )}
    </div>
  )
}
