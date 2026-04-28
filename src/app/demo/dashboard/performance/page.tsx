const CAMPAIGNS = [
  {
    name: 'Window Cleaning | Local | Broad',
    spend: 560,
    leads: 17,
    cpl: 32.94,
    status: 'Running',
  },
  {
    name: 'Residential | Retarget | 30d Visitors',
    spend: 420,
    leads: 14,
    cpl: 30.00,
    status: 'Running',
  },
  {
    name: 'Spring Promo | Cold | 20mi Radius',
    spend: 310,
    leads: 7,
    cpl: 44.29,
    status: 'Running',
  },
  {
    name: 'Commercial | Prospecting | Interest',
    spend: 190,
    leads: 3,
    cpl: 63.33,
    status: 'Learning',
  },
]

const cplColor = (cpl: number) => cpl < 40 ? '#21D19F' : cpl < 55 ? '#F59E0B' : '#F4F5F8'

export default function DemoPerformancePage() {
  const totalSpend = CAMPAIGNS.reduce((s, c) => s + c.spend, 0)
  const totalLeads = CAMPAIGNS.reduce((s, c) => s + c.leads, 0)
  const avgCpl = totalSpend / totalLeads

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Last 30 days</p>
        <h1 className="font-serif italic text-3xl sm:text-4xl tracking-tight mb-2" style={{ color: '#F4F5F8' }}>Campaign Performance</h1>
        <p className="text-base" style={{ color: '#8A8F98' }}>How your budget is working for you.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        {[
          { label: 'Total Spend', value: `$${totalSpend.toLocaleString()}`, color: '#F4F5F8' },
          { label: 'Total Leads', value: String(totalLeads), color: '#21D19F' },
          { label: 'Avg. Cost Per Lead', value: `$${avgCpl.toFixed(2)}`, color: '#F4F5F8' },
        ].map((m, i) => (
          <div key={i} className="p-5" style={{ background: '#15161A' }}>
            <p className="text-xs font-medium mb-2" style={{ color: '#5C606C' }}>{m.label}</p>
            <p className="text-2xl font-semibold tracking-tight tnum" style={{ color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>

      <section className="card overflow-hidden">
        <div className="px-5 sm:px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="font-semibold text-sm" style={{ color: '#F4F5F8' }}>Your Campaigns</p>
          <p className="text-xs mt-0.5" style={{ color: '#5C606C' }}>All active campaigns and their results this month</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th className="text-left py-3 px-5 sm:px-6 text-xs font-medium" style={{ color: '#5C606C' }}>Campaign</th>
                <th className="text-right py-3 px-4 text-xs font-medium" style={{ color: '#5C606C' }}>Spend</th>
                <th className="text-right py-3 px-4 text-xs font-medium" style={{ color: '#5C606C' }}>Leads</th>
                <th className="text-right py-3 px-4 text-xs font-medium" style={{ color: '#5C606C' }}>Cost / Lead</th>
                <th className="text-center py-3 px-5 sm:px-6 text-xs font-medium" style={{ color: '#5C606C' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {CAMPAIGNS.map((c, i) => {
                const isLearning = c.status === 'Learning'
                return (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="py-3.5 px-5 sm:px-6 font-medium max-w-xs" style={{ color: '#F4F5F8' }}>{c.name}</td>
                    <td className="py-3.5 px-4 text-right tnum" style={{ color: '#8A8F98' }}>${c.spend.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right font-semibold tnum" style={{ color: '#21D19F' }}>{c.leads}</td>
                    <td className="py-3.5 px-4 text-right tnum" style={{ color: cplColor(c.cpl) }}>${c.cpl.toFixed(2)}</td>
                    <td className="py-3.5 px-5 sm:px-6 text-center">
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded inline-flex items-center gap-1.5"
                        style={isLearning
                          ? { background: 'rgba(245,158,11,0.08)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.18)' }
                          : { background: 'rgba(33,209,159,0.08)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.18)' }
                        }
                      >
                        <span className="w-1 h-1 rounded-full bg-current" />
                        {c.status}
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
        <p className="text-sm leading-relaxed" style={{ color: '#8A8F98' }}>
          <span style={{ color: '#F4F5F8', fontWeight: 600 }}>Leads</span> are people who saw your ad and reached out for a quote.{' '}
          <span style={{ color: '#F4F5F8', fontWeight: 600 }}>Cost Per Lead</span> tells you what each inquiry costs — we target under $45 for your market.
          Campaigns in <span style={{ color: '#F59E0B', fontWeight: 600 }}>Learning</span> mode are new — Meta is gathering data to optimize delivery, which takes about 7–10 days and $100–150 in spend.
        </p>
      </section>

      <section className="card p-5 sm:p-6">
        <div className="mb-4">
          <p className="font-semibold text-sm mb-0.5" style={{ color: '#F4F5F8' }}>Lead Volume by Campaign</p>
          <p className="text-xs" style={{ color: '#5C606C' }}>Where your leads are coming from</p>
        </div>
        <div className="space-y-3">
          {CAMPAIGNS.map((c, i) => {
            const pct = Math.round((c.leads / totalLeads) * 100)
            const barColor = cplColor(c.cpl)
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-medium" style={{ color: '#F4F5F8' }}>{c.name}</p>
                  <p className="text-xs font-medium tnum" style={{ color: barColor }}>{c.leads} leads ({pct}%)</p>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
