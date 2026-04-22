import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const TOKEN = process.env.META_ACCESS_TOKEN
const VERSION = process.env.META_API_VERSION || 'v21.0'

export interface AdLibraryAd {
  id: string
  page_name: string
  page_id: string
  body: string
  title: string
  description: string
  snapshot_url: string
  start_date: string
  days_running: number
  impressions_lower: number
  impressions_upper: number
  spend_lower: number
  spend_upper: number
  relevance_score: number
  badges: string[]
}

export interface AdLibraryResult {
  brand: string
  total_found: number
  ads: AdLibraryAd[]
}

function daysSince(dateStr: string): number {
  if (!dateStr) return 0
  const start = new Date(dateStr)
  const now = new Date()
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

function parseBound(val: string | undefined): number {
  if (!val) return 0
  return parseInt(val.replace(/,/g, ''), 10) || 0
}

export async function POST(req: NextRequest) {
  try {
    const { brand } = await req.json()
    if (!brand?.trim()) return NextResponse.json({ error: 'No brand provided' }, { status: 400 })

    if (!TOKEN) return NextResponse.json({ error: 'Meta access token not configured' }, { status: 500 })

    const fields = [
      'id',
      'page_name',
      'page_id',
      'ad_creative_bodies',
      'ad_creative_link_titles',
      'ad_creative_link_descriptions',
      'ad_delivery_start_time',
      'ad_snapshot_url',
      'impressions',
      'spend',
      'currency',
    ].join(',')

    const params = new URLSearchParams({
      access_token: TOKEN,
      ad_reached_countries: "['US']",
      search_terms: brand.trim(),
      ad_active_status: 'ACTIVE',
      ad_type: 'ALL',
      fields,
      limit: '100',
    })

    const url = `https://graph.facebook.com/${VERSION}/ads_archive?${params}`
    const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(15000) })
    const data = await res.json()

    if (data.error) throw new Error(data.error.message)

    const raw: any[] = data.data || []

    // Parse and score each ad
    const parsed: AdLibraryAd[] = raw.map((ad: any) => {
      const body = (ad.ad_creative_bodies?.[0] || '').trim()
      const title = (ad.ad_creative_link_titles?.[0] || '').trim()
      const description = (ad.ad_creative_link_descriptions?.[0] || '').trim()
      const days = daysSince(ad.ad_delivery_start_time)
      const imp_lower = parseBound(ad.impressions?.lower_bound)
      const imp_upper = parseBound(ad.impressions?.upper_bound)
      const spend_lower = parseBound(ad.spend?.lower_bound)
      const spend_upper = parseBound(ad.spend?.upper_bound)

      // Relevance score: weighted by impressions + longevity + has copy
      const imp_score = Math.min(imp_upper / 1_000_000, 1) * 50   // 0–50 pts
      const age_score = Math.min(days / 90, 1) * 30                 // 0–30 pts
      const copy_score = (body || title) ? 20 : 0                   // 20 pts for having copy
      const relevance_score = Math.round(imp_score + age_score + copy_score)

      // Badges
      const badges: string[] = []
      if (days >= 60) badges.push('🏆 Long Runner')
      else if (days >= 30) badges.push('✅ Proven')
      if (imp_upper >= 1_000_000) badges.push('🔥 1M+ Reach')
      else if (imp_upper >= 100_000) badges.push('📈 High Reach')
      if (spend_upper >= 5000) badges.push('💰 Big Spend')

      return {
        id: ad.id,
        page_name: ad.page_name || brand,
        page_id: ad.page_id || '',
        body,
        title,
        description,
        snapshot_url: ad.ad_snapshot_url || '',
        start_date: ad.ad_delivery_start_time || '',
        days_running: days,
        impressions_lower: imp_lower,
        impressions_upper: imp_upper,
        spend_lower,
        spend_upper,
        relevance_score,
        badges,
      }
    })

    // Sort by relevance descending, filter out ads with no copy
    const sorted = parsed
      .filter(a => a.body || a.title)
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 30)

    const result: AdLibraryResult = {
      brand: brand.trim(),
      total_found: raw.length,
      ads: sorted,
    }

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Ad Library search failed' }, { status: 500 })
  }
}
