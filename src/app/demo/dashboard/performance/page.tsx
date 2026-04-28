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

export default function DemoPerformancePage() {
  const totalSpend = CAMPAIGNS.reduce((s, c) => s + c.spend, 0)
  const totalLeads = CAMPAIGNS.reduce((s, c) => s + c.leads, 0)
  const avgCpl = totalSpend / totalLeads

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#21D19F' }}>— Last 30 Days</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2" style={{ color: '#E8ECFF' }}>Campaign Performance</h1>
            <p className="text-base" style={{ color: '#7B82A0' }}>How your budget is working for you.</p>
          </div>

          {/* Summary row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {[
              { label: 'Total Spend', value: `$${totalSpend.toLocaleString()}`, color: '#A0A4B8' },
              { label: 'Total Leads', value: totalLeads, color: '#21D19F' },
              { label: 'Avg. Cost Per Lead', value: `$${avgCpl.toFixed(2)}`, color: '#45B69C' },
            ].map((m, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 relative overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
              >
                <div className="absolute -top-4 -right-4 w-14 h-14 rounded-full blur-2xl opacity-20" style={{ background: m.color }} />
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#484D6D' }}>{m.label}</p>
                <p className="text-2xl font-black" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Campaign table */}
          <div
            className="rounded-2xl overflow-hidden glass-accent"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="px-7 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>Your Campaigns</p>
              <p className="text-xs mt-0.5" style={{ color: '#484D6D' }}>All active campaigns and their results this month</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <th className="text-left py-4 px-7 text-xs font-bold uppercase tracking-widest" style={{ color: '#484D6D' }}>Campaign</th>
                    <th className="text-right py-4 px-5 text-xs font-bold uppercase tracking-widest" style={{ color: '#484D6D' }}>Spend</th>
                    <th className="text-right py-4 px-5 text-xs font-bold uppercase tracking-widest" style={{ color: '#484D6D' }}>Leads</th>
                    <th className="text-right py-4 px-5 text-xs font-bold uppercase tracking-widest" style={{ color: '#484D6D' }}>Cost / Lead</th>
                    <th className="text-center py-4 px-7 text-xs font-bold uppercase tracking-widest" style={{ color: '#484D6D' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {CAMPAIGNS.map((c, i) => {
                    const isLearning = c.status === 'Learning'
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="py-4 px-7 font-bold max-w-xs" style={{ color: '#E8ECFF' }}>{c.name}</td>
                        <td className="py-4 px-5 text-right" style={{ color: '#A0A4B8' }}>
                          ${c.spend.toLocaleString()}
                        </td>
                        <td className="py-4 px-5 text-right font-black" style={{ color: '#21D19F' }}>
                          {c.leads}
                        </td>
                        <td className="py-4 px-5 text-right font-medium" style={{ color: c.cpl < 40 ? '#21D19F' : c.cpl < 55 ? '#F59E0B' : '#EF4444' }}>
                          ${c.cpl.toFixed(2)}
                        </td>
                        <td className="py-4 px-7 text-center">
                          <span
                            className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit mx-auto"
                            style={isLearning
                              ? { background: 'rgba(245,158,11,0.08)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }
                              : { background: 'rgba(33,209,159,0.08)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }
                            }
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* What this means */}
          <div
            className="rounded-2xl p-7 glass-accent"
            style={{ background: 'rgba(33,209,159,0.04)', border: '1px solid rgba(33,209,159,0.12)', backdropFilter: 'blur(20px)' }}
          >
            <p className="font-black text-sm mb-3" style={{ color: '#21D19F' }}>What does this mean?</p>
            <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>
              <span style={{ color: '#E8ECFF', fontWeight: 700 }}>Leads</span> are people who saw your ad and reached out for a quote.{' '}
              <span style={{ color: '#E8ECFF', fontWeight: 700 }}>Cost Per Lead</span> tells you what each inquiry costs — we target under $45 for your market.
              Campaigns in <span style={{ color: '#F59E0B', fontWeight: 700 }}>Learning</span> mode are new — Meta is gathering data to optimize delivery, which takes about 7–10 days and $100–150 in spend.
            </p>
          </div>

          {/* CPL visual breakdown */}
          <div
            className="rounded-2xl p-7"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
          >
            <div className="mb-5">
              <p className="font-black text-sm mb-0.5" style={{ color: '#E8ECFF' }}>Lead Volume by Campaign</p>
              <p className="text-xs" style={{ color: '#484D6D' }}>Where your leads are coming from</p>
            </div>
            <div className="space-y-4">
              {CAMPAIGNS.map((c, i) => {
                const pct = Math.round((c.leads / totalLeads) * 100)
                const barColor = c.cpl < 40 ? '#21D19F' : c.cpl < 55 ? '#F59E0B' : '#EF4444'
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-bold" style={{ color: '#E8ECFF' }}>{c.name}</p>
                      <p className="text-xs font-black" style={{ color: barColor }}>{c.leads} leads ({pct}%)</p>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${barColor}90, ${barColor}50)` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
    </main>
  )
}
