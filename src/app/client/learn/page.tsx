import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import { ClientNav } from '../ClientNav'

const METRICS = [
  { name: 'CPM', full: 'Cost Per 1,000 Impressions', plain: 'How much it costs to show your ad to 1,000 people.', why: 'A lower CPM means your budget goes further — more people see your ad for less money. Good for local businesses: $5–$15. Ecommerce: $15–$40.', good: 'Lower is better. Under $20 is healthy for most campaigns.', color: '#A0CFFF' },
  { name: 'CTR', full: 'Click-Through Rate', plain: 'The percentage of people who saw your ad and clicked on it.', why: "A high CTR means your ad is grabbing attention. A low CTR means the ad isn't connecting with your audience.", good: 'Above 1% is average. Above 2% is good. Above 3% means your creative is working.', color: '#45B69C' },
  { name: 'CPC', full: 'Cost Per Click', plain: 'How much you pay each time someone clicks your ad.', why: "Lower CPC means more people are visiting your site for the same budget. High CPC usually means your ad isn't relevant enough.", good: 'Under $1.50 is solid. Under $0.50 is excellent.', color: '#FFB800' },
  { name: 'ROAS', full: 'Return on Ad Spend', plain: 'For every $1 you spend on ads, how many dollars you make back.', why: "This is the most important number for ecommerce. 1x means you're breaking even. 2x means you're doubling your money.", good: 'Above 2x is profitable. 3x+ is where you start to scale hard.', color: '#21D19F' },
  { name: 'CPL', full: 'Cost Per Lead', plain: 'How much it costs to get one lead or inquiry from your ads.', why: 'If a job is worth $300 to you, paying $50 per lead is great. Paying $200 per lead is a problem.', good: 'Target: 10–20% of your average job value.', color: '#21D19F' },
  { name: 'Impressions', full: 'Total Impressions', plain: 'The total number of times your ad was shown to people.', why: "More impressions means more people seeing your brand. But impressions alone don't mean much — you need clicks and actions.", good: 'Track trends. If impressions drop, your budget ran out or audience is too narrow.', color: '#A0A4B8' },
  { name: 'Frequency', full: 'Ad Frequency', plain: 'How many times the average person has seen your ad.', why: "Seeing an ad once usually isn't enough to act. But 10+ times gets annoying. High frequency + low results = need new creative.", good: '1–3 is ideal. Over 4–5 means you need fresh ads or a bigger audience.', color: '#F59E0B' },
  { name: 'CTR vs CVR', full: 'Click Rate vs Conversion Rate', plain: 'CTR measures who clicked. Conversion rate measures who actually bought or contacted you after clicking.', why: "You can have great CTR (people click) but terrible conversion rate (people leave without buying). That means the problem is your website, not the ad.", good: 'Aim for 2%+ website conversion rate. If people click but don\'t buy, focus on your landing page.', color: '#EF4444' },
]

export default async function LearnPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'agency') redirect('/dashboard')

  const client = CLIENTS[session.clientId as keyof typeof CLIENTS]
  if (!client) redirect('/')

  return (
    <div className="min-h-screen" style={{ background: '#080B14' }}>
      <div className="bg-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="page-content">
        <ClientNav client={client} active="Learn" />

        <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#21D19F' }}>— Education</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2" style={{ color: '#E8ECFF' }}>Learn the Metrics</h1>
            <p className="text-base" style={{ color: '#7B82A0' }}>Plain English — what every number means and why it matters for your business.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {METRICS.map(m => (
              <div
                key={m.name}
                className="rounded-2xl p-6 glass-accent relative overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {/* Corner glow */}
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-20" style={{ background: m.color }} />

                <div className="flex items-start gap-4 relative">
                  <div className="w-1 self-stretch rounded-full flex-shrink-0 mt-1" style={{ background: m.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs font-black px-2.5 py-1 rounded-full"
                        style={{ background: m.color + '18', color: m.color, border: `1px solid ${m.color}30` }}
                      >
                        {m.name}
                      </span>
                      <span className="text-xs" style={{ color: '#484D6D' }}>{m.full}</span>
                    </div>
                    <p className="font-black text-sm mb-2" style={{ color: '#E8ECFF' }}>{m.plain}</p>
                    <p className="text-xs leading-relaxed mb-4" style={{ color: '#7B82A0' }}>{m.why}</p>
                    <div
                      className="rounded-xl px-4 py-2.5 text-xs font-bold"
                      style={{ background: m.color + '10', color: m.color, border: `1px solid ${m.color}20` }}
                    >
                      {m.good}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
