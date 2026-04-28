import Link from 'next/link'
import { Greeting } from '@/app/client/Greeting'
import { DemoNav } from './DemoNav'

const CLIENT = {
  name: 'Riverside Window Cleaning',
  initial: 'R',
  type: 'service',
}

const FUNNEL = [
  { label: 'Impressions', value: '68,200', raw: 68200, rate: null },
  { label: 'Clicks',      value: '1,869',  raw: 1869,  rate: '2.74% CTR' },
  { label: 'Page Views',  value: '1,496',  raw: 1496,  rate: '80% of clicks' },
  { label: 'Leads',       value: '41',     raw: 41,    rate: '3% of views' },
]

const AGENCY_MESSAGE = `Strong month — 41 leads at $36 per lead is well within the target range for your market. We've identified the residential retargeting ad set as your top performer and are pushing more budget there this week. Expect volume to climb over the next 7 days as we refine the audience.`

const QUICK_LINKS = [
  {
    href: '/demo/dashboard/performance',
    title: 'Campaign Performance',
    desc: 'See your campaigns and how your budget is working.',
    accent: '#5E6AD2',
  },
  {
    href: '/demo/dashboard/grow',
    title: 'Growth Playbook',
    desc: 'Website, follow-up, SMS, and content tips to maximize every lead.',
    accent: '#F59E0B',
  },
  {
    href: '/demo/dashboard/learn',
    title: 'Learn the Metrics',
    desc: 'Plain English explanations of every number and what it means.',
    accent: '#21D19F',
  },
  {
    href: '/demo/dashboard/quiz',
    title: 'Business Quiz',
    desc: 'Test your knowledge on scaling, ads, and growing your business.',
    accent: '#5E6AD2',
  },
]

export default function DemoDashboardPage() {
  const metrics = [
    { label: 'Ad Spend',      value: '$1,480',  sub: 'Last 30 days',          tone: 'neutral' as const },
    { label: 'Total Leads',   value: '41',      sub: 'Quote requests',        tone: 'positive' as const },
    { label: 'Cost Per Lead', value: '$36.10',  sub: 'Per inquiry',           tone: 'positive' as const },
    { label: 'Click Rate',    value: '2.74%',   sub: 'Who clicked your ad',   tone: 'neutral' as const },
  ]

  const toneColor = (t: 'neutral' | 'positive' | 'attention') =>
    t === 'positive' ? '#21D19F' : t === 'attention' ? '#F59E0B' : '#F4F5F8'

  return (
    <div className="min-h-screen" style={{ background: '#0B0C0F' }}>
      <DemoNav active="Overview" />

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-14 space-y-12">
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
              <p className="text-2xl font-semibold tracking-tight mb-1" style={{ color: toneColor(m.tone) }}>{m.value}</p>
              <p className="text-xs" style={{ color: '#5C606C' }}>{m.sub}</p>
            </div>
          ))}
        </div>

        <section className="card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#5E6AD2' }} />
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#8A8F98' }}>Higher Level</p>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ color: '#21D19F', background: 'rgba(33,209,159,0.08)', border: '1px solid rgba(33,209,159,0.18)' }}>
              Update
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#C8CBD3' }}>{AGENCY_MESSAGE}</p>
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: '#F4F5F8' }}>Ad funnel</h2>
            <p className="text-xs" style={{ color: '#5C606C' }}>Last 30 days</p>
          </div>
          <div className="card divide-y" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            {FUNNEL.map((step, i) => {
              const pct = Math.round((step.raw / FUNNEL[0].raw) * 100)
              const accent = i === FUNNEL.length - 1 ? '#21D19F' : i === 0 ? '#5E6AD2' : '#8A8F98'
              return (
                <div key={i} className="px-4 sm:px-5 py-3.5 flex items-center gap-4" style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium" style={{ color: '#F4F5F8' }}>{step.label}</p>
                      <p className="text-sm font-semibold tabular-nums" style={{ color: '#F4F5F8' }}>{step.value}</p>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: accent }} />
                    </div>
                    {step.rate && (
                      <p className="text-xs mt-1.5" style={{ color: '#5C606C' }}>{step.rate}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-4" style={{ color: '#F4F5F8' }}>Explore</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_LINKS.map((link) => (
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
    </div>
  )
}
