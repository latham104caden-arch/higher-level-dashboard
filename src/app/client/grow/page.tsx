import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import Link from 'next/link'

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = {
  ecommerce: [
    {
      id: 'website',
      
      title: 'Build a Website That Actually Converts',
      color: '#00C2FF',
      stat: { value: '35%', label: 'avg conversion lift from checkout optimization alone (Baymard Institute)' },
      intro: 'Your ads drive traffic. Your website either converts it or kills it. Most ecommerce stores leave 30–70% of their revenue on the table from avoidable friction.',
      tips: [
        {
          heading: 'Speed is money — literally',
          body: 'Every 1 second of load time costs you 7% in conversions. If your store makes $10K/month, a 3-second load time is costing you $2,100/month vs a 1-second load time. Test your speed at PageSpeed Insights and target under 2.5 seconds.',
        },
        {
          heading: 'Kill forced account creation',
          body: '19% of shoppers abandon checkout because they don\'t want to create an account. Offer guest checkout. You can ask them to create an account after the purchase — not before.',
        },
        {
          heading: 'Show total cost early',
          body: '48% of cart abandonments happen because hidden fees appear at checkout. Show shipping estimates on product pages. No surprises. Every surprise costs you a sale.',
        },
        {
          heading: 'Stack social proof near the buy button',
          body: 'Place reviews directly next to your Add to Cart button — not just at the bottom of the page. 86% of consumers say star ratings on a homepage are the #1 thing that drives them to buy from a new brand.',
        },
        {
          heading: 'Mobile-first, not mobile-friendly',
          body: '83% of your traffic is on a phone. Test every page on mobile before anything else. Buttons should be thumb-friendly (min 44px), text readable without zooming, and checkout completable in under 60 seconds.',
        },
        {
          heading: 'Remove navigation from landing pages',
          body: 'If you\'re running ads to a product or collection page, removing the nav menu has been shown to double conversion rates. Every exit point you remove is more money in your pocket.',
        },
      ],
    },
    {
      id: 'content',
      
      title: 'Content & Photography That Sells',
      color: '#21D19F',
      stat: { value: '5x', label: 'more conversions from UGC vs professional photography (inBeat Agency)' },
      intro: 'The biggest mistake ecommerce brands make: spending thousands on polished studio shots, then wondering why ads don\'t work. Real beats perfect every time.',
      tips: [
        {
          heading: 'UGC outperforms studio shots in ads',
          body: 'UGC ads get 4x higher CTR and 50% lower cost-per-click than professional brand creative. For Meta ads specifically, a real customer holding your product on their phone camera will outperform a $3,000 product shoot almost every time.',
        },
        {
          heading: 'The 3-shot minimum for every product',
          body: 'For your website: (1) clean white/neutral background hero shot, (2) lifestyle shot in real use, (3) close-up of key detail or ingredient label. Products with high-quality images see 33% higher conversion rates. Products with only one image lose sales to products with 4+.',
        },
        {
          heading: 'Natural light beats artificial — always',
          body: 'Shoot near a large window during the day. Diffuse harsh sunlight with a white sheet or curtain. A $0 setup with good natural light beats a $500 ring light. Avoid overhead lighting — it creates unflattering shadows.',
        },
        {
          heading: 'How to shoot UGC that converts',
          body: 'Hold the product at eye level. Record in a real environment (kitchen, gym, outdoors). Start with a visual hook in the first 2 seconds. Show the product being used, not just sitting there. Authentic > polished. Shaky camera is fine. Genuine reaction is everything.',
        },
        {
          heading: '360° and multiple angles increase sales 22%',
          body: '63% of shoppers want to see a product from multiple angles before buying. If you can\'t do 360°, shoot front, back, side, and top. Show the scale of the product next to something familiar.',
        },
        {
          heading: 'Repurpose everything for ads',
          body: 'Every piece of content you create for your website should have an ad version. Film the lifestyle shot as a video too. Screenshot the best review and put it in an ad. Your content calendar and your ad creative should be the same calendar.',
        },
      ],
    },
    {
      id: 'followup',
      
      title: 'Response Time & Follow-Up',
      color: '#F59E0B',
      stat: { value: '21x', label: 'more likely to convert when you respond within 5 minutes vs 30 minutes' },
      intro: 'For ecommerce, follow-up isn\'t about phone calls — it\'s about automated sequences that recover abandoned carts, re-engage past buyers, and turn one-time customers into repeat buyers.',
      tips: [
        {
          heading: 'Abandoned cart SMS within 15 minutes',
          body: 'Abandoned cart SMS sequences have a 24–39% conversion rate. The window is 15 minutes after abandonment — that\'s when intent is still high. Set up a 3-message sequence: (1) 15 min: "You forgot something," (2) 2 hrs: discount offer, (3) 24 hrs: last chance.',
        },
        {
          heading: 'Post-purchase is your most valuable moment',
          body: 'The 24 hours after a purchase is the highest-trust window you have with a customer. Send a thank-you, set expectations for shipping, and introduce them to your next product. Customers who buy twice are 5x more likely to become loyal repeat buyers.',
        },
        {
          heading: 'Win-back sequence at 60 and 90 days',
          body: 'A customer who hasn\'t bought in 60 days needs a reason to come back. Send a win-back email at 60 days with a personal message and at 90 days with a discount. Don\'t let customers go silent without a fight.',
        },
        {
          heading: 'Review request within 7 days of delivery',
          body: 'Send a review request 5–7 days after confirmed delivery — not the purchase date. SMS review requests from local businesses convert at 12–15%, vs 3–4% for email. Use both.',
        },
      ],
    },
    {
      id: 'sms',
      
      title: 'SMS Marketing',
      color: '#45B69C',
      stat: { value: '98%', label: 'open rate — 90% read within 3 minutes (Omnisend 2025)' },
      intro: 'Email gets ignored. SMS gets read. If you\'re not building a text list alongside your email list, you\'re leaving your most valuable marketing channel empty.',
      tips: [
        {
          heading: 'Build your list from day one',
          body: 'Offer 10–15% off the first order for SMS signup at checkout. Your SMS list will convert at 3–5x the rate of your email list. Klaviyo, Postscript, and Attentive are the best platforms for ecommerce SMS.',
        },
        {
          heading: 'What to send and when',
          body: 'New product drops, flash sales (24-hour window creates urgency), abandoned cart reminders, back-in-stock alerts, and VIP early access. Send 4–6 texts per month maximum. Over-texting kills your list fast.',
        },
        {
          heading: 'SMS revenue benchmarks',
          body: 'Well-run ecommerce SMS programs generate $15–$30 per subscriber per month. An SMS list of 1,000 subscribers should be generating $15K–$30K in monthly attributed revenue. If it\'s not, your content or timing is off.',
        },
        {
          heading: 'Keep it short, personal, and human',
          body: 'The best SMS messages sound like they came from a friend: "Hey, your cart is still waiting. Here\'s 10% off: [link]" — not corporate copy. Under 160 characters when possible. Always include opt-out instructions.',
        },
      ],
    },
    {
      id: 'email',
      
      title: 'Email Marketing',
      color: '#A78BFA',
      stat: { value: '$42', label: 'returned for every $1 spent on email — highest ROI of any channel (Litmus)' },
      intro: 'Email is the only channel you own. Your Meta account can be shut down tomorrow — your email list is yours forever. Build it like your business depends on it, because it does.',
      tips: [
        {
          heading: 'The 5 flows every ecommerce store needs',
          body: '(1) Welcome series — 3 emails over 7 days introducing your brand, (2) Abandoned cart — 3 emails over 24 hours, (3) Post-purchase — thank you, shipping update, review request, (4) Win-back — 60 and 90 day re-engagement, (5) Browse abandonment — they looked but didn\'t add to cart.',
        },
        {
          heading: 'Automated flows generate 320% more revenue',
          body: 'Automated email sequences outperform manual sends by 320%. Set them up once and they run forever. Your abandoned cart flow alone should recover 5–15% of abandoned revenue on autopilot.',
        },
        {
          heading: 'Subject line is everything',
          body: '47% of emails are opened or ignored based on the subject line alone. Best performers: curiosity gaps ("You forgot this..."), personalization ("[Name], this one\'s for you"), and urgency ("Last chance — 4 hours left"). Under 50 characters. No emojis in subject lines for cold audiences.',
        },
        {
          heading: 'Send 5–8 emails per month',
          body: 'Brands sending 5–8 emails per month see the highest ROI — around $48 per $1 spent. Under 4 emails per month and you\'re invisible. Over 12 and unsubscribes spike. Consistency beats volume.',
        },
      ],
    },
  ],

  local: [
    {
      id: 'website',
      
      title: 'Build a Website That Books Jobs',
      color: '#FFB800',
      stat: { value: '70%+', label: 'of local searches happen on phones — mobile-first is non-negotiable' },
      intro: 'Your website has one job: turn a visitor into a lead in under 30 seconds. Most local service websites fail this test completely. Here\'s how to fix it.',
      tips: [
        {
          heading: 'Your phone number goes in the header — always',
          body: 'Put your phone number top-right on every page, clickable on mobile. Customers who are ready to book won\'t scroll to find your contact info. Make it impossible to miss. A click-to-call button alone can increase leads 20–30%.',
        },
        {
          heading: 'One clear CTA above the fold',
          body: '"Get a Free Quote" or "Book Now" — one button, big, in your brand color, above the fold. Not three buttons. Not "Learn More." The visitor should know exactly what to do within 3 seconds of landing on your page.',
        },
        {
          heading: 'Social proof kills hesitation',
          body: '71% of consumers read reviews before hiring a local service business. 69% won\'t trust you until you have at least 20 reviews. Show your Google rating and review count on your homepage. Screenshot your best reviews and put them front and center.',
        },
        {
          heading: 'Short contact forms convert better',
          body: 'Forms with 3 fields (name, phone, service needed) convert 27% better than forms with 5+ fields. Don\'t ask for their address, budget, or project timeline upfront — get them in the door first. You can collect details when you call.',
        },
        {
          heading: 'Before & after photos are your #1 trust signal',
          body: 'For local services, before and after photos do more work than any other content. Real results from real jobs. Put them on your homepage, not buried in a gallery. They show competence instantly without anyone having to read a word.',
        },
        {
          heading: 'Speed and mobile first',
          body: 'A 1-second delay kills 7% of conversions. Load time should be under 2.5 seconds. Test on your own phone first — if it feels slow to you, it\'s too slow. Google\'s PageSpeed Insights is free and tells you exactly what to fix.',
        },
      ],
    },
    {
      id: 'content',
      
      title: 'Content & Photography That Builds Trust',
      color: '#21D19F',
      stat: { value: '134%', label: 'conversion increase when real job photos are shown vs stock images' },
      intro: 'Stock photos scream "fake." Real job photos scream "we\'ve done this before." There\'s no faster way to build trust with a local customer than showing them exactly what you\'ve done for their neighbor.',
      tips: [
        {
          heading: 'Shoot every job — no exceptions',
          body: 'Before and after is the format. Take the before shot before you touch anything. Take the after shot from the same angle when you\'re done. Takes 30 seconds. This becomes your best ad creative, website content, and Google Business photos.',
        },
        {
          heading: 'What to capture on every job',
          body: '(1) Wide before shot — full view of the problem, (2) Wide after shot — same angle, (3) Close-up detail of the quality work, (4) You or your team at the job (builds trust with faces), (5) The customer\'s happy reaction if they\'ll allow it.',
        },
        {
          heading: 'Video beats photos for ads',
          body: 'A 30-second walkthrough of a job site — before and after on camera — outperforms any static image in Meta ads. Shoot vertical (9:16) on your phone. Talk to camera for 10 seconds about what the problem was and how you fixed it. Authentic > polished.',
        },
        {
          heading: 'Google Business photos drive calls',
          body: 'Businesses with 100+ photos on Google Business Profile get 520% more calls than businesses with fewer than 10. Upload every job photo. Label them with your service and city for SEO benefit.',
        },
        {
          heading: 'Testimonial videos are gold',
          body: 'Ask happy customers for a 30-second video review right when you finish the job — that\'s when satisfaction is highest. "Hi, I\'m [name], [company] just [service] and I\'m really happy with how it turned out..." — that clip is worth thousands in ad spend.',
        },
        {
          heading: 'Consistency beats volume',
          body: 'Post 3 times a week to Google Business, Facebook, and Instagram. Job photo Monday, tip or process video Wednesday, review or testimonial Friday. Simple, repeatable, and compounds over time.',
        },
      ],
    },
    {
      id: 'followup',
      
      title: 'Speed to Lead & Follow-Up',
      color: '#EF4444',
      stat: { value: '391%', label: 'conversion increase when you call a lead within 1 minute of inquiry' },
      intro: 'This is the single biggest lever most local businesses ignore. The leads are coming in — the money is being lost in the follow-up. Fix this and your cost per booked job drops dramatically without spending a single extra dollar on ads.',
      tips: [
        {
          heading: 'The 5-minute rule is life or death',
          body: 'Leads reached within 5 minutes are 21x more likely to convert than leads called after 30 minutes. 78% of customers go with the first business that responds. You don\'t need to be the best — you need to be first.',
        },
        {
          heading: 'The average business waits 47 hours',
          body: 'The industry average response time is 47 hours. 57% of companies take a week. 51% of leads are never contacted at all. If you respond within 5 minutes, you win by default in most markets — not because you\'re better, but because everyone else is asleep.',
        },
        {
          heading: 'Text first, call immediately after',
          body: 'The moment a lead comes in: send an automated text ("Hi [name], thanks for reaching out! I\'ll call you in the next few minutes.") then call immediately. Text responses under 60 seconds achieve 73% appointment booking rate. After 30 minutes: 4%.',
        },
        {
          heading: 'The 5-touch follow-up sequence',
          body: 'Day 1: Call + text. Day 2: Call again. Day 3: Email. Day 5: Text with a different angle. Day 7: Final call. 55% of replies to follow-up sequences come from messages 2–5, not the first one. Most businesses give up after one try.',
        },
        {
          heading: 'Set up missed-call text-back',
          body: 'If you miss a call, an automatic text goes out within 30 seconds: "Hey, I just missed your call — I\'m finishing up a job. What service can I help you with?" This alone saves 20–30% of missed leads that would otherwise call your competitor.',
        },
        {
          heading: 'Ask for the review while you\'re still there',
          body: 'The best time to ask for a Google review is right when you finish the job and the customer is happy. Text them a direct link to your Google review page before you leave the driveway. 12–15% of customers who receive a post-service SMS leave a review.',
        },
      ],
    },
    {
      id: 'sms',
      
      title: 'SMS Marketing for Local Businesses',
      color: '#45B69C',
      stat: { value: '98%', label: 'SMS open rate — 90% read within 3 minutes vs 20% for email (Omnisend)' },
      intro: 'For local businesses, SMS is your most powerful tool for rebooking past customers, following up on quotes, and getting reviews. Most of your competitors aren\'t using it.',
      tips: [
        {
          heading: 'Every customer becomes a text contact',
          body: 'When you complete a job, add the customer to your text list with their permission. This is your highest-value marketing asset. A list of 500 past customers you can text is worth more than any ad campaign.',
        },
        {
          heading: 'Seasonal re-engagement campaigns',
          body: 'Text past customers before peak season: "Hey [name], spring is here — ready to get your [service] done? We\'re booking up fast. Reply YES and I\'ll hold a spot for you." Past customers convert at 60–70% vs 2–5% for cold leads.',
        },
        {
          heading: 'Quote follow-up via text',
          body: 'If someone gets a quote but doesn\'t book, follow up by text at 24 hours, 3 days, and 7 days. Keep it short: "Hey [name], just checking in on that [service] quote — any questions I can answer?" Texts feel personal. Emails feel automated.',
        },
        {
          heading: 'Keep it personal, not promotional',
          body: 'The best local business texts read like they\'re from an actual person, not a marketing department. First name, conversational tone, short message, clear ask. Under 160 characters. Always include opt-out: "Reply STOP to unsubscribe."',
        },
      ],
    },
    {
      id: 'email',
      
      title: 'Email Marketing',
      color: '#A78BFA',
      stat: { value: '$42', label: 'returned for every $1 spent on email — highest ROI of any channel (Litmus)' },
      intro: 'Email keeps you top of mind with past customers between jobs. A simple monthly email to your customer list is one of the highest-ROI things you can do.',
      tips: [
        {
          heading: 'The 4 emails every local business should send',
          body: '(1) Job completion thank-you with review link, (2) Seasonal reminder 2 weeks before peak season, (3) Referral ask — "Know anyone who needs [service]?", (4) Annual check-in — "It\'s been a year — time for another [service]?"',
        },
        {
          heading: 'Automated follow-up is your silent salesperson',
          body: 'Set up an automated email sequence for every new lead: Day 1 thank you, Day 3 follow-up, Day 7 social proof + testimonial. Automated sequences generate 320% more revenue than one-off emails and run without you touching anything.',
        },
        {
          heading: 'Referral emails are free leads',
          body: 'Email your happy customers 2 weeks after job completion: "We loved working with you — if you know anyone who needs [service], we\'d love to help. We\'ll take $[X] off your next service as a thank-you." Referred customers close at 4x the rate of cold leads.',
        },
        {
          heading: 'Keep subject lines simple',
          body: '"Hey [name], quick question" outperforms every clever subject line for local businesses. Feels personal. Gets opened. Don\'t overthink it. Your goal is a 25%+ open rate — anything above that is excellent.',
        },
      ],
    },
  ],
}

