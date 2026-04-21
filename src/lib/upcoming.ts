export const UPCOMING_RESEARCH: Record<string, {
  market: { summary: string; stats: { label: string; value: string }[] }
  competitors: { name: string; weakness: string }[]
  angles: { name: string; type: string; color: string; description: string; hook: string }[]
  copy: { type: string; headline: string; body: string; cta: string }[]
  policyNote: string | null
}> = {
  'green-horizon': {
    market: {
      summary: 'The residential irrigation market is booming in Oklahoma. 102+ licensed sprinkler contractors operate statewide, but most rely on Angi, HomeAdvisor, and word-of-mouth — almost none are running aggressive paid social. Oklahoma summers are brutal (100°F+), suburban housing growth is strong, and homeowners are increasingly unwilling to babysit a hose. The person who shows up first on their feed with a compelling hook owns the job.',
      stats: [
        { label: 'Avg Install Value', value: '$2,500–$4,500' },
        { label: 'Avg Water Savings', value: '30–50% vs manual' },
        { label: 'OKC Competitors on Meta', value: '~6 running ads' },
        { label: 'Peak Season', value: 'April – September' },
      ],
    },
    competitors: [
      { name: 'Pelon\'s Irrigation', weakness: 'No visible Meta ads. Website is basic. Relies purely on referrals and Google.' },
      { name: '405 Irrigation', weakness: 'Active online but generic messaging. No strong hook or offer in ads.' },
      { name: 'Excellence Irrigation', weakness: 'Broad landscaping focus — irrigation is just one service. Not specialized.' },
      { name: 'Andy\'s Sprinkler', weakness: 'Long-established but no urgency, no offer. Zero social presence.' },
    ],
    angles: [
      {
        name: 'Water Bill Shock',
        type: 'Pain Point',
        color: '#EF4444',
        description: 'Homeowners overpay on water because they either overwater manually or have a busted system. Hit them with the number.',
        hook: '"The average Oklahoma homeowner wastes $400/year overwatering their lawn. Here\'s how to fix it."',
      },
      {
        name: 'Set It & Forget It',
        type: 'Convenience',
        color: '#4ADE80',
        description: 'Nobody wants to drag hoses or remember to run sprinklers. Automation is the sell — not irrigation.',
        hook: '"You shouldn\'t have to think about your lawn. We set it up once, and your yard handles itself."',
      },
      {
        name: 'Neighbor\'s Lawn',
        type: 'Social Proof',
        color: '#A78BFA',
        description: 'Classic green-grass-envy angle. Show a lush yard and let the emotion do the work.',
        hook: '"Your neighbor didn\'t get lucky with their lawn. They just called us first."',
      },
      {
        name: 'Oklahoma Heat Urgency',
        type: 'Urgency',
        color: '#F59E0B',
        description: 'Summer is coming. Lawns die fast without proper irrigation. Create urgency around booking before peak season.',
        hook: '"Oklahoma summers don\'t wait. Install your system now before your lawn pays the price."',
      },
      {
        name: 'Curb Appeal / Home Value',
        type: 'Investment',
        color: '#45B69C',
        description: 'A green lawn adds real home value. Speak to homeowners thinking long-term about their property.',
        hook: '"A healthy lawn adds up to 15% to your home\'s value. Irrigation systems pay for themselves."',
      },
    ],
    copy: [
      {
        type: 'Primary Hook — Water Bill',
        headline: 'Your water bill is high because your lawn is guessing.',
        body: 'Manual watering means over-watering some zones and killing others. A professionally installed irrigation system waters only what needs it, only when it needs it — and cuts the average Oklahoma homeowner\'s water bill by 30–50%. We install, calibrate, and walk you out the door with a lawn that runs itself. Get a free quote this week.',
        cta: 'Get My Free Quote',
      },
      {
        type: 'Social Proof Hook',
        headline: 'We\'ve installed 200+ systems across the OKC metro.',
        body: 'Green Horizon handles everything — design, installation, and setup. Most jobs done in a single day. Your lawn gets the right water at the right time, and you get your weekends back. Don\'t babysit a hose this summer.',
        cta: 'Book a Free Consultation',
      },
      {
        type: 'Urgency Hook — Seasonal',
        headline: 'Booking fast before summer hits. Here\'s what you need to know.',
        body: 'Once temperatures climb above 90°F, installation gets complicated and slots fill up. Right now, we have openings in your area. A properly zoned irrigation system means a green lawn all summer — without the water waste. Takes about a day to install. Zero hassle.',
        cta: 'Check Availability in My Area',
      },
      {
        type: 'Short-Form / Story Ad',
        headline: 'Spent $180 on my water bill last July. Installed irrigation in August. Paid $94 in July this year.',
        body: 'That\'s a real customer story. Proper irrigation isn\'t a luxury — it\'s the smarter way to have a great lawn. We design the system around your yard, install it clean, and set your schedule. You don\'t touch it again.',
        cta: 'See If It Makes Sense for My Yard',
      },
    ],
    policyNote: null,
  },

  'solas-sciences': {
    market: {
      summary: 'The research peptide market is exploding. The global peptide therapeutics market hit $49.7B in 2025 and is projected to reach $100B by 2034. NAD+, Semax, BPC-157, and GLP-adjacent compounds are driving massive consumer demand — especially in longevity, cognitive performance, and body composition circles. The space is crowded with low-quality vendors, which is exactly why purity credentials and COAs are the primary differentiator. Meta ads require careful navigation — all copy must be framed around research use only.',
      stats: [
        { label: 'Global Market Size', value: '$49.7B (2025)' },
        { label: 'Projected Growth', value: '8.1% CAGR to 2034' },
        { label: 'Primary Buyers', value: 'Researchers, biohackers, longevity clinics' },
        { label: 'Key Risk', value: 'Meta policy — research framing required' },
      ],
    },
    competitors: [
      { name: 'Limitless Biotech', weakness: 'Wide selection but high prices. Not running aggressive Meta. Relies on SEO and community.' },
      { name: 'Peptide Sciences', weakness: 'Established brand but clinical/cold brand voice. No emotional hooks in their ads.' },
      { name: 'Core Peptides', weakness: 'Cheap positioning hurts trust. COA quality questioned in communities.' },
      { name: 'Paradigm Peptides', weakness: 'Decent brand but no standout creative. Easy to differentiate with quality storytelling.' },
    ],
    angles: [
      {
        name: 'Purity Is Everything',
        type: 'Trust / Quality',
        color: '#A78BFA',
        description: 'The #1 fear in this market is getting underdosed or contaminated compounds. Lead with dual third-party COAs. Make trust the product.',
        hook: '"Most suppliers tell you it\'s pure. We show you — every batch, third-party verified."',
      },
      {
        name: 'Research-Grade Credibility',
        type: 'Authority',
        color: '#45B69C',
        description: 'Researchers want confidence that the compound they\'re working with is what it says it is. Lean into the science and documentation.',
        hook: '"≥99% purity. Batch-level COAs. No guesswork. Serious compounds for serious research."',
      },
      {
        name: 'Price vs. Quality',
        type: 'Value',
        color: '#4ADE80',
        description: 'Solas is priced competitively below market averages through direct manufacturing. Quality at a lower cost is a massive angle.',
        hook: '"Premium research compounds. Below-market pricing. No compromises on either."',
      },
      {
        name: 'The Trust Gap',
        type: 'Problem/Solution',
        color: '#EF4444',
        description: 'Most researchers have been burned by underdosed or mislabeled compounds. Name the frustration and offer the solution.',
        hook: '"Tired of ordering compounds you can\'t verify? Every Solas batch ships with third-party lab documentation."',
      },
      {
        name: 'NAD+ / Longevity Wave',
        type: 'Trend',
        color: '#F59E0B',
        description: 'NAD+ is having a massive cultural moment thanks to the longevity space. Ride the wave without making health claims.',
        hook: '"NAD+ is one of the most researched compounds in cellular biology. Start your research with verified supply."',
      },
    ],
    copy: [
      {
        type: 'Trust Hook — COA Angle',
        headline: 'Your research is only as good as your source.',
        body: 'Every compound at Solas Science is synthesized to ≥99% purity and verified by dual third-party labs. Batch-level Certificates of Analysis ship with every order — so you know exactly what you\'re working with before you open the vial. Free shipping over $150. Buy 3, get 10% off.',
        cta: 'View Lab-Verified Compounds',
      },
      {
        type: 'Problem Hook — Burned Before',
        headline: 'You\'ve ordered from vendors who couldn\'t prove their purity. We can.',
        body: 'Low-quality compounds waste your research and your budget. Solas sources through direct manufacturing partnerships — cutting the middleman and the markup — while maintaining strict third-party verification standards. COAs available before you buy.',
        cta: 'See Current Inventory',
      },
      {
        type: 'Value Hook — Pricing',
        headline: 'Research-grade compounds. Below-market pricing. Verified.',
        body: 'Direct manufacturing partnerships mean Solas delivers ≥99% purity at prices consistently below industry averages. NAD+, Semax, BPC-157, and more — all batch-tested and COA-documented. No inflated margins. No shortcuts on quality.',
        cta: 'Shop Research Compounds',
      },
      {
        type: 'Short-Form / Credibility',
        headline: 'If your supplier can\'t show you the COA, find a new supplier.',
        body: 'Every Solas compound ships with dual third-party verification. Synthesized to ≥99% purity. Competitively priced. Fast shipping. This is what research-grade actually means.',
        cta: 'Browse Verified Inventory',
      },
    ],
    policyNote: '⚠️ Meta Policy Flag: Peptides and research compounds are a sensitive category. All ad copy must frame around "research use only" — never imply human consumption, health outcomes, or medical benefits. Avoid before/after framing. Expect higher scrutiny on creative review. Test with broad educational angles first before pushing product-direct.',
  },
}
