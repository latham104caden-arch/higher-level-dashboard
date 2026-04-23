import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'

export const dynamic = 'force-dynamic'

// Demo fallback client for the preview portal
const DEMO_CLIENT = {
  name: 'Riverside Window Cleaning',
  website: 'shinebrightokc.com',
  type: 'local',
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'AI chat is not configured yet. Add ANTHROPIC_API_KEY to your environment variables.' }, { status: 503 })
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const session = await getSession()
    if (!session || !['client', 'demo'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Demo mode uses fallback client data
    const businessClient = session.role === 'demo'
      ? DEMO_CLIENT
      : CLIENTS[session.clientId as keyof typeof CLIENTS]

    if (!businessClient) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

    const { message, auditData } = await req.json()
    if (!message) return NextResponse.json({ error: 'No message' }, { status: 400 })

    // Build a compact audit summary for the system prompt
    const auditSummary = auditData ? buildAuditSummary(auditData, businessClient.website) : 'No audit data available yet.'

    const systemPrompt = `You are a digital marketing and website expert helping ${businessClient.name}, a ${businessClient.type === 'ecommerce' ? 'ecommerce' : 'local service'} business. Their website is ${businessClient.website}.

You have just audited their website and here are the results:

${auditSummary}

Your job is to answer their questions about their website and how to improve it. Be:
- Direct and specific — no vague advice
- Plain English — no jargon unless you explain it
- Actionable — every answer should give them something they can actually do
- Honest — if something is hurting their ad performance, say so clearly
- Concise — 2–4 sentences unless they ask for detail

You're speaking directly to the business owner, not a developer. Keep it conversational.`

    const stream = await anthropic.messages.stream({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
    })

    // Stream the response
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(chunk.delta.text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Chat failed' }, { status: 500 })
  }
}

function buildAuditSummary(audit: any, website: string): string {
  const scores = audit.scores || {}
  const topFixes = audit.topFixes || []
  const cats = audit.categories || {}
  const el = audit.detectedElements || {}

  const lines: string[] = [
    `WEBSITE: ${website}`,
    `OVERALL GRADE: ${audit.grade || '?'} (${scores.overall ?? '?'}/100)`,
    '',
    'SCORES:',
    `  Speed: ${scores.speed ?? '?'}/100`,
    `  SEO: ${scores.seo ?? '?'}/100`,
    `  Conversion: ${scores.conversion ?? '?'}/100`,
    `  Trust: ${scores.trust ?? '?'}/100`,
    `  Tracking: ${scores.tracking ?? '?'}/100`,
    `  Ad Readiness: ${scores.adReadiness ?? '?'}/100`,
    '',
    'BUSINESS TYPE DETECTED: ' + (audit.businessType || 'unknown'),
    '',
    'KEY DETECTED ELEMENTS:',
    `  Meta Pixel: ${el.hasMetaPixel ? 'YES' : 'NO — CRITICAL'}`,
    `  HTTPS: ${el.isHttps ? 'YES' : 'NO — CRITICAL'}`,
    `  Reviews visible: ${el.hasReviews ? 'YES' : 'NO'}`,
    `  Guarantee/money-back: ${el.hasSatisfactionGuarantee || el.hasGuarantee ? 'YES' : 'NO'}`,
    `  Free shipping: ${el.hasFreeShipping ? 'YES' : 'NO'}`,
    `  Add to cart: ${el.hasATC ? 'YES' : 'NO'}`,
    `  Out of stock detected: ${el.hasOutOfStock ? 'YES — CRITICAL' : 'NO'}`,
    `  Return policy visible: ${el.hasReturnPolicy ? 'YES' : 'NO'}`,
    `  All sales final warning: ${el.hasAllSalesFinal ? 'YES — BAD' : 'NO'}`,
    `  Cross-sell section: ${el.hasCrossSell ? 'YES' : 'NO'}`,
    `  Ingredient/product story: ${el.hasIngredientStory ? 'YES' : 'NO'}`,
    `  Payment options (PayPal/Apple Pay etc): ${el.hasPaymentOptions ? 'YES' : 'NO'}`,
    `  Urgency/scarcity signals: ${el.hasUrgency ? 'YES' : 'NO'}`,
    `  Discount/deal present: ${el.hasDiscount ? 'YES' : 'NO'}`,
    `  Video content: ${el.hasVideo ? 'YES' : 'NO'}`,
    '',
    'TOP ISSUES TO FIX:',
  ]

  topFixes.forEach((fix: any, i: number) => {
    lines.push(`  ${i + 1}. ${fix.fix}`)
    lines.push(`     Why: ${fix.impact}`)
  })

  // Add category-level findings
  if (cats.conversion?.findings?.length) {
    lines.push('', 'CONVERSION FINDINGS:')
    cats.conversion.findings.forEach((f: any) => {
      lines.push(`  [${f.status.toUpperCase()}] ${f.label}: ${f.detail}`)
    })
  }

  if (cats.trust?.findings?.length) {
    lines.push('', 'TRUST FINDINGS:')
    cats.trust.findings.forEach((f: any) => {
      lines.push(`  [${f.status.toUpperCase()}] ${f.label}: ${f.detail}`)
    })
  }

  return lines.join('\n')
}
