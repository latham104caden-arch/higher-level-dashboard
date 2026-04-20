import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import {
  getCampaigns,
  getAccountInsights,
  getCampaignInsights,
  getAdInsights,
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

  // Clients can only see their own data
  if (session.role === 'client' && session.clientId !== clientId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const client = CLIENTS[clientId as keyof typeof CLIENTS]
  const accountId = client.accountId

  try {
    const [campaigns, accountInsights, campaignInsights, adInsights, dailyInsights] = await Promise.all([
      getCampaigns(accountId),
      getAccountInsights(accountId, datePreset),
      getCampaignInsights(accountId, datePreset),
      getAdInsights(accountId, datePreset),
      getDailyInsights(accountId, datePreset),
    ])

    return NextResponse.json({ campaigns, accountInsights, campaignInsights, adInsights, dailyInsights })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
