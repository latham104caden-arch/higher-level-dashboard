const SECTIONS = [
  {
    id: 'website',
    title: 'Build a Website That Books Jobs',
    color: '#FFB800',
    stat: { value: '70%+', label: 'of local searches happen on phones — mobile-first is non-negotiable' },
    intro: 'Your website has one job: turn a visitor into a lead in under 30 seconds. Most local service websites fail this test. Here\'s how to fix it.',
    tips: [
      { heading: 'Your phone number goes in the header — always', body: 'Put your phone number top-right on every page, clickable on mobile. Customers who are ready to book won\'t scroll to find your contact info. A click-to-call button alone can increase leads 20–30%.' },
      { heading: 'One clear CTA above the fold', body: '"Get a Free Quote" or "Book Now" — one button, big, in your brand color, above the fold. Not three buttons. Not "Learn More." The visitor should know exactly what to do within 3 seconds of landing.' },
      { heading: 'Social proof kills hesitation', body: '71% of consumers read reviews before hiring a local service business. Show your Google rating and review count on your homepage. Screenshot your best reviews and put them front and center.' },
      { heading: 'Short contact forms convert better', body: 'Forms with 3 fields (name, phone, service needed) convert 27% better than forms with 5+ fields. Get them in the door first — collect details when you call.' },
      { heading: 'Before & after photos are your #1 trust signal', body: 'Real results from real jobs. Put them on your homepage, not buried in a gallery. They show competence instantly without anyone having to read a word.' },
      { heading: 'Speed and mobile first', body: 'A 1-second delay kills 7% of conversions. Load time should be under 2.5 seconds. Test on your own phone first. Google PageSpeed Insights is free.' },
    ],
  },
  {
    id: 'content',
    title: 'Content & Photography That Builds Trust',
    color: '#21D19F',
    stat: { value: '134%', label: 'conversion increase when real job photos are shown vs stock images' },
    intro: 'Stock photos scream "fake." Real job photos scream "we\'ve done this before." There\'s no faster way to build trust than showing exactly what you\'ve done for your neighbors.',
    tips: [
      { heading: 'Shoot every job — no exceptions', body: 'Before and after is the format. Take the before shot before you touch anything. Take the after shot from the same angle when you\'re done. 30 seconds. This becomes your best ad creative, website content, and Google Business photos.' },
      { heading: 'What to capture on every job', body: '(1) Wide before shot, (2) Wide after shot from same angle, (3) Close-up of the quality work, (4) You or your team at the job — faces build trust, (5) The customer\'s happy reaction if they allow it.' },
      { heading: 'Video beats photos for ads', body: 'A 30-second before-and-after walkthrough outperforms any static image in Meta ads. Shoot vertical on your phone. Talk to camera about the problem and how you fixed it. Authentic beats polished.' },
      { heading: 'Google Business photos drive calls', body: 'Businesses with 100+ photos on Google Business Profile get 520% more calls than businesses with fewer than 10. Upload every job photo and label them with your service and city.' },
      { heading: 'Testimonial videos are gold', body: 'Ask happy customers for a 30-second video review right when you finish the job. "Hi, I\'m [name], they just cleaned my windows and I\'m really happy..." — that clip is worth thousands in ad spend.' },
      { heading: 'Consistency beats volume', body: 'Post 3 times a week: job photo Monday, tip or process video Wednesday, review Friday. Simple, repeatable, and compounds over time.' },
    ],
  },
  {
    id: 'followup',
    title: 'Speed to Lead & Follow-Up',
    color: '#EF4444',
    stat: { value: '391%', label: 'conversion increase when you call a lead within 1 minute of inquiry' },
    intro: 'The leads are coming in — the money is being lost in the follow-up. Fix this and your cost per booked job drops without spending an extra dollar on ads.',
    tips: [
      { heading: 'The 5-minute rule is life or death', body: 'Leads reached within 5 minutes are 21x more likely to convert than leads called after 30 minutes. 78% of customers go with the first business that responds. You don\'t need to be the best — you need to be first.' },
      { heading: 'The average business waits 47 hours', body: 'If you respond within 5 minutes, you win by default in most markets — not because you\'re better, but because everyone else is asleep. 51% of leads are never contacted at all.' },
      { heading: 'Text first, call immediately after', body: 'The moment a lead comes in: send an automated text ("I\'ll call you in the next few minutes") then call immediately. Texts under 60 seconds achieve 73% appointment booking rate. After 30 minutes: 4%.' },
      { heading: 'The 5-touch follow-up sequence', body: 'Day 1: Call + text. Day 2: Call again. Day 3: Email. Day 5: Text with a different angle. Day 7: Final call. 55% of replies come from messages 2–5, not the first one.' },
      { heading: 'Set up missed-call text-back', body: 'If you miss a call, an automatic text goes out within 30 seconds: "Hey, I just missed your call — I\'m finishing up a job. What service can I help you with?" This saves 20–30% of leads that would otherwise call your competitor.' },
      { heading: 'Ask for the review while you\'re still there', body: 'The best time to ask for a Google review is right when you finish and the customer is happy. Text them a direct link before you leave the driveway. 12–15% of customers who get that SMS leave a review.' },
    ],
  },
  {
    id: 'sms',
    title: 'SMS Marketing for Local Businesses',
    color: '#45B69C',
    stat: { value: '98%', label: 'SMS open rate — 90% read within 3 minutes vs 20% for email' },
    intro: 'For local businesses, SMS is your most powerful tool for rebooking past customers, following up on quotes, and getting reviews. Most of your competitors aren\'t using it.',
    tips: [
      { heading: 'Every customer becomes a text contact', body: 'When you complete a job, add the customer to your text list with their permission. A list of 500 past customers you can text is worth more than any ad campaign.' },
      { heading: 'Seasonal re-engagement campaigns', body: 'Text past customers before peak season: "Hey [name], spring is here — ready to get your windows done? We\'re booking up fast. Reply YES and I\'ll hold a spot for you." Past customers convert at 60–70%.' },
      { heading: 'Quote follow-up via text', body: 'If someone gets a quote but doesn\'t book, follow up at 24 hours, 3 days, and 7 days: "Hey [name], just checking in on that quote — any questions I can answer?" Texts feel personal. Emails feel automated.' },
      { heading: 'Keep it personal, not promotional', body: 'The best local business texts read like they\'re from an actual person. First name, conversational tone, short message, clear ask. Under 160 characters. Always include opt-out.' },
    ],
  },
]

