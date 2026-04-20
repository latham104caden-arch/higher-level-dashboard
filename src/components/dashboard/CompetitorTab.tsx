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
    <div className="space-y-6">
      {/* Market Overview */}
      {market && (
        <div className="bg-gray-900 rounded-xl p-6 text-white">
          <h3 className="font-bold text-lg mb-4">Market Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Market Size</p>
              <p className="text-sm text-gray-200">{market.marketSize}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Trend</p>
              <p className="text-sm text-gray-200">{market.trend}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">White Space</p>
              <p className="text-sm text-emerald-400 font-medium">{market.whitespace}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Biggest Gap to Exploit</p>
              <p className="text-sm text-yellow-400 font-medium">{market.targetGap}</p>
            </div>
          </div>
        </div>
      )}

      {/* Competitor Cards */}
      <div className="space-y-4">
        {competitors.map((comp, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{comp.name}</h3>
                <p className="text-xs text-gray-400">{comp.url} · {comp.price}</p>
              </div>
              <span className="text-xs text-gray-500 max-w-xs text-right italic">"{comp.positioning}"</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Strengths */}
              <div className="px-6 py-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Strengths</p>
                <ul className="space-y-1">
                  {comp.strengths.map((s: string, j: number) => (
                    <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-gray-300 mt-0.5">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="px-6 py-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Weaknesses</p>
                <ul className="space-y-1">
                  {comp.weaknesses.map((w: string, j: number) => (
                    <li key={j} className="text-sm text-red-600 flex items-start gap-2">
                      <span className="text-red-300 mt-0.5">•</span>{w}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opportunity */}
              <div className="px-6 py-4 bg-emerald-50">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Our Opportunity</p>
                <p className="text-sm text-emerald-800 font-medium">{comp.opportunity}</p>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Their Ad Angles</p>
                  <div className="flex flex-wrap gap-1">
                    {comp.adAngles.map((a: string, j: number) => (
                      <span key={j} className="text-xs px-2 py-0.5 bg-white border border-gray-200 rounded-full text-gray-600">{a}</span>
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
