import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export type BusinessType = 'ecommerce' | 'service' | 'saas' | 'unknown'

export interface Finding {
  label: string
  status: 'pass' | 'fail' | 'warn'
  detail: string
  points: number
  maxPoints: number
}

export interface CategoryResult {
  score: number
  label: string
  description: string
  findings: Finding[]
}

export interface DetectedElements {
  // shared
  hasMetaPixel: boolean
  hasForm: boolean
  hasCTA: boolean
  hasPhone: boolean
  hasClickToCall: boolean
  hasReviews: boolean
  hasGuarantee: boolean
  isHttps: boolean
  hasAddress: boolean
  hasVideo: boolean
  // service
  hasLicensed: boolean
  hasYearsExp: boolean
  hasTeamPhoto: boolean
  hasLocalSignal: boolean
  hasOnlineBooking: boolean
  hasLiveChat: boolean
  hasFastResponsePromise: boolean
  formFieldCount: number
  // ecommerce
  hasATC: boolean
  hasPrice: boolean
  hasDiscount: boolean
  hasUrgency: boolean
  hasFreeShipping: boolean
  hasBundleDeal: boolean
  hasPaymentOptions: boolean
  hasReturnPolicy: boolean
  hasOutOfStock: boolean
  hasSubscriptionFriction: boolean
  hasAllSalesFinal: boolean
  hasCrossSell: boolean
  hasSatisfactionGuarantee: boolean
  hasIngredientStory: boolean
  // saas
  hasFreeTrial: boolean
  hasNoCC: boolean
  hasDemo: boolean
  hasPricing: boolean
  hasFeatureList: boolean
  hasIntegrations: boolean
  hasLogoWall: boolean
}

