const METRICS = [
  { name: 'CPM', full: 'Cost Per 1,000 Impressions', plain: 'How much it costs to show your ad to 1,000 people.', why: 'A lower CPM means your budget goes further — more people see your ad for less money. Good for local businesses: $5–$15.', good: 'Lower is better. Under $20 is healthy for most campaigns.', color: '#5E6AD2' },
  { name: 'CTR', full: 'Click-Through Rate', plain: 'The percentage of people who saw your ad and clicked on it.', why: 'A high CTR means your ad is grabbing attention. A low CTR means the ad isn\'t connecting with your audience.', good: 'Above 1% is average. Above 2% is good. Above 3% means your creative is working.', color: '#21D19F' },
  { name: 'CPC', full: 'Cost Per Click', plain: 'How much you pay each time someone clicks your ad.', why: 'Lower CPC means more people are visiting your site for the same budget. High CPC usually means your ad isn\'t relevant enough.', good: 'Under $1.50 is solid. Under $0.50 is excellent.', color: '#F59E0B' },
  { name: 'CPL', full: 'Cost Per Lead', plain: 'How much it costs to get one lead or inquiry from your ads.', why: 'If a job is worth $300 to you, paying $50 per lead is great. Paying $200 per lead is a problem.', good: 'Target: 10–20% of your average job value.', color: '#21D19F' },
  { name: 'ROAS', full: 'Return on Ad Spend', plain: 'For every $1 you spend on ads, how many dollars you make back.', why: '1x means you\'re breaking even. 2x means you\'re doubling your money. Most ecommerce targets 3x+.', good: 'Above 2x is profitable. 3x+ is where you start to scale hard.', color: '#21D19F' },
  { name: 'Impressions', full: 'Total Impressions', plain: 'The total number of times your ad was shown to people.', why: 'More impressions means more people seeing your brand. But impressions alone don\'t mean much — you need clicks and actions.', good: 'Track trends. If impressions drop, your budget ran out or audience is too narrow.', color: '#8A8F98' },
  { name: 'Frequency', full: 'Ad Frequency', plain: 'How many times the average person has seen your ad.', why: 'Seeing an ad once usually isn\'t enough to act. But seeing it 10+ times gets annoying. High frequency + low results = need new creative.', good: '1–3 is ideal. Over 4–5 means you need fresh ads or a bigger audience.', color: '#F59E0B' },
  { name: 'CTR vs CVR', full: 'Click Rate vs Conversion Rate', plain: 'CTR measures who clicked. Conversion rate measures who actually contacted you after clicking.', why: 'You can have great CTR (people click) but terrible conversion rate (people leave). That means the problem is your website, not the ad.', good: 'Aim for 2%+ website conversion rate. If people click but don\'t call, focus on your landing page.', color: '#F59E0B' },
]

export default function DemoLearnPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
      <div className="mb-10">
        <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Education</p>
        <h1 className="font-serif italic text-3xl sm:text-4xl tracking-tight mb-2" style={{ color: '#F4F5F8' }}>Learn the Metrics</h1>
        <p className="text-base" style={{ color: '#8A8F98' }}>Plain English — what every number means and why it matters for your business.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {METRICS.map(m => (
          <div key={m.name} className="card p-5">
            <div className="flex items-start gap-3">
              <div className="w-1 self-stretch rounded-full flex-shrink-0 mt-1" style={{ background: m.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded" style={{ background: m.color + '14', color: m.color, border: `1px solid ${m.color}28` }}>{m.name}</span>
                  <span className="text-xs" style={{ color: '#5C606C' }}>{m.full}</span>
                </div>
                <p className="font-semibold text-sm mb-2" style={{ color: '#F4F5F8' }}>{m.plain}</p>
                <p className="text-xs leading-relaxed mb-3" style={{ color: '#8A8F98' }}>{m.why}</p>
                <div className="rounded-md px-3 py-2 text-xs font-medium" style={{ background: m.color + '0d', color: m.color, border: `1px solid ${m.color}1f` }}>{m.good}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
