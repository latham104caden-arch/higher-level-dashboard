import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import { getCampaignInsights, getRoas, getLeads } from '@/lib/meta'
import { fmtCurrency, fmtX, fmtInt } from '@/lib/utils'

export default async function ClientPerformancePage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'agency') redirect('/dashboard')

  const client = CLIENTS[session.clientId as keyof typeof CLIENTS]
  if (!client) redirect('/')

  let campaigns: any[] = []
  try { campaigns = await getCampaignInsights(client.accountId, 'last_30d') } catch {}

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Last 30 days</p>
        <h1 className="font-serif italic text-3xl sm:text-4xl tracking-tight mb-2" style={{ color: '#F4F5F8' }}>Campaign Performance</h1>
        <p className="text-base" style={{ color: '#8A8F98' }}>How your budget is working for you.</p>
      </div>

      <section className="card overflow-hidden">
        <div className="px-5 sm:px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="font-semibold text-sm" style={{ color: '#F4F5F8' }}>Your Campaigns</p>
          <p className="text-xs mt-0.5" style={{ color: '#5C606C' }}>All active campaigns and their results</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th className="text-left py-3 px-5 sm:px-6 text-xs font-medium" style={{ color: '#5C606C' }}>Campaign</th>
                <th className="text-right py-3 px-4 text-xs font-medium" style={{ color: '#5C606C' }}>Spend</th>
                <th className="text-right py-3 px-4 text-xs font-medium" style={{ color: '#5C606C' }}>
                  {client.type === 'ecommerce' ? 'Return' : 'Leads'}
                </th>
                <th className="text-center py-3 px-5 sm:px-6 text-xs font-medium" style={{ color: '#5C606C' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c: any, i: number) => {
                const roas = getRoas(c)
                const leads = getLeads(c)
                const valueColor = client.type === 'ecommerce'
                  ? (roas >= 2 ? '#21D19F' : roas >= 1 ? '#F59E0B' : '#F4F5F8')
                  : '#21D19F'
                return (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="py-3.5 px-5 sm:px-6 font-medium max-w-xs truncate" style={{ color: '#F4F5F8' }}>{c.campaign_name}</td>
                    <td className="py-3.5 px-4 text-right tnum" style={{ color: '#8A8F98' }}>{fmtCurrency(parseFloat(c.spend || 0))}</td>
                    <td className="py-3.5 px-4 text-right font-semibold tnum" style={{ color: valueColor }}>
                      {client.type === 'ecommerce' ? fmtX(roas) : fmtInt(leads)}
                    </td>
                    <td className="py-3.5 px-5 sm:px-6 text-center">
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded inline-flex items-center gap-1.5"
                        style={{ background: 'rgba(33,209,159,0.08)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.18)' }}
                      >
                        <span className="w-1 h-1 rounded-full bg-current" />
                        Running
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <p className="font-semibold text-sm mb-2" style={{ color: '#21D19F' }}>What does this mean?</p>
        {client.type === 'ecommerce' ? (
          <p className="text-sm leading-relaxed" style={{ color: '#8A8F98' }}>
            <span style={{ color: '#F4F5F8', fontWeight: 600 }}>Return (ROAS)</span> is the most important number — it tells you how many dollars come back for every dollar you spend on ads.
            A <span style={{ color: '#21D19F', fontWeight: 600 }}>2x return</span> means you make $2 for every $1 spent. We're working to push this number higher every week.
          </p>
        ) : (
          <p className="text-sm leading-relaxed" style={{ color: '#8A8F98' }}>
            <span style={{ color: '#F4F5F8', fontWeight: 600 }}>Leads</span> are people who saw your ad and asked for a quote or contacted you.
            The goal is to keep your <span style={{ color: '#21D19F', fontWeight: 600 }}>cost per lead low</span> while bringing in the highest quality customers possible.
          </p>
        )}
      </section>
    </main>
  )
}
