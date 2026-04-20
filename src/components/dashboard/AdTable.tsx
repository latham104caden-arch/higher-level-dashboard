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

export function AdTable({ ads, clientType }: AdTableProps) {
  // Live ads first (sorted by spend), then off ads (sorted by spend)
  const live = [...ads].filter(isLive).sort((a, b) => parseFloat(b.spend) - parseFloat(a.spend))
  const off = [...ads].filter(a => !isLive(a)).sort((a, b) => parseFloat(b.spend) - parseFloat(a.spend))
  const sorted = [...live, ...off]

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
                  opacity: isLive(ad) ? 1 : 0.45,
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
                  {!isLive(ad) ? (
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(72,77,109,0.3)', color: '#484D6D', border: '1px solid rgba(168,174,210,0.1)' }}
                    >
                      OFF
                    </span>
                  ) : (
                    <Badge label={verdict.label} color={verdict.color} />
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
