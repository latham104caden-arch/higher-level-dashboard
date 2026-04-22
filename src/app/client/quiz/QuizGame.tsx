'use client'

import { useState, useEffect } from 'react'

type Question = {
  question: string
  options: string[]
  correct: number
  explanation: string
  fact: string
  tag?: string
}

const ECOMMERCE_QUESTIONS: Question[] = [
  {
    question: 'What percentage of online shoppers abandon their cart before purchasing?',
    options: ['28%', '47%', '70%', '88%'],
    correct: 2,
    explanation: 'Cart abandonment averages 70% across ecommerce. The biggest culprits: surprise shipping costs (48%), forced account creation (19%), and slow checkout.',
    fact: 'Fixing checkout alone can increase your conversions by up to 35%.',
  },
  {
    question: 'UGC ads vs professional studio photos — which gets a higher CTR on Meta?',
    options: ['Professional by 2x', 'They perform the same', 'UGC by 4x', 'Depends on the product'],
    correct: 2,
    explanation: 'UGC gets 4x higher CTR and cuts cost-per-click by 50% compared to polished brand creative. Authentic beats perfect on social media every time.',
    fact: 'UGC is 5x more likely to drive a conversion than professional content.',
  },
  {
    question: 'How much does a 1-second delay in page load time cost you in conversions?',
    options: ['1%', '4%', '7%', '15%'],
    correct: 2,
    explanation: 'Every 1 second of load time reduces conversions by 7%. A store making $50K/month with a 4-second load vs 1-second load is losing over $10K monthly.',
    fact: 'Target under 2.5 seconds. Test yours free at PageSpeed Insights.',
  },
  {
    question: 'What percentage of ecommerce traffic comes from mobile devices?',
    options: ['45%', '61%', '73%', '83%'],
    correct: 3,
    explanation: '83% of your traffic is on a phone — but mobile converts 8% lower than desktop. That gap is pure revenue leaking from bad mobile experiences.',
    fact: 'Test your store on your own phone before any other device. If it feels slow, it is.',
  },
  {
    question: 'What is the abandoned cart SMS conversion rate?',
    options: ['4–8%', '11–15%', '24–39%', '50%+'],
    correct: 2,
    explanation: 'Abandoned cart SMS sequences convert at 24–39% — the highest of any automated ecommerce message. Send within 15 minutes of abandonment.',
    fact: 'A 3-message sequence (15min, 2hr, 24hr) dramatically outperforms a single follow-up text.',
  },
  {
    question: 'For every $1 spent on email marketing, what\'s the average return?',
    options: ['$8', '$18', '$42', '$76'],
    correct: 2,
    explanation: 'Email averages $42 return per $1 spent — the highest ROI of any marketing channel. It\'s also the only channel you fully own.',
    fact: 'Automated email flows generate 320% more revenue than one-off campaigns.',
  },
  {
    question: 'Where should you place customer reviews for maximum conversion impact?',
    options: ['Footer only', 'Separate reviews page', 'Next to the Add to Cart button', 'Pop-up after 30 seconds'],
    correct: 2,
    explanation: '86% of consumers say star ratings near the buy button are the #1 thing that drives them to purchase from a new brand. Social proof kills hesitation.',
    fact: 'Product pages with customer photos see up to 134% more conversions vs professional-only photos.',
  },
  {
    question: 'How many product images maximize conversions?',
    options: ['1 hero image', '2–3 angles', '4+ including lifestyle', '10+'],
    correct: 2,
    explanation: '63% of shoppers want multiple angles before buying. 4+ images including a lifestyle shot dramatically outperforms single-image listings.',
    fact: '360° product images increase conversion rates by 22%.',
  },
  {
    question: 'What\'s the #1 reason shoppers abandon checkout?',
    options: ['Too many steps', 'Hidden fees at checkout', 'Forced account creation', 'Limited payment options'],
    correct: 1,
    explanation: '48% of abandoned orders are caused by unexpected costs revealed at checkout. Show shipping estimates on the product page — no surprises.',
    fact: 'Be upfront about all costs from the first click. Trust builds conversions.',
  },
  {
    question: 'How many SMS messages per month maximizes engagement without killing your list?',
    options: ['1–2', '4–6', '10–12', '15–20'],
    correct: 1,
    explanation: '4–6 SMS per month is the sweet spot. Under 4 and you\'re invisible. Over 8 and opt-outs spike fast.',
    fact: 'A well-run SMS list should generate $15–$30 per subscriber per month.',
  },
  {
    question: 'What is the industry median landing page conversion rate?',
    options: ['1.2%', '3.2%', '6.6%', '12%'],
    correct: 2,
    explanation: 'The median across all landing pages is 6.6%. 10% is considered good. 15%+ means your page is genuinely optimized.',
    fact: 'Removing navigation from a landing page has been shown to double conversion rates.',
  },
  {
    question: 'Adding video to a landing page can improve conversions by how much?',
    options: ['12%', '36%', '86%', '200%'],
    correct: 2,
    explanation: 'Landing page videos can improve conversions by up to 86%. 90% of consumers prefer video content over static images for understanding a product.',
    fact: 'Even a simple 30-second walkthrough shot on your phone outperforms most professional images.',
  },
  {
    question: 'What email traffic conversion rate makes it one of the best acquisition channels?',
    options: ['4.1%', '9.3%', '19.3%', '28%'],
    correct: 2,
    explanation: 'Email traffic converts at 19.3% — nearly double paid search. Your email list isn\'t just for communication, it\'s one of your best conversion tools.',
    fact: 'Personalized CTAs in emails convert 202% better than generic ones.',
  },
  {
    question: 'What percentage of online shoppers consider product photos the most important buying factor?',
    options: ['45%', '68%', '78%', '90%'],
    correct: 3,
    explanation: '9 out of 10 online shoppers say high-quality product photos are among the most important factors in their purchase decision.',
    fact: '50% of shoppers specifically buy products featuring larger, high-quality images.',
  },
  {
    question: 'A 2x ROAS on Meta ads means what exactly?',
    options: ['You spent $2 and made $1', 'You broke even', 'You doubled your ad spend in revenue', 'You made 200% profit'],
    correct: 2,
    explanation: '2x ROAS means for every $1 you spent on ads, you made $2 back in revenue. Whether that\'s profitable depends on your margins — typically you need 3x+ to scale.',
    fact: 'Most brands need 2.5–4x ROAS to be truly profitable after product cost, shipping, and overhead.',
  },
  {
    question: 'Businesses with how many landing pages see nearly 300% more conversions?',
    options: ['5–10', '10–15', '21–40', '50+'],
    correct: 2,
    explanation: 'Businesses with 21–40 landing pages experience nearly 300% more conversions than those with fewer pages. Each specific page targets a specific customer.',
    fact: 'Every ad angle should have its own dedicated landing page — not your homepage.',
  },
  {
    question: 'What percentage of shoppers abandon if you require account creation to checkout?',
    options: ['8%', '14%', '19%', '31%'],
    correct: 2,
    explanation: '19% of shoppers abandon checkout solely because they don\'t want to create an account. Always offer guest checkout. Ask for account creation after the purchase.',
    fact: 'Post-purchase account creation converts much higher than pre-purchase — the customer already trusts you.',
  },
  {
    question: 'What percentage of products are returned because they looked different in photos?',
    options: ['8%', '15%', '22%', '35%'],
    correct: 2,
    explanation: '22% of product returns happen because the item looked different in the photo. Better photography doesn\'t just increase sales — it reduces costly returns.',
    fact: '360° images and lifestyle shots dramatically close the gap between expectation and reality.',
  },
  {
    question: 'A customer who buys twice is how many times more likely to become a loyal repeat buyer?',
    options: ['2x', '3x', '5x', '10x'],
    correct: 2,
    explanation: 'The second purchase is the most important milestone in a customer relationship. Get someone to buy twice and they\'re 5x more likely to keep coming back.',
    fact: 'Focus your post-purchase email flow on getting that second order — offer a related product within 7 days.',
  },
  {
    question: 'What percentage of small businesses use email marketing to acquire customers?',
    options: ['42%', '61%', '81%', '94%'],
    correct: 2,
    explanation: '81% of small businesses use email to acquire customers, and 80% use it for retention. It\'s the single most universal marketing channel across all business sizes.',
    fact: 'The brands that treat email as their primary owned channel consistently outperform those that rely only on paid ads.',
  },
  {
    question: 'Which audience typically has the lowest cost-per-acquisition on Meta?',
    options: ['Cold interest targeting', 'Lookalike audiences', 'Retargeting past visitors', 'Broad targeting with Advantage+'],
    correct: 2,
    explanation: 'Retargeting past visitors and customers almost always has the lowest CPA because these people already know your brand. Warm audiences convert cheaper.',
    fact: 'Layer your strategy: cold traffic to build awareness → retargeting to convert → email/SMS to retain.',
  },
  {
    question: 'How long do you have to capture attention in a Meta video ad before people scroll past?',
    options: ['5 seconds', '3 seconds', '1.7 seconds', '8 seconds'],
    correct: 1,
    explanation: 'You have about 3 seconds to hook the viewer before they scroll. The first frame needs to stop the scroll visually — movement, a face, a bold statement, or a surprising visual.',
    fact: 'Never start a video ad with a logo animation. Start with your strongest hook.',
  },
  {
    question: 'Prices ending in .99 vs rounded numbers — which performs better and why?',
    options: ['.99 always wins', 'Rounded numbers always win', '.99 wins for value positioning, rounded wins for premium', 'No difference proven'],
    correct: 2,
    explanation: '$29.99 signals a deal. $30 signals quality/premium. Both work — but for different audiences and brand positions. Premium brands should use round numbers.',
    fact: 'Charm pricing (.99) works best with price-sensitive audiences. Round numbers build perceived quality.',
  },
  {
    question: 'What percentage of consumers made a purchase after receiving a brand SMS?',
    options: ['38%', '52%', '72%', '86%'],
    correct: 2,
    explanation: '72% of consumers have made a purchase after receiving a brand text. And 86% have made multiple purchases via SMS in the past year.',
    fact: 'Businesses that engage customers through SMS are 683% more likely to achieve digital marketing success.',
  },
  {
    question: 'How much more revenue do automated email campaigns generate vs non-automated?',
    options: ['80% more', '140% more', '220% more', '320% more'],
    correct: 3,
    explanation: 'Automated email campaigns generate 320% more revenue than manual sends. Set up your flows once — abandoned cart, welcome, post-purchase — and they compound forever.',
    fact: 'Your abandoned cart flow alone should recover 5–15% of all abandoned revenue on autopilot.',
  },
  {
    question: 'When scaling a winning Meta ad, what\'s the safest budget increase increment?',
    options: ['Double it immediately', 'Increase 20–30% every 3 days', 'Increase 50% weekly', 'Move to a new campaign'],
    correct: 1,
    explanation: 'Increasing budget 20–30% every 3 days gives the Meta algorithm time to recalibrate without shocking the delivery system and spiking your CPM.',
    fact: 'Doubling the budget overnight often tanks performance temporarily. Patience when scaling saves money.',
  },
  {
    question: 'When testing new ad creatives, what metric should you look at first?',
    options: ['ROAS', 'Cost per purchase', 'CTR (Click-Through Rate)', 'Impressions'],
    correct: 2,
    explanation: 'CTR tells you if the creative is stopping the scroll and generating interest — before you have enough spend data to evaluate ROAS. A high CTR with no conversions = landing page problem, not ad problem.',
    fact: 'A CTR above 2% is good. Above 4% means your hook is genuinely working.',
  },
  {
    question: 'Offering more payment options at checkout has what effect on conversions?',
    options: ['No measurable effect', 'Reduces conversions — too many choices', 'Increases conversions, especially with Buy Now Pay Later', 'Only matters for orders over $100'],
    correct: 2,
    explanation: 'Payment flexibility increases conversions, especially for higher-ticket items. Adding BNPL (Afterpay, Klarna) typically increases average order value 30–50%.',
    fact: 'Missing a preferred payment method is a top-5 reason for checkout abandonment.',
  },
  {
    question: 'What is the fastest way to increase conversions without changing your ads?',
    options: ['Lower your prices', 'Optimize your landing page speed', 'Add more products', 'Increase your ad budget'],
    correct: 1,
    explanation: 'Your landing page is the first thing ad clicks hit. A slow, confusing, or untrustworthy page kills conversions regardless of how good your ads are.',
    fact: 'Ad optimization without landing page optimization is like pouring water into a leaky bucket.',
  },
  {
    question: 'What\'s the best time to introduce a customer to your next product?',
    options: ['Before they buy the first one', 'Immediately at checkout', 'In the 24 hours after their first purchase', '30 days after delivery'],
    correct: 2,
    explanation: 'The 24 hours after a purchase is your highest-trust window. The customer is excited, their credit card is already out, and they just validated that they believe in your product.',
    fact: 'A well-timed post-purchase upsell email in this window can add 15–25% to your average order value.',
  },
  {
    question: 'What does CPM stand for and what does a high CPM indicate?',
    options: ['Cost Per Month — too much spending', 'Cost Per Message — your DMs are expensive', 'Cost Per 1,000 Impressions — competition for your audience is high', 'Conversion Per Metric — your tracking is off'],
    correct: 2,
    explanation: 'CPM = Cost Per 1,000 Impressions. A rising CPM means more advertisers are competing for your audience, which drives up your costs. Broaden your audience or refresh creative to combat it.',
    fact: 'High frequency (seeing the same ad 4+ times) inflates CPM. New creative resets this.',
  },
]

