import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import { getAdInsights, getCampaignInsights, adVerdict, getRoas, getPurchases, getLeads } from '@/lib/meta'
import { fmtCurrency, fmtPct, fmtX, fmtInt } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

export default async function ClientPerformancePage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'agency') redirect('/dashboard')

  const client = CLIENTS[session.clientId as keyof typeof CLIENTS]
  if (!client) redirect('/')

  let ads: any[] = []
  let campaigns: any[] = []
  try {
    ;[ads, campaigns] = await Promise.all([
      getAdInsights(client.accountId, 'last_30d'),
      getCampaignInsights(client.accountId, 'last_30d'),
    ])
  } catch {}

  const sorted = [...ads].sort((a, b) => parseFloat(b.spend) - parseFloat(a.spend))

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ background: client.color }}>
              {client.name.charAt(0)}
            </div>
            <p className="font-bold text-gray-900 text-sm">{client.name}</p>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/client" className="text-gray-400 hover:text-gray-700">Overview</Link>
            <Link href="/client/performance" className="font-semibold" style={{ color: '#6366F1' }}>Performance</Link>
            <Link href="/client/learn" className="text-gray-400 hover:text-gray-700">Learn</Link>
            <Link href="/logout" className="text-gray-400 hover:text-gray-600">Sign out</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaign Performance</h1>
          <p className="text-gray-400 text-sm mt-1">Last 30 days · All active ads</p>
        </div>

        {/* Campaign Summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="font-semibold text-gray-900 text-sm">Campaigns</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Campaign</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Spend</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {client.type === 'ecommerce' ? 'ROAS' : 'Leads'}
                </th>
                <th className="text-center py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.map((c: any, i: number) => {
                const roas = getRoas(c)
                const leads = getLeads(c)
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium text-gray-900">{c.campaign_name}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{fmtCurrency(parseFloat(c.spend || 0))}</td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900">
                      {client.type === 'ecommerce' ? fmtX(roas) : fmtInt(leads)}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Running</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Ad Performance — simplified for client */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="font-semibold text-gray-900 text-sm">Individual Ads</p>
            <p className="text-xs text-gray-400 mt-0.5">How each ad is performing for your budget</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Ad Name</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Budget Used</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">People Reached</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Click Rate</th>
                  {client.type === 'ecommerce' ? (
                    <>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sales</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Return</th>
                    </>
                  ) : (
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Leads</th>
                  )}
                  <th className="text-center py-3 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sorted.map((ad: any, i: number) => {
                  const verdict = adVerdict(ad, client.type)
                  const roas = getRoas(ad)
                  const purchases = getPurchases(ad)
                  const leads = getLeads(ad)
                  const clientLabels: Record<string, string> = {
                    KILL: 'Underperforming',
                    SCALE: 'Top Performer',
                    KEEP: 'Performing',
                    WATCH: 'Monitoring',
                    TEST: 'In Testing',
                  }
                  const clientColors: Record<string, string> = {
                    KILL: '#EF4444',
                    SCALE: '#22C55E',
                    KEEP: '#3B82F6',
                    WATCH: '#F59E0B',
                    TEST: '#8B5CF6',
                  }
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-3 px-6 font-medium text-gray-900 max-w-[180px] truncate">{ad.ad_name}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{fmtCurrency(parseFloat(ad.spend || 0))}</td>
                      <td className="py-3 px-4 text-right text-gray-500">{fmtInt(parseFloat(ad.impressions || 0))}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{fmtPct(parseFloat(ad.ctr || 0))}</td>
                      {client.type === 'ecommerce' ? (
                        <>
                          <td className="py-3 px-4 text-right font-semibold text-gray-900">{fmtInt(purchases)}</td>
                          <td className="py-3 px-4 text-right font-bold" style={{ color: roas >= 2 ? '#22C55E' : roas > 0 ? '#F59E0B' : '#9CA3AF' }}>
                            {fmtX(roas)}
                          </td>
                        </>
                      ) : (
                        <td className="py-3 px-4 text-right font-semibold text-gray-900">{fmtInt(leads)}</td>
                      )}
                      <td className="py-3 px-6 text-center">
                        <Badge label={clientLabels[verdict.label] || verdict.label} color={clientColors[verdict.label] || verdict.color} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
