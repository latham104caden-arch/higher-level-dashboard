import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import { getAccountInsights, getRoas, getPurchases, getLeads, getLPV, getATC, getCheckouts } from '@/lib/meta'
import { fmtCurrency, fmtX, fmtInt } from '@/lib/utils'
import Link from 'next/link'
import { Greeting } from './Greeting'

function generateAgencyMessage(clientType: string, spend: number, roas: number, leads: number, cpl: number, ctr: number, impressions: number, purchases: number): string {
  if (clientType === 'ecommerce') {
    if (roas >= 3.5) {
      return `Your campaigns are running at ${fmtX(roas)} ROAS this month — well above the 3x threshold we target before scaling hard. We're pushing budget into the top performers and testing new creatives to sustain momentum. Expect increased spend over the next 7 days.`
    } else if (roas >= 2.5) {
      return `You're sitting at a healthy ${fmtX(roas)} ROAS on ${fmtCurrency(spend)} in spend. We're in the optimization phase — tightening audiences and pruning underperformers to push that return higher. On track for a strong month.`
    } else if (roas >= 1.5) {
      return `Your campaigns are producing ${fmtX(roas)} ROAS this month. We're profitable, but there's room to climb. We've identified 2–3 ad sets pulling the average down and are reallocating budget toward what's converting. You should see the ROAS climb over the next week.`
    } else if (roas >= 1) {
      return `Breaking even at ${fmtX(roas)} ROAS on ${fmtCurrency(spend)} in spend. We're running creative tests this week to find angles that convert — the click-through rate is solid at ${ctr.toFixed(2)}%, so the issue is post-click. Landing page and offer are the focus right now.`
    } else if (spend > 0) {
      return `We're in the learning phase — ${fmtCurrency(spend)} spent while Meta's algorithm gathers data. This is normal in the first 7–14 days. We're watching closely and will make targeting adjustments this week. Expect results to stabilize shortly.`
    } else {
      return `Your campaigns are being set up. We'll have performance data to share within the first 48–72 hours of going live. Watch this space.`
    }
  } else {
    if (leads > 0 && cpl > 0 && cpl < 30) {
      return `Strong results this month — ${fmtInt(leads)} leads at ${fmtCurrency(cpl)} per lead. That's a healthy cost per inquiry for your market. We're testing new hooks this week to bring volume up while keeping CPL low. Follow up with every lead fast — speed to contact is everything.`
    } else if (leads > 0 && cpl > 0) {
      return `${fmtInt(leads)} leads in so far at ${fmtCurrency(cpl)} cost per lead. We're working to bring that CPL down by refining the audience and testing offer angles. Your click-through rate is at ${ctr.toFixed(2)}% — the ad is grabbing attention, it's a targeting refinement from here.`
    } else if (spend > 0) {
      return `Your campaigns are generating traffic — ${fmtCurrency(spend)} spent with ${impressions.toLocaleString()} impressions and a ${ctr.toFixed(2)}% click-through rate. We're monitoring lead form completions and will adjust targeting if volume doesn't pick up this week.`
    } else {
      return `Your campaigns are being finalized. We'll have live performance data within 48–72 hours of launch. We'll keep you updated as results come in.`
    }
  }
}