export default function DemoGrowPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#21D19F' }}>— Growth Playbook</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: '#E8ECFF' }}>Grow Your Business</h1>
            <p className="text-base max-w-xl" style={{ color: '#7B82A0' }}>The playbook local businesses use to turn ad spend into booked jobs — website, content, follow-up, and everything in between.</p>
          </div>

          {SECTIONS.map((section, si) => (
            <section key={section.id} id={section.id}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-3 self-stretch rounded-full flex-shrink-0" style={{ background: `linear-gradient(180deg, ${section.color}, ${section.color}44)` }} />
                <div>
                  <h2 className="text-2xl font-black tracking-tight" style={{ color: '#E8ECFF' }}>{section.title}</h2>
                  <p className="text-sm mt-0.5" style={{ color: '#7B82A0' }}>{section.intro}</p>
                </div>
              </div>

              <div className="rounded-2xl p-5 mb-6 relative overflow-hidden" style={{ background: section.color + '08', border: `1px solid ${section.color}20` }}>
                <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full blur-2xl opacity-30" style={{ background: section.color }} />
                <p className="text-3xl font-black mb-1" style={{ color: section.color }}>{section.stat.value}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#7B82A0' }}>{section.stat.label}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.tips.map((tip, ti) => (
                  <div key={ti} className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
                    <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full blur-2xl opacity-15" style={{ background: section.color }} />
                    <p className="font-black text-sm mb-2" style={{ color: '#E8ECFF' }}>{tip.heading}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>{tip.body}</p>
                  </div>
                ))}
              </div>

              {si < SECTIONS.length - 1 && (
                <div className="mt-16" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
              )}
            </section>
          ))}
    </main>
  )
}