const LOCAL_QUESTIONS: Question[] = [
  {
    question: 'How much more likely are you to convert a lead responding within 5 minutes vs 30 minutes?',
    options: ['3x more likely', '10x more likely', '21x more likely', 'Same chance'],
    correct: 2,
    explanation: 'Responding within 5 minutes makes you 21x more likely to convert that lead. Intent drops off a cliff within minutes — people move on fast.',
    fact: 'Calling within 1 minute of inquiry boosts conversions by 391%.',
  },
  {
    question: 'What is the average business response time to a new lead?',
    options: ['15 minutes', '2 hours', '12 hours', '47 hours'],
    correct: 3,
    explanation: 'The average business takes 47 hours to respond. 57% of companies take a week. Respond in 5 minutes and you win by default in most markets.',
    fact: '51% of leads are never contacted at all. Just showing up puts you ahead of half your competition.',
  },
  {
    question: 'What percentage of buyers go with the first business that responds?',
    options: ['42%', '58%', '67%', '78%'],
    correct: 3,
    explanation: '78% of customers go with whoever responds first — not necessarily the best price or the most reviews. Speed is your most underrated competitive advantage.',
    fact: '82% of consumers expect a business to reply within 10 minutes of reaching out.',
  },
  {
    question: 'What is the open rate for SMS messages compared to email?',
    options: ['SMS 45% / Email 35%', 'SMS 75% / Email 25%', 'SMS 98% / Email 20%', 'About the same'],
    correct: 2,
    explanation: 'SMS has a 98% open rate — 90% read within 3 minutes. Email sits around 20%. Text is your most powerful follow-up tool by a wide margin.',
    fact: 'Post-service SMS review requests convert at 12–15% vs 3–4% for email.',
  },
  {
    question: 'How many reviews does a local business need before customers trust their rating?',
    options: ['5', '10', '20', '50'],
    correct: 2,
    explanation: '69% of consumers won\'t trust a business\'s rating until they see at least 20 reviews. Getting to 20 is your first critical milestone.',
    fact: '71% of consumers regularly read reviews before hiring any local service business.',
  },
  {
    question: 'A lead submits a quote request. When should you text them?',
    options: ['Within 24 hours', 'Within 4 hours', 'Within 1 hour', 'Within 60 seconds'],
    correct: 3,
    explanation: 'Text responses under 60 seconds achieve a 73% appointment booking rate. After 30 minutes, that drops to 4%. The difference is 18x in your booking rate.',
    fact: 'Text first ("I\'ll call you in a moment") then call immediately. Two-touch instant response wins every time.',
  },
  {
    question: 'What\'s the #1 trust signal on a local service business website?',
    options: ['Professional logo', 'Before & after photos', 'Price list', 'Years in business badge'],
    correct: 1,
    explanation: 'Before and after photos show competence instantly without a word of reading. Real results from real jobs outperform every other trust element.',
    fact: 'Businesses with 100+ photos on Google Business Profile get 520% more calls than those with fewer than 10.',
  },
  {
    question: 'How many fields should your lead capture form have for maximum conversions?',
    options: ['8–10 fields', '5–6 fields', '3 fields', '1 field'],
    correct: 2,
    explanation: '3-field forms (name, phone, service needed) convert 27% better than 5-field forms. Get them in the door first — collect details when you call.',
    fact: 'Every extra form field is another opportunity for your potential customer to give up.',
  },
  {
    question: 'What percentage of replies to follow-up sequences come from messages 2–5, not the first contact?',
    options: ['15%', '30%', '45%', '55%'],
    correct: 3,
    explanation: '55% of all replies come from follow-up messages — not the first one. Most businesses give up after one try and lose more than half their potential revenue.',
    fact: 'The winning sequence: Day 1 call + text, Day 2 call, Day 3 email, Day 5 text, Day 7 final call.',
  },
  {
    question: 'What percentage of local searches happen on mobile phones?',
    options: ['45%', '58%', '70%+', '90%'],
    correct: 2,
    explanation: '70%+ of local searches happen on phones. Your website must be mobile-first — not just "mobile-friendly." Tap-to-call in the top right is non-negotiable.',
    fact: 'A 1-second delay in page load time reduces conversions by 7%.',
  },
  {
    question: 'When is the best time to ask a customer for a Google review?',
    options: ['1 month after the job', 'In a follow-up email a week later', 'Right when you finish the job while they\'re happy', 'After they rebook'],
    correct: 2,
    explanation: 'The moment you complete a job is peak satisfaction — emotions are high, the result is fresh. Ask right then and text them a direct review link before you leave.',
    fact: 'Asking in person then sending a text link is the highest-converting review request method.',
  },
  {
    question: 'Referred customers close at what rate compared to cold leads?',
    options: ['Same rate', '2x higher', '4x higher', '10x higher'],
    correct: 2,
    explanation: 'Referred customers close at 4x the rate of cold leads and have a higher lifetime value. A referral program isn\'t optional — it\'s your lowest-cost acquisition channel.',
    fact: 'Emailing happy customers 2 weeks post-job with a referral offer is one of the highest-ROI moves in local service marketing.',
  },
  {
    question: 'For every $1 spent on email marketing, what\'s the average return?',
    options: ['$8', '$18', '$42', '$76'],
    correct: 2,
    explanation: 'Email returns $42 per $1 spent — the highest ROI of any marketing channel. It\'s also the only channel you own — no algorithm can take it away.',
    fact: 'A simple monthly email to your past customer list is one of the highest-ROI activities in your whole business.',
  },
  {
    question: 'Where should your phone number appear on your website?',
    options: ['Footer only', 'Contact page only', 'Top right of every page, clickable on mobile', 'Pop-up after 10 seconds'],
    correct: 2,
    explanation: 'Customers who are ready to book won\'t scroll to find your contact info. Top right, every page, tap-to-call on mobile. A click-to-call button alone can increase leads 20–30%.',
    fact: 'Your homepage has one job: turn a visitor into a lead in under 30 seconds.',
  },
  {
    question: 'What type of content performs best for local service businesses in Meta ads?',
    options: ['Polished studio ads', 'Stock footage with voiceover', 'Before/after walkthrough videos shot on a phone', 'Carousel of service options'],
    correct: 2,
    explanation: 'Authentic before/after walkthroughs shot on a phone outperform polished studio ads for local service businesses. Real job footage builds immediate trust.',
    fact: 'A 30-second phone video of a completed job — before and after — is your most powerful ad creative.',
  },
  {
    question: 'What is the #1 reason homeowners hesitate to hire a new service business?',
    options: ['Price is too high', 'They\'re worried about who\'s coming to their home', 'Too many choices', 'They don\'t know what they need'],
    correct: 1,
    explanation: 'Trust is the #1 barrier in home services. Showing your team\'s faces, your reviews, your insurance, and your real job photos removes the "stranger danger" hesitation.',
    fact: 'A "Meet the Team" page with real photos and short bios directly increases inquiry conversion rates.',
  },
  {
    question: 'What does CPL stand for and what\'s a healthy target for most local service businesses?',
    options: ['Cost Per Lead — target under $200', 'Cost Per Lead — target 10–20% of average job value', 'Clicks Per Lead — depends on industry', 'Conversion Per Lead — above 50%'],
    correct: 1,
    explanation: 'CPL = Cost Per Lead. Target 10–20% of your average job value. If an average job is worth $400, a $40–$80 CPL is healthy. Higher than that and the economics break down.',
    fact: 'Tracking CPL is just the start — also track lead-to-booked-job rate to understand your true acquisition cost.',
  },
  {
    question: 'Past customers convert at what rate compared to cold leads?',
    options: ['About the same', '2–3x higher', '20–30x higher', '60–70x higher'],
    correct: 2,
    explanation: 'Past customers convert at 60–70% vs 2–5% for cold leads. Your existing customer list is worth far more than any ad campaign you could run.',
    fact: 'A seasonal text or email to your past customers before peak season is your highest-ROI campaign every year.',
  },
  {
    question: 'What is a "missed-call text-back" and why does it matter?',
    options: ['A feature that calls back automatically', 'An auto-text sent within 30 seconds of a missed call', 'A voicemail transcription service', 'A callback scheduling tool'],
    correct: 1,
    explanation: 'A missed-call text-back sends an automatic text within 30 seconds: "Hey, I just missed your call — I\'m finishing a job. What can I help you with?" It saves 20–30% of leads that would otherwise call your competitor.',
    fact: 'Most CRM and phone tools (GoHighLevel, Jobber, etc.) have this feature built in.',
  },
  {
    question: 'What\'s the most cost-effective way to grow a local service business?',
    options: ['More ad spend', 'More service offerings', 'Referral program + review system + fast follow-up', 'Hire more staff first'],
    correct: 2,
    explanation: 'The highest-ROI growth lever for local businesses is a system: fast follow-up converts more leads, reviews attract new ones, and referrals bring pre-sold customers. No ad spend required.',
    fact: 'Building systems before scaling ad spend means every dollar you invest goes further.',
  },
  {
    question: 'What percentage of consumers check a business\'s online presence before calling?',
    options: ['41%', '63%', '79%', '92%'],
    correct: 3,
    explanation: '92% of consumers check a business online before calling. Your Google Business Profile, reviews, website, and social media are all being evaluated before a single call is made.',
    fact: 'A complete, active Google Business Profile with recent photos and reviews is worth more than most paid campaigns.',
  },
  {
    question: 'When should you start marketing for your peak season?',
    options: ['When peak season starts', '2 weeks before peak season', '4–6 weeks before peak season', 'Year-round with no changes'],
    correct: 2,
    explanation: 'Starting 4–6 weeks before your peak season gives Meta\'s algorithm time to optimize, builds your retargeting audience, and fills your calendar before the rush hits.',
    fact: 'By the time most homeowners are actively searching, the best service providers are already fully booked.',
  },
  {
    question: 'Your homepage has one primary goal. What is it?',
    options: ['Show everything you offer', 'Rank on Google', 'Turn a visitor into a lead in under 30 seconds', 'Look professional'],
    correct: 2,
    explanation: 'Every element on your homepage should push toward one action: getting the visitor\'s contact info or getting them to call you. Everything else is a distraction.',
    fact: 'Pages with a single, clear CTA convert significantly higher than pages with multiple competing calls to action.',
  },
  {
    question: 'What makes a Facebook ad hook effective for a local service business?',
    options: ['Mentioning your years of experience', 'Leading with the customer\'s problem, not your solution', 'Starting with your company name and logo', 'Listing all your services'],
    correct: 1,
    explanation: 'Lead with what the customer is feeling — the problem. "Your windows are killing your curb appeal" hits harder than "We\'re the #1 window cleaning company." Problem first, solution second.',
    fact: 'You have 3 seconds to stop the scroll. A problem your customer recognizes is your fastest hook.',
  },
  {
    question: 'What is the ideal follow-up cadence after sending a quote that hasn\'t been accepted?',
    options: ['Wait for them to reach out', 'One email after 3 days then stop', '24hr text, 3-day call, 7-day final message', 'Daily messages for a week'],
    correct: 2,
    explanation: 'A 3-touch sequence after a quote covers the window when most decisions get made. More than that and you risk annoying them. Less and you leave money on the table.',
    fact: '55% of replies to follow-up sequences come from the 2nd or 3rd message — not the first.',
  },
  {
    question: 'Google reviews vs Facebook reviews — which matters more for local service SEO?',
    options: ['Facebook reviews', 'They are equal', 'Google reviews', 'Yelp reviews'],
    correct: 2,
    explanation: 'Google reviews directly impact your local search ranking and your star rating in Google Maps — where most local intent searches happen. Facebook reviews are social proof but don\'t move your search position.',
    fact: 'Getting to 50+ Google reviews with a 4.8+ rating puts you in a completely different competitive tier.',
  },
  {
    question: 'Seasonal re-engagement SMS to past customers typically converts at what rate?',
    options: ['2–5%', '10–20%', '40–50%', '60–70%'],
    correct: 3,
    explanation: 'Past customers already trust you. A well-timed "Spring is here — ready to book?" text to your past customer list can convert at 60–70%, compared to 2–5% for cold audiences.',
    fact: 'This is the highest-ROI campaign you can run — costs almost nothing, converts like crazy.',
  },
  {
    question: 'What is the most common reason small local businesses fail to grow despite getting enough leads?',
    options: ['Not enough ad budget', 'Poor follow-up and slow response time', 'Bad service quality', 'Too much competition'],
    correct: 1,
    explanation: 'Most local businesses have a follow-up problem, not a lead problem. Slow response, inconsistent follow-up, and no system for re-engaging past customers means constant leaking.',
    fact: 'Building a follow-up system before increasing ad spend is always the right order of operations.',
  },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function QuizGame({ clientType }: { clientType: string }) {
  const allQuestions = clientType === 'ecommerce' ? ECOMMERCE_QUESTIONS : LOCAL_QUESTIONS

  const [queue, setQueue] = useState<Question[]>(() => shuffle(allQuestions))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  const q = queue[index]

  function handleSelect(idx: number) {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
  }

  function handleNext() {
    if (index + 1 >= queue.length) {
      // reshuffle and loop
      setQueue(shuffle(allQuestions))
      setIndex(0)
    } else {
      setIndex(i => i + 1)
    }
    setSelected(null)
    setAnswered(false)
  }

  const isCorrect = selected === q?.correct
  const seen = index + 1
  const total = queue.length

  return (
    <div className="space-y-4">
      {/* Light header — no score, just position */}
      <div className="flex items-center justify-between mb-1">
        <span
          className="text-xs font-black px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.05)', color: '#484D6D', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {q.tag}
        </span>
        <span className="text-xs" style={{ color: '#484D6D' }}>{seen} of {total}</span>
      </div>

      {/* Thin progress strip */}
      <div className="rounded-full overflow-hidden" style={{ height: '2px', background: 'rgba(255,255,255,0.05)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(seen / total) * 100}%`, background: 'rgba(33,209,159,0.5)' }}
        />
      </div>

      {/* Question card */}
      <div
        className="rounded-2xl p-7 relative overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
      >
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-3xl opacity-08 pointer-events-none" style={{ background: '#21D19F' }} />
        {q.tag && <span className="text-xs font-black px-2.5 py-1 rounded-full inline-block mb-4" style={{ background: 'rgba(33,209,159,0.1)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }}>{q.tag}</span>}
        <p className="font-black text-lg leading-snug mb-6" style={{ color: '#E8ECFF' }}>{q.question}</p>

        <div className="space-y-3">
          {q.options.map((option, idx) => {
            let bg = 'rgba(255,255,255,0.04)'
            let border = 'rgba(255,255,255,0.08)'
            let color = '#E8ECFF'
            let icon: string | null = null

            if (answered) {
              if (idx === q.correct) {
                bg = 'rgba(33,209,159,0.1)'; border = 'rgba(33,209,159,0.35)'; color = '#21D19F'; icon = '✓'
              } else if (idx === selected) {
                bg = 'rgba(239,68,68,0.08)'; border = 'rgba(239,68,68,0.3)'; color = '#EF4444'; icon = '✗'
              } else {
                color = '#484D6D'
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                className="w-full text-left px-5 py-4 rounded-xl font-bold text-sm flex items-center justify-between transition-all duration-150"
                style={{ background: bg, border: `1px solid ${border}`, color, cursor: answered ? 'default' : 'pointer' }}
                onMouseEnter={e => { if (!answered) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                onMouseLeave={e => { if (!answered) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              >
                <span>{option}</span>
                {icon && <span className="text-sm font-black flex-shrink-0">{icon}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Explanation */}
      {answered && (
        <div
          className="rounded-2xl p-6 space-y-3"
          style={{
            background: isCorrect ? 'rgba(33,209,159,0.05)' : 'rgba(239,68,68,0.05)',
            border: `1px solid ${isCorrect ? 'rgba(33,209,159,0.18)' : 'rgba(239,68,68,0.18)'}`,
          }}
        >
          <p className="font-black text-sm" style={{ color: isCorrect ? '#21D19F' : '#EF4444' }}>
            {isCorrect ? 'Correct!' : `The answer is: ${q.options[q.correct]}`}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>{q.explanation}</p>
          <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs" style={{ color: '#A0A4B8' }}>
              {q.fact}
            </p>
          </div>
        </div>
      )}

      {/* Next */}
      {answered && (
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-xl font-black text-sm tracking-wider transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #21D19F, #45B69C)',
            color: '#080B14',
            letterSpacing: '0.06em',
            boxShadow: '0 0 20px rgba(33,209,159,0.2)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {index + 1 >= queue.length ? 'SHUFFLE & KEEP GOING →' : 'NEXT →'}
        </button>
      )}
    </div>
  )
}
