import Link from 'next/link'
import { Greeting } from '@/app/client/Greeting'
import { DemoNav } from './DemoNav'

// ── Fake Data ────────────────────────────────────────────────────────────────
const CLIENT = {
  name: 'Riverside Window Cleaning',
  initial: 'R',
  color: '#F59E0B',
  type: 'service',
}

const METRICS = {
  spend: 1480,
  leads: 41,
  cpl: 36.10,
  ctr: 2.74,
  impressions: 68200,
  clicks: 1869,
  pageViews: 1496,
}

const FUNNEL = [
  { label: 'Impressions', value: '68,200', raw: 68200, color: '#A0A4B8', rate: null },
  { label: 'Clicks',      value: '1,869',  raw: 1869,  color: '#A0CFFF', rate: '2.74% CTR' },
  { label: 'Page Views',  value: '1,496',  raw: 1496,  color: '#F59E0B', rate: '80% of clicks' },
  { label: 'Leads',       value: '41',     raw: 41,    color: '#21D19F', rate: '3% of views' },
]

const AGENCY_MESSAGE = `Strong month — 41 leads at $36 per lead is well within the target range for your market. We've identified the residential retargeting ad set as your top performer and are pushing more budget there this week. Expect volume to climb over the next 7 days as we refine the audience.`

const QUICK_LINKS = [
  {
    href: '/demo/dashboard/performance',
    title: 'Campaign Performance',
    desc: 'See your campaigns and how your budget is working.',
    cta: 'View Report →',
    color: '#21D19F',
  },
  {
    href: '/demo/dashboard/grow',
    title: 'Growth Playbook',
    desc: 'Website, follow-up, SMS, and content tips to maximize every lead.',
    cta: 'Read Playbook →',
    color: '#A0CFFF',
  },
  {
    href: '/demo/dashboard/learn',
    title: 'Learn the Metrics',
    desc: 'Plain English explanations of every number and what it means.',
    cta: 'Start Learning →',
    color: '#45B69C',
  },
  {
    href: '/demo/dashboard/quiz',
    title: 'Business Quiz',
    desc: 'Test your knowledge on scaling, ads, and growing your business.',
    cta: 'Play Now →',
    color: '#F59E0B',
  },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DemoDashboardPage() {
  const metricCards = [
    { label: 'Ad Spend',      value: '$1,480',  sub: 'Last 30 days',    color: '#A0A4B8' },
    { label: 'Total Leads',   value: '41',      sub: 'Quote requests',  color: '#21D19F' },
    { label: 'Cost Per Lead', value: '$36.10',  sub: 'Per inquiry',     color: '#45B69C' },
    { label: 'Click Rate',    value: '2.74%',   sub: 'Who clicked your ad', color: '#A0CFFF' },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#080B14' }}>
      <div className="bg-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="page-content">
        <DemoNav active="Overview" />

        <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
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
            {metricCards.map((m, i) => (
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
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-10" style={{ background: CLIENT.color }} />
            <div className="flex items-start gap-4 relative">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 mt-0.5"
                style={{
                  background: `linear-gradient(135deg, ${CLIENT.color}33, ${CLIENT.color}55)`,
                  border: `1px solid ${CLIENT.color}44`,
                  color: CLIENT.color,
                }}
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
                <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>{AGENCY_MESSAGE}</p>
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
              <p className="text-xs" style={{ color: '#484D6D' }}>How people move from seeing your ad to becoming a lead</p>
            </div>

            <div className="flex items-stretch gap-0">
              {FUNNEL.map((step, i) => {
                const maxRaw = FUNNEL[0].raw
                const barHeight = Math.max(12, Math.round((step.raw / maxRaw) * 80))
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
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
                    <p className="text-lg font-black mb-0.5" style={{ color: step.color }}>{step.value}</p>
                    <p className="text-xs font-bold mb-1" style={{ color: '#E8ECFF' }}>{step.label}</p>
                    {step.rate && (
                      <p className="text-xs" style={{ color: '#484D6D' }}>{step.rate}</p>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex items-center mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {FUNNEL.map((step, i) => (
                <div key={i} className="flex-1 flex items-center">
                  <div className="flex-1 text-center">
                    <p className="text-xs" style={{ color: '#484D6D' }}>{step.label}</p>
                  </div>
                  {i < FUNNEL.length - 1 && (
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
              {QUICK_LINKS.map((link) => (
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
