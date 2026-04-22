import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

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
  findings: Finding[]
}

export interface AuditResult {
  url: string
  fetchTimeMs: number
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
  pageTitle: string
  pageDescription: string
}

function extractText(html: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i')
  const match = html.match(regex)
  return match ? match[1].replace(/<[^>]+>/g, '').trim() : null
}

function extractMeta(html: string, name: string): string | null {
  const regex = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i')
  const regex2 = new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${name}["']`, 'i')
  const match = html.match(regex) || html.match(regex2)
  return match ? match[1].trim() : null
}

function countMatches(html: string, pattern: RegExp): number {
  return (html.match(pattern) || []).length
}

function hasPattern(html: string, pattern: RegExp): boolean {
  return pattern.test(html)
}

function getGrade(score: number): { grade: string; color: string } {
  if (score >= 90) return { grade: 'A', color: '#21D19F' }
  if (score >= 80) return { grade: 'B', color: '#45B69C' }
  if (score >= 70) return { grade: 'C', color: '#F59E0B' }
  if (score >= 60) return { grade: 'D', color: '#F97316' }
  return { grade: 'F', color: '#EF4444' }
}

function clamp(n: number): number {
  return Math.min(100, Math.max(0, Math.round(n)))
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 })

    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`

    // Fetch the page
    const start = Date.now()
    let html = ''
    let fetchTimeMs = 0
    let fetchOk = false

    try {
      const res = await fetch(normalizedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; HigherLevelAudit/1.0)',
          'Accept': 'text/html,application/xhtml+xml',
        },
        signal: AbortSignal.timeout(12000),
        cache: 'no-store',
      })
      fetchTimeMs = Date.now() - start
      html = await res.text()
      fetchOk = true
    } catch (e) {
      fetchTimeMs = Date.now() - start
    }

    const isHttps = normalizedUrl.startsWith('https://')
    const htmlLower = html.toLowerCase()

    // ── PageSpeed via Google API ─────────────────────────────────────────────
    let pageSpeedScore = -1
    let mobileScore = -1
    try {
      const psUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(normalizedUrl)}&strategy=mobile`
      const psRes = await fetch(psUrl, { signal: AbortSignal.timeout(15000), cache: 'no-store' })
      if (psRes.ok) {
        const psData = await psRes.json()
        const lcp = psData?.lighthouseResult?.categories?.performance?.score
        if (lcp !== undefined && lcp !== null) {
          pageSpeedScore = Math.round(lcp * 100)
          mobileScore = pageSpeedScore
        }
      }
    } catch {}

    // Fallback speed from fetch time
    if (pageSpeedScore < 0) {
      if (!fetchOk) pageSpeedScore = 10
      else if (fetchTimeMs < 800) pageSpeedScore = 90
      else if (fetchTimeMs < 1500) pageSpeedScore = 78
      else if (fetchTimeMs < 2500) pageSpeedScore = 62
      else if (fetchTimeMs < 4000) pageSpeedScore = 42
      else pageSpeedScore = 22
    }

    // ── Extractions ──────────────────────────────────────────────────────────
    const title = extractText(html, 'title') || ''
    const metaDesc = extractMeta(html, 'description') || ''
    const h1 = extractText(html, 'h1') || ''
    const h2Count = countMatches(html, /<h2/gi)
    const imgCount = countMatches(html, /<img/gi)
    const imgWithAlt = countMatches(html, /<img[^>]+alt=["'][^"']+["']/gi)
    const imgMissingAlt = imgCount - imgWithAlt
    const hasViewport = hasPattern(html, /name=["']viewport["']/i)
    const hasCanonical = hasPattern(html, /<link[^>]+rel=["']canonical["']/i)
    const hasForm = hasPattern(html, /<form/i)
    const hasPhone = hasPattern(htmlLower, /(\(?\d{3}\)?[\s\-.]?\d{3}[\s\-.]?\d{4}|tel:|phone|call us)/i)
    const hasAddress = hasPattern(htmlLower, /(street|avenue|blvd|suite|city|zip|address|\d{5})/i)
    const hasReviews = hasPattern(htmlLower, /(review|testimonial|star|rated|customer|feedback|trust\s?pilot|google review)/i)
    const hasGuarantee = hasPattern(htmlLower, /(guarantee|warranty|risk.free|money.back|satisfaction)/i)
    const hasMetaPixel = hasPattern(html, /(fbq\(|connect\.facebook\.net|facebook\.com\/tr)/i)
    const hasGA = hasPattern(html, /(gtag\(|google-analytics\.com|UA-\d|G-[A-Z0-9]+)/i)
    const hasGTM = hasPattern(html, /(googletagmanager\.com|GTM-)/i)
    const hasCTA = hasPattern(htmlLower, /(get a quote|get quote|book now|schedule|call now|contact us|get started|free estimate|free quote|order now|shop now|buy now|sign up|learn more|claim|apply)/i)
    const hasValueProp = hasPattern(htmlLower, /(#1|best|top.rated|award|certified|licensed|insured|years of experience|trusted|professional)/i)
    const hasPricing = hasPattern(htmlLower, /(\$\d|\d+% off|discount|sale|price|cost|rate|from \$)/i)
    const hasNav = countMatches(html, /<nav/gi) > 0
    const hasVideo = hasPattern(html, /(<video|youtube\.com|vimeo\.com|iframe[^>]+src=["'][^"']+(youtube|vimeo))/i)
    const pageSizeKb = Math.round(html.length / 1024)
    const wordCount = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').split(' ').filter(w => w.length > 3).length

    // ── SPEED CATEGORY ───────────────────────────────────────────────────────
    const speedFindings: Finding[] = [
      {
        label: 'Page Load Speed',
        status: pageSpeedScore >= 80 ? 'pass' : pageSpeedScore >= 60 ? 'warn' : 'fail',
        detail: pageSpeedScore >= 80
          ? `Score ${pageSpeedScore}/100 — fast loading improves ad Quality Score and reduces bounce rate.`
          : pageSpeedScore >= 60
          ? `Score ${pageSpeedScore}/100 — moderate speed. Compress images and reduce render-blocking scripts.`
          : `Score ${pageSpeedScore}/100 — slow load time is costing you conversions. Every extra second loses ~7% of visitors.`,
        points: pageSpeedScore >= 80 ? 40 : pageSpeedScore >= 60 ? 25 : 10,
        maxPoints: 40,
      },
      {
        label: 'Page Size',
        status: pageSizeKb < 200 ? 'pass' : pageSizeKb < 500 ? 'warn' : 'fail',
        detail: pageSizeKb < 200
          ? `${pageSizeKb}KB — lean and efficient.`
          : pageSizeKb < 500
          ? `${pageSizeKb}KB — acceptable but could be trimmed. Compress images and minify CSS/JS.`
          : `${pageSizeKb}KB — heavy page. Large pages kill mobile performance. Optimize images immediately.`,
        points: pageSizeKb < 200 ? 30 : pageSizeKb < 500 ? 20 : 8,
        maxPoints: 30,
      },
      {
        label: 'Server Response Time',
        status: fetchTimeMs < 1000 ? 'pass' : fetchTimeMs < 2500 ? 'warn' : 'fail',
        detail: fetchTimeMs < 1000
          ? `${fetchTimeMs}ms — excellent server response.`
          : fetchTimeMs < 2500
          ? `${fetchTimeMs}ms — could be faster. Consider a CDN or better hosting.`
          : `${fetchTimeMs}ms — slow server. Upgrade hosting or move to a CDN like Cloudflare.`,
        points: fetchTimeMs < 1000 ? 30 : fetchTimeMs < 2500 ? 18 : 6,
        maxPoints: 30,
      },
    ]
    const speedScore = clamp((speedFindings.reduce((s, f) => s + f.points, 0) / 100) * 100)

    // ── SEO CATEGORY ─────────────────────────────────────────────────────────
    const seoFindings: Finding[] = [
      {
        label: 'Page Title',
        status: title ? (title.length >= 30 && title.length <= 70 ? 'pass' : 'warn') : 'fail',
        detail: title
          ? title.length >= 30 && title.length <= 70
            ? `"${title.slice(0, 60)}${title.length > 60 ? '…' : ''}" — ${title.length} chars, optimal length.`
            : `"${title.slice(0, 60)}${title.length > 60 ? '…' : ''}" — ${title.length} chars. ${title.length < 30 ? 'Too short, add keywords.' : 'Too long, will get cut off in search results.'}`
          : 'No title tag found. This is critical for SEO and ad quality score.',
        points: title ? (title.length >= 30 && title.length <= 70 ? 20 : 12) : 0,
        maxPoints: 20,
      },
      {
        label: 'Meta Description',
        status: metaDesc ? (metaDesc.length >= 120 && metaDesc.length <= 160 ? 'pass' : 'warn') : 'fail',
        detail: metaDesc
          ? metaDesc.length >= 120 && metaDesc.length <= 160
            ? `"${metaDesc.slice(0, 80)}…" — ${metaDesc.length} chars, perfect.`
            : `${metaDesc.length} chars — ${metaDesc.length < 120 ? 'expand it to 120–160 chars for better click rates' : 'too long, Google will cut it off'}.`
          : 'No meta description. Google will auto-generate one, often pulling irrelevant text.',
        points: metaDesc ? (metaDesc.length >= 120 && metaDesc.length <= 160 ? 20 : 12) : 0,
        maxPoints: 20,
      },
      {
        label: 'H1 Headline',
        status: h1 ? 'pass' : 'fail',
        detail: h1
          ? `"${h1.slice(0, 80)}${h1.length > 80 ? '…' : ''}" — H1 found.`
          : 'No H1 tag. Every page needs one clear headline — it tells Google and visitors what the page is about.',
        points: h1 ? 20 : 0,
        maxPoints: 20,
      },
      {
        label: 'Image Alt Text',
        status: imgMissingAlt === 0 ? 'pass' : imgMissingAlt <= 3 ? 'warn' : 'fail',
        detail: imgCount === 0
          ? 'No images found on the page.'
          : imgMissingAlt === 0
          ? `All ${imgCount} images have alt text.`
          : `${imgMissingAlt} of ${imgCount} images are missing alt text. Add descriptive alt tags to improve SEO and accessibility.`,
        points: imgCount === 0 ? 20 : imgMissingAlt === 0 ? 20 : Math.max(0, 20 - imgMissingAlt * 4),
        maxPoints: 20,
      },
      {
        label: 'Mobile Viewport',
        status: hasViewport ? 'pass' : 'fail',
        detail: hasViewport
          ? 'Viewport meta tag found — page is configured for mobile.'
          : 'Missing viewport meta tag. Your page will display incorrectly on mobile devices.',
        points: hasViewport ? 20 : 0,
        maxPoints: 20,
      },
    ]
    const seoScore = clamp((seoFindings.reduce((s, f) => s + f.points, 0) / 100) * 100)

    // ── CONVERSION CATEGORY ──────────────────────────────────────────────────
    const conversionFindings: Finding[] = [
      {
        label: 'Call-to-Action Present',
        status: hasCTA ? 'pass' : 'fail',
        detail: hasCTA
          ? 'Clear CTA detected (Book, Quote, Schedule, Buy, etc.). Good — visitors know what to do next.'
          : 'No clear CTA found. Every page needs one obvious action: "Get a Free Quote", "Book Now", "Shop Now".',
        points: hasCTA ? 25 : 0,
        maxPoints: 25,
      },
      {
        label: 'Phone Number Visible',
        status: hasPhone ? 'pass' : 'warn',
        detail: hasPhone
          ? 'Phone number detected on the page. Important for local trust and mobile conversions.'
          : 'No phone number found. Adding a click-to-call number increases local lead conversions by up to 40%.',
        points: hasPhone ? 20 : 5,
        maxPoints: 20,
      },
      {
        label: 'Lead Form / Checkout',
        status: hasForm ? 'pass' : 'fail',
        detail: hasForm
          ? 'Form detected — visitors have a way to convert directly on the page.'
          : 'No form found. Without a form, you\'re sending ad traffic to a page with no conversion mechanism.',
        points: hasForm ? 25 : 0,
        maxPoints: 25,
      },
      {
        label: 'Value Proposition',
        status: hasValueProp ? 'pass' : 'warn',
        detail: hasValueProp
          ? 'Value signals found (certified, licensed, award, trusted, etc.). Good social proof.'
          : 'No obvious value prop detected. Add credentials, awards, or a bold differentiator above the fold.',
        points: hasValueProp ? 15 : 5,
        maxPoints: 15,
      },
      {
        label: 'Content Focus',
        status: wordCount < 800 ? 'pass' : wordCount < 1500 ? 'warn' : 'fail',
        detail: wordCount < 800
          ? `~${wordCount} words — focused and scannable. Visitors can find the key info fast.`
          : wordCount < 1500
          ? `~${wordCount} words — moderate length. Make sure the CTA and key info are visible above the fold.`
          : `~${wordCount} words — very long. Ad traffic bounces fast. Move your CTA above the fold and trim the copy.`,
        points: wordCount < 800 ? 15 : wordCount < 1500 ? 10 : 4,
        maxPoints: 15,
      },
    ]
    const conversionScore = clamp((conversionFindings.reduce((s, f) => s + f.points, 0) / 100) * 100)

    // ── TRUST CATEGORY ───────────────────────────────────────────────────────
    const trustFindings: Finding[] = [
      {
        label: 'SSL Certificate (HTTPS)',
        status: isHttps ? 'pass' : 'fail',
        detail: isHttps
          ? 'Site is secured with HTTPS. Browsers and Meta require this for ad destinations.'
          : 'No SSL — site is HTTP only. Meta will not allow ads to this URL. Get SSL immediately.',
        points: isHttps ? 30 : 0,
        maxPoints: 30,
      },
      {
        label: 'Reviews & Testimonials',
        status: hasReviews ? 'pass' : 'warn',
        detail: hasReviews
          ? 'Social proof detected (reviews, testimonials, ratings). Builds trust with cold ad traffic.'
          : 'No reviews or testimonials found. Adding social proof can increase conversions by 20–30%.',
        points: hasReviews ? 25 : 5,
        maxPoints: 25,
      },
      {
        label: 'Contact / Address Info',
        status: hasAddress ? 'pass' : 'warn',
        detail: hasAddress
          ? 'Business address or location info found. Builds local credibility.'
          : 'No address info found. For local businesses, showing your location builds trust and improves local SEO.',
        points: hasAddress ? 25 : 8,
        maxPoints: 25,
      },
      {
        label: 'Guarantee or Risk Reversal',
        status: hasGuarantee ? 'pass' : 'warn',
        detail: hasGuarantee
          ? 'Guarantee language found. Reducing perceived risk is one of the highest-leverage conversion tactics.'
          : 'No guarantee found. Adding "satisfaction guaranteed", "money-back", or "free estimate" removes purchase risk.',
        points: hasGuarantee ? 20 : 5,
        maxPoints: 20,
      },
    ]
    const trustScore = clamp((trustFindings.reduce((s, f) => s + f.points, 0) / 100) * 100)

    // ── TRACKING CATEGORY ────────────────────────────────────────────────────
    const trackingFindings: Finding[] = [
      {
        label: 'Meta Pixel',
        status: hasMetaPixel ? 'pass' : 'fail',
        detail: hasMetaPixel
          ? 'Meta Pixel detected. Conversion tracking and retargeting audiences are active.'
          : 'No Meta Pixel found. Without it, you cannot track conversions, build audiences, or optimize campaigns for results.',
        points: hasMetaPixel ? 40 : 0,
        maxPoints: 40,
      },
      {
        label: 'Google Analytics',
        status: hasGA ? 'pass' : 'warn',
        detail: hasGA
          ? 'Google Analytics detected. Website behavior data is being collected.'
          : 'No Google Analytics found. You\'re flying blind on where traffic comes from and what visitors do.',
        points: hasGA ? 30 : 5,
        maxPoints: 30,
      },
      {
        label: 'Google Tag Manager',
        status: hasGTM ? 'pass' : 'warn',
        detail: hasGTM
          ? 'Google Tag Manager found. Makes managing pixels and events much easier.'
          : 'No GTM detected. Not required, but GTM makes it faster to deploy and update tracking.',
        points: hasGTM ? 30 : 10,
        maxPoints: 30,
      },
    ]
    const trackingScore = clamp((trackingFindings.reduce((s, f) => s + f.points, 0) / 100) * 100)

    // ── AD READINESS CATEGORY ────────────────────────────────────────────────
    const adFindings: Finding[] = [
      {
        label: 'Tracking Installed',
        status: hasMetaPixel ? 'pass' : 'fail',
        detail: hasMetaPixel
          ? 'Meta Pixel active — ad traffic can be tracked and retargeted.'
          : 'No Meta Pixel. Running ads without a pixel wastes budget — you can\'t optimize for conversions.',
        points: hasMetaPixel ? 25 : 0,
        maxPoints: 25,
      },
      {
        label: 'Fast Load for Ad Traffic',
        status: pageSpeedScore >= 70 ? 'pass' : pageSpeedScore >= 50 ? 'warn' : 'fail',
        detail: pageSpeedScore >= 70
          ? `Speed score ${pageSpeedScore}/100 — fast enough for paid traffic. Slow pages kill ad ROI.`
          : `Speed score ${pageSpeedScore}/100 — too slow for ad traffic. High bounce rates hurt your ROAS.`,
        points: pageSpeedScore >= 70 ? 25 : pageSpeedScore >= 50 ? 12 : 4,
        maxPoints: 25,
      },
      {
        label: 'Clear Single CTA',
        status: hasCTA ? 'pass' : 'fail',
        detail: hasCTA
          ? 'A clear CTA exists. Ad visitors need to know exactly what to do when they land.'
          : 'No clear CTA. Ad traffic needs an immediate, obvious action. No CTA = wasted ad spend.',
        points: hasCTA ? 25 : 0,
        maxPoints: 25,
      },
      {
        label: 'HTTPS (Required for Ads)',
        status: isHttps ? 'pass' : 'fail',
        detail: isHttps
          ? 'HTTPS active — site meets Meta\'s destination requirements.'
          : 'HTTP only — Meta will reject your ads. SSL is non-negotiable for running ads.',
        points: isHttps ? 25 : 0,
        maxPoints: 25,
      },
    ]
    const adScore = clamp((adFindings.reduce((s, f) => s + f.points, 0) / 100) * 100)

    // ── OVERALL SCORE ────────────────────────────────────────────────────────
    const overall = clamp(
      pageSpeedScore * 0.20 +
      seoScore * 0.15 +
      conversionScore * 0.25 +
      trustScore * 0.20 +
      trackingScore * 0.10 +
      adScore * 0.10
    )

    const { grade, color: gradeColor } = getGrade(overall)

    // ── TOP FIXES ─────────────────────────────────────────────────────────────
    const allFixes: { priority: number; fix: string; impact: string }[] = []

    if (!isHttps) allFixes.push({ priority: 1, fix: 'Install SSL (move to HTTPS)', impact: 'Required to run Meta ads. Without it, all campaigns are blocked.' })
    if (!hasMetaPixel) allFixes.push({ priority: 1, fix: 'Install Meta Pixel', impact: 'Without it, you cannot track conversions or optimize ad delivery. This is the single biggest gap.' })
    if (!hasCTA) allFixes.push({ priority: 1, fix: 'Add a clear Call-to-Action', impact: 'Every ad dollar sent to a page without a CTA is wasted. "Get a Free Quote", "Book Now", "Shop Now" — pick one and make it prominent.' })
    if (!hasForm) allFixes.push({ priority: 2, fix: 'Add a lead form or checkout', impact: 'Give visitors a way to convert without leaving the page. Forms reduce friction and capture leads 24/7.' })
    if (pageSpeedScore < 60) allFixes.push({ priority: 2, fix: 'Improve page speed (currently ' + pageSpeedScore + '/100)', impact: 'Slow pages lose 50%+ of ad traffic before it converts. Compress images and minimize scripts.' })
    if (!title) allFixes.push({ priority: 2, fix: 'Add a proper page title tag', impact: 'No title = poor SEO and lower ad quality scores.' })
    if (!metaDesc) allFixes.push({ priority: 2, fix: 'Write a meta description (120–160 chars)', impact: 'Increases organic click-through rates significantly.' })
    if (!hasReviews) allFixes.push({ priority: 3, fix: 'Add reviews or testimonials to the page', impact: 'Social proof increases conversion rate by 20–30% on cold ad traffic.' })
    if (!hasGuarantee) allFixes.push({ priority: 3, fix: 'Add a guarantee or risk-reversal statement', impact: '"Satisfaction guaranteed" or "Free estimate" removes purchase hesitation.' })
    if (!hasGA) allFixes.push({ priority: 3, fix: 'Install Google Analytics', impact: 'Understand where traffic comes from and what visitors do on your site.' })
    if (imgMissingAlt > 0) allFixes.push({ priority: 3, fix: `Add alt text to ${imgMissingAlt} images`, impact: 'Improves SEO and accessibility with minimal effort.' })
    if (!hasPhone) allFixes.push({ priority: 3, fix: 'Display phone number prominently', impact: 'Click-to-call is the #1 conversion action for local service businesses.' })

    const topFixes = allFixes.sort((a, b) => a.priority - b.priority).slice(0, 6)

    const result: AuditResult = {
      url: normalizedUrl,
      fetchTimeMs,
      pageTitle: title || 'Untitled Page',
      pageDescription: metaDesc || 'No meta description found.',
      scores: {
        speed: pageSpeedScore,
        seo: seoScore,
        conversion: conversionScore,
        trust: trustScore,
        tracking: trackingScore,
        adReadiness: adScore,
        overall,
      },
      grade,
      gradeColor,
      categories: {
        speed: { score: pageSpeedScore, label: 'Page Speed', findings: speedFindings },
        seo: { score: seoScore, label: 'SEO Basics', findings: seoFindings },
        conversion: { score: conversionScore, label: 'Conversion Rate', findings: conversionFindings },
        trust: { score: trustScore, label: 'Trust Signals', findings: trustFindings },
        tracking: { score: trackingScore, label: 'Ad Tracking', findings: trackingFindings },
        adReadiness: { score: adScore, label: 'Ad Readiness', findings: adFindings },
      },
      topFixes,
    }

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Audit failed' }, { status: 500 })
  }
}
