'use client'

import { useState, useEffect } from 'react'
import type { CreatorAdsResponse, CreatorAdStat } from '@/app/api/creator/ads/route'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt$(n: number) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
function fmtR(n: number) { return n.toFixed(2) + 'x' }
function fmtPct(n: number) { return n.toFixed(2) + '%' }

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  chart: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  search: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  file: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  dollar: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  trophy: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="13"/><path d="M7 4H17l-1 9a5 5 0 0 1-8 0L7 4z"/><path d="M4 4h3"/><path d="M17 4h3"/>
    </svg>
  ),
  check: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  pin: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  lightbulb: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
    </svg>
  ),
  video: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  ),
  hook: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
    </svg>
  ),
  arrow: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
}

// ─── Tier config — no emojis ──────────────────────────────────────────────────
const TIER_CONFIG = {
  winner:   { label: 'Winner',    bg: 'rgba(33,209,159,0.12)',  border: 'rgba(33,209,159,0.25)',  color: '#21D19F' },
  solid:    { label: 'Solid',     bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.25)',  color: '#60A5FA' },
  learning: { label: 'Learning',  bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)',  color: '#FBB724' },
  weak:     { label: 'Needs Work',bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)',    color: '#EF4444' },
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

      <div className="space-y-2">
        <p className="text-xs font-black" style={{ color: '#484D6D' }}>Milestones</p>
        {[500, 1000, 2500, 5000].map(target => {
          const vidsNeeded = Math.ceil(target / (ratePerVideo + avgPurchasesPerVideo * bonusPerPurchase))
          const reached = total >= target
          return (
            <div key={target} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: reached ? 'rgba(33,209,159,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${reached ? 'rgba(33,209,159,0.4)' : 'rgba(255,255,255,0.08)'}`, color: '#21D19F' }}>
                {reached && Icon.check}
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
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

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 text-xs font-bold"
          style={{ color: '#7B82A0' }}
        >
          <span style={{ transform: open ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 0.15s' }}>{Icon.arrow}</span>
          {open ? 'Hide analysis' : 'See analysis'}
        </button>

        {open && (
          <div className="mt-3 space-y-3">
            {ad.why_winning.length > 0 && (
              <div className="rounded-xl p-3" style={{ background: 'rgba(33,209,159,0.06)', border: '1px solid rgba(33,209,159,0.12)' }}>
                <p className="text-xs font-black mb-2" style={{ color: '#21D19F' }}>Why it's working</p>
                {ad.why_winning.map((w, i) => (
                  <p key={i} className="text-xs mb-1" style={{ color: '#7B82A0' }}>— {w}</p>
                ))}
              </div>
            )}
            {ad.improvement_tips.length > 0 && (
              <div className="rounded-xl p-3" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.12)' }}>
                <p className="text-xs font-black mb-2" style={{ color: '#FBB724' }}>How to improve</p>
                {ad.improvement_tips.map((t, i) => (
                  <p key={i} className="text-xs mb-1" style={{ color: '#7B82A0' }}>— {t}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

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
    { name: 'Liquid IV',       url: 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Liquid+IV&search_type=keyword_unordered' },
    { name: 'LMNT',            url: 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=LMNT+electrolyte&search_type=keyword_unordered' },
    { name: 'Athletic Greens', url: 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Athletic+Greens&search_type=keyword_unordered' },
    { name: 'Nuun',            url: 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Nuun+hydration&search_type=keyword_unordered' },
    { name: 'DripDrop',        url: 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=DripDrop&search_type=keyword_unordered' },
    { name: 'Pedialyte',       url: 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=Pedialyte&search_type=keyword_unordered' },
  ]

  return (
    <div className="space-y-4">
      <div className="rounded-xl px-5 py-4" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
        <div className="flex items-center gap-2 mb-1" style={{ color: '#A78BFA' }}>
          {Icon.pin}
          <p className="text-xs font-black" style={{ color: '#A78BFA' }}>How to use this</p>
        </div>
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
              <a href={c.url} target="_blank" rel="noopener noreferrer"
                className="text-xs px-2.5 py-1 rounded-lg font-bold"
                style={{ background: 'rgba(139,92,246,0.1)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.2)' }}>
                All ads →
              </a>
              <a href={c.url.replace('ad_type=all', 'ad_type=all&media_type=video')} target="_blank" rel="noopener noreferrer"
                className="text-xs px-2.5 py-1 rounded-lg font-bold"
                style={{ background: 'rgba(255,255,255,0.04)', color: '#7B82A0', border: '1px solid rgba(255,255,255,0.08)' }}>
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
        <div className="flex items-center gap-2 mb-1">
          {Icon.lightbulb && <span style={{ color: '#A78BFA' }}>{Icon.lightbulb}</span>}
          <p className="text-xs font-black" style={{ color: '#A78BFA' }}>Scripts based on what's actually working</p>
        </div>
        <p className="text-xs" style={{ color: '#7B82A0' }}>
          Each angle is proven in health & wellness. Adapt them — change the product name, make it your voice, film it natural. Don't read it like a script.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {SCRIPTS.map((s, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className="text-xs px-3 py-1.5 rounded-lg font-bold transition-all"
            style={selected === i
              ? { background: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.3)' }
              : { background: 'rgba(255,255,255,0.04)', color: '#7B82A0', border: '1px solid rgba(255,255,255,0.08)' }}>
            {s.angle}
          </button>
        ))}
      </div>

      <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.2)' }}>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#A78BFA' }}>ANGLE</p>
          <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>{script.angle}</p>
        </div>

        {[
          { label: 'HOOK — first 3 sec', icon: Icon.hook, val: script.hook, color: '#EF4444' },
          { label: 'BODY', icon: Icon.video, val: script.body, color: '#E8ECFF' },
          { label: 'CTA', icon: Icon.arrow, val: script.cta, color: '#21D19F' },
        ].map(({ label, icon, val, color }) => (
          <div key={label}>
            <div className="flex items-center gap-1.5 mb-1.5" style={{ color: '#484D6D' }}>
              {icon}
              <p className="text-xs font-bold">{label}</p>
            </div>
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
function EmptyAds({ clientName, clientColor }: { clientName: string; clientColor: string }) {
  return (
    <div className="rounded-2xl p-10 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex justify-center mb-4" style={{ color: 'rgba(255,255,255,0.15)' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
      </div>
      <p className="font-black text-sm mb-2" style={{ color: '#E8ECFF' }}>No ads found for {clientName}</p>
      <p className="text-xs max-w-xs mx-auto" style={{ color: '#7B82A0' }}>
        Ads with your name tag will appear here automatically once they go live in Meta.
      </p>
    </div>
  )
}

// ─── Brand folder ─────────────────────────────────────────────────────────────
function BrandFolder({
  clientName, clientColor, clientWebsite, ads,
}: {
  clientName: string
  clientColor: string
  clientWebsite: string
  ads: CreatorAdStat[]
}) {
  const [open, setOpen] = useState(true)

  const activeAds  = ads.filter(a => a.status === 'ACTIVE')
  const totalSpend = ads.reduce((s, a) => s + a.spend, 0)
  const totalRev   = ads.reduce((s, a) => s + a.revenue, 0)
  const overallRoas = totalSpend > 0 ? totalRev / totalSpend : 0
  const winners    = ads.filter(a => a.performance_tier === 'winner').length
  const initial    = clientName.charAt(0).toUpperCase()

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${clientColor}22` }}>

      {/* Folder header — click to expand/collapse */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-6 py-5 flex items-center gap-4 text-left transition-all"
        style={{ background: open ? `${clientColor}06` : 'transparent' }}
      >
        {/* Brand avatar */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${clientColor}22, ${clientColor}44)`,
            border: `1px solid ${clientColor}44`,
            color: clientColor,
          }}
        >
          {initial}
        </div>

        {/* Brand info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-black text-base" style={{ color: '#E8ECFF' }}>{clientName}</p>
            {clientWebsite && (
              <span className="text-xs" style={{ color: '#484D6D' }}>{clientWebsite}</span>
            )}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs font-bold" style={{ color: clientColor }}>
              {ads.length} {ads.length === 1 ? 'ad' : 'ads'} matched
            </span>
            <span className="text-xs" style={{ color: '#484D6D' }}>
              {activeAds.length} active
            </span>
            {totalSpend > 0 && (
              <span className="text-xs" style={{ color: '#484D6D' }}>
                {fmt$(totalSpend)} spend · {fmtR(overallRoas)} ROAS
              </span>
            )}
            {winners > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(33,209,159,0.1)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }}>
                {winners} winner{winners > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <div
          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            transform: open ? 'rotate(90deg)' : 'none',
            color: '#484D6D',
          }}
        >
          {Icon.arrow}
        </div>
      </button>

      {/* Divider */}
      {open && <div style={{ height: '1px', background: `${clientColor}18` }} />}

      {/* Ads inside the folder */}
      {open && (
        <div className="p-4 space-y-3">
          {ads.length === 0 ? (
            <EmptyAds clientName={clientName} clientColor={clientColor} />
          ) : (
            ads.map(ad => <AdCard key={ad.id} ad={ad} />)
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
type Tab = 'performance' | 'competitors' | 'scripts' | 'earnings'

interface Props {
  creatorId: string
  creatorName: string
  clientName: string
  clientColor: string
  clientWebsite: string
  ratePerVideo: number
  bonusPerPurchase: number
  niche: string
}

export function CreatorDashboard({ creatorId, creatorName, clientName, clientColor, clientWebsite, ratePerVideo, bonusPerPurchase, niche }: Props) {
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

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'performance', label: 'My Ads',        icon: Icon.chart  },
    { id: 'competitors', label: 'Competitor Ads', icon: Icon.search },
    { id: 'scripts',     label: 'Script Lab',     icon: Icon.file   },
    { id: 'earnings',    label: 'My Earnings',    icon: Icon.dollar },
  ]

  const winners = data?.ads.filter(a => a.performance_tier === 'winner') || []
  const topAd = winners[0] || data?.ads[0]

  return (
    <div className="space-y-6">
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Spend',       val: fmt$(data.total_spend),         color: '#E8ECFF' },
            { label: 'Revenue Generated', val: fmt$(data.total_revenue),        color: '#21D19F' },
            { label: 'Overall ROAS',      val: fmtR(data.overall_roas),         color: data.overall_roas >= 2 ? '#21D19F' : data.overall_roas >= 1 ? '#FBB724' : '#EF4444' },
            { label: 'Total Earned',      val: fmt$(data.earnings.total_earned), color: '#A78BFA' },
          ].map(({ label, val, color }) => (
            <div key={label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs mb-1" style={{ color: '#484D6D' }}>{label}</p>
              <p className="text-xl font-black" style={{ color }}>{val}</p>
            </div>
          ))}
        </div>
      )}

      {topAd && topAd.performance_tier === 'winner' && (
        <div className="rounded-xl px-5 py-4 flex items-center gap-3" style={{ background: 'rgba(33,209,159,0.06)', border: '1px solid rgba(33,209,159,0.15)' }}>
          <span style={{ color: '#21D19F', flexShrink: 0 }}>{Icon.trophy}</span>
          <p className="text-xs font-black" style={{ color: '#21D19F' }}>
            Top performer: <span style={{ color: '#E8ECFF' }}>{topAd.name}</span> — {fmtR(topAd.roas)} ROAS, {fmtPct(topAd.ctr)} CTR. Make more content in this style.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-black transition-all"
            style={tab === t.id
              ? { background: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.25)' }
              : { color: '#7B82A0', border: '1px solid transparent' }}
          >
            <span style={{ opacity: 0.8 }}>{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

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
          {!error && (
            <BrandFolder
              clientName={clientName}
              clientColor={clientColor}
              clientWebsite={clientWebsite}
              ads={data?.ads || []}
            />
          )}
        </div>
      )}

      {!loading && tab === 'competitors' && <CompetitorPanel niche={niche} />}
      {!loading && tab === 'scripts' && <ScriptLab />}

      {!loading && tab === 'earnings' && data && (
        <div className="space-y-6">
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

      {!loading && tab === 'earnings' && !data && <EmptyAds clientName={clientName} clientColor={clientColor} />}
    </div>
  )
}
