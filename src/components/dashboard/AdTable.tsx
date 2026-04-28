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
    return { label: 'In review', bg: 'rgba(94,106,210,0.1)', color: '#5E6AD2', border: 'rgba(94,106,210,0.2)' }
  if (s === 'IN_PROCESS')
    return { label: 'Processing', bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: 'rgba(245,158,11,0.2)' }
  if (s === 'DISAPPROVED' || s === 'WITH_ISSUES')
    return { label: s === 'DISAPPROVED' ? 'Rejected' : 'Issues', bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: 'rgba(245,158,11,0.2)' }
  if (s === 'PAUSED' || s === 'CAMPAIGN_PAUSED' || s === 'ADSET_PAUSED')
    return { label: 'Paused', bg: '#1A1B20', color: '#8A8F98', border: 'rgba(255,255,255,0.08)' }
  return { label: 'Off', bg: '#1A1B20', color: '#5C606C', border: 'rgba(255,255,255,0.06)' }
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
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <th className="text-left py-3 px-4 text-xs font-medium" style={{ color: '#5C606C' }}>Ad</th>
            <th className="text-right py-3 px-4 text-xs font-medium" style={{ color: '#5C606C' }}>Spend</th>
            <th className="text-right py-3 px-4 text-xs font-medium" style={{ color: '#5C606C' }}>Impressions</th>
            <th className="text-right py-3 px-4 text-xs font-medium" style={{ color: '#5C606C' }}>CTR</th>
            <th className="text-right py-3 px-4 text-xs font-medium" style={{ color: '#5C606C' }}>CPC</th>
            <th className="text-right py-3 px-4 text-xs font-medium" style={{ color: '#5C606C' }}>CPM</th>
            {clientType === 'ecommerce' ? (
              <>
                <th className="text-right py-3 px-4 text-xs font-medium" style={{ color: '#5C606C' }}>ATC</th>
                <th className="text-right py-3 px-4 text-xs font-medium" style={{ color: '#5C606C' }}>Purchases</th>
                <th className="text-right py-3 px-4 text-xs font-medium" style={{ color: '#5C606C' }}>ROAS</th>
              </>
            ) : (
              <th className="text-right py-3 px-4 text-xs font-medium" style={{ color: '#5C606C' }}>Leads</th>
            )}
            <th className="text-center py-3 px-4 text-xs font-medium" style={{ color: '#5C606C' }}>Verdict</th>
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
            const roasColor = roas >= 2 ? '#21D19F' : roas > 0 ? '#F59E0B' : '#F4F5F8'

            return (
              <tr
                key={i}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  opacity: isLive(ad) ? 1 : isPending(ad) ? 0.8 : 0.5,
                }}
              >
                <td className="py-3 px-4 font-medium max-w-[200px] truncate" style={{ color: '#F4F5F8' }}>
                  {ad.ad_name}
                </td>
                <td className="py-3 px-4 text-right tnum" style={{ color: '#F4F5F8' }}>{fmtCurrency(spend)}</td>
                <td className="py-3 px-4 text-right tnum" style={{ color: '#8A8F98' }}>{fmtInt(parseFloat(ad.impressions || 0))}</td>
                <td className="py-3 px-4 text-right tnum" style={{ color: '#F4F5F8' }}>{fmtPct(parseFloat(ad.ctr || 0))}</td>
                <td className="py-3 px-4 text-right tnum" style={{ color: '#F4F5F8' }}>{fmtCurrency(parseFloat(ad.cpc || 0))}</td>
                <td className="py-3 px-4 text-right tnum" style={{ color: '#F4F5F8' }}>{fmtCurrency(parseFloat(ad.cpm || 0))}</td>
                {clientType === 'ecommerce' ? (
                  <>
                    <td className="py-3 px-4 text-right tnum" style={{ color: '#8A8F98' }}>{fmtInt(atc)}</td>
                    <td className="py-3 px-4 text-right font-semibold tnum" style={{ color: '#F4F5F8' }}>{fmtInt(purchases)}</td>
                    <td className="py-3 px-4 text-right font-semibold tnum" style={{ color: roasColor }}>
                      {fmtX(roas)}
                    </td>
                  </>
                ) : (
                  <td className="py-3 px-4 text-right font-semibold tnum" style={{ color: '#F4F5F8' }}>{fmtInt(leads)}</td>
                )}
                <td className="py-3 px-4 text-center">
                  {isLive(ad) ? (
                    <Badge label={verdict.label} color={verdict.color} />
                  ) : (() => {
                    const badge = getStatusBadge(ad)
                    return (
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded"
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
