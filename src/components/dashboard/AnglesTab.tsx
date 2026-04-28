'use client'

import { getRoas, getPurchases, getLeads, adVerdict } from '@/lib/meta'
import { fmtCurrency, fmtX, fmtPct } from '@/lib/utils'

const ANGLES: Record<string, any[]> = {
  hydra: [
    {
      angle: 'The GLP-1 Hook',
      priority: 'HIGH',
      rationale: 'Ozempic/Wegovy users need electrolytes but are underserved by every major brand. Zero brands are talking to this audience directly in the electrolyte space.',
      hook: '"Taking Ozempic? You need this."',
      hooks: [
        '"Taking Ozempic or Wegovy? Here\'s what your body actually needs."',
        '"GLP-1 medications deplete your electrolytes. This fixes that."',
        '"The #1 thing Ozempic users forget about."',
      ],
      format: 'UGC video — someone sharing their GLP-1 journey, introducing Hydra Pops as their daily electrolyte',
      whyNow: 'GLP-1 users are the fastest growing health segment in the US. No electrolyte brand owns this conversation yet.',
      competitorGap: 'Liquid IV, LMNT, and Nuun are not talking to this audience at all.',
    },
    {
      angle: 'The Mom + Clean Label Play',
      priority: 'HIGH',
      rationale: '[MOM VARIETY] v1 is your 8.35x ROAS all-time winner. This angle is proven — go deeper on it.',
      hook: '"The freeze pop with zero sugar, zero dye, zero guilt."',
      hooks: [
        '"My kids think it\'s a treat. I know it\'s electrolytes."',
        '"Finally a freeze pop I don\'t have to hide from my kids\' doctor."',
        '"Other freeze pops: sugar, dyes, artificial everything. Hydra Pops: none of that."',
      ],
      format: 'UGC — mom unboxing, giving to kids, reading the clean ingredient label. Side by side with a sugary competitor.',
      whyNow: 'Your data proves this works. [MOM VARIETY] v1 at 8.35x ROAS with only $65 spend. Scale the angle, not just the ad.',
      competitorGap: 'No competitor has a freeze pop format with clean ingredients. This is completely unoccupied.',
    },
    {
      angle: 'The Anti-Sugar Comparison',
      priority: 'HIGH',
      rationale: 'Liquid IV, Gatorade, and Pedialyte all contain sugar. Hydra has zero. Call it out directly.',
      hook: '"Liquid IV has 11g of sugar. Hydra Pops have 0."',
      hooks: [
        '"Check the label on your electrolyte drink. We\'ll wait."',
        '"11g sugar. 0g sugar. You pick."',
        '"Most electrolyte brands are just glorified sugar water."',
      ],
      format: 'Static image or short video — competitor label vs Hydra Pops label. No words needed.',
      whyNow: 'Comparison ads are crushing it right now. Clean label movement is at peak momentum.',
      competitorGap: 'Liquid IV is the #1 electrolyte brand and they have sugar. Make them the villain.',
    },
    {
      angle: 'The CrossFit/Orange Theory Athlete',
      priority: 'MEDIUM',
      rationale: 'Performance athletes who care about what they put in their body. LMNT owns the hardcore athlete — go after the gym-goer who wants clean but also fun.',
      hook: '"Your pre-workout is clean. Your electrolytes should be too."',
      hooks: [
        '"You track your macros. Don\'t ignore your electrolytes."',
        '"What serious gym-goers actually drink after a workout."',
        '"No sugar. No dye. 200mg electrolytes. Stick it in the freezer."',
      ],
      format: 'UGC — someone at a gym or post-workout, pulling a Hydra Pop out of a cooler.',
      whyNow: 'Your [GLP] v1 ad has 10% CTR — that\'s the health-conscious audience responding. Feed it more budget.',
      competitorGap: 'LMNT is too intense/clinical for casual gym-goers. Hydra is the fun, accessible alternative.',
    },
    {
      angle: 'The Summer/Seasonal Push',
      priority: 'MEDIUM',
      rationale: 'Freeze pops are summer. Lean into the seasonal timing hard — it\'s April now, perfect time to build momentum.',
      hook: '"Summer\'s coming. Stock the freezer."',
      hooks: [
        '"The only thing better than a cold pool day? A Hydra Pop."',
        '"Summer hydration that actually works."',
        '"Pool bag essential: sunscreen, towel, Hydra Pops."',
      ],
      format: 'Bright, fun lifestyle imagery — outdoor, summer vibes, colorful Hydra Pops.',
      whyNow: 'April through August is peak freeze pop season. Start building now before summer hits.',
      competitorGap: 'No competitor has a freeze pop — this format owns summer by default.',
    },
  ],
  shinebright: [
    {
      angle: 'The Before/After Proof',
      priority: 'HIGH',
      rationale: 'Your [Man Before/After] and [Basic Before/After] ads have the best CTRs. Proof-based creative is working — go deeper.',
      hook: '"This is what clean windows actually look like."',
      hooks: [
        '"Before vs After. The difference is one call."',
        '"What 2 hours and a professional can do to your home."',
        '"Your neighbors will notice."',
      ],
      format: 'Split screen before/after video — dramatic reveal, no words needed for first 3 seconds.',
      whyNow: 'Visual proof is the highest-converting angle for home services. Double down.',
      competitorGap: 'No OKC competitor is running before/after ads. This is completely uncontested.',
    },
    {
      angle: 'The Spring Timing Hook',
      priority: 'HIGH',
      rationale: 'It\'s April. Spring cleaning season is peak demand for window cleaning. Urgency + seasonal = high intent.',
      hook: '"Spring is here. Your windows aren\'t ready."',
      hooks: [
        '"Spring cleaning checklist: windows. We handle that."',
        '"One thing most people forget in their spring clean."',
        '"Your home looks different with clean windows. See for yourself."',
      ],
      format: 'Short video — seasonal hook, quick before/after, clear CTA to book.',
      whyNow: 'Right now. This is the highest-intent season for window cleaning.',
      competitorGap: 'No local competitor is running seasonal ads. First mover takes all the bookings.',
    },
    {
      angle: 'The Trust/Local Play',
      priority: 'MEDIUM',
      rationale: 'Home service businesses win on trust. You\'re local, family-owned, and have real reviews. Use that.',
      hook: '"OKC\'s most trusted window cleaners. Ask your neighbors."',
      hooks: [
        '"500+ OKC homes cleaned. Yours could be next."',
        '"Family-owned, locally operated. Not a franchise."',
        '"Your neighbor booked us last week. Here\'s what they said."',
      ],
      format: 'UGC-style testimonial — real customer on camera, genuine reaction, local feel.',
      whyNow: 'Trust is the #1 barrier for home services. Remove it with social proof.',
      competitorGap: 'Fish Window Cleaning feels corporate. Being local is your biggest weapon against them.',
    },
    {
      angle: 'The Objection Killer',
      priority: 'MEDIUM',
      rationale: 'People don\'t book because they\'re worried about price, who\'s coming to their home, or if it\'s worth it. Address all three upfront.',
      hook: '"Insured, background-checked, and we guarantee the work."',
      hooks: [
        '"Not sure if it\'s worth it? Here\'s what dirty windows are actually costing you."',
        '"Worried about who you\'re letting in your home? Meet the team."',
        '"Free quote in 60 seconds. No commitment, no surprises."',
      ],
      format: 'Direct response video — address the objection head-on, then flip to the proof.',
      whyNow: 'Your campaign objective is set to Traffic not Leads — fixing this + this angle will unlock conversions.',
      competitorGap: 'No competitor in OKC is doing objection-based advertising at all.',
    },
  ],
}

