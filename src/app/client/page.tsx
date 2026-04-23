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

  // Funnel steps
  const funnelSteps = client.type === 'ecommerce'
    ? [
        { label: 'Impressions', value: fmtInt(impressions), raw: impressions, color: '#A0A4B8' },
        { label: 'Clicks', value: fmtInt(clicks), raw: clicks, color: '#A0CFFF', rate: impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) + '% CTR' : null },
        { label: 'Page Views', value: fmtInt(lpv), raw: lpv, color: '#F59E0B', rate: clicks > 0 && lpv > 0 ? ((lpv / clicks) * 100).toFixed(0) + '% of clicks' : null },
        { label: 'Add to Cart', value: fmtInt(atc), raw: atc, color: '#45B69C', rate: lpv > 0 && atc > 0 ? ((atc / lpv) * 100).toFixed(0) + '% of views' : null },
        { label: 'Purchases', value: fmtInt(purchases), raw: purchases, color: '#21D19F', rate: atc > 0 && purchases > 0 ? ((purchases / atc) * 100).toFixed(0) + '% of carts' : null },
      ]
    : [
        { label: 'Impressions', value: fmtInt(impressions), raw: impressions, color: '#A0A4B8' },
        { label: 'Clicks', value: fmtInt(clicks), raw: clicks, color: '#A0CFFF', rate: impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) + '% CTR' : null },
        { label: 'Page Views', value: fmtInt(lpv), raw: lpv, color: '#F59E0B', rate: clicks > 0 && lpv > 0 ? ((lpv / clicks) * 100).toFixed(0) + '% of clicks' : null },
        { label: 'Leads', value: fmtInt(leads), raw: leads, color: '#21D19F', rate: lpv > 0 && leads > 0 ? ((leads / lpv) * 100).toFixed(0) + '% of views' : null },
      ]

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

  const agencyMessage = generateAgencyMessage(client.type, spend, roas, leads, cpl, ctr, impressions, purchases)


  const quickLinks = [
    {
      href: '/client/performance',
      title: 'Campaign Performance',
      desc: 'See your campaigns and how your budget is working.',
      cta: 'View Report →',
      color: '#21D19F',
    },
    {
      href: '/client/grow',
      title: 'Growth Playbook',
      desc: 'Website, content, follow-up, SMS, and email tips to maximize results.',
      cta: 'Read Playbook →',
      color: '#A0CFFF',
    },
    {
      href: '/client/learn',
      title: 'Learn the Metrics',
      desc: 'Plain English explanations of every number and what it means.',
      cta: 'Start Learning →',
      color: '#45B69C',
    },
    {
      href: '/client/quiz',
      title: 'Business Quiz',
      desc: 'Test your knowledge on scaling, ads, and growing a successful business.',
      cta: 'Play Now →',
      color: '#F59E0B',
    },
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
                { href: '/client/audit', label: 'Site Audit', active: false },
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

        <main className="max-w-5xl mx-auto px-8 py-12 space-y-10">
          {/* Welcome */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#21D19F' }}>— Last 30 Days</p>
            <Greeting />
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

          {/* Agency Message */}
          <div
            className="rounded-2xl p-7 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
          >
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-10" style={{ background: client.color }} />
            <div className="flex items-start gap-4 relative">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 mt-0.5"
                style={{ background: `linear-gradient(135deg, ${client.color}33, ${client.color}55)`, border: `1px solid ${client.color}44`, color: client.color }}
              >
                HL
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>Higher Level</p>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(33,209,159,0.1)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }}
                  >
                    Campaign Update
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>{agencyMessage}</p>
              </div>
            </div>
          </div>

          {/* Funnel Snapshot */}
          <div
            className="rounded-2xl p-7"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
          >
            <div className="mb-6">
              <p className="font-black text-sm mb-0.5" style={{ color: '#E8ECFF' }}>Ad Funnel</p>
              <p className="text-xs" style={{ color: '#484D6D' }}>How people move from seeing your ad to taking action</p>
            </div>

            <div className="flex items-stretch gap-0">
              {funnelSteps.map((step, i) => {
                const isLast = i === funnelSteps.length - 1
                const maxRaw = funnelSteps[0].raw || 1
                const barHeight = Math.max(12, Math.round((step.raw / maxRaw) * 80))
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    {/* Bar */}
                    <div className="w-full flex flex-col items-center mb-3">
                      <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                        <div
                          className="w-full max-w-16 rounded-t-lg transition-all"
                          style={{
                            height: `${barHeight}px`,
                            background: `linear-gradient(180deg, ${step.color}90, ${step.color}40)`,
                            border: `1px solid ${step.color}40`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Value */}
                    <p className="text-lg font-black mb-0.5" style={{ color: step.color }}>{step.value}</p>
                    <p className="text-xs font-bold mb-1" style={{ color: '#E8ECFF' }}>{step.label}</p>
                    {step.rate && (
                      <p className="text-xs" style={{ color: '#484D6D' }}>{step.rate}</p>
                    )}

                    {/* Arrow connector */}
                    {!isLast && (
                      <div className="absolute" style={{ display: 'none' }} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Connector arrows between steps */}
            <div className="flex items-center mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {funnelSteps.map((step, i) => (
                <div key={i} className="flex-1 flex items-center">
                  <div className="flex-1 text-center">
                    <p className="text-xs" style={{ color: '#484D6D' }}>{step.label}</p>
                  </div>
                  {i < funnelSteps.length - 1 && (
                    <p className="text-xs px-1" style={{ color: '#2A2F4A' }}>→</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#484D6D' }}>Explore</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div
                    className="rounded-2xl p-7 cursor-pointer group relative overflow-hidden glass-accent transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <div
                      className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"
                      style={{ background: link.color }}
                    />
                    <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center" style={{ background: `${link.color}18`, border: `1px solid ${link.color}30` }}>
                      <div className="w-3 h-3 rounded-full" style={{ background: link.color }} />
                    </div>
                    <h3 className="font-black text-lg mb-2" style={{ color: '#E8ECFF' }}>{link.title}</h3>
                    <p className="text-sm mb-5" style={{ color: '#7B82A0' }}>{link.desc}</p>
                    <p className="text-sm font-black" style={{ color: link.color }}>{link.cta}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
