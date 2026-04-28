'use client'

import { getRoas, getLeads, getPurchases, adVerdict } from '@/lib/meta'
import { fmtCurrency, fmtX, fmtPct, fmtInt } from '@/lib/utils'

const PENDING_STATUSES = ['PENDING_REVIEW', 'IN_PROCESS', 'PENDING_BILLING_INFO']

function getDecisionReason(ad: any, clientType: string): { action: string; reason: string; metric: string } {
  // Don't make kill/scale calls on ads still in review
  if (PENDING_STATUSES.includes(ad.effective_status)) {
    return {
      action: 'PENDING',
      reason: 'This ad is currently in review with Meta. Wait for approval before evaluating performance.',
      metric: `Status: ${ad.effective_status.replace(/_/g, ' ')}`,
    }
  }

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

const VERDICT_CONFIG: Record<string, { bg: string; border: string; color: string; budgetNote: string }> = {
  KILL:    { bg: 'rgba(245,158,11,0.04)', border: 'rgba(245,158,11,0.18)', color: '#F59E0B', budgetNote: 'Pause immediately' },
  SCALE:   { bg: 'rgba(33,209,159,0.04)', border: 'rgba(33,209,159,0.18)', color: '#21D19F', budgetNote: 'Increase budget 20–30%' },
  KEEP:    { bg: 'rgba(94,106,210,0.04)', border: 'rgba(94,106,210,0.18)', color: '#5E6AD2', budgetNote: 'Hold current budget' },
  WATCH:   { bg: 'rgba(245,158,11,0.04)', border: 'rgba(245,158,11,0.18)', color: '#F59E0B', budgetNote: 'Monitor for 2–3 days' },
  TEST:    { bg: 'rgba(94,106,210,0.04)', border: 'rgba(94,106,210,0.18)', color: '#5E6AD2', budgetNote: 'Let it breathe — more data needed' },
  PENDING: { bg: '#15161A',                 border: 'rgba(255,255,255,0.08)', color: '#8A8F98', budgetNote: 'Waiting on Meta review' },
}

function priorityOrder(label: string) {
  return { KILL: 0, SCALE: 1, KEEP: 2, WATCH: 3, TEST: 4, PENDING: 5 }[label] ?? 6
}

export function DecisionsTab({ ads, clientType }: { ads: any[]; clientType: string }) {
  if (!ads || ads.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-sm" style={{ color: '#5C606C' }}>No ad data available for this period.</p>
      </div>
    )
  }

  const decisions = ads
    .map(ad => ({ ad, ...getDecisionReason(ad, clientType), verdict: adVerdict(ad, clientType) }))
    .sort((a, b) => priorityOrder(a.action) - priorityOrder(b.action))

  const kills   = decisions.filter(d => d.action === 'KILL')
  const scales  = decisions.filter(d => d.action === 'SCALE')
  const keeps   = decisions.filter(d => d.action === 'KEEP')
  const watches = decisions.filter(d => d.action === 'WATCH')
  const tests   = decisions.filter(d => d.action === 'TEST')
  const pending = decisions.filter(d => d.action === 'PENDING')

  const totalSpend = ads.reduce((s, a) => s + parseFloat(a.spend || 0), 0)
  const killSpend  = kills.reduce((s, d) => s + parseFloat(d.ad.spend || 0), 0)
  const scaleSpend = scales.reduce((s, d) => s + parseFloat(d.ad.spend || 0), 0)

  const summary: { label: string; count: number; sub: string; color: string }[] = [
    { label: 'Kill',       count: kills.length,                  sub: `${fmtCurrency(killSpend)} wasted`,    color: '#F59E0B' },
    { label: 'Scale',      count: scales.length,                 sub: `${fmtCurrency(scaleSpend)} working`,  color: '#21D19F' },
    { label: 'Keep',       count: keeps.length,                  sub: 'Holding steady',                       color: '#5E6AD2' },
    { label: 'Watch/Test', count: watches.length + tests.length, sub: 'Needs more data',                      color: '#F59E0B' },
  ]
  if (pending.length > 0) summary.push({ label: 'In Review', count: pending.length, sub: 'Awaiting Meta approval', color: '#8A8F98' })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        {summary.map((s, i) => (
          <div key={i} className="p-5" style={{ background: '#15161A' }}>
            <p className="text-xs font-medium mb-2" style={{ color: '#5C606C' }}>{s.label}</p>
            <p className="text-2xl font-semibold tnum" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs mt-1" style={{ color: '#5C606C' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {(kills.length > 0 || scales.length > 0) && (
        <div className="card p-5">
          <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Priority Actions Right Now</p>
          <div className="space-y-2">
            {kills.length > 0 && (
              <p className="text-sm" style={{ color: '#F59E0B' }}>
                <span className="inline-block w-1.5 h-1.5 rounded-full mr-2" style={{ background: '#F59E0B' }} />
                Pause {kills.map(d => d.ad.ad_name).join(', ')} — {fmtCurrency(killSpend)} in daily spend going nowhere.
              </p>
            )}
            {scales.length > 0 && (
              <p className="text-sm" style={{ color: '#21D19F' }}>
                <span className="inline-block w-1.5 h-1.5 rounded-full mr-2" style={{ background: '#21D19F' }} />
                Scale {scales.map(d => d.ad.ad_name).join(', ')} — push budget 20–30% now while they're working.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-medium" style={{ color: '#5C606C' }}>
          All Ads — {decisions.length} total · sorted by priority
        </p>
        {decisions.map(({ ad, action, reason, metric }, i) => {
          const cfg = VERDICT_CONFIG[action] || VERDICT_CONFIG.WATCH
          const isLive = ad.effective_status === 'ACTIVE'
          return (
            <div key={i} className="card p-5" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-sm truncate" style={{ color: '#F4F5F8' }}>{ad.ad_name}</p>
                    {!isLive && (
                      <span className="text-[10px] px-2 py-0.5 rounded font-medium" style={{ background: '#1A1B20', color: '#8A8F98', border: '1px solid rgba(255,255,255,0.08)' }}>
                        Off
                      </span>
                    )}
                  </div>
                  <p className="text-xs mb-2" style={{ color: cfg.color }}>{metric}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#8A8F98' }}>{reason}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span
                    className="inline-block text-[10px] font-medium px-2 py-0.5 rounded"
                    style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                  >
                    {action}
                  </span>
                  <p className="text-xs mt-1.5" style={{ color: '#5C606C' }}>{cfg.budgetNote}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
