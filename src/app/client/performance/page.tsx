import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import { getCampaignInsights, getRoas, getLeads } from '@/lib/meta'
import { fmtCurrency, fmtX, fmtInt } from '@/lib/utils'
import Link from 'next/link'

export default async function ClientPerformancePage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'agency') redirect('/dashboard')

  const client = CLIENTS[session.clientId as keyof typeof CLIENTS]
  if (!client) redirect('/')

  let campaigns: any[] = []
  try { campaigns = await getCampaignInsights(client.accountId, 'last_30d') } catch {}

  return (
    <div className="min-h-screen" style={{ background: '#080B14' }}>
      <div className="bg-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="page-content">
        {/* Header */}
        <header
          className="px-6 py-4 sticky top-0 z-10"
          style={{
            background: 'rgba(8,11,20,0.85)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
                style={{ background: `linear-gradient(135deg, ${client.color}33, ${client.color}55)`, border: `1px solid ${client.color}44`, color: client.color }}
              >
                {client.name.charAt(0)}
              </div>
              <div>
                <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>{client.name}</p>
                <p className="text-xs" style={{ color: '#484D6D' }}>Campaign Portal</p>
              </div>
            </div>
            <nav className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { href: '/client', label: 'Overview', active: false },
                { href: '/client/performance', label: 'Performance', active: true },
                { href: '/client/learn', label: 'Learn', active: false },
              ].map(n => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={n.active
                    ? { background: 'rgba(33,209,159,0.12)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }
                    : { color: '#7B82A0', border: '1px solid transparent' }
                  }
                >
                  {n.label}
                </Link>
              ))}
              <Link href="/logout" className="px-4 py-1.5 rounded-lg text-xs font-bold ml-2" style={{ color: '#484D6D', border: '1px solid transparent' }}>
                Sign out
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-8 py-12 space-y-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#21D19F' }}>— Last 30 Days</p>
            <h1 className="text-4xl font-black tracking-tight mb-2" style={{ color: '#E8ECFF' }}>Campaign Performance</h1>
            <p className="text-base" style={{ color: '#7B82A0' }}>How your budget is working for you.</p>
          </div>

          {/* Campaigns */}
          <div
            className="rounded-2xl overflow-hidden glass-accent"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="px-7 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>Your Campaigns</p>
              <p className="text-xs mt-0.5" style={{ color: '#484D6D' }}>All active campaigns and their results</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <th className="text-left py-4 px-7 text-xs font-bold uppercase tracking-widest" style={{ color: '#484D6D' }}>Campaign</th>
                    <th className="text-right py-4 px-5 text-xs font-bold uppercase tracking-widest" style={{ color: '#484D6D' }}>Spend</th>
                    <th className="text-right py-4 px-5 text-xs font-bold uppercase tracking-widest" style={{ color: '#484D6D' }}>
                      {client.type === 'ecommerce' ? 'Return' : 'Leads'}
                    </th>
                    <th className="text-center py-4 px-7 text-xs font-bold uppercase tracking-widest" style={{ color: '#484D6D' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c: any, i: number) => {
                    const roas = getRoas(c)
                    const leads = getLeads(c)
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="py-4 px-7 font-bold max-w-xs truncate" style={{ color: '#E8ECFF' }}>{c.campaign_name}</td>
                        <td className="py-4 px-5 text-right" style={{ color: '#A0A4B8' }}>{fmtCurrency(parseFloat(c.spend || 0))}</td>
                        <td className="py-4 px-5 text-right font-black" style={{ color: client.type === 'ecommerce' ? (roas >= 2 ? '#21D19F' : roas >= 1 ? '#F59E0B' : '#EF4444') : '#21D19F' }}>
                          {client.type === 'ecommerce' ? fmtX(roas) : fmtInt(leads)}
                        </td>
                        <td className="py-4 px-7 text-center">
                          <span
                            className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit mx-auto"
                            style={{ background: 'rgba(33,209,159,0.08)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            Running
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* What these numbers mean */}
          <div
            className="rounded-2xl p-7 glass-accent"
            style={{ background: 'rgba(33,209,159,0.04)', border: '1px solid rgba(33,209,159,0.12)', backdropFilter: 'blur(20px)' }}
          >
            <p className="font-black text-sm mb-3" style={{ color: '#21D19F' }}>What does this mean?</p>
            {client.type === 'ecommerce' ? (
              <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>
                <span style={{ color: '#E8ECFF', fontWeight: 700 }}>Return (ROAS)</span> is the most important number — it tells you how many dollars come back for every dollar you spend on ads.
                A <span style={{ color: '#21D19F', fontWeight: 700 }}>2x return</span> means you make $2 for every $1 spent. We're working to push this number higher every week.
              </p>
            ) : (
              <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>
                <span style={{ color: '#E8ECFF', fontWeight: 700 }}>Leads</span> are people who saw your ad and asked for a quote or contacted you.
                The goal is to keep your <span style={{ color: '#21D19F', fontWeight: 700 }}>cost per lead low</span> while bringing in the highest quality customers possible.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
