'use client'

import { getRoas, getLeads, getPurchases, adVerdict } from '@/lib/meta'
import { fmtCurrency, fmtX, fmtPct, fmtInt } from '@/lib/utils'

function getDecisionReason(ad: any, clientType: string): { action: string; reason: string; metric: string } {
  const spend = parseFloat(ad.spend || 0)
  const roas = getRoas(ad)
  const purchases = getPurchases(ad)
  const leads = getLeads(ad)
  const ctr = parseFloat(ad.ctr || 0)
  const cpc = parseFloat(ad.cpc || 0)
  const cpm = parseFloat(ad.cpm || 0)

  if (clientType === 'ecommerce') {
    if (spend > 20 && roas === 0 && purchases === 0)
      return { action: 'KILL', reason: `Spent ${fmtCurrency(spend)} with zero purchases. Budget is bleeding — pause immediately.`, metric: `${fmtCurrency(spend)} spent · 0 purchases · ROAS 0x` }
    if (spend > 10 && roas === 0)
      return { action: 'KILL', reason: `Over ${fmtCurrency(spend)} spent with no return. Kill it before it burns more.`, metric: `${fmtCurrency(spend)} spent · 0 purchases · ROAS 0x` }
    if (roas >= 3)
      return { action: 'SCALE', reason: `${fmtX(roas)} ROAS is well above breakeven. Increase daily budget 20–30% every 3 days until it breaks.`, metric: `${fmtX(roas)} ROAS · ${fmtCurrency(spend)} spent · ${fmtInt(purchases)} purchases` }
    if (roas >= 2)
      return { action: 'SCALE', reason: `${fmtX(roas)} ROAS is profitable. Start scaling — raise budget 15–20% and watch CPM closely.`, metric: `${fmtX(roas)} ROAS · ${fmtCurrency(spend)} spent · ${fmtInt(purchases)} purchases` }
    if (roas >= 1.5)
      return { action: 'KEEP', reason: `${fmtX(roas)} ROAS is above breakeven. Hold budget steady — let it optimize before touching.`, metric: `${fmtX(roas)} ROAS · ${fmtCurrency(spend)} spent` }
    if (roas > 0 && roas < 1.5)
      return { action: 'WATCH', reason: `${fmtX(roas)} ROAS is below breakeven but has conversions. Give it 2–3 more days before cutting.`, metric: `${fmtX(roas)} ROAS · ${fmtCurrency(spend)} spent · ${fmtInt(purchases)} purchases` }
    if (spend < 10 && ctr > 5)
      return { action: 'TEST', reason: `${fmtPct(ctr)} CTR is strong but too early to judge — needs more spend data. Don't touch it yet.`, metric: `${fmtPct(ctr)} CTR · ${fmtCurrency(spend)} spent` }
    return { action: 'WATCH', reason: `Early data — not enough spend to make a call. Check back in 2–3 days.`, metric: `${fmtCurrency(spend)} spent · ${fmtPct(ctr)} CTR` }
  } else {
    if (spend > 15 && leads === 0)
      return { action: 'KILL', reason: `${fmtCurrency(spend)} spent, zero leads generated. This ad isn't working — pull the budget.`, metric: `${fmtCurrency(spend)} spent · 0 leads` }
    if (leads > 2) {
      const cpl = spend / leads
      return { action: 'SCALE', reason: `${fmtInt(leads)} leads at ${fmtCurrency(cpl)} CPL. If CPL is under your target, push more budget in.`, metric: `${fmtInt(leads)} leads · ${fmtCurrency(cpl)} CPL · ${fmtCurrency(spend)} spent` }
    }
    if (leads > 0) {
      const cpl = spend / leads
      return { action: 'KEEP', reason: `${fmtInt(leads)} lead so far at ${fmtCurrency(cpl)} CPL. Let it run — pulling it too early kills optimization.`, metric: `${fmtInt(leads)} lead · ${fmtCurrency(cpl)} CPL · ${fmtCurrency(spend)} spent` }
    }
    if (ctr > 3)
      return { action: 'TEST', reason: `${fmtPct(ctr)} CTR means people are clicking — check if the landing page is converting. The ad itself is working.`, metric: `${fmtPct(ctr)} CTR · ${fmtCurrency(spend)} spent · 0 leads` }
    return { action: 'WATCH', reason: `Low engagement so far. Check CPM — audience may be too narrow or creative isn't stopping the scroll.`, metric: `${fmtCurrency(spend)} spent · ${fmtPct(ctr)} CTR · ${fmtCurrency(cpm)} CPM` }
  }
}

