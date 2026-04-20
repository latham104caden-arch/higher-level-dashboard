import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import {
  getCampaigns,
  getAccountInsights,
  getCampaignInsights,
  getAdInsights,
  getAdStatuses,
  getDailyInsights,
  DatePreset,
} from '@/lib/meta'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')
  const datePreset = (searchParams.get('datePreset') || 'last_7d') as DatePreset

  if (!clientId || !CLIENTS[clientId as keyof typeof CLIENTS]) {
    return NextResponse.json({ error: 'Invalid client' }, { status: 400 })
  }

  if (session.role === 'client' && session.clientId !== clientId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const client = CLIENTS[clientId as keyof typeof CLIENTS]
  const accountId = client.accountId

  try {
    const [campaigns, accountInsights, campaignInsights, adInsights, adStatuses, dailyInsights] = await Promise.all([
      getCampaigns(accountId),
      getAccountInsights(accountId, datePreset),
      getCampaignInsights(accountId, datePreset),
      getAdInsights(accountId, datePreset),
      getAdStatuses(accountId),
      getDailyInsights(accountId, datePreset),
    ])

    // Build status map: ad_id -> effective_status
    const statusMap: Record<string, string> = {}
    for (const ad of adStatuses) {
      statusMap[ad.id] = ad.effective_status
    }

    // Merge status into each ad insight
    const adInsightsWithStatus = adInsights.map((ad: any) => ({
      ...ad,
      effective_status: statusMap[ad.ad_id] || 'UNKNOWN',
    }))

    // Also include OFF ads that had no impressions in this period
    const insightIds = new Set(adInsights.map((a: any) => a.ad_id))
    const offAds = adStatuses
      .filter((ad: any) => !insightIds.has(ad.id) && ad.effective_status !== 'ACTIVE')
      .map((ad: any) => ({
        ad_id: ad.id,
        ad_name: ad.name,
        effective_status: ad.effective_status,
        spend: '0',
        impressions: '0',
        clicks: '0',
        ctr: '0',
        cpc: '0',
        cpm: '0',
      }))

    return NextResponse.json({
      campaigns,
      accountInsights,
      campaignInsights,
      adInsights: [...adInsightsWithStatus, ...offAds],
      dailyInsights,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