export interface AuditResult {
  url: string
  fetchTimeMs: number
  pageTitle: string
  pageDescription: string
  businessType: BusinessType
  businessTypeConfidence: string
  screenshotBase64: string | null
  detectedElements: DetectedElements
  scores: {
    speed: number
    seo: number
    conversion: number
    trust: number
    tracking: number
    adReadiness: number
    overall: number
  }
  grade: string
  gradeColor: string
  categories: {
    speed: CategoryResult
    seo: CategoryResult
    conversion: CategoryResult
    trust: CategoryResult
    tracking: CategoryResult
    adReadiness: CategoryResult
  }
  topFixes: { priority: number; fix: string; impact: string }[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractText(html: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i')
  const m = html.match(regex)
  return m ? m[1].replace(/<[^>]+>/g, '').trim() : null
}

function extractMeta(html: string, name: string): string | null {
  const r1 = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i')
  const r2 = new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${name}["']`, 'i')
  const m = html.match(r1) || html.match(r2)
  return m ? m[1].trim() : null
}

function count(html: string, pattern: RegExp): number {
  return (html.match(pattern) || []).length
}

function has(html: string, pattern: RegExp): boolean {
  return pattern.test(html)
}

function clamp(n: number): number {
  return Math.min(100, Math.max(0, Math.round(n)))
}

function getGrade(score: number): { grade: string; color: string } {
  if (score >= 90) return { grade: 'A', color: '#21D19F' }
  if (score >= 80) return { grade: 'B', color: '#45B69C' }
  if (score >= 70) return { grade: 'C', color: '#F59E0B' }
  if (score >= 60) return { grade: 'D', color: '#F97316' }
  return { grade: 'F', color: '#EF4444' }
}

// ── Business Type Detection ───────────────────────────────────────────────────

function detectBusinessType(html: string, url: string): { type: BusinessType; confidence: string } {
  const h = html.toLowerCase()
  const u = url.toLowerCase()

  let ecomScore = 0
  let serviceScore = 0
  let saasScore = 0

  // Ecommerce signals
  if (has(h, /cdn\.shopify\.com|myshopify\.com/)) ecomScore += 10
  if (has(h, /woocommerce|wc-cart|wc-checkout/)) ecomScore += 10
  if (has(h, /bigcommerce|squarespace\.com\/commerce/)) ecomScore += 8
  if (has(h, /add.to.cart|add_to_cart|addtocart/i)) ecomScore += 8
  if (has(h, /view.cart|shopping.cart|your.cart/i)) ecomScore += 6
  if (has(h, /checkout|place.order|proceed.to/i)) ecomScore += 5
  if (has(h, /shipping|free.shipping|delivery/i)) ecomScore += 4
  if (has(h, /product|shop now|buy now|order now/i)) ecomScore += 4
  if (count(h, /\$\d+(\.\d{2})?/g) > 3) ecomScore += 5
  if (has(h, /in.stock|out.of.stock|qty|quantity|size|variant/i)) ecomScore += 4
  if (has(h, /stripe|paypal|apple.pay|shop.pay|afterpay|klarna/i)) ecomScore += 4

  // Service signals
  if (has(h, /get.a.(free.)?quote|free.estimate|request.a.quote/i)) serviceScore += 10
  if (has(h, /schedule.a|book.a|book.now|appointment/i)) serviceScore += 8
  if (has(h, /licensed|insured|bonded|certified technician/i)) serviceScore += 8
  if (has(h, /service.area|we.serve|serving.the/i)) serviceScore += 7
  if (has(h, /years.of.experience|family.owned|locally.owned/i)) serviceScore += 6
  if (has(h, /free.estimate|no.obligation|same.day|24.7.service|emergency/i)) serviceScore += 6
  if (has(h, /plumb|hvac|roofing|landscap|clean|pest|electri|paint|remodel|window/i)) serviceScore += 6
  if (has(h, /our.team|meet.the.team|our.technicians|our.staff/i)) serviceScore += 4
  if (has(h, /service.area|zip.code|city|location/i)) serviceScore += 3

  // SaaS signals
  if (has(h, /free.trial|start.for.free|try.for.free|no.credit.card/i)) saasScore += 10
  if (has(h, /per.month|\/mo|per.user|per.seat|billed.annually/i)) saasScore += 10
  if (has(h, /pricing.plan|choose.a.plan|start.plan|enterprise.plan/i)) saasScore += 9
  if (has(h, /integrations|api|dashboard|platform|workflow|automation/i)) saasScore += 7
  if (has(h, /schedule.a.demo|book.a.demo|watch.demo|live.demo/i)) saasScore += 8
  if (has(h, /sign.up.free|create.an.account|get.started.free/i)) saasScore += 6
  if (has(h, /features|solutions|use.cases|how.it.works/i)) saasScore += 4
  if (has(h, /customers|case.studies|trusted.by|\d+.companies|\d+.users/i)) saasScore += 4
  if (has(h, /chrome.extension|app.store|google.play|desktop.app/i)) saasScore += 4

  const max = Math.max(ecomScore, serviceScore, saasScore)
  if (max < 6) return { type: 'unknown', confidence: 'Could not determine type' }

  if (ecomScore === max) {
    const conf = ecomScore > 15 ? 'High confidence' : ecomScore > 8 ? 'Medium confidence' : 'Low confidence'
    return { type: 'ecommerce', confidence: conf }
  }
  if (serviceScore === max) {
    const conf = serviceScore > 15 ? 'High confidence' : serviceScore > 8 ? 'Medium confidence' : 'Low confidence'
    return { type: 'service', confidence: conf }
  }
  const conf = saasScore > 15 ? 'High confidence' : saasScore > 8 ? 'Medium confidence' : 'Low confidence'
  return { type: 'saas', confidence: conf }
}

// ── Speed Category (shared) ───────────────────────────────────────────────────

function buildSpeedCategory(pageSpeedScore: number, fetchTimeMs: number, pageSizeKb: number): CategoryResult {
  const findings: Finding[] = [
    {
      label: 'Mobile Page Speed',
      status: pageSpeedScore >= 80 ? 'pass' : pageSpeedScore >= 60 ? 'warn' : 'fail',
      detail: pageSpeedScore >= 80
        ? `${pageSpeedScore}/100 — fast. Google rewards speed with lower CPMs and better ad placements.`
        : pageSpeedScore >= 60
        ? `${pageSpeedScore}/100 — moderate. Every 1s delay cuts conversions ~7%. Target 80+.`
        : `${pageSpeedScore}/100 — slow. Ad traffic bounces before the page loads. This is bleeding your ROAS.`,
      points: pageSpeedScore >= 80 ? 40 : pageSpeedScore >= 60 ? 24 : 8,
      maxPoints: 40,
    },
    {
      label: 'Server Response Time',
      status: fetchTimeMs < 800 ? 'pass' : fetchTimeMs < 2000 ? 'warn' : 'fail',
      detail: fetchTimeMs < 800
        ? `${fetchTimeMs}ms — excellent.`
        : fetchTimeMs < 2000
        ? `${fetchTimeMs}ms — acceptable but could be faster. Consider a CDN (Cloudflare is free).`
        : `${fetchTimeMs}ms — very slow server. Upgrade hosting or add Cloudflare in front of it.`,
      points: fetchTimeMs < 800 ? 30 : fetchTimeMs < 2000 ? 18 : 5,
      maxPoints: 30,
    },
    {
      label: 'Page Weight',
      status: pageSizeKb < 200 ? 'pass' : pageSizeKb < 600 ? 'warn' : 'fail',
      detail: pageSizeKb < 200
        ? `${pageSizeKb}KB — lean.`
        : pageSizeKb < 600
        ? `${pageSizeKb}KB — moderate. Compress images and lazy-load below-fold content.`
        : `${pageSizeKb}KB — heavy. Large pages destroy mobile performance. Compress images first.`,
      points: pageSizeKb < 200 ? 30 : pageSizeKb < 600 ? 18 : 5,
      maxPoints: 30,
    },
  ]
  const raw = findings.reduce((s, f) => s + f.points, 0)
  return {
    score: clamp((raw / 100) * 100),
    label: 'Page Speed',
    description: 'Load time directly impacts ad quality score, bounce rate, and ROAS.',
    findings,
  }
}

// ── SEO Category (shared) ─────────────────────────────────────────────────────

function buildSeoCategory(html: string): CategoryResult {
  const title = extractText(html, 'title') || ''
  const metaDesc = extractMeta(html, 'description') || ''
  const h1 = extractText(html, 'h1') || ''
  const imgCount = count(html, /<img/gi)
  const imgWithAlt = count(html, /<img[^>]+alt=["'][^"']+["']/gi)
  const hasViewport = has(html, /name=["']viewport["']/i)

  const findings: Finding[] = [
    {
      label: 'Page Title Tag',
      status: title ? (title.length >= 30 && title.length <= 70 ? 'pass' : 'warn') : 'fail',
      detail: title
        ? `"${title.slice(0, 65)}${title.length > 65 ? '…' : ''}" — ${title.length} chars. ${title.length < 30 ? 'Too short.' : title.length > 70 ? 'Too long — gets cut in search results.' : 'Optimal length.'}`
        : 'No title tag. Critical for SEO and ad Quality Score.',
      points: title ? (title.length >= 30 && title.length <= 70 ? 20 : 12) : 0,
      maxPoints: 20,
    },
    {
      label: 'Meta Description',
      status: metaDesc ? (metaDesc.length >= 120 && metaDesc.length <= 160 ? 'pass' : 'warn') : 'fail',
      detail: metaDesc
        ? `${metaDesc.length} chars. ${metaDesc.length < 120 ? 'Expand to 120–160 chars.' : metaDesc.length > 160 ? 'Too long — Google will truncate it.' : 'Perfect length.'}`
        : 'No meta description. Google will pull random text — usually a poor first impression.',
      points: metaDesc ? (metaDesc.length >= 120 && metaDesc.length <= 160 ? 20 : 12) : 0,
      maxPoints: 20,
    },
    {
      label: 'H1 Headline',
      status: h1 ? 'pass' : 'fail',
      detail: h1
        ? `"${h1.slice(0, 80)}${h1.length > 80 ? '…' : ''}" — H1 found.`
        : 'No H1 tag. Every page needs a single clear headline. Missing H1 = weak SEO signal.',
      points: h1 ? 20 : 0,
      maxPoints: 20,
    },
    {
      label: 'Image Alt Text',
      status: imgCount === 0 || imgCount === imgWithAlt ? 'pass' : imgCount - imgWithAlt <= 3 ? 'warn' : 'fail',
      detail: imgCount === 0
        ? 'No images found.'
        : imgCount === imgWithAlt
        ? `All ${imgCount} images have alt text.`
        : `${imgCount - imgWithAlt} of ${imgCount} images missing alt text. Easy SEO win.`,
      points: imgCount === 0 ? 20 : Math.max(0, 20 - (imgCount - imgWithAlt) * 4),
      maxPoints: 20,
    },
    {
      label: 'Mobile Viewport',
      status: hasViewport ? 'pass' : 'fail',
      detail: hasViewport
        ? 'Viewport meta tag present — mobile rendering configured correctly.'
        : 'Missing viewport meta. Page will look broken on mobile. ~60%+ of ad traffic is mobile.',
      points: hasViewport ? 20 : 0,
      maxPoints: 20,
    },
  ]
  const raw = findings.reduce((s, f) => s + f.points, 0)
  return {
    score: clamp(raw),
    label: 'SEO Basics',
    description: 'Foundational signals affecting organic rankings and ad Quality Score.',
    findings,
  }
}

// ── Tracking Category (shared) ────────────────────────────────────────────────

function buildTrackingCategory(html: string): CategoryResult {
  const hasMetaPixel = has(html, /(fbq\(|connect\.facebook\.net|facebook\.com\/tr)/i)
  const hasGA = has(html, /(gtag\(|google-analytics\.com|UA-\d|G-[A-Z0-9]+)/i)
  const hasGTM = has(html, /(googletagmanager\.com|GTM-)/i)
  const hasTikTokPixel = has(html, /(ttq\.|analytics\.tiktok\.com)/i)

  const findings: Finding[] = [
    {
      label: 'Meta Pixel',
      status: hasMetaPixel ? 'pass' : 'fail',
      detail: hasMetaPixel
        ? 'Meta Pixel active. Conversion tracking, retargeting, and lookalike audiences are all possible.'
        : 'No Meta Pixel. Without it you cannot track conversions, build audiences, or optimize ad delivery. Top priority.',
      points: hasMetaPixel ? 40 : 0,
      maxPoints: 40,
    },
    {
      label: 'Google Analytics',
      status: hasGA ? 'pass' : 'warn',
      detail: hasGA
        ? 'Google Analytics detected. Site behavior data is being collected.'
        : 'No Google Analytics. You\'re missing data on traffic sources, user behavior, and drop-off points.',
      points: hasGA ? 25 : 5,
      maxPoints: 25,
    },
    {
      label: 'Google Tag Manager',
      status: hasGTM ? 'pass' : 'warn',
      detail: hasGTM
        ? 'GTM found — makes deploying and updating tracking fast without touching code.'
        : 'No GTM. Not required, but strongly recommended for managing multiple pixels and events.',
      points: hasGTM ? 25 : 10,
      maxPoints: 25,
    },
    {
      label: 'TikTok Pixel',
      status: hasTikTokPixel ? 'pass' : 'warn',
      detail: hasTikTokPixel
        ? 'TikTok Pixel found. Multi-platform tracking is solid.'
        : 'No TikTok Pixel. If running or planning TikTok ads, install this.',
      points: hasTikTokPixel ? 10 : 5,
      maxPoints: 10,
    },
  ]
  const raw = findings.reduce((s, f) => s + f.points, 0)
  return {
    score: clamp(raw),
    label: 'Ad Tracking',
    description: 'Pixel and analytics setup — the foundation of every ad campaign.',
    findings,
  }
}

// ── ECOMMERCE: Conversion (Product Page + Offers + ATC) ──────────────────────

function buildEcomConversion(html: string): CategoryResult {
  const h = html.toLowerCase()

  const hasATC = has(h, /add.to.cart|add_to_cart|add-to-cart/i)
  const hasPrice = count(h, /\$\d+(\.\d{2})?/g) > 1
  const hasImages = count(html, /<img/gi) >= 3
  const hasProductDesc = count(h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '), /\b\w+\b/g) > 150

  // Deal & urgency signals
  const hasDiscount = has(h, /(\d+%.off|save \$|\bsale\b|clearance|discount code|coupon|promo)/i)
  const hasUrgency = has(h, /(limited (time|stock|offer)|only \d+ left|ends (today|soon|midnight)|hurry|flash sale|today only)/i)
  const hasFreeShipping = has(h, /(free shipping|free delivery|ships free|free.* shipping on orders)/i)
  const hasBundleDeal = has(h, /(bundle|buy \d+ get|multipack|value pack|combo|kit)/i)
  const hasSubscribe = has(h, /(subscribe.*save|subscription|auto.replenish)/i)
  const hasCountdown = has(h, /(countdown|timer|time.left|hours?.left|minutes?.left)/i)

  // ATC page quality
  const hasReviewsNearProduct = has(h, /(review|rating|star|\d+.customer|verified.purchase)/i)
  const hasTrustBadge = has(h, /(secure.checkout|ssl|money.back|guarantee|satisfaction|safe.checkout|trusted)/i)
  const hasPaymentOptions = has(h, /(paypal|apple.pay|shop.pay|afterpay|klarna|affirm|buy.now.pay.later|visa|mastercard)/i)
  const hasReturnPolicy = has(h, /(return.policy|easy.returns|hassle.free.return|\d+.day.return|\d+.day.guarantee)/i)

  // New ecom signals
  const hasOutOfStock = has(h, /(sold.out|out.of.stock|currently.unavailable|no.longer.available|unavailable)/i)
  const hasSubscriptionFriction = has(h, /(recurring.purchase|subscription.required|auto.renewal|auto-renewal)/i) && !has(h, /(one.time|one-time|buy.once|no.subscription)/i)
  const hasAllSalesFinal = has(h, /(all.sales.final|no.returns|no.refunds)/i)
  const hasCrossSell = has(h, /(you.may.also.like|frequently.bought|related.products|customers.also|pairs.well|goes.well.with)/i)
  const hasSatisfactionGuarantee = has(h, /(money.back|satisfaction.guarantee|love.it.or|risk.free|\d+.day.guarantee)/i)
  const hasIngredientStory = has(h, /(sea.mineral|sourced.from|third.party.tested|independently.tested|why.it.works|the.science|how.it.works)/i)

  const findings: Finding[] = [
    {
      label: 'Add to Cart Button',
      status: hasATC ? 'pass' : 'fail',
      detail: hasATC
        ? 'Add to cart button detected. The core conversion element is present.'
        : 'No clear "Add to Cart" button detected. This is the most critical ecommerce conversion element.',
      points: hasATC ? 15 : 0,
      maxPoints: 15,
    },
    {
      label: 'Price Clearly Displayed',
      status: hasPrice ? 'pass' : 'fail',
      detail: hasPrice
        ? 'Prices detected on the page. Visitors can see what they\'re buying before committing.'
        : 'No prices found. Hidden pricing causes drop-off — people leave to "check prices" and never come back.',
      points: hasPrice ? 10 : 0,
      maxPoints: 10,
    },
    {
      label: 'Product Images (3+)',
      status: hasImages ? 'pass' : 'warn',
      detail: hasImages
        ? 'Multiple product images found. Visual coverage helps buyers commit.'
        : 'Fewer than 3 images detected. Products with more images convert significantly better — show every angle.',
      points: hasImages ? 10 : 4,
      maxPoints: 10,
    },
    {
      label: 'Discount / Deal Present',
      status: hasDiscount ? 'pass' : 'warn',
      detail: hasDiscount
        ? 'Discount or sale language found. Price anchoring and deals are proven conversion boosters.'
        : 'No deals detected. "% off", "Save $X", or limited-time offers dramatically increase ATC rate for cold ad traffic.',
      points: hasDiscount ? 15 : 3,
      maxPoints: 15,
    },
    {
      label: 'Urgency / Scarcity',
      status: hasUrgency ? 'pass' : 'warn',
      detail: hasUrgency
        ? 'Urgency signals found ("Only X left", "Sale ends soon", etc.). FOMO is a powerful converter.'
        : 'No urgency signals. Adding "Only 12 left" or a countdown timer can increase conversion rate 10–25%.',
      points: hasUrgency ? 10 : 2,
      maxPoints: 10,
    },
    {
      label: 'Free Shipping Offer',
      status: hasFreeShipping ? 'pass' : 'warn',
      detail: hasFreeShipping
        ? 'Free shipping mentioned. Top reason customers add to cart — keep this prominent.'
        : 'No free shipping messaging. 80% of shoppers expect it. Add a "Free shipping on orders over $X" bar.',
      points: hasFreeShipping ? 10 : 2,
      maxPoints: 10,
    },
    {
      label: 'Bundle / Upsell Offers',
      status: hasBundleDeal ? 'pass' : 'warn',
      detail: hasBundleDeal
        ? 'Bundle or multi-product deals found. These increase AOV and improve ROAS.'
        : 'No bundle deals detected. Offering "Buy 2, save 15%" or a bundle is the easiest AOV increase.',
      points: hasBundleDeal ? 8 : 2,
      maxPoints: 8,
    },
    {
      label: 'Trust Badges Near Checkout',
      status: hasTrustBadge ? 'pass' : 'warn',
      detail: hasTrustBadge
        ? 'Trust signals near checkout (secure, guarantee, SSL). Reduces cart abandonment.'
        : 'No trust badges near ATC/checkout. "Secure Checkout" and "30-Day Returns" at the point of purchase reduce abandonment.',
      points: hasTrustBadge ? 8 : 2,
      maxPoints: 8,
    },
    {
      label: 'Multiple Payment Options',
      status: hasPaymentOptions ? 'pass' : 'warn',
      detail: hasPaymentOptions
        ? 'Multiple payment methods detected (PayPal, Apple Pay, BNPL, etc.). Reduces checkout friction.'
        : 'No alternative payment methods found. Adding PayPal, Apple Pay, or Afterpay increases completed purchases.',
      points: hasPaymentOptions ? 8 : 2,
      maxPoints: 8,
    },
    {
      label: 'Return Policy Visible',
      status: hasReturnPolicy ? 'pass' : 'warn',
      detail: hasReturnPolicy
        ? 'Return policy or guarantee mentioned. Removes the biggest risk objection for cold traffic.'
        : 'No return policy visible. Showing a clear return policy on product pages reduces hesitation.',
      points: hasReturnPolicy ? 6 : 1,
      maxPoints: 6,
    },
    {
      label: 'Products In Stock',
      status: hasOutOfStock ? 'fail' : 'pass',
      detail: hasOutOfStock
        ? 'Sold out or out-of-stock language detected. Running ads to an out-of-stock product is money in the trash — pause campaigns immediately until inventory is live.'
        : 'No out-of-stock signals detected. Products appear available — good to run ads.',
      points: hasOutOfStock ? 0 : 10,
      maxPoints: 10,
    },
    {
      label: 'Subscription Friction',
      status: hasSubscriptionFriction ? 'warn' : 'pass',
      detail: hasSubscriptionFriction
        ? 'Subscription or auto-renewal language found without a clear one-time option. Cold traffic hates commitment — add "one-time purchase" alongside subscribe & save to reduce ATC hesitation.'
        : 'No forced subscription friction detected. Customers can buy without a commitment barrier.',
      points: hasSubscriptionFriction ? 2 : 6,
      maxPoints: 6,
    },
    {
      label: 'All Sales Final Warning',
      status: hasAllSalesFinal ? 'warn' : 'pass',
      detail: hasAllSalesFinal
        ? '"All sales final" or "no returns" language found. This is a major trust killer for cold ad traffic who haven\'t tried your product. Replace with a satisfaction guarantee — even a 15-day one dramatically improves conversions.'
        : 'No hard "all sales final" language detected.',
      points: hasAllSalesFinal ? 0 : 5,
      maxPoints: 5,
    },
    {
      label: 'Cross-Sell / Related Products',
      status: hasCrossSell ? 'pass' : 'warn',
      detail: hasCrossSell
        ? 'Cross-sell or "frequently bought together" section found. These lift AOV and make each ad dollar work harder.'
        : 'No cross-sell section detected. Adding "Pairs well with" or "Frequently bought together" after ATC is one of the easiest AOV wins in ecommerce.',
      points: hasCrossSell ? 8 : 2,
      maxPoints: 8,
    },
    {
      label: 'Satisfaction Guarantee',
      status: hasSatisfactionGuarantee ? 'pass' : 'warn',
      detail: hasSatisfactionGuarantee
        ? 'Satisfaction guarantee or money-back offer found. This is the single highest-leverage trust signal for converting cold traffic — keep it prominent.'
        : 'No satisfaction guarantee detected. A 30-day money-back guarantee removes the biggest purchase objection. If you offer one, make it visible near the ATC button.',
      points: hasSatisfactionGuarantee ? 8 : 1,
      maxPoints: 8,
    },
    {
      label: 'Ingredient / Product Story',
      status: hasIngredientStory ? 'pass' : 'warn',
      detail: hasIngredientStory
        ? 'Ingredient sourcing or "why it works" content found. Educated buyers convert better — especially in health, wellness, and supplement categories.'
        : 'No ingredient story or "why it works" section detected. For health/wellness products, explaining what\'s in it and why it works builds conviction. Add a short "The Science" or "Why It Works" section near the product.',
      points: hasIngredientStory ? 6 : 1,
      maxPoints: 6,
    },
  ]
  const raw = findings.reduce((s, f) => s + f.points, 0)
  const max = findings.reduce((s, f) => s + f.maxPoints, 0)
  return {
    score: clamp((raw / max) * 100),
    label: 'Product & Offer Quality',
    description: 'How well the product page converts cold ad traffic — deals, ATC, urgency, and trust.',
    findings,
  }
}

// ── ECOMMERCE: Trust ──────────────────────────────────────────────────────────

function buildEcomTrust(html: string, isHttps: boolean): CategoryResult {
  const h = html.toLowerCase()
  const hasReviews = has(h, /(review|testimonial|star.rating|rated \d|customer.said|verified.buyer)/i)
  const hasSocialProof = has(h, /(\d+k?.customers|\d+.orders|\d+.reviews|trusted.by|as.seen.in)/i)
  const hasGuarantee = has(h, /(money.back|satisfaction.guarantee|\d+.day.guarantee|hassle.free|risk.free)/i)
  const hasSecureBadge = has(h, /(ssl.secure|secure.checkout|norton|mcafee|trust.badge|256.bit)/i)
  const hasBrandStory = has(h, /(our.story|founded|family.owned|mission|about.us)/i)

  const findings: Finding[] = [
    {
      label: 'HTTPS / SSL',
      status: isHttps ? 'pass' : 'fail',
      detail: isHttps
        ? 'HTTPS active. Required by Meta for ad destinations and boosts buyer confidence.'
        : 'HTTP only — Meta will reject all ads to this URL. SSL is non-negotiable.',
      points: isHttps ? 30 : 0,
      maxPoints: 30,
    },
    {
      label: 'Customer Reviews & Ratings',
      status: hasReviews ? 'pass' : 'fail',
      detail: hasReviews
        ? 'Reviews and ratings found. Cold ad traffic converts 3x better with visible social proof.'
        : 'No reviews found. This is the #1 trust gap for ecommerce. Add a reviews widget (Loox, Judge.me, Okendo).',
      points: hasReviews ? 25 : 0,
      maxPoints: 25,
    },
    {
      label: 'Social Proof Numbers',
      status: hasSocialProof ? 'pass' : 'warn',
      detail: hasSocialProof
        ? 'Proof numbers found ("10,000+ customers", "4.8 stars", etc.). Anchors credibility fast.'
        : 'No proof numbers. Adding "Loved by 5,000+ customers" or a star count builds immediate trust.',
      points: hasSocialProof ? 20 : 5,
      maxPoints: 20,
    },
    {
      label: 'Money-Back Guarantee',
      status: hasGuarantee ? 'pass' : 'warn',
      detail: hasGuarantee
        ? 'Guarantee found. Removing purchase risk is the highest-leverage trust tactic for cold traffic.'
        : 'No guarantee visible. A 30-day money-back guarantee can increase conversions 20–30% with zero real cost.',
      points: hasGuarantee ? 15 : 3,
      maxPoints: 15,
    },
    {
      label: 'Secure Checkout Badge',
      status: hasSecureBadge ? 'pass' : 'warn',
      detail: hasSecureBadge
        ? 'Security badge found near checkout. Reduces card entry anxiety.'
        : 'No checkout security badge. Add a "Secure Checkout" or lock icon near payment fields.',
      points: hasSecureBadge ? 10 : 3,
      maxPoints: 10,
    },
  ]
  const raw = findings.reduce((s, f) => s + f.points, 0)
  const max = findings.reduce((s, f) => s + f.maxPoints, 0)
  return {
    score: clamp((raw / max) * 100),
    label: 'Checkout Trust',
    description: 'Signals that make first-time buyers feel safe entering their card.',
    findings,
  }
}

// ── ECOMMERCE: Ad Readiness ───────────────────────────────────────────────────

function buildEcomAdReadiness(html: string, isHttps: boolean, pageSpeedScore: number): CategoryResult {
  const h = html.toLowerCase()
  const hasMetaPixel = has(html, /(fbq\(|connect\.facebook\.net|facebook\.com\/tr)/i)
  const hasATC = has(h, /add.to.cart|add_to_cart/i)
  const hasPrice = count(h, /\$\d+(\.\d{2})?/g) > 1
  const hasCatalog = has(html, /(product\.json|catalog|og:type.*product)/i)
  const hasOGTags = has(html, /og:title|og:image|og:description/i)
  const hasOutOfStock = has(h, /(sold.out|out.of.stock|currently.unavailable|no.longer.available|unavailable)/i)

  const findings: Finding[] = [
    {
      label: 'Inventory Available',
      status: hasOutOfStock ? 'fail' : 'pass',
      detail: hasOutOfStock
        ? 'Out-of-stock or sold-out language detected. Stop all paid traffic immediately — every click to an unavailable product is wasted spend and destroys ROAS. Pause campaigns until inventory is live.'
        : 'No out-of-stock indicators detected. Products appear in stock — safe to send paid traffic.',
      points: hasOutOfStock ? 0 : 25,
      maxPoints: 25,
    },
    {
      label: 'Meta Pixel + Conversion Events',
      status: hasMetaPixel ? 'pass' : 'fail',
      detail: hasMetaPixel
        ? 'Pixel found. Make sure Purchase, AddToCart, and InitiateCheckout events are firing.'
        : 'No Meta Pixel. Cannot run conversion campaigns, build retargeting audiences, or optimize for purchases.',
      points: hasMetaPixel ? 25 : 0,
      maxPoints: 25,
    },
    {
      label: 'Page Load Speed for Paid Traffic',
      status: pageSpeedScore >= 70 ? 'pass' : pageSpeedScore >= 50 ? 'warn' : 'fail',
      detail: pageSpeedScore >= 70
        ? `${pageSpeedScore}/100 — fast enough. Slow pages kill ROAS — yours is solid.`
        : `${pageSpeedScore}/100 — too slow. Every second of delay costs ~7% in conversions. Fix this before scaling.`,
      points: pageSpeedScore >= 70 ? 25 : pageSpeedScore >= 50 ? 12 : 3,
      maxPoints: 25,
    },
    {
      label: 'Product Open Graph Tags',
      status: hasOGTags ? 'pass' : 'warn',
      detail: hasOGTags
        ? 'Open Graph tags found. Ads pulling from this page will display correctly in Meta\'s ad previews.'
        : 'No OG tags. Dynamic product ads may show incorrect or missing images and text.',
      points: hasOGTags ? 20 : 5,
      maxPoints: 20,
    },
    {
      label: 'HTTPS (Ad Requirement)',
      status: isHttps ? 'pass' : 'fail',
      detail: isHttps
        ? 'HTTPS active — meets Meta\'s destination URL requirements.'
        : 'HTTP only — Meta will reject all ads pointing here.',
      points: isHttps ? 25 : 0,
      maxPoints: 25,
    },
  ]
  const raw = findings.reduce((s, f) => s + f.points, 0)
  const max = findings.reduce((s, f) => s + f.maxPoints, 0)
  return {
    score: clamp((raw / max) * 100),
    label: 'Ad Readiness',
    description: 'Technical requirements for running effective Meta ad campaigns.',
    findings,
  }
}

// ── SERVICE: Conversion (Form Quality) ───────────────────────────────────────

function buildServiceConversion(html: string): CategoryResult {
  const h = html.toLowerCase()

  const hasForm = has(html, /<form/i)
  const formFieldCount = count(html, /<input(?:[^>]*type=["'](?:text|email|tel|number|date|select)["']|[^>]*(?<!type=["'](?:hidden|submit|radio|checkbox)["']))/gi)
  const hasPhone = has(h, /(\(?\d{3}\)?[\s\-.]?\d{3}[\s\-.]?\d{4}|tel:|click.to.call|call.us)/i)
  const hasCTA = has(h, /(get.a.(free.)?quote|free.estimate|schedule|book.now|contact.us|get.started|call.now|request.service)/i)
  const hasClickToCall = has(html, /href=["']tel:/i)
  const hasOnlineBooking = has(h, /(book.online|schedule.online|calendar|pick.a.time|select.a.date)/i)
  const hasLiveChat = has(h, /(livechat|intercom|drift|tawk|crisp|chat.widget|chat.now|live.chat)/i)
  const hasFastResponsePromise = has(h, /(respond.within|reply.within|same.day.response|call.back.within|we.reply|24.hour.response)/i)

  const isFormSimple = formFieldCount > 0 && formFieldCount <= 4
  const isFormModerate = formFieldCount > 4 && formFieldCount <= 7
  const isFormComplex = formFieldCount > 7

  const findings: Finding[] = [
    {
      label: 'Lead Form Present',
      status: hasForm ? 'pass' : 'fail',
      detail: hasForm
        ? 'Form found. Visitors have a way to convert without calling.'
        : 'No form found. You\'re forcing every lead to call — many won\'t. A simple form captures leads 24/7.',
      points: hasForm ? 20 : 0,
      maxPoints: 20,
    },
    {
      label: 'Form Simplicity (# of Fields)',
      status: isFormSimple ? 'pass' : isFormModerate ? 'warn' : hasForm ? 'fail' : 'warn',
      detail: !hasForm
        ? 'No form to evaluate.'
        : isFormSimple
        ? `~${formFieldCount} fields detected — clean and low-friction. Fewer fields = more submissions.`
        : isFormModerate
        ? `~${formFieldCount} fields — starting to feel long. Cut any non-essential fields. Name + Phone + Service = enough.`
        : `~${formFieldCount}+ fields — too many. Long forms kill conversion rate. Get to 3–4 fields max for the first touch.`,
      points: !hasForm ? 0 : isFormSimple ? 20 : isFormModerate ? 12 : 4,
      maxPoints: 20,
    },
    {
      label: 'Phone Number & Click-to-Call',
      status: hasClickToCall ? 'pass' : hasPhone ? 'warn' : 'fail',
      detail: hasClickToCall
        ? 'Click-to-call link found. Mobile visitors can tap and call instantly — top converter for local services.'
        : hasPhone
        ? 'Phone number found but not linked for click-to-call. Wrap it in <a href="tel:..."> for mobile users.'
        : 'No phone number visible. For local service businesses, a prominent phone number is essential.',
      points: hasClickToCall ? 15 : hasPhone ? 9 : 0,
      maxPoints: 15,
    },
    {
      label: 'Primary CTA',
      status: hasCTA ? 'pass' : 'fail',
      detail: hasCTA
        ? 'Clear CTA found ("Get a Quote", "Schedule", "Book Now", etc.). Visitors know what to do next.'
        : 'No clear CTA detected. Every service page needs one obvious next step above the fold.',
      points: hasCTA ? 15 : 0,
      maxPoints: 15,
    },
    {
      label: 'Online Booking / Scheduling',
      status: hasOnlineBooking ? 'pass' : 'warn',
      detail: hasOnlineBooking
        ? 'Online booking detected. Self-serve scheduling removes friction and captures leads outside business hours.'
        : 'No online booking found. Tools like Calendly or Jobber let leads book without waiting for a call back.',
      points: hasOnlineBooking ? 15 : 3,
      maxPoints: 15,
    },
    {
      label: 'Response Time Promise',
      status: hasFastResponsePromise ? 'pass' : 'warn',
      detail: hasFastResponsePromise
        ? 'Response time commitment found. Setting expectations increases form submission confidence.'
        : 'No response time commitment. Adding "We respond within 1 hour" or "Same-day reply" can significantly lift form fills.',
      points: hasFastResponsePromise ? 10 : 2,
      maxPoints: 10,
    },
    {
      label: 'Live Chat',
      status: hasLiveChat ? 'pass' : 'warn',
      detail: hasLiveChat
        ? 'Chat widget found. Captures visitors who won\'t call or fill a form.'
        : 'No live chat. Adding chat (free options: Tawk.to, Tidio) converts 3–5x more than form-only pages.',
      points: hasLiveChat ? 5 : 1,
      maxPoints: 5,
    },
  ]
  const raw = findings.reduce((s, f) => s + f.points, 0)
  const max = findings.reduce((s, f) => s + f.maxPoints, 0)
  return {
    score: clamp((raw / max) * 100),
    label: 'Lead Form & Contact',
    description: 'How easy it is for a cold ad visitor to become a lead.',
    findings,
  }
}

// ── SERVICE: Trust ────────────────────────────────────────────────────────────

function buildServiceTrust(html: string, isHttps: boolean): CategoryResult {
  const h = html.toLowerCase()
  const hasLicensed = has(h, /(licensed|insured|bonded|certified|background.check|background.checked)/i)
  const hasYearsExp = has(h, /(\d+.years?.of.experience|\d+.years?.in.business|since \d{4}|serving.since)/i)
  const hasReviews = has(h, /(review|testimonial|star|rated|google.review|yelp|home.advisor|angi)/i)
  const hasTeamPhoto = has(h, /(our.team|meet.the.team|our.staff|our.technicians|about.us)/i)
  const hasLocalSignal = has(h, /(serving.the|service.area|locally.owned|family.owned|local.business|\bour.community\b)/i)
  const hasGuarantee = has(h, /(satisfaction.guarantee|100%.satisfaction|happiness.guarantee|guarantee|warranty)/i)
  const hasAwards = has(h, /(award|best.of|top.rated|#1|voted|recognized|accredited|bbb)/i)
  const hasBeforeAfter = has(h, /(before.and.after|before.after|before\/after|our.work|gallery|portfolio)/i)

  const findings: Finding[] = [
    {
      label: 'HTTPS / SSL',
      status: isHttps ? 'pass' : 'fail',
      detail: isHttps
        ? 'HTTPS active. Required for Meta ads and signals professionalism.'
        : 'HTTP only — Meta ads will be rejected. SSL certificates are free (Let\'s Encrypt).',
      points: isHttps ? 20 : 0,
      maxPoints: 20,
    },
    {
      label: 'Licensed, Insured & Certified',
      status: hasLicensed ? 'pass' : 'warn',
      detail: hasLicensed
        ? 'License and insurance credentials mentioned. Critical trust signal for service businesses.'
        : 'No license/insurance info found. This is the #1 trust factor for local service — add it prominently.',
      points: hasLicensed ? 20 : 2,
      maxPoints: 20,
    },
    {
      label: 'Years in Business / Experience',
      status: hasYearsExp ? 'pass' : 'warn',
      detail: hasYearsExp
        ? 'Years of experience or "Since YYYY" found. Anchors credibility instantly for new visitors.'
        : 'No experience duration mentioned. "15 Years in Business" or "Serving Since 2009" builds trust fast.',
      points: hasYearsExp ? 15 : 3,
      maxPoints: 15,
    },
    {
      label: 'Customer Reviews / Testimonials',
      status: hasReviews ? 'pass' : 'fail',
      detail: hasReviews
        ? 'Reviews or testimonials found. Social proof is the most persuasive element for local service businesses.'
        : 'No reviews found. Add Google Reviews embed or at least 3–5 testimonials. This is costing you leads.',
      points: hasReviews ? 20 : 0,
      maxPoints: 20,
    },
    {
      label: 'Team or Owner Photos',
      status: hasTeamPhoto ? 'pass' : 'warn',
      detail: hasTeamPhoto
        ? 'Team info or photos found. Putting a human face on the business dramatically increases trust.'
        : 'No team photos. People hire people, not logos. Add a photo of the owner or crew.',
      points: hasTeamPhoto ? 10 : 2,
      maxPoints: 10,
    },
    {
      label: 'Local Community Signals',
      status: hasLocalSignal ? 'pass' : 'warn',
      detail: hasLocalSignal
        ? 'Local ownership or service area mentioned. Helps with both trust and local SEO.'
        : 'No local signals. Mentioning your city, "locally owned", or "serving [City] since XXXX" helps both trust and SEO.',
      points: hasLocalSignal ? 10 : 2,
      maxPoints: 10,
    },
    {
      label: 'Satisfaction Guarantee',
      status: hasGuarantee ? 'pass' : 'warn',
      detail: hasGuarantee
        ? 'Guarantee found. Removing risk is the single highest-leverage conversion move for services.'
        : 'No guarantee mentioned. "100% Satisfaction Guaranteed" removes the biggest objection to booking.',
      points: hasGuarantee ? 5 : 1,
      maxPoints: 5,
    },
  ]
  const raw = findings.reduce((s, f) => s + f.points, 0)
  const max = findings.reduce((s, f) => s + f.maxPoints, 0)
  return {
    score: clamp((raw / max) * 100),
    label: 'Local Trust & Credibility',
    description: 'The signals that turn a stranger into a customer for a local service business.',
    findings,
  }
}

// ── SERVICE: Ad Readiness ─────────────────────────────────────────────────────

function buildServiceAdReadiness(html: string, isHttps: boolean, pageSpeedScore: number): CategoryResult {
  const h = html.toLowerCase()
  const hasMetaPixel = has(html, /(fbq\(|connect\.facebook\.net|facebook\.com\/tr)/i)
  const hasForm = has(html, /<form/i)
  const hasPhone = has(h, /(\(?\d{3}\)?[\s\-.]?\d{3}[\s\-.]?\d{4}|tel:|call.us)/i)
  const hasCTA = has(h, /(get.a.(free.)?quote|free.estimate|schedule|book.now|contact.us|get.started|call.now)/i)
  const hasLeadEvent = has(html, /(fbq.*Lead|Lead.*fbq|pixel.*lead)/i)

  const findings: Finding[] = [
    {
      label: 'Meta Pixel Installed',
      status: hasMetaPixel ? 'pass' : 'fail',
      detail: hasMetaPixel
        ? 'Pixel found. Make sure the Lead event fires on form submission.'
        : 'No Meta Pixel. Cannot track leads, build audiences, or optimize for conversions.',
      points: hasMetaPixel ? 30 : 0,
      maxPoints: 30,
    },
    {
      label: 'Lead Event Tracking',
      status: hasLeadEvent ? 'pass' : 'warn',
      detail: hasLeadEvent
        ? 'Lead conversion event detected. Meta can optimize ad delivery for form completions.'
        : 'No Lead event firing detected. Without it, Meta optimizes for clicks — not actual leads. Big ROAS impact.',
      points: hasLeadEvent ? 25 : 5,
      maxPoints: 25,
    },
    {
      label: 'Fast Load for Ad Traffic',
      status: pageSpeedScore >= 70 ? 'pass' : pageSpeedScore >= 50 ? 'warn' : 'fail',
      detail: pageSpeedScore >= 70
        ? `${pageSpeedScore}/100 — fast enough for paid traffic.`
        : `${pageSpeedScore}/100 — too slow. High bounce before the form even loads = wasted ad budget.`,
      points: pageSpeedScore >= 70 ? 20 : pageSpeedScore >= 50 ? 10 : 2,
      maxPoints: 20,
    },
    {
      label: 'Form + CTA Above Fold',
      status: hasForm && hasCTA ? 'pass' : hasForm || hasCTA ? 'warn' : 'fail',
      detail: hasForm && hasCTA
        ? 'Both a form and CTA are present. Visitors know exactly what to do when they land.'
        : hasForm
        ? 'Form found but no clear CTA text. Make the action explicit — "Get Your Free Quote" above the form.'
        : hasCTA
        ? 'CTA found but no form. Add a form so visitors can convert without picking up the phone.'
        : 'No form or CTA. Landing page has no conversion mechanism — all ad spend is being wasted.',
      points: hasForm && hasCTA ? 15 : hasForm || hasCTA ? 8 : 0,
      maxPoints: 15,
    },
    {
      label: 'HTTPS (Ad Requirement)',
      status: isHttps ? 'pass' : 'fail',
      detail: isHttps
        ? 'HTTPS active — meets Meta\'s destination URL requirement.'
        : 'HTTP only — Meta will reject all ads to this URL.',
      points: isHttps ? 10 : 0,
      maxPoints: 10,
    },
  ]
  const raw = findings.reduce((s, f) => s + f.points, 0)
  const max = findings.reduce((s, f) => s + f.maxPoints, 0)
  return {
    score: clamp((raw / max) * 100),
    label: 'Ad Readiness',
    description: 'Technical setup for running high-converting service lead gen campaigns.',
    findings,
  }
}

// ── SAAS: Conversion (Trial / Demo) ──────────────────────────────────────────

function buildSaasConversion(html: string): CategoryResult {
  const h = html.toLowerCase()
  const hasFreeTrial = has(h, /(free.trial|start.for.free|try.for.free|try.free)/i)
  const hasNoCC = has(h, /(no.credit.card|no cc required|no card needed|cancel.anytime)/i)
  const hasDemo = has(h, /(schedule.a.demo|book.a.demo|watch.demo|live.demo|request.demo)/i)
  const hasCTA = has(h, /(get.started|start.now|sign.up.free|create.account|try.it.free)/i)
  const hasPricing = has(h, /(pricing|per.month|\/mo|per.user|per.seat|choose.a.plan)/i)
  const hasFeatureList = has(h, /(features|what.you.get|everything.you.need|includes|key.features)/i)
  const hasHowItWorks = has(h, /(how.it.works|how.we.work|3.steps|in.minutes|quick.setup|easy.setup)/i)
  const hasVideo = has(h, /(<video|youtube|vimeo|demo.video|product.video|watch.how)/i)

  const findings: Finding[] = [
    {
      label: 'Free Trial Offer',
      status: hasFreeTrial ? 'pass' : 'warn',
      detail: hasFreeTrial
        ? 'Free trial messaging found. Lowers the barrier to entry dramatically for cold ad traffic.'
        : 'No free trial offer found. SaaS without a trial forces high-intent action too early. Add "Try free for 14 days".',
      points: hasFreeTrial ? 20 : 3,
      maxPoints: 20,
    },
    {
      label: 'No Credit Card Required',
      status: hasNoCC ? 'pass' : 'warn',
      detail: hasNoCC
        ? '"No credit card required" messaging found. Removes the #1 friction point for trial signups.'
        : 'No "no credit card" messaging. Adding this next to your CTA can increase trial signups 30–50%.',
      points: hasNoCC ? 15 : 2,
      maxPoints: 15,
    },
    {
      label: 'Demo / Walkthrough Option',
      status: hasDemo ? 'pass' : 'warn',
      detail: hasDemo
        ? 'Demo booking or video found. Captures leads who aren\'t ready for a trial but want to see the product.'
        : 'No demo option. "Schedule a Demo" as a secondary CTA catches buyers who need more context before committing.',
      points: hasDemo ? 15 : 3,
      maxPoints: 15,
    },
    {
      label: 'Pricing Visible',
      status: hasPricing ? 'pass' : 'warn',
      detail: hasPricing
        ? 'Pricing information found. Transparency filters bad leads and pre-qualifies good ones.'
        : 'No pricing visible. Hidden pricing causes distrust and makes it hard to pre-qualify ad traffic.',
      points: hasPricing ? 15 : 3,
      maxPoints: 15,
    },
    {
      label: 'Feature List or Benefit Summary',
      status: hasFeatureList ? 'pass' : 'warn',
      detail: hasFeatureList
        ? 'Feature or benefit list found. Helps visitors quickly understand the value proposition.'
        : 'No feature list detected. Cold ad traffic needs to understand what they get — fast. Add a 3-column feature section.',
      points: hasFeatureList ? 15 : 3,
      maxPoints: 15,
    },
    {
      label: 'How It Works Section',
      status: hasHowItWorks ? 'pass' : 'warn',
      detail: hasHowItWorks
        ? '"How It Works" section found. Reduces setup anxiety and increases trial confidence.'
        : 'No "How It Works" section. A 3-step "Set up in minutes" section removes the fear of complexity.',
      points: hasHowItWorks ? 10 : 2,
      maxPoints: 10,
    },
    {
      label: 'Product Demo Video',
      status: hasVideo ? 'pass' : 'warn',
      detail: hasVideo
        ? 'Video content found. Pages with product demo videos convert 2–3x higher for SaaS.'
        : 'No product video. A 60–90 second demo video is the single highest-converting asset for SaaS landing pages.',
      points: hasVideo ? 10 : 2,
      maxPoints: 10,
    },
  ]
  const raw = findings.reduce((s, f) => s + f.points, 0)
  const max = findings.reduce((s, f) => s + f.maxPoints, 0)
  return {
    score: clamp((raw / max) * 100),
    label: 'Trial & Demo Conversion',
    description: 'How well the page converts cold traffic into trial signups or demo bookings.',
    findings,
  }
}

// ── SAAS: Trust ───────────────────────────────────────────────────────────────

function buildSaasTrust(html: string, isHttps: boolean): CategoryResult {
  const h = html.toLowerCase()
  const hasLogos = has(h, /(trusted.by|our.customers|used.by|as.seen.in|featured.in|customer.logo|logo.wall)/i)
  const hasTestimonials = has(h, /(testimonial|what.our.customers|what.users.say|review|case.study)/i)
  const hasSocialProof = has(h, /(\d+k?.customers|\d+.companies|\d+.users|\d+.teams|millions.of)/i)
  const hasSecurityBadge = has(h, /(soc.?2|gdpr|hipaa|iso.270|enterprise.security|data.security|encrypted|ssl.secured)/i)
  const hasIntegrations = has(h, /(integrates.with|works.with|connects.to|integration|slack|zapier|salesforce|hubspot)/i)

  const findings: Finding[] = [
    {
      label: 'HTTPS / SSL',
      status: isHttps ? 'pass' : 'fail',
      detail: isHttps
        ? 'HTTPS active. Essential for SaaS — users need to trust you with their data.'
        : 'HTTP only — a SaaS product without SSL is a red flag. No serious user will sign up.',
      points: isHttps ? 20 : 0,
      maxPoints: 20,
    },
    {
      label: 'Customer Logo Wall',
      status: hasLogos ? 'pass' : 'warn',
      detail: hasLogos
        ? 'Customer logos or brand references found. "Trusted by X companies" builds instant credibility.'
        : 'No customer logos. A logo wall of recognizable customers is the fastest trust signal for SaaS.',
      points: hasLogos ? 20 : 3,
      maxPoints: 20,
    },
    {
      label: 'Testimonials or Case Studies',
      status: hasTestimonials ? 'pass' : 'warn',
      detail: hasTestimonials
        ? 'Testimonials or case studies found. Specific, outcome-driven quotes convert significantly better than generic.'
        : 'No testimonials. Add 2–3 specific, results-based quotes from real customers with name and company.',
      points: hasTestimonials ? 20 : 3,
      maxPoints: 20,
    },
    {
      label: 'User / Customer Count',
      status: hasSocialProof ? 'pass' : 'warn',
      detail: hasSocialProof
        ? 'Social proof numbers found. Quantified proof ("10,000+ teams") builds trust fast.'
        : 'No user count or proof numbers. "Join 5,000+ companies" is simple to add and highly effective.',
      points: hasSocialProof ? 20 : 3,
      maxPoints: 20,
    },
    {
      label: 'Security & Compliance',
      status: hasSecurityBadge ? 'pass' : 'warn',
      detail: hasSecurityBadge
        ? 'Security compliance mentioned (SOC 2, GDPR, etc.). Critical for enterprise buyers.'
        : 'No security/compliance info. Even for SMB SaaS, mentioning "SOC 2" or "bank-level encryption" increases signup rates.',
      points: hasSecurityBadge ? 10 : 2,
      maxPoints: 10,
    },
    {
      label: 'Integrations / Ecosystem',
      status: hasIntegrations ? 'pass' : 'warn',
      detail: hasIntegrations
        ? 'Integration mentions found. Showing compatibility with tools buyers already use increases relevance.'
        : 'No integrations shown. Showing Slack, Zapier, HubSpot logos is low effort and high trust impact.',
      points: hasIntegrations ? 10 : 2,
      maxPoints: 10,
    },
  ]
  const raw = findings.reduce((s, f) => s + f.points, 0)
  const max = findings.reduce((s, f) => s + f.maxPoints, 0)
  return {
    score: clamp((raw / max) * 100),
    label: 'Credibility & Social Proof',
    description: 'Trust signals that convert skeptical buyers into trial users.',
    findings,
  }
}

// ── SAAS: Ad Readiness ────────────────────────────────────────────────────────

function buildSaasAdReadiness(html: string, isHttps: boolean, pageSpeedScore: number): CategoryResult {
  const h = html.toLowerCase()
  const hasMetaPixel = has(html, /(fbq\(|connect\.facebook\.net|facebook\.com\/tr)/i)
  const hasFreeTrial = has(h, /(free.trial|start.for.free|try.free)/i)
  const hasCTA = has(h, /(get.started|sign.up|start.now|try.free|create.account)/i)
  const hasGA = has(html, /(gtag\(|google-analytics\.com)/i)
  const hasRetargeting = has(html, /(fbq|remarketing|retargeting|_ga|_gads)/i)

  const findings: Finding[] = [
    {
      label: 'Meta Pixel + Signup Tracking',
      status: hasMetaPixel ? 'pass' : 'fail',
      detail: hasMetaPixel
        ? 'Pixel found. Ensure CompleteRegistration or Lead event fires on trial signup confirmation page.'
        : 'No Meta Pixel. Cannot track signups, build lookalike audiences from converters, or optimize for registrations.',
      points: hasMetaPixel ? 30 : 0,
      maxPoints: 30,
    },
    {
      label: 'Free Trial as Primary Hook',
      status: hasFreeTrial ? 'pass' : 'warn',
      detail: hasFreeTrial
        ? 'Free trial offer present. This is the highest-converting hook for SaaS cold traffic.'
        : 'No free trial. Running ads without a trial offer is hard — cold traffic rarely commits to paid-first.',
      points: hasFreeTrial ? 25 : 5,
      maxPoints: 25,
    },
    {
      label: 'Page Speed for Paid Traffic',
      status: pageSpeedScore >= 70 ? 'pass' : pageSpeedScore >= 50 ? 'warn' : 'fail',
      detail: pageSpeedScore >= 70
        ? `${pageSpeedScore}/100 — solid. SaaS buyers are often on desktop but mobile still matters.`
        : `${pageSpeedScore}/100 — slow. Fix before scaling spend.`,
      points: pageSpeedScore >= 70 ? 25 : pageSpeedScore >= 50 ? 12 : 3,
      maxPoints: 25,
    },
    {
      label: 'HTTPS (Ad Requirement)',
      status: isHttps ? 'pass' : 'fail',
      detail: isHttps
        ? 'HTTPS active — meets Meta\'s destination URL requirements.'
        : 'HTTP only — Meta ads will be rejected.',
      points: isHttps ? 20 : 0,
      maxPoints: 20,
    },
  ]
  const raw = findings.reduce((s, f) => s + f.points, 0)
  const max = findings.reduce((s, f) => s + f.maxPoints, 0)
  return {
    score: clamp((raw / max) * 100),
    label: 'Ad Readiness',
    description: 'Technical and strategic setup for running SaaS conversion campaigns.',
    findings,
  }
}

// ── Main Handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 })

    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`
    const isHttps = normalizedUrl.startsWith('https://')

    // Fetch HTML
    const start = Date.now()
    let html = ''
    let fetchTimeMs = 0

    try {
      const res = await fetch(normalizedUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HigherLevelAudit/1.0)', Accept: 'text/html' },
        signal: AbortSignal.timeout(12000),
        cache: 'no-store',
      })
      html = await res.text()
      fetchTimeMs = Date.now() - start
    } catch {
      fetchTimeMs = Date.now() - start
    }

    const pageSizeKb = Math.round(html.length / 1024)
    const title = extractText(html, 'title') || ''
    const metaDesc = extractMeta(html, 'description') || ''

    // PageSpeed + screenshot
    let pageSpeedScore = -1
    let screenshotBase64: string | null = null
    try {
      const psRes = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(normalizedUrl)}&strategy=mobile`,
        { signal: AbortSignal.timeout(20000), cache: 'no-store' }
      )
      if (psRes.ok) {
        const ps = await psRes.json()
        const s = ps?.lighthouseResult?.categories?.performance?.score
        if (s !== undefined && s !== null) pageSpeedScore = Math.round(s * 100)
        // Extract screenshot from PageSpeed response
        const shot = ps?.lighthouseResult?.audits?.['final-screenshot']?.details?.data
        if (shot && typeof shot === 'string') screenshotBase64 = shot
      }
    } catch {}

    if (pageSpeedScore < 0) {
      if (!html) pageSpeedScore = 10
      else if (fetchTimeMs < 800) pageSpeedScore = 88
      else if (fetchTimeMs < 1500) pageSpeedScore = 72
      else if (fetchTimeMs < 2500) pageSpeedScore = 55
      else if (fetchTimeMs < 4000) pageSpeedScore = 38
      else pageSpeedScore = 20
    }

    // Detect type
    const { type: businessType, confidence: businessTypeConfidence } = detectBusinessType(html, normalizedUrl)

    // Build categories
    const speedCat = buildSpeedCategory(pageSpeedScore, fetchTimeMs, pageSizeKb)
    const seoCat = buildSeoCategory(html)
    const trackingCat = buildTrackingCategory(html)

    let conversionCat: CategoryResult
    let trustCat: CategoryResult
    let adCat: CategoryResult

    if (businessType === 'ecommerce') {
      conversionCat = buildEcomConversion(html)
      trustCat = buildEcomTrust(html, isHttps)
      adCat = buildEcomAdReadiness(html, isHttps, pageSpeedScore)
    } else if (businessType === 'saas') {
      conversionCat = buildSaasConversion(html)
      trustCat = buildSaasTrust(html, isHttps)
      adCat = buildSaasAdReadiness(html, isHttps, pageSpeedScore)
    } else {
      // service or unknown — default to service
      conversionCat = buildServiceConversion(html)
      trustCat = buildServiceTrust(html, isHttps)
      adCat = buildServiceAdReadiness(html, isHttps, pageSpeedScore)
    }

    // Weights by type
    const weights =
      businessType === 'ecommerce'
        ? { speed: 0.15, seo: 0.10, conversion: 0.30, trust: 0.25, tracking: 0.12, ad: 0.08 }
        : businessType === 'saas'
        ? { speed: 0.15, seo: 0.10, conversion: 0.30, trust: 0.20, tracking: 0.15, ad: 0.10 }
        : { speed: 0.12, seo: 0.10, conversion: 0.28, trust: 0.28, tracking: 0.12, ad: 0.10 }

    const overall = clamp(
      speedCat.score * weights.speed +
      seoCat.score * weights.seo +
      conversionCat.score * weights.conversion +
      trustCat.score * weights.trust +
      trackingCat.score * weights.tracking +
      adCat.score * weights.ad
    )

    const { grade, color: gradeColor } = getGrade(overall)

    // Build detected elements map
    const h2 = html.toLowerCase()
    const hasMetaPixel = has(html, /(fbq\(|connect\.facebook\.net|facebook\.com\/tr)/i)
    const hasForm = has(html, /<form/i)
    const hasCTA = has(h2, /(get.a.quote|free.estimate|schedule|book.now|contact.us|get.started|call.now|add.to.cart|try.free|sign.up|start.now)/i)
    const detectedElements: DetectedElements = {
      hasMetaPixel,
      hasForm,
      hasCTA,
      hasPhone: has(h2, /(\(?\d{3}\)?[\s\-.]?\d{3}[\s\-.]?\d{4}|tel:|call.us)/i),
      hasClickToCall: has(html, /href=["']tel:/i),
      hasReviews: has(h2, /(review|testimonial|star.rating|rated \d|customer.said|verified.buyer)/i),
      hasGuarantee: has(h2, /(money.back|satisfaction.guarantee|\d+.day.guarantee|hassle.free|risk.free|guarantee)/i),
      isHttps,
      hasAddress: has(h2, /(street|avenue|blvd|suite|\d{5}|our.location|find.us)/i),
      hasVideo: has(html, /(<video|youtube|vimeo|demo.video)/i),
      hasLicensed: has(h2, /(licensed|insured|bonded|certified)/i),
      hasYearsExp: has(h2, /(\d+.years?.of.experience|\d+.years?.in.business|since \d{4})/i),
      hasTeamPhoto: has(h2, /(our.team|meet.the.team|our.staff|our.technicians)/i),
      hasLocalSignal: has(h2, /(serving.the|service.area|locally.owned|family.owned)/i),
      hasOnlineBooking: has(h2, /(book.online|schedule.online|calendar|pick.a.time|select.a.date)/i),
      hasLiveChat: has(h2, /(livechat|intercom|drift|tawk|crisp|chat.widget|live.chat)/i),
      hasFastResponsePromise: has(h2, /(respond.within|reply.within|same.day.response|call.back.within)/i),
      formFieldCount: count(html, /<input(?:[^>]*type=["'](?:text|email|tel|number)["'])/gi),
      hasATC: has(h2, /add.to.cart|add_to_cart/i),
      hasPrice: count(h2, /\$\d+(\.\d{2})?/g) > 1,
      hasDiscount: has(h2, /(\d+%.off|save \$|\bsale\b|discount|coupon)/i),
      hasUrgency: has(h2, /(limited.time|only \d+ left|ends.today|flash.sale)/i),
      hasFreeShipping: has(h2, /(free.shipping|free.delivery)/i),
      hasBundleDeal: has(h2, /(bundle|buy \d+ get|value.pack)/i),
      hasPaymentOptions: has(h2, /(paypal|apple.pay|shop.pay|afterpay|klarna)/i),
      hasReturnPolicy: has(h2, /(return.policy|\d+.day.return|\d+.day.guarantee)/i),
      hasOutOfStock: has(h2, /(sold.out|out.of.stock|currently.unavailable|no.longer.available|unavailable)/i),
      hasSubscriptionFriction: has(h2, /(recurring.purchase|subscription.required|auto.renewal|auto-renewal)/i) && !has(h2, /(one.time|one-time|buy.once|no.subscription)/i),
      hasAllSalesFinal: has(h2, /(all.sales.final|no.returns|no.refunds)/i),
      hasCrossSell: has(h2, /(you.may.also.like|frequently.bought|related.products|customers.also|pairs.well|goes.well.with)/i),
      hasSatisfactionGuarantee: has(h2, /(money.back|satisfaction.guarantee|love.it.or|risk.free|\d+.day.guarantee)/i),
      hasIngredientStory: has(h2, /(sea.mineral|sourced.from|third.party.tested|independently.tested|why.it.works|the.science|how.it.works)/i),
      hasFreeTrial: has(h2, /(free.trial|start.for.free|try.free)/i),
      hasNoCC: has(h2, /(no.credit.card|no cc required)/i),
      hasDemo: has(h2, /(schedule.a.demo|book.a.demo|watch.demo)/i),
      hasPricing: has(h2, /(pricing|per.month|\/mo|per.user)/i),
      hasFeatureList: has(h2, /(features|what.you.get|everything.you.need)/i),
      hasIntegrations: has(h2, /(integrates.with|works.with|zapier|slack|salesforce)/i),
      hasLogoWall: has(h2, /(trusted.by|our.customers|used.by|customer.logo)/i),
    }

    const allFixes: { priority: number; fix: string; impact: string }[] = []

    if (!isHttps) allFixes.push({ priority: 1, fix: 'Install SSL (move to HTTPS)', impact: 'Meta will reject all ads to HTTP URLs. SSL is free via Let\'s Encrypt. Fix this first.' })
    if (!hasMetaPixel) allFixes.push({ priority: 1, fix: 'Install Meta Pixel + conversion events', impact: 'Without a pixel you cannot track conversions, build audiences, or optimize ad delivery. Every dollar spent is untracked.' })
    if (!hasCTA) allFixes.push({ priority: 1, fix: 'Add a clear Call-to-Action above the fold', impact: 'Visitors from ads need an obvious next step immediately. No CTA = no conversions.' })

    if (businessType === 'ecommerce') {
      const h3 = html.toLowerCase()
      const hasDiscount = has(h3, /(\d+%.off|save \$|\bsale\b|discount|coupon)/i)
      const hasReviews = has(h3, /(review|testimonial|star|rated)/i)
      const hasFreeShipping = has(h3, /free.shipping|free.delivery/i)
      const outOfStock = has(h3, /(sold.out|out.of.stock|currently.unavailable|no.longer.available|unavailable)/i)
      const allSalesFinal = has(h3, /(all.sales.final|no.returns|no.refunds)/i)
      const hasSatGuarantee = has(h3, /(money.back|satisfaction.guarantee|love.it.or|risk.free|\d+.day.guarantee)/i)
      const hasCrossSell = has(h3, /(you.may.also.like|frequently.bought|related.products|customers.also)/i)
      const hasIngredientStory = has(h3, /(sourced.from|third.party.tested|independently.tested|why.it.works|the.science|how.it.works)/i)
      if (outOfStock) allFixes.push({ priority: 1, fix: 'Pause all paid ads — products appear out of stock', impact: 'Sending ad traffic to sold-out products burns 100% of your budget with zero return. Stop spend until inventory is live.' })
      if (allSalesFinal) allFixes.push({ priority: 1, fix: 'Replace "all sales final" with a satisfaction guarantee', impact: 'No-return policies kill cold traffic conversions. A 30-day guarantee converts 20–30% better and rarely gets abused.' })
      if (!hasDiscount) allFixes.push({ priority: 2, fix: 'Add a discount or deal to the product page', impact: '% off, "Save $X", or a free gift with purchase massively increases ATC rate for cold traffic.' })
      if (!hasReviews) allFixes.push({ priority: 2, fix: 'Add customer reviews to product pages', impact: 'Cold traffic doesn\'t trust you yet. Reviews are the #1 factor in purchase decisions.' })
      if (!hasFreeShipping) allFixes.push({ priority: 2, fix: 'Add free shipping messaging prominently', impact: '80% of shoppers expect free shipping. If you offer it, make it obvious. If not, add a threshold.' })
      if (!hasSatGuarantee) allFixes.push({ priority: 2, fix: 'Add a visible satisfaction guarantee near the ATC button', impact: 'The single highest-leverage trust signal for cold traffic. "Love it or your money back" removes the last objection.' })
      if (!hasCrossSell) allFixes.push({ priority: 3, fix: 'Add a "Frequently Bought Together" or cross-sell section', impact: 'Increases AOV without additional ad spend. Even a 10% AOV lift significantly improves ROAS on the same budget.' })
      if (!hasIngredientStory) allFixes.push({ priority: 3, fix: 'Add a "Why It Works" or ingredient story section', impact: 'Health/wellness buyers want to know what\'s in it and why it works. Educated shoppers convert at 2–3x the rate of uninformed ones.' })
      if (!hasForm) allFixes.push({ priority: 3, fix: 'Ensure checkout has guest option + multiple payment methods', impact: 'Forced account creation and single payment option are the top reasons for cart abandonment.' })
    } else if (businessType === 'service') {
      const hasLicensed = has(html.toLowerCase(), /(licensed|insured|bonded|certified)/i)
      const hasReviews = has(html.toLowerCase(), /(review|testimonial|star|rated)/i)
      const formFields = count(html, /<input(?:[^>]*type=["'](?:text|email|tel|number)["'])/gi)
      if (!hasForm) allFixes.push({ priority: 2, fix: 'Add a lead form with 3–4 fields max', impact: 'Without a form you\'re forcing every lead to call. Many won\'t. A simple form captures leads 24/7.' })
      if (!hasLicensed) allFixes.push({ priority: 2, fix: 'Display license, insurance, and certifications prominently', impact: 'The #1 trust signal for service businesses. Add this above the fold if possible.' })
      if (!hasReviews) allFixes.push({ priority: 2, fix: 'Add Google Reviews or testimonials', impact: 'Social proof is the most persuasive element for local services. Even 3 specific testimonials make a big difference.' })
      if (formFields > 6) allFixes.push({ priority: 2, fix: `Reduce form fields (currently ~${formFields}, target 3–4)`, impact: 'Every extra field reduces form completion rate. Name + Phone + Service = all you need for the first touch.' })
    } else if (businessType === 'saas') {
      const hasFreeTrial = has(html.toLowerCase(), /(free.trial|start.for.free|try.free)/i)
      const hasNoCC = has(html.toLowerCase(), /(no.credit.card|no cc required)/i)
      const hasTestimonials = has(html.toLowerCase(), /(testimonial|case.study|review)/i)
      if (!hasFreeTrial) allFixes.push({ priority: 2, fix: 'Add a free trial offer', impact: 'Cold ad traffic rarely pays first. A free trial removes the biggest friction point in SaaS conversion.' })
      if (!hasNoCC) allFixes.push({ priority: 2, fix: 'Add "No credit card required" next to your CTA', impact: 'This single line can increase trial signups 30–50%. It removes the fear of accidental charges.' })
      if (!hasTestimonials) allFixes.push({ priority: 2, fix: 'Add testimonials or case studies with specific outcomes', impact: '"We saved 10 hours a week" beats "Great product!" by 5x. Outcome-specific social proof converts.' })
    }

    if (pageSpeedScore < 60) allFixes.push({ priority: 2, fix: `Improve page speed (${pageSpeedScore}/100)`, impact: 'Slow pages lose over half of mobile ad traffic before the page even loads. Compress images first.' })
    if (seoCat.score < 60) allFixes.push({ priority: 3, fix: 'Fix SEO basics (title, meta description, H1)', impact: 'These directly affect ad Quality Score and organic traffic.' })

    const topFixes = allFixes.sort((a, b) => a.priority - b.priority).slice(0, 6)

    const result: AuditResult = {
      url: normalizedUrl,
      fetchTimeMs,
      pageTitle: title || 'Untitled Page',
      pageDescription: metaDesc || 'No meta description.',
      businessType,
      businessTypeConfidence,
      screenshotBase64,
      detectedElements,
      scores: {
        speed: speedCat.score,
        seo: seoCat.score,
        conversion: conversionCat.score,
        trust: trustCat.score,
        tracking: trackingCat.score,
        adReadiness: adCat.score,
        overall,
      },
      grade,
      gradeColor,
      categories: {
        speed: speedCat,
        seo: seoCat,
        conversion: conversionCat,
        trust: trustCat,
        tracking: trackingCat,
        adReadiness: adCat,
      },
      topFixes,
    }

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Audit failed' }, { status: 500 })
  }
}
