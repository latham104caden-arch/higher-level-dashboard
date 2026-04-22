import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { CREATORS } from '@/lib/creators'
import { CLIENTS } from '@/lib/clients'

export const dynamic = 'force-dynamic'

const TOKEN = process.env.META_ACCESS_TOKEN
const VERSION = process.env.META_API_VERSION || 'v21.0'

export interface CreatorAdStat {
  id: string
  name: string
  status: string
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  cpm: number
  purchases: number
  revenue: number
  roas: number
  thumbstop_rate: number | null
  hook_rate: number | null
  days_running: number
  created_time: string
  // Derived
  performance_tier: 'winner' | 'solid' | 'learning' | 'weak'
  why_winning: string[]
  improvement_tips: string[]
}

export interface CreatorAdsResponse {
  creator_name: string
  client_name: string
  total_spend: number
  total_revenue: number
  overall_roas: number
  ads: CreatorAdStat[]
  earnings: {
    videos_delivered: number
    rate_per_video: number
    bonus_per_purchase: number
    total_purchases: number
    base_earnings: number
    bonus_earnings: number
    total_earned: number
  }
}

function daysSince(dateStr: string): number {
  if (!dateStr) return 0
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
}

function classifyAd(roas: number, ctr: number, spend: number): CreatorAdStat['performance_tier'] {
  if (roas >= 2.5 && spend > 100) return 'winner'
  if (roas >= 1.5 || (ctr >= 2 && spend > 50)) return 'solid'
  if (spend < 50) return 'learning'
  return 'weak'
}

function whyWinning(stat: Omit<CreatorAdStat, 'why_winning' | 'improvement_tips' | 'performance_tier'>): string[] {
  const reasons: string[] = []
  if (stat.roas >= 3) reasons.push(`Strong ${stat.roas.toFixed(1)}x ROAS — this creative is printing money`)
  if (stat.ctr >= 3) reasons.push(`${stat.ctr.toFixed(2)}% CTR — the hook is stopping the scroll`)
  if (stat.cpm <= 12) reasons.push(`$${stat.cpm.toFixed(2)} CPM — algorithm loves this creative`)
  if (stat.days_running >= 30) reasons.push(`Still running after ${stat.days_running} days — proven staying power`)
  if (stat.purchases >= 10) reasons.push(`${stat.purchases} purchases attributed — converting real buyers`)
  return reasons.length ? reasons : ['Gathering data — needs more spend to draw conclusions']
}

function improvementTips(stat: Omit<CreatorAdStat, 'why_winning' | 'improvement_tips' | 'performance_tier'>): string[] {
  const tips: string[] = []
  if (stat.ctr < 1) tips.push("CTR under 1% — your hook isn't landing. Try a bold statement or question in the first 3 seconds")
  if (stat.ctr >= 1 && stat.ctr < 2) tips.push('CTR is decent — test a more direct hook that names the problem immediately')
  if (stat.roas > 0 && stat.roas < 1) tips.push('ROAS under 1x — the offer or landing page may be the issue, not your creative')
  if (stat.cpm > 20) tips.push(`$${stat.cpm.toFixed(0)} CPM is high — try a warmer opener, Meta may be showing it to cold audiences`)
  if (stat.cpc > 3) tips.push('CPC over $3 — work on your CTA. Make the next step obvious and low-friction')
  if (stat.days_running < 7) tips.push('Still early — let it run to $50+ spend before judging performance')
  return tips.length ? tips : ['Keep making content in this style — the data looks good']
}

