import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import { getAccountInsights, getAdInsights, getRoas, getPurchases, getLeads } from '@/lib/meta'
import { fmtCurrency, fmtX, fmtInt } from '@/lib/utils'
import Link from 'next/link'

export default async function ClientPortalPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'agency') redirect('/dashboard')

  const client = CLIENTS[session.clientId as keyof typeof CLIENTS]
  if (!client) redirect('/')

  let insights: any = null
  try {
    insights = await getAccountInsights(client.accountId, 'last_30d')
  } catch {}

  const spend = parseFloat(insights?.spend || 0)
  const roas = getRoas(insights)
  const purchases = getPurchases(insights)
  const leads = getLeads(insights)
  const revenue = roas * spend
  const ctr = parseFloat(insights?.ctr || 0)

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ background: client.color }}>
              {client.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{client.name}</p>
              <p className="text-xs text-gray-400">Campaign Portal</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/client" className="font-semibold" style={{ color: '#6366F1' }}>Overview</Link>
            <Link href="/client/performance" className="text-gray-400 hover:text-gray-700">Performance</Link>
            <Link href="/client/learn" className="text-gray-400 hover:text-gray-700">Learn</Link>
            <Link href="/logout" className="text-gray-400 hover:text-gray-600">Sign out</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning 👋</h1>
          <p className="text-gray-400 text-sm mt-1">Here's how your campaigns are performing over the last 30 days.</p>
        </div>

        {/* Key Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Money Spent</p>
            <p className="text-2xl font-bold text-gray-900">{fmtCurrency(spend)}</p>
            <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
          </div>
          {client.type === 'ecommerce' ? (
            <>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Revenue Generated</p>
                <p className="text-2xl font-bold text-gray-900">{fmtCurrency(revenue)}</p>
                <p className="text-xs text-gray-400 mt-1">From ads</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Return on Ad Spend</p>
                <p className="text-2xl font-bold" style={{ color: roas >= 2 ? '#16A34A' : roas >= 1 ? '#D97706' : '#DC2626' }}>{fmtX(roas)}</p>
                <p className="text-xs text-gray-400 mt-1">For every $1 spent</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Purchases</p>
                <p className="text-2xl font-bold text-gray-900">{fmtInt(purchases)}</p>
                <p className="text-xs text-gray-400 mt-1">Orders from ads</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{fmtInt(leads)}</p>
                <p className="text-xs text-gray-400 mt-1">Quote requests</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Cost Per Lead</p>
                <p className="text-2xl font-bold text-gray-900">{leads > 0 ? fmtCurrency(spend / leads) : '—'}</p>
                <p className="text-xs text-gray-400 mt-1">Per quote request</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Ad Click Rate</p>
                <p className="text-2xl font-bold text-gray-900">{ctr > 0 ? ctr.toFixed(2) + '%' : '—'}</p>
                <p className="text-xs text-gray-400 mt-1">Who clicked your ad</p>
              </div>
            </>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/client/performance">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-bold text-gray-900 mb-1">View Full Performance</h3>
              <p className="text-gray-400 text-sm">See every campaign, ad, and metric in detail.</p>
              <p className="text-sm font-medium mt-3" style={{ color: '#6366F1' }}>View Report →</p>
            </div>
          </Link>
          <Link href="/client/learn">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-2xl mb-2">📖</div>
              <h3 className="font-bold text-gray-900 mb-1">Learn the Metrics</h3>
              <p className="text-gray-400 text-sm">Plain English explanations of every number and what it means for your business.</p>
              <p className="text-sm font-medium mt-3" style={{ color: '#6366F1' }}>Start Learning →</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