const VERDICT_CONFIG: Record<string, { bg: string; border: string; color: string; icon: string; budgetNote: string }> = {
  KILL:  { bg: 'rgba(239,68,68,0.06)',   border: 'rgba(239,68,68,0.2)',    color: '#EF4444', icon: '🔴', budgetNote: 'Pause immediately' },
  SCALE: { bg: 'rgba(33,209,159,0.06)',  border: 'rgba(33,209,159,0.2)',   color: '#21D19F', icon: '🟢', budgetNote: 'Increase budget 20–30%' },
  KEEP:  { bg: 'rgba(59,130,246,0.06)',  border: 'rgba(59,130,246,0.2)',   color: '#60A5FA', icon: '🔵', budgetNote: 'Hold current budget' },
  WATCH: { bg: 'rgba(245,158,11,0.06)',  border: 'rgba(245,158,11,0.2)',   color: '#F59E0B', icon: '🟡', budgetNote: 'Monitor for 2–3 days' },
  TEST:  { bg: 'rgba(139,92,246,0.06)',  border: 'rgba(139,92,246,0.2)',   color: '#A78BFA', icon: '🟣', budgetNote: 'Let it breathe — more data needed' },
}

function priorityOrder(label: string) {
  return { KILL: 0, SCALE: 1, KEEP: 2, WATCH: 3, TEST: 4 }[label] ?? 5
}

export function DecisionsTab({ ads, clientType }: { ads: any[]; clientType: string }) {
  if (!ads || ads.length === 0) {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-sm" style={{ color: '#484D6D' }}>No ad data available for this period.</p>
      </div>
    )
  }

  const decisions = ads
    .map(ad => ({ ad, ...getDecisionReason(ad, clientType), verdict: adVerdict(ad, clientType) }))
    .sort((a, b) => priorityOrder(a.action) - priorityOrder(b.action))

  const kills  = decisions.filter(d => d.action === 'KILL')
  const scales = decisions.filter(d => d.action === 'SCALE')
  const keeps  = decisions.filter(d => d.action === 'KEEP')
  const watches = decisions.filter(d => d.action === 'WATCH')
  const tests  = decisions.filter(d => d.action === 'TEST')

  const totalSpend = ads.reduce((s, a) => s + parseFloat(a.spend || 0), 0)
  const killSpend  = kills.reduce((s, d) => s + parseFloat(d.ad.spend || 0), 0)
  const scaleSpend = scales.reduce((s, d) => s + parseFloat(d.ad.spend || 0), 0)

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#EF4444' }}>Kill</p>
          <p className="text-2xl font-black" style={{ color: '#EF4444' }}>{kills.length}</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(239,68,68,0.5)' }}>{fmtCurrency(killSpend)} wasted</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: 'rgba(33,209,159,0.06)', border: '1px solid rgba(33,209,159,0.15)' }}>
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#21D19F' }}>Scale</p>
          <p className="text-2xl font-black" style={{ color: '#21D19F' }}>{scales.length}</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(33,209,159,0.5)' }}>{fmtCurrency(scaleSpend)} working</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#60A5FA' }}>Keep</p>
          <p className="text-2xl font-black" style={{ color: '#60A5FA' }}>{keeps.length}</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(59,130,246,0.4)' }}>Holding steady</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#F59E0B' }}>Watch / Test</p>
          <p className="text-2xl font-black" style={{ color: '#F59E0B' }}>{watches.length + tests.length}</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(245,158,11,0.4)' }}>Needs more data</p>
        </div>
      </div>

      {/* Priority action callout */}
      {(kills.length > 0 || scales.length > 0) && (
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#484D6D' }}>Priority Actions Right Now</p>
          <div className="space-y-2">
            {kills.length > 0 && (
              <p className="text-sm font-bold" style={{ color: '#EF4444' }}>
                🔴 Pause {kills.map(d => d.ad.ad_name).join(', ')} — {fmtCurrency(killSpend)} in daily spend going nowhere.
              </p>
            )}
            {scales.length > 0 && (
              <p className="text-sm font-bold" style={{ color: '#21D19F' }}>
                🟢 Scale {scales.map(d => d.ad.ad_name).join(', ')} — push budget 20–30% now while they're working.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Ad cards */}
      <div className="space-y-3">
        <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#484D6D' }}>
          All Ads — {decisions.length} total · sorted by priority
        </p>
        {decisions.map(({ ad, action, reason, metric }, i) => {
          const cfg = VERDICT_CONFIG[action] || VERDICT_CONFIG.WATCH
          const isLive = ad.effective_status === 'ACTIVE'
          return (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, backdropFilter: 'blur(12px)' }}
            >
              <div className="px-6 py-4 flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-base mt-0.5 flex-shrink-0">{cfg.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-black text-sm truncate" style={{ color: '#E8ECFF' }}>{ad.ad_name}</p>
                      {!isLive && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(255,255,255,0.06)', color: '#484D6D', border: '1px solid rgba(255,255,255,0.08)' }}>
                          OFF
                        </span>
                      )}
                    </div>
                    <p className="text-xs mb-2" style={{ color: cfg.color, opacity: 0.8 }}>{metric}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>{reason}</p>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span
                    className="inline-block text-xs font-black px-3 py-1.5 rounded-full"
                    style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                  >
                    {action}
                  </span>
                  <p className="text-xs mt-1.5" style={{ color: '#484D6D' }}>{cfg.budgetNote}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
