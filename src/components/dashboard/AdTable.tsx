'use client'

import { Badge } from '@/components/ui/Badge'
import { adVerdict, getRoas, getPurchases, getLeads, getATC, getCheckouts } from '@/lib/meta'
import { fmtCurrency, fmtPct, fmtX, fmtInt, fmt } from '@/lib/utils'

interface AdTableProps {
  ads: any[]
  clientType: string
}

export function AdTable({ ads, clientType }: AdTableProps) {
  const sorted = [...ads].sort((a, b) => parseFloat(b.spend) - parseFloat(a.spend))

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Ad</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Spend</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Impressions</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">CTR</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">CPC</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">CPM</th>
            {clientType === 'ecommerce' ? (
              <>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">ATC</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Purchases</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">ROAS</th>
              </>
            ) : (
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Leads</th>
            )}
            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Verdict</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sorted.map((ad, i) => {
            const verdict = adVerdict(ad, clientType)
            const roas = getRoas(ad)
            const purchases = getPurchases(ad)
            const leads = getLeads(ad)
            const atc = getATC(ad)
            const spend = parseFloat(ad.spend || 0)

            return (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-900 max-w-[200px] truncate">
                  {ad.ad_name}
                </td>
                <td className="py-3 px-4 text-right text-gray-700">{fmtCurrency(spend)}</td>
                <td className="py-3 px-4 text-right text-gray-500">{fmtInt(parseFloat(ad.impressions || 0))}</td>
                <td className="py-3 px-4 text-right text-gray-700">{fmtPct(parseFloat(ad.ctr || 0))}</td>
                <td className="py-3 px-4 text-right text-gray-700">{fmtCurrency(parseFloat(ad.cpc || 0))}</td>
                <td className="py-3 px-4 text-right text-gray-700">{fmtCurrency(parseFloat(ad.cpm || 0))}</td>
                {clientType === 'ecommerce' ? (
                  <>
                    <td className="py-3 px-4 text-right text-gray-700">{fmtInt(atc)}</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">{fmtInt(purchases)}</td>
                    <td className="py-3 px-4 text-right font-bold" style={{ color: roas >= 2 ? '#22C55E' : roas > 0 ? '#F59E0B' : '#EF4444' }}>
                      {fmtX(roas)}
                    </td>
                  </>
                ) : (
                  <td className="py-3 px-4 text-right font-semibold text-gray-900">{fmtInt(leads)}</td>
                )}
                <td className="py-3 px-4 text-center">
                  <Badge label={verdict.label} color={verdict.color} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