const PRIORITY_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  HIGH: { bg: 'rgba(245,158,11,0.08)', color: '#F59E0B', border: 'rgba(245,158,11,0.2)' },
  MEDIUM: { bg: 'rgba(94,106,210,0.08)', color: '#5E6AD2', border: 'rgba(94,106,210,0.2)' },
  LOW: { bg: '#1A1B20', color: '#8A8F98', border: 'rgba(255,255,255,0.08)' },
}

export function AnglesTab({ clientId, ads }: { clientId: string; ads: any[] }) {
  const angles = ANGLES[clientId] || []

  const liveAds = ads.filter(a => a.effective_status === 'ACTIVE' || parseFloat(a.spend || 0) > 0)
  const sorted = [...liveAds].sort((a, b) => parseFloat(b.ctr || 0) - parseFloat(a.ctr || 0))
  const topByCtr = sorted.slice(0, 3)
  const topByRoas = [...liveAds]
    .filter(a => getRoas(a) > 0)
    .sort((a, b) => getRoas(b) - getRoas(a))
    .slice(0, 3)
  const toKill = liveAds.filter(a => adVerdict(a, clientId === 'hydra' ? 'ecommerce' : 'local').label === 'KILL')
  const toScale = liveAds.filter(a => adVerdict(a, clientId === 'hydra' ? 'ecommerce' : 'local').label === 'SCALE')

  return (
    <div className="space-y-5">
      {(toKill.length > 0 || toScale.length > 0) && (
        <div className="card p-5">
          <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Live Signals — Act Now</p>
          <div className="space-y-2">
            {toScale.map((ad, i) => (
              <p key={i} className="text-sm" style={{ color: '#21D19F' }}>
                <span className="inline-block w-1.5 h-1.5 rounded-full mr-2" style={{ background: '#21D19F' }} />
                <span style={{ color: '#F4F5F8', fontWeight: 600 }}>{ad.ad_name}</span> is proving its angle — {fmtX(getRoas(ad))} ROAS. Scale the budget before frequency kills it.
              </p>
            ))}
            {toKill.map((ad, i) => (
              <p key={i} className="text-sm" style={{ color: '#F59E0B' }}>
                <span className="inline-block w-1.5 h-1.5 rounded-full mr-2" style={{ background: '#F59E0B' }} />
                <span style={{ color: '#F4F5F8', fontWeight: 600 }}>{ad.ad_name}</span> has spent {fmtCurrency(parseFloat(ad.spend || 0))} with no return. The angle isn't landing — pull it.
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="card p-5">
          <p className="text-xs font-medium mb-4" style={{ color: '#5C606C' }}>
            Top CTR — Angles Stopping the Scroll
          </p>
          <div className="space-y-2.5">
            {topByCtr.length > 0 ? topByCtr.map((ad, i) => (
              <div key={i} className="flex items-center justify-between">
                <p className="text-sm font-medium truncate max-w-[200px]" style={{ color: '#F4F5F8' }}>{ad.ad_name}</p>
                <span className="text-sm font-semibold tnum" style={{ color: '#21D19F' }}>{fmtPct(parseFloat(ad.ctr || 0))}</span>
              </div>
            )) : (
              <p className="text-sm" style={{ color: '#5C606C' }}>No data yet</p>
            )}
          </div>
        </div>

        <div className="card p-5">
          <p className="text-xs font-medium mb-4" style={{ color: '#5C606C' }}>
            Top ROAS — Angles That Convert
          </p>
          <div className="space-y-2.5">
            {topByRoas.length > 0 ? topByRoas.map((ad, i) => (
              <div key={i} className="flex items-center justify-between">
                <p className="text-sm font-medium truncate max-w-[200px]" style={{ color: '#F4F5F8' }}>{ad.ad_name}</p>
                <span className="text-sm font-semibold tnum" style={{ color: '#21D19F' }}>{fmtX(getRoas(ad))}</span>
              </div>
            )) : (
              <p className="text-sm" style={{ color: '#5C606C' }}>No conversion data yet</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-base" style={{ color: '#F4F5F8' }}>Recommended New Angles</h3>
          <p className="text-xs" style={{ color: '#5C606C' }}>Based on your data + competitor gaps</p>
        </div>

        <div className="space-y-3">
          {angles.map((angle, i) => {
            const ps = PRIORITY_STYLE[angle.priority] || PRIORITY_STYLE.LOW
            return (
              <div key={i} className="card overflow-hidden">
                <div
                  className="px-5 sm:px-6 py-4 flex items-center gap-3"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded"
                    style={{ background: ps.bg, color: ps.color, border: `1px solid ${ps.border}` }}
                  >
                    {angle.priority}
                  </span>
                  <h4 className="font-semibold text-sm" style={{ color: '#F4F5F8' }}>{angle.angle}</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="px-5 sm:px-6 py-5 space-y-4" style={{ borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                    <div>
                      <p className="text-xs font-medium mb-1.5" style={{ color: '#5C606C' }}>Why This Angle</p>
                      <p className="text-sm" style={{ color: '#8A8F98' }}>{angle.rationale}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1.5" style={{ color: '#5C606C' }}>Why Now</p>
                      <p className="text-sm font-medium" style={{ color: '#5E6AD2' }}>{angle.whyNow}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1.5" style={{ color: '#5C606C' }}>Competitor Gap</p>
                      <p className="text-sm font-medium" style={{ color: '#21D19F' }}>{angle.competitorGap}</p>
                    </div>
                  </div>

                  <div className="px-5 sm:px-6 py-5 space-y-4">
                    <div>
                      <p className="text-xs font-medium mb-2" style={{ color: '#5C606C' }}>Hook Variations</p>
                      <div className="space-y-2">
                        {angle.hooks.map((h: string, j: number) => (
                          <div
                            key={j}
                            className="rounded-md px-3 py-2 text-sm italic"
                            style={{ background: '#1A1B20', color: '#F4F5F8', border: '1px solid rgba(255,255,255,0.06)' }}
                          >
                            "{h}"
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1.5" style={{ color: '#5C606C' }}>Best Format</p>
                      <p className="text-sm" style={{ color: '#8A8F98' }}>{angle.format}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
