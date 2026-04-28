'use client'

const COMPETITORS: Record<string, any[]> = {
  hydra: [
    {
      name: 'Liquid IV',
      url: 'liquid-iv.com',
      price: '$25 (16ct)',
      positioning: 'Hydration multiplier, 3x electrolytes vs sports drinks',
      strengths: ['Massive brand awareness', 'Celebrity endorsements', 'Wide retail distribution (Costco, Target)', 'Strong UGC presence'],
      weaknesses: ['Contains sugar and artificial ingredients', 'Higher price per serving', 'Mainstream — not "clean"', 'Over-saturated market presence'],
      adAngles: ['Clinical hydration claims', 'Convenience', 'Variety of flavors'],
      opportunity: 'Liquid IV uses sugar. Hydra Pops have zero sugar — attack that gap directly.',
    },
    {
      name: 'LMNT',
      url: 'drinklmnt.com',
      price: '$45 (30ct)',
      positioning: 'Science-backed electrolytes, zero sugar, keto/carnivore audience',
      strengths: ['Cult following', 'Premium positioning', 'Strong podcast/influencer partnerships', 'Clean ingredients'],
      weaknesses: ['Very high sodium — not for everyone', 'No fun format (powder only)', 'Expensive', 'Niche audience'],
      adAngles: ['Science of electrolytes', 'Keto/performance athletes', 'No sugar messaging'],
      opportunity: 'LMNT owns the serious athlete. Hydra owns the fun, everyday hydration angle. Different lane — but steal the clean ingredients narrative.',
    },
    {
      name: 'Nuun',
      url: 'nuunlife.com',
      price: '$8 (10ct)',
      positioning: 'Effervescent tablets, runner/cyclist audience, low calorie',
      strengths: ['Great retail presence', 'Active community', 'Affordable', 'Good flavors'],
      weaknesses: ['Contains sweeteners and dyes', 'Old-school branding', 'Tablet format is inconvenient', 'Not trendy'],
      adAngles: ['Active lifestyle', 'Portability', 'Variety'],
      opportunity: 'Nuun has dyes and sweeteners. Hydra has neither. Easy win on the "clean" angle against them.',
    },
    {
      name: 'Pedialyte Sport',
      url: 'pedialyte.com',
      price: '$10 (4ct)',
      positioning: 'Medical-grade hydration for athletes, trusted brand',
      strengths: ['Medical trust/credibility', 'Wide retail distribution', 'Strong for parents'],
      weaknesses: ['Clinical/boring branding', 'Expensive per serving', 'Contains artificial flavors', 'Not fun or trendy'],
      adAngles: ['Recovery', 'Parent trust', 'Medical credibility'],
      opportunity: 'Parents buying Pedialyte for kids are YOUR customer. Hydra Pops are fun, clean, kid-friendly. Go after that parent angle hard.',
    },
  ],
  shinebright: [
    {
      name: 'Fish Window Cleaning',
      url: 'fishwindowcleaning.com',
      price: 'Varies by market',
      positioning: 'National franchise, residential + commercial',
      strengths: ['National brand recognition', 'Systemized operations', 'Commercial accounts'],
      weaknesses: ['Feels corporate, not local', 'Franchise inconsistency', 'Less personal service', 'Higher overhead = higher prices'],
      adAngles: ['Reliability', 'Brand recognition', 'Commercial focus'],
      opportunity: 'They feel like a corporation. Shine Bright is local, personal, and actually cares. Play the "neighbor" card.',
    },
    {
      name: 'Local OKC Competitors',
      url: 'Various',
      price: 'Varies',
      positioning: 'Local window cleaners — mostly word of mouth',
      strengths: ['Low price competition', 'Established local relationships'],
      weaknesses: ['No real marketing', 'Unprofessional online presence', 'No reviews strategy', 'No digital ads'],
      adAngles: ['Price', 'Availability'],
      opportunity: 'Most local competitors have zero digital presence. Shine Bright running ads at all is already a major advantage.',
    },
  ],
}

