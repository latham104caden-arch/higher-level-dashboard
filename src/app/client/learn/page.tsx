import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import Link from 'next/link'

const METRICS = [
  {
    name: 'CPM',
    full: 'Cost Per 1,000 Impressions',
    emoji: '👁️',
    plain: 'How much it costs to show your ad to 1,000 people.',
    why: 'A lower CPM means your budget goes further — more people see your ad for less money. Good for local businesses: $5–$15. Ecommerce: $15–$40.',
    good: 'Lower is better. Under $20 is healthy for most campaigns.',
    color: '#6366F1',
  },
  {
    name: 'CTR',
    full: 'Click-Through Rate',
    emoji: '🖱️',
    plain: 'The percentage of people who saw your ad and clicked on it.',
    why: 'A high CTR means your ad is grabbing attention and making people want to learn more. A low CTR means the ad isn\'t connecting with your audience.',
    good: 'Above 1% is average. Above 2% is good. Above 3% means your creative is working.',
    color: '#8B5CF6',
  },
  {
    name: 'CPC',
    full: 'Cost Per Click',
    emoji: '💰',
    plain: 'How much you pay each time someone clicks your ad.',
    why: 'Lower CPC means more people are visiting your site or landing page for the same budget. High CPC usually means your ad isn\'t relevant enough to the audience.',
    good: 'Under $1.50 is solid for most campaigns. Under $0.50 is excellent.',
    color: '#EC4899',
  },
  {
    name: 'ROAS',
    full: 'Return on Ad Spend',
    emoji: '📈',
    plain: 'For every $1 you spend on ads, how many dollars you make back.',
    why: 'This is the most important number for ecommerce. 1x means you\'re breaking even. 2x means you\'re doubling your money. Anything under 1x means you\'re losing money on ads.',
    good: 'Above 2x is profitable for most businesses. 3x+ is where you start to scale.',
    color: '#22C55E',
  },
  {
    name: 'CPA / CPL',
    full: 'Cost Per Acquisition / Cost Per Lead',
    emoji: '🎯',
    plain: 'How much it costs to get one customer or one lead inquiry.',
    why: 'This tells you if your ads are efficient. If a job is worth $300 to you, paying $50 per lead is great. Paying $200 per lead is a problem.',
    good: 'Depends on your average job value. Target: 10–20% of your average sale.',
    color: '#F59E0B',
  },
  {
    name: 'Impressions',
    full: 'Impressions',
    emoji: '📣',
    plain: 'The total number of times your ad was shown to people.',
    why: 'More impressions means more people seeing your brand. But impressions alone don\'t mean much — you need people to click and take action.',
    good: 'Track trends. If impressions drop, your budget ran out or your audience is too narrow.',
    color: '#06B6D4',
  },
  {
    name: 'Frequency',
    full: 'Ad Frequency',
    emoji: '🔁',
    plain: 'How many times the average person has seen your ad.',
    why: 'Seeing an ad once usually isn\'t enough to act. But seeing it 10+ times gets annoying. High frequency with low results means people are tuning your ad out — time for new creative.',
    good: '1–3 is ideal. Over 4–5 means you need fresh ads or a bigger audience.',
    color: '#F97316',
  },
  {
    name: 'CTR vs Conversion Rate',
    full: 'Why These Are Different',
    emoji: '⚡',
    plain: 'CTR measures who clicked your ad. Conversion rate measures who actually bought or contacted you after clicking.',
    why: 'You can have a great CTR (people click) but a terrible conversion rate (people leave your site without buying). When that happens, the problem isn\'t the ad — it\'s the website or checkout.',
    good: 'Aim for 2%+ website conversion rate. If people are clicking but not buying, focus on your landing page.',
    color: '#EF4444',
  },
]

export default async function LearnPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'agency') redirect('/dashboard')

  const client = CLIENTS[session.clientId as keyof typeof CLIENTS]
  if (!client) redirect('/')

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
            <Link href="/client/performance" className="text-gray-400 hover:text-gray-700">Performance</Link>
            <Link href="/client/learn" className="font-semibold" style={{ color: '#6366F1' }}>Learn</Link>
            <Link href="/logout" className="text-gray-400 hover:text-gray-600">Sign out</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Learn the Metrics</h1>
          <p className="text-gray-400 text-sm mt-1">Plain English explanations of what every number means and why it matters for your business.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {METRICS.map(m => (
            <div key={m.name} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="text-2xl">{m.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: m.color }}>
                      {m.name}
                    </span>
                    <span className="text-xs text-gray-400">{m.full}</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm mb-2">{m.plain}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{m.why}</p>
                  <div className="rounded-lg px-3 py-2 text-xs font-medium" style={{ background: m.color + '12', color: m.color }}>
                    ✓ {m.good}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
