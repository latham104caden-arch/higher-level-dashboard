import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import { getAccountInsights, getRoas, getPurchases, getLeads } from '@/lib/meta'
import { fmtCurrency, fmtX, fmtInt } from '@/lib/utils'
import Link from 'next/link'

export default async function ClientPortalPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'agency') redirect('/dashboard')

  const client = CLIENTS[session.clientId as keyof typeof CLIENTS]
  if (!client) redirect('/')

  let insights: any = null
  try { insights = await getAccountInsights(client.accountId, 'last_30d') } catch {}

  const spend = parseFloat(insights?.spend || 0)
  const roas = getRoas(insights)
  const purchases = getPurchases(insights)
  const leads = getLeads(insights)
  const revenue = roas * spend
  const ctr = parseFloat(insights?.ctr || 0)

  const metrics = client.type === 'ecommerce'
    ? [
        { label: 'Ad Spend', value: fmtCurrency(spend), sub: 'Last 30 days', color: '#A0A4B8' },
        { label: 'Revenue Generated', value: fmtCurrency(revenue), sub: 'From your ads', color: '#21D19F' },
        { label: 'Return on Ad Spend', value: fmtX(roas), sub: 'For every $1 spent', color: roas >= 2 ? '#21D19F' : roas >= 1 ? '#F59E0B' : '#EF4444' },
        { label: 'Total Purchases', value: fmtInt(purchases), sub: 'Orders from ads', color: '#45B69C' },
      ]
    : [
        { label: 'Ad Spend', value: fmtCurrency(spend), sub: 'Last 30 days', color: '#A0A4B8' },
        { label: 'Total Leads', value: fmtInt(leads), sub: 'Quote requests', color: '#21D19F' },
        { label: 'Cost Per Lead', value: leads > 0 ? fmtCurrency(spend / leads) : '—', sub: 'Per inquiry', color: '#45B69C' },
        { label: 'Click Rate', value: ctr > 0 ? ctr.toFixed(2) + '%' : '—', sub: 'Who clicked your ad', color: '#A0CFFF' },
      ]

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
                { href: '/client', label: 'Overview', active: true },
                { href: '/client/performance', label: 'Performance', active: false },
                { href: '/client/grow', label: 'Grow', active: false },
                { href: '/client/learn', label: 'Learn', active: false },
                { href: '/client/quiz', label: 'Quiz', active: false },
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
              <Link
                href="/logout"
                className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all ml-2"
                style={{ color: '#484D6D', border: '1px solid transparent' }}
              >
                Sign out
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-8 py-12 space-y-8">
          {/* Welcome */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#21D19F' }}>— Last 30 Days</p>
            <h1 className="text-4xl font-black tracking-tight mb-2" style={{ color: '#E8ECFF' }}>
              Good morning 👋
            </h1>
            <p className="text-base" style={{ color: '#7B82A0' }}>
              Here's how your campaigns are performing.
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {metrics.map((m, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 relative overflow-hidden glass-accent"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-25" style={{ background: m.color }} />
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#484D6D' }}>{m.label}</p>
                <p className="text-2xl font-black tracking-tight mb-1" style={{ color: m.color }}>{m.value}</p>
                <p className="text-xs" style={{ color: '#484D6D' }}>{m.sub}</p>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link href="/client/performance">
              <div
                className="rounded-2xl p-7 cursor-pointer group relative overflow-hidden glass-accent transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: '#21D19F' }} />
                <div className="text-3xl mb-4">📊</div>
                <h3 className="font-black text-lg mb-2" style={{ color: '#E8ECFF' }}>Campaign Performance</h3>
                <p className="text-sm mb-5" style={{ color: '#7B82A0' }}>See your campaigns and how your budget is working.</p>
                <p className="text-sm font-black" style={{ color: '#21D19F' }}>View Report →</p>
              </div>
            </Link>
            <Link href="/client/learn">
              <div
                className="rounded-2xl p-7 cursor-pointer group relative overflow-hidden glass-accent transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: '#45B69C' }} />
                <div className="text-3xl mb-4">📖</div>
                <h3 className="font-black text-lg mb-2" style={{ color: '#E8ECFF' }}>Learn the Metrics</h3>
                <p className="text-sm mb-5" style={{ color: '#7B82A0' }}>Plain English explanations of every number and what it means.</p>
                <p className="text-sm font-black" style={{ color: '#45B69C' }}>Start Learning →</p>
              </div>
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