function StatBadge({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: color + '08', border: `1px solid ${color}20` }}>
      <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full blur-2xl opacity-30" style={{ background: color }} />
      <p className="text-3xl font-black mb-1" style={{ color }}>{value}</p>
      <p className="text-xs leading-relaxed" style={{ color: '#7B82A0' }}>{label}</p>
    </div>
  )
}

export default async function GrowPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'agency') redirect('/dashboard')

  const client = CLIENTS[session.clientId as keyof typeof CLIENTS]
  if (!client) redirect('/')

  const sections = client.type === 'ecommerce' ? SECTIONS.ecommerce : SECTIONS.local

  const NAV = [
    { href: '/client', label: 'Overview', active: false },
    { href: '/client/performance', label: 'Performance', active: false },
    { href: '/client/grow', label: 'Grow', active: true },
    { href: '/client/learn', label: 'Learn', active: false },
    { href: '/client/quiz', label: 'Quiz', active: false },
    { href: '/client/audit', label: 'Site Audit', active: false },
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
              {NAV.map(n => (
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
              <Link href="/logout" className="px-4 py-1.5 rounded-lg text-xs font-bold ml-2" style={{ color: '#484D6D', border: '1px solid transparent' }}>
                Sign out
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-8 py-12 space-y-16">
          {/* Page header */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#21D19F' }}>— Growth Playbook</p>
            <h1 className="text-4xl font-black tracking-tight mb-3" style={{ color: '#E8ECFF' }}>
              {client.type === 'ecommerce' ? 'Scale Your Store' : 'Grow Your Business'}
            </h1>
            <p className="text-base max-w-xl" style={{ color: '#7B82A0' }}>
              {client.type === 'ecommerce'
                ? 'Real data, real tactics. Everything outside of your ads that determines whether your campaigns succeed or fail.'
                : 'The playbook local businesses use to turn ad spend into booked jobs — website, content, follow-up, and everything in between.'}
            </p>
          </div>

          {/* Sections */}
          {sections.map((section, si) => (
            <section key={section.id} id={section.id}>
              {/* Section header */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="w-3 self-stretch rounded-full flex-shrink-0"
                  style={{ background: `linear-gradient(180deg, ${section.color}, ${section.color}44)` }}
                />
                <div>
                  <h2 className="text-2xl font-black tracking-tight" style={{ color: '#E8ECFF' }}>{section.title}</h2>
                  <p className="text-sm mt-0.5" style={{ color: '#7B82A0' }}>{section.intro}</p>
                </div>
              </div>

              {/* Stat */}
              <div className="mb-6">
                <StatBadge value={section.stat.value} label={section.stat.label} color={section.color} />
              </div>

              {/* Tips grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.tips.map((tip, ti) => (
                  <div
                    key={ti}
                    className="rounded-2xl p-6 relative overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
                  >
                    <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full blur-2xl opacity-15" style={{ background: section.color }} />
                    <p className="font-black text-sm mb-2" style={{ color: '#E8ECFF' }}>{tip.heading}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>{tip.body}</p>
                  </div>
                ))}
              </div>

              {/* Divider between sections */}
              {si < sections.length - 1 && (
                <div className="mt-16" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
              )}
            </section>
          ))}
        </main>
      </div>
    </div>
  )
}