export default async function ClientPortalPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'agency') redirect('/dashboard')

  const client = CLIENTS[session.clientId as keyof typeof CLIENTS]
  if (!client) redirect('/')

  let insights: any = null
  try { insights = await getAccountInsights(client.accountId, 'last_30d') } catch {}

  const spend = parseFloat(insights?.spend || 0)
  const impressions = parseInt(insights?.impressions || 0)
  const clicks = parseInt(insights?.clicks || 0)
  const roas = getRoas(insights)
  const purchases = getPurchases(insights)
  const leads = getLeads(insights)
  const revenue = roas * spend
  const ctr = parseFloat(insights?.ctr || 0)
  const cpl = leads > 0 ? spend / leads : 0
  const lpv = getLPV(insights)
  const atc = getATC(insights)
  const checkouts = getCheckouts(insights)

  const funnelSteps = client.type === 'ecommerce'
    ? [
        { label: 'Impressions', value: fmtInt(impressions), raw: impressions },
        { label: 'Clicks', value: fmtInt(clicks), raw: clicks, rate: impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) + '% CTR' : null },
        { label: 'Page Views', value: fmtInt(lpv), raw: lpv, rate: clicks > 0 && lpv > 0 ? ((lpv / clicks) * 100).toFixed(0) + '% of clicks' : null },
        { label: 'Add to Cart', value: fmtInt(atc), raw: atc, rate: lpv > 0 && atc > 0 ? ((atc / lpv) * 100).toFixed(0) + '% of views' : null },
        { label: 'Purchases', value: fmtInt(purchases), raw: purchases, rate: atc > 0 && purchases > 0 ? ((purchases / atc) * 100).toFixed(0) + '% of carts' : null },
      ]
    : [
        { label: 'Impressions', value: fmtInt(impressions), raw: impressions },
        { label: 'Clicks', value: fmtInt(clicks), raw: clicks, rate: impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) + '% CTR' : null },
        { label: 'Page Views', value: fmtInt(lpv), raw: lpv, rate: clicks > 0 && lpv > 0 ? ((lpv / clicks) * 100).toFixed(0) + '% of clicks' : null },
        { label: 'Leads', value: fmtInt(leads), raw: leads, rate: lpv > 0 && leads > 0 ? ((leads / lpv) * 100).toFixed(0) + '% of views' : null },
      ]

  type Tone = 'neutral' | 'positive' | 'attention'
  const metrics: { label: string; value: string; sub: string; tone: Tone }[] = client.type === 'ecommerce'
    ? [
        { label: 'Ad Spend', value: fmtCurrency(spend), sub: 'Last 30 days', tone: 'neutral' },
        { label: 'Revenue Generated', value: fmtCurrency(revenue), sub: 'From your ads', tone: 'positive' },
        { label: 'Return on Ad Spend', value: fmtX(roas), sub: 'For every $1 spent', tone: roas >= 2 ? 'positive' : roas >= 1 ? 'attention' : 'neutral' },
        { label: 'Total Purchases', value: fmtInt(purchases), sub: 'Orders from ads', tone: 'neutral' },
      ]
    : [
        { label: 'Ad Spend', value: fmtCurrency(spend), sub: 'Last 30 days', tone: 'neutral' },
        { label: 'Total Leads', value: fmtInt(leads), sub: 'Quote requests', tone: 'positive' },
        { label: 'Cost Per Lead', value: leads > 0 ? fmtCurrency(spend / leads) : '—', sub: 'Per inquiry', tone: 'neutral' },
        { label: 'Click Rate', value: ctr > 0 ? ctr.toFixed(2) + '%' : '—', sub: 'Who clicked your ad', tone: 'neutral' },
      ]

  const toneColor = (t: Tone) =>
    t === 'positive' ? '#21D19F' : t === 'attention' ? '#F59E0B' : '#F4F5F8'

  const agencyMessage = generateAgencyMessage(client.type, spend, roas, leads, cpl, ctr, impressions, purchases)

  const quickLinks = [
    {
      href: '/client/performance',
      title: 'Campaign Performance',
      desc: 'See your campaigns and how your budget is working.',
      accent: '#5E6AD2',
    },
    {
      href: '/client/grow',
      title: 'Growth Playbook',
      desc: 'Website, content, follow-up, SMS, and email tips to maximize results.',
      accent: '#F59E0B',
    },
    {
      href: '/client/learn',
      title: 'Learn the Metrics',
      desc: 'Plain English explanations of every number and what it means.',
      accent: '#21D19F',
    },
    {
      href: '/client/quiz',
      title: 'Business Quiz',
      desc: 'Test your knowledge on scaling, ads, and growing a successful business.',
      accent: '#5E6AD2',
    },
  ]

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-12">
      <div>
        <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Last 30 days</p>
        <Greeting />
        <p className="text-base mt-2" style={{ color: '#8A8F98' }}>
          Here's how your campaigns are performing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        {metrics.map((m, i) => (
          <div key={i} className="p-5" style={{ background: '#15161A' }}>
            <p className="text-xs font-medium mb-2" style={{ color: '#5C606C' }}>{m.label}</p>
            <p className="text-2xl font-semibold tracking-tight tnum mb-1" style={{ color: toneColor(m.tone) }}>{m.value}</p>
            <p className="text-xs" style={{ color: '#5C606C' }}>{m.sub}</p>
          </div>
        ))}
      </div>

      <section className="card p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: '#5E6AD2' }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#5E6AD2' }} />
          </span>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#8A8F98' }}>Higher Level</p>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ color: '#21D19F', background: 'rgba(33,209,159,0.08)', border: '1px solid rgba(33,209,159,0.18)' }}>
            Update
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: '#C8CBD3' }}>{agencyMessage}</p>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-base font-semibold" style={{ color: '#F4F5F8' }}>Ad funnel</h2>
          <p className="text-xs" style={{ color: '#5C606C' }}>Last 30 days</p>
        </div>
        <div className="card">
          {funnelSteps.map((step, i) => {
            const maxRaw = funnelSteps[0].raw || 1
            const pct = Math.round((step.raw / maxRaw) * 100)
            const accent = i === funnelSteps.length - 1 ? '#21D19F' : i === 0 ? '#5E6AD2' : '#8A8F98'
            return (
              <div key={i} className="px-4 sm:px-5 py-3.5" style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium" style={{ color: '#F4F5F8' }}>{step.label}</p>
                  <p className="text-sm font-semibold tnum" style={{ color: '#F4F5F8' }}>{step.value}</p>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: accent }} />
                </div>
                {step.rate && (
                  <p className="text-xs mt-1.5" style={{ color: '#5C606C' }}>{step.rate}</p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-4" style={{ color: '#F4F5F8' }}>Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="card card-hover p-5 block">
              <div className="flex items-start gap-3">
                <div className="w-1 h-10 rounded-full flex-shrink-0 mt-0.5" style={{ background: link.accent }} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1" style={{ color: '#F4F5F8' }}>{link.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#8A8F98' }}>{link.desc}</p>
                </div>
                <span className="text-sm flex-shrink-0" style={{ color: '#5C606C' }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