// Fetch all ads from an account, paginating through results
async function fetchAllAccountAds(accountId: string): Promise<any[]> {
  const fields = [
    'id', 'name', 'status', 'created_time',
    'insights.date_preset(last_30d){spend,impressions,clicks,ctr,cpc,cpm,actions,action_values}',
  ].join(',')

  const url = `https://graph.facebook.com/${VERSION}/${accountId}/ads?fields=${encodeURIComponent(fields)}&limit=200&access_token=${TOKEN}`

  const all: any[] = []
  let nextUrl: string | null = url

  while (nextUrl) {
    const res: Response = await fetch(nextUrl, { cache: 'no-store', signal: AbortSignal.timeout(15000) })
    const json: any = await res.json()
    if (json.error) throw new Error(`Meta API: ${json.error.message}`)
    if (json.data) all.push(...json.data)
    nextUrl = json.paging?.next || null
  }

  return all
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'creator' || !session.creatorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const creator = CREATORS[session.creatorId]
    if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 })

    const client = CLIENTS[creator.clientId as keyof typeof CLIENTS]

    // No token yet — return empty state
    if (!TOKEN) {
      return NextResponse.json({
        creator_name: creator.name,
        client_name: client?.name || creator.clientId,
        total_spend: 0, total_revenue: 0, overall_roas: 0,
        ads: [],
        earnings: {
          videos_delivered: 0,
          rate_per_video: creator.ratePerVideo,
          bonus_per_purchase: creator.bonusPerPurchase,
          total_purchases: 0,
          base_earnings: 0,
          bonus_earnings: 0,
          total_earned: 0,
        },
      } as CreatorAdsResponse)
    }

    // Pull all ads from the account and filter by nameTag
    const allAds = await fetchAllAccountAds(creator.accountId)
    const tag = creator.nameTag.toUpperCase()
    const matched = allAds.filter(ad => (ad.name || '').toUpperCase().includes(tag))

    const ads: CreatorAdStat[] = matched.map(ad => {
      const ins = ad.insights?.data?.[0] || {}
      const spend = parseFloat(ins.spend || '0')
      const impressions = parseInt(ins.impressions || '0')
      const clicks = parseInt(ins.clicks || '0')
      const ctr = parseFloat(ins.ctr || '0')
      const cpc = parseFloat(ins.cpc || '0')
      const cpm = parseFloat(ins.cpm || '0')

      const actions: any[] = ins.actions || []
      const values: any[] = ins.action_values || []
      const purchases = parseInt(actions.find((a: any) => a.action_type === 'purchase')?.value || '0')
      const revenue = parseFloat(values.find((a: any) => a.action_type === 'purchase')?.value || '0')
      const roas = spend > 0 ? revenue / spend : 0
      const days = daysSince(ad.created_time || '')

      const base = {
        id: ad.id,
        name: ad.name || 'Untitled',
        status: ad.status || 'UNKNOWN',
        spend, impressions, clicks, ctr, cpc, cpm,
        purchases, revenue, roas,
        thumbstop_rate: null, hook_rate: null,
        days_running: days,
        created_time: ad.created_time || '',
      }

      return {
        ...base,
        performance_tier: classifyAd(roas, ctr, spend),
        why_winning: whyWinning(base),
        improvement_tips: improvementTips(base),
      }
    }).sort((a, b) => b.roas - a.roas)

    const total_spend = ads.reduce((s, a) => s + a.spend, 0)
    const total_revenue = ads.reduce((s, a) => s + a.revenue, 0)
    const total_purchases = ads.reduce((s, a) => s + a.purchases, 0)
    const overall_roas = total_spend > 0 ? total_revenue / total_spend : 0

    const base_earnings = ads.length * creator.ratePerVideo
    const bonus_earnings = total_purchases * creator.bonusPerPurchase

    return NextResponse.json({
      creator_name: creator.name,
      client_name: client?.name || creator.clientId,
      total_spend,
      total_revenue,
      overall_roas,
      ads,
      earnings: {
        videos_delivered: ads.length,
        rate_per_video: creator.ratePerVideo,
        bonus_per_purchase: creator.bonusPerPurchase,
        total_purchases,
        base_earnings,
        bonus_earnings,
        total_earned: base_earnings + bonus_earnings,
      },
    } as CreatorAdsResponse)

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch creator ads' }, { status: 500 })
  }
}