const MARKET_DATA: Record<string, any> = {
  hydra: {
    marketSize: '$3.2B electrolyte market, growing 8% YoY',
    trend: 'Clean label hydration exploding — consumers leaving sugary sports drinks',
    whitespace: 'Fun format (freeze pops) + clean ingredients is nearly unoccupied. No major brand owns this.',
    targetGap: 'GLP-1 users (Ozempic, Wegovy) need electrolytes — massive underserved market right now',
  },
  shinebright: {
    marketSize: 'Window cleaning is a $10B+ industry, growing with home services boom',
    trend: 'Post-COVID home services demand is permanent — people invest more in home upkeep',
    whitespace: 'No OKC window cleaner is running aggressive digital ads. First mover advantage is available.',
    targetGap: 'New homeowners and seasonal (spring/fall) are highest intent — not being targeted by anyone',
  },
}

export function CompetitorTab({ clientId }: { clientId: string }) {
  const competitors = COMPETITORS[clientId] || []
  const market = MARKET_DATA[clientId]

  return (
    <div className="space-y-5">
      {market && (
        <div className="card p-5 sm:p-6">
          <p className="text-xs font-medium mb-4" style={{ color: '#5C606C' }}>Market Overview</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: '#5C606C' }}>Market Size</p>
              <p className="text-sm" style={{ color: '#F4F5F8' }}>{market.marketSize}</p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: '#5C606C' }}>Trend</p>
              <p className="text-sm" style={{ color: '#F4F5F8' }}>{market.trend}</p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: '#5C606C' }}>White Space</p>
              <p className="text-sm font-medium" style={{ color: '#21D19F' }}>{market.whitespace}</p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: '#5C606C' }}>Biggest Gap to Exploit</p>
              <p className="text-sm font-medium" style={{ color: '#5E6AD2' }}>{market.targetGap}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {competitors.map((comp, i) => (
          <div key={i} className="card overflow-hidden">
            <div
              className="px-5 sm:px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div>
                <h3 className="font-semibold text-sm" style={{ color: '#F4F5F8' }}>{comp.name}</h3>
                <p className="text-xs mt-0.5" style={{ color: '#5C606C' }}>{comp.url} · {comp.price}</p>
              </div>
              <span className="text-xs max-w-xs text-right italic" style={{ color: '#8A8F98' }}>"{comp.positioning}"</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="px-5 sm:px-6 py-4" style={{ borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Strengths</p>
                <ul className="space-y-2">
                  {comp.strengths.map((s: string, j: number) => (
                    <li key={j} className="text-sm flex items-start gap-2" style={{ color: '#8A8F98' }}>
                      <span style={{ color: '#5C606C' }}>•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-5 sm:px-6 py-4" style={{ borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Weaknesses</p>
                <ul className="space-y-2">
                  {comp.weaknesses.map((w: string, j: number) => (
                    <li key={j} className="text-sm flex items-start gap-2" style={{ color: '#F59E0B' }}>
                      <span style={{ color: 'rgba(245,158,11,0.5)' }}>•</span>{w}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-5 sm:px-6 py-4" style={{ background: 'rgba(33,209,159,0.03)' }}>
                <p className="text-xs font-medium mb-3" style={{ color: '#21D19F' }}>Our Opportunity</p>
                <p className="text-sm font-medium mb-4" style={{ color: '#21D19F' }}>{comp.opportunity}</p>
                <div>
                  <p className="text-xs font-medium mb-2" style={{ color: '#5C606C' }}>Their Ad Angles</p>
                  <div className="flex flex-wrap gap-1.5">
                    {comp.adAngles.map((a: string, j: number) => (
                      <span
                        key={j}
                        className="text-[10px] px-2 py-0.5 rounded font-medium"
                        style={{ background: '#1A1B20', color: '#8A8F98', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
