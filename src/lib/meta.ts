const TOKEN = process.env.META_ACCESS_TOKEN
const VERSION = process.env.META_API_VERSION || 'v21.0'
const BASE = `https://graph.facebook.com/${VERSION}`

export type DatePreset =
  | 'today'
  | 'yesterday'
  | 'last_7d'
  | 'last_14d'
  | 'last_30d'
  | 'last_90d'
  | 'maximum'

async function metaFetch(url: string) {
  const res = await fetch(url, { next: { revalidate: 300 } })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data
}

export async function getCampaigns(accountId: string) {
  const url = `${BASE}/${accountId}/campaigns?fields=name,status,daily_budget,lifetime_budget,objective,effective_status&access_token=${TOKEN}`
  const data = await metaFetch(url)
  return data.data || []
}

export async function getAccountInsights(accountId: string, datePreset: DatePreset = 'last_7d') {
  const fields = 'spend,impressions,clicks,ctr,cpc,cpm,actions,action_values,purchase_roas,cost_per_action_type'
  const url = `${BASE}/${accountId}/insights?date_preset=${datePreset}&fields=${fields}&access_token=${TOKEN}`
  const data = await metaFetch(url)
  return data.data?.[0] || null
}

export async function getCampaignInsights(accountId: string, datePreset: DatePreset = 'last_7d') {
  const fields = 'campaign_name,campaign_id,spend,impressions,clicks,ctr,cpc,cpm,actions,action_values,purchase_roas,cost_per_action_type'
  const url = `${BASE}/${accountId}/insights?date_preset=${datePreset}&level=campaign&fields=${fields}&access_token=${TOKEN}`
  const data = await metaFetch(url)
  return data.data || []
}

export async function getAdInsights(accountId: string, datePreset: DatePreset = 'last_7d') {
  const fields = 'ad_name,ad_id,adset_name,spend,impressions,clicks,ctr,cpc,cpm,actions,action_values,purchase_roas,cost_per_action_type'
  const url = `${BASE}/${accountId}/insights?date_preset=${datePreset}&level=ad&fields=${fields}&access_token=${TOKEN}`
  const data = await metaFetch(url)
  return data.data || []
}

export async function getDailyInsights(accountId: string, datePreset: DatePreset = 'last_30d') {
  const fields = 'spend,impressions,clicks,ctr,cpc,cpm,actions,action_values,purchase_roas'
  const url = `${BASE}/${accountId}/insights?date_preset=${datePreset}&time_increment=1&fields=${fields}&access_token=${TOKEN}`
  const data = await metaFetch(url)
  return data.data || []
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getAction(actions: any[], type: string): number {
  if (!actions) return 0
  const match = actions.find((a: any) =>
    a.action_type === type ||
    a.action_type === `offsite_conversion.fb_pixel_${type}` ||
    a.action_type === `omni_${type}`
  )
  return match ? parseFloat(match.value) : 0
}

export function getActionValue(actionValues: any[], type: string): number {
  if (!actionValues) return 0
  const match = actionValues.find((a: any) =>
    a.action_type === type ||
    a.action_type === `offsite_conversion.fb_pixel_${type}` ||
    a.action_type === `omni_${type}`
  )
  return match ? parseFloat(match.value) : 0
}

export function getRoas(data: any): number {
  if (data?.purchase_roas?.[0]?.value) return parseFloat(data.purchase_roas[0].value)
  const spend = parseFloat(data?.spend || 0)
  const revenue = getActionValue(data?.action_values, 'purchase')
  if (!spend || !revenue) return 0
  return revenue / spend
}

export function getPurchases(data: any): number {
  return getAction(data?.actions, 'purchase')
}

export function getLeads(data: any): number {
  return getAction(data?.actions, 'lead') || getAction(data?.actions, 'complete_registration')
}

export function getCPA(data: any, type: 'purchase' | 'lead'): number {
  const spend = parseFloat(data?.spend || 0)
  const conversions = type === 'purchase' ? getPurchases(data) : getLeads(data)
  if (!spend || !conversions) return 0
  return spend / conversions
}

export function getATC(data: any): number {
  return getAction(data?.actions, 'add_to_cart')
}

export function getCheckouts(data: any): number {
  return getAction(data?.actions, 'initiate_checkout')
}

export function getLPV(data: any): number {
  return getAction(data?.actions, 'landing_page_view')
}

export function adVerdict(ad: any, clientType: string): { label: string; color: string } {
  const spend = parseFloat(ad.spend || 0)
  const roas = getRoas(ad)
  const purchases = getPurchases(ad)
  const leads = getLeads(ad)
  const ctr = parseFloat(ad.ctr || 0)

  if (clientType === 'ecommerce') {
    if (spend > 20 && roas === 0 && purchases === 0) return { label: 'KILL', color: '#EF4444' }
    if (roas >= 3) return { label: 'SCALE', color: '#22C55E' }
    if (roas >= 1.5) return { label: 'KEEP', color: '#3B82F6' }
    if (roas > 0 && roas < 1.5) return { label: 'WATCH', color: '#F59E0B' }
    if (spend < 10 && ctr > 5) return { label: 'TEST', color: '#8B5CF6' }
    if (spend > 10 && roas === 0) return { label: 'KILL', color: '#EF4444' }
  } else {
    if (spend > 15 && leads === 0) return { label: 'KILL', color: '#EF4444' }
    if (leads > 0) return { label: 'KEEP', color: '#3B82F6' }
    if (ctr > 3) return { label: 'TEST', color: '#8B5CF6' }
  }
  return { label: 'WATCH', color: '#F59E0B' }
}
