'use client'

import { Badge } from '@/components/ui/Badge'
import { adVerdict, getRoas, getPurchases, getLeads, getATC, getCheckouts } from '@/lib/meta'
import { fmtCurrency, fmtPct, fmtX, fmtInt, fmt } from '@/lib/utils'

interface AdTableProps {
  ads: any[]
  clientType: string
}

function isLive(ad: any) {
  return ad.effective_status === 'ACTIVE'
}

function isPending(ad: any) {
  return ['PENDING_REVIEW', 'IN_PROCESS', 'PENDING_BILLING_INFO'].includes(ad.effective_status)
}

function getStatusBadge(ad: any) {
  const s = ad.effective_status
  if (s === 'PENDING_REVIEW')
    return { label: 'IN REVIEW', bg: 'rgba(167,139,250,0.1)', color: '#A78BFA', border: 'rgba(167,139,250,0.25)' }
  if (s === 'IN_PROCESS')
    return { label: 'PROCESSING', bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: 'rgba(245,158,11,0.25)' }
  if (s === 'DISAPPROVED' || s === 'WITH_ISSUES')
    return { label: s === 'DISAPPROVED' ? 'REJECTED' : 'ISSUES', bg: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'rgba(239,68,68,0.25)' }
  if (s === 'PAUSED' || s === 'CAMPAIGN_PAUSED' || s === 'ADSET_PAUSED')
    return { label: 'PAUSED', bg: 'rgba(72,77,109,0.3)', color: '#7B82A0', border: 'rgba(168,174,210,0.15)' }
  return { label: 'OFF', bg: 'rgba(72,77,109,0.2)', color: '#484D6D', border: 'rgba(168,174,210,0.08)' }
}

export function AdTable({ ads, clientType }: AdTableProps) {
  // Live first, then pending/in-review, then off
  const live    = [...ads].filter(isLive).sort((a, b) => parseFloat(b.spend || 0) - parseFloat(a.spend || 0))
  const pending = [...ads].filter(isPending).sort((a, b) => parseFloat(b.spend || 0) - parseFloat(a.spend || 0))
  const off     = [...ads].filter(a => !isLive(a) && !isPending(a)).sort((a, b) => parseFloat(b.spend || 0) - parseFloat(a.spend || 0))
  const sorted  = [...live, ...pending, ...off]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(168, 174, 210, 0.07)' }}>
            <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#484D6D' }}>Ad</th>
            <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#484D6D' }}>Spend</th>
            <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#484D6D' }}>Impressions</th>
            <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#484D6D' }}>CTR</th>
            <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#484D6D' }}>CPC</th>
            <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#484D6D' }}>CPM</th>
            {clientType === 'ecommerce' ? (
              <>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#484D6D' }}>ATC</th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#484D6D' }}>Purchases</th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#484D6D' }}>ROAS</th>
              </>
            ) : (
              <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#484D6D' }}>Leads</th>
            )}
            <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#484D6D' }}>Verdict</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((ad, i) => {
            const verdict = adVerdict(ad, clientType)
            const roas = getRoas(ad)
            const purchases = getPurchases(ad)
            const leads = getLeads(ad)
            const atc = getATC(ad)
            const spend = parseFloat(ad.spend || 0)

            return (
              <tr
                key={i}
                className="transition-colors"
                style={{
                  borderBottom: '1px solid rgba(168, 174, 210, 0.05)',
                  opacity: isLive(ad) ? 1 : isPending(ad) ? 0.8 : 0.4,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(72,77,109,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td className="py-3 px-4 font-medium max-w-[200px] truncate" style={{ color: '#D8DDEF' }}>
                  {ad.ad_name}
                </td>
                <td className="py-3 px-4 text-right" style={{ color: '#D8DDEF' }}>{fmtCurrency(spend)}</td>
                <td className="py-3 px-4 text-right" style={{ color: '#A0A4B8' }}>{fmtInt(parseFloat(ad.impressions || 0))}</td>
                <td className="py-3 px-4 text-right" style={{ color: '#D8DDEF' }}>{fmtPct(parseFloat(ad.ctr || 0))}</td>
                <td className="py-3 px-4 text-right" style={{ color: '#D8DDEF' }}>{fmtCurrency(parseFloat(ad.cpc || 0))}</td>
                <td className="py-3 px-4 text-right" style={{ color: '#D8DDEF' }}>{fmtCurrency(parseFloat(ad.cpm || 0))}</td>
                {clientType === 'ecommerce' ? (
                  <>
                    <td className="py-3 px-4 text-right" style={{ color: '#A0A4B8' }}>{fmtInt(atc)}</td>
                    <td className="py-3 px-4 text-right font-semibold" style={{ color: '#D8DDEF' }}>{fmtInt(purchases)}</td>
                    <td className="py-3 px-4 text-right font-bold" style={{ color: roas >= 2 ? '#21D19F' : roas > 0 ? '#F59E0B' : '#EF4444' }}>
                      {fmtX(roas)}
                    </td>
                  </>
                ) : (
                  <td className="py-3 px-4 text-right font-semibold" style={{ color: '#D8DDEF' }}>{fmtInt(leads)}</td>
                )}
                <td className="py-3 px-4 text-center">
                  {isLive(ad) ? (
                    <Badge label={verdict.label} color={verdict.color} />
                  ) : (() => {
                    const badge = getStatusBadge(ad)
                    return (
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}
                      >
                        {badge.label}
                      </span>
                    )
                  })()}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
