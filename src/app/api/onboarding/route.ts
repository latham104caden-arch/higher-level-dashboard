import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type SubmissionRow = {
  id: string
  created_at: string
  business_name: string
  legal_name: string
  main_service: string
  service_for_ads: string
  website: string
  target_area: string
  phone: string
  has_run_ads: string
  ad_platforms: string[]
  has_ad_account: string
  ad_account_id: string
  avg_job_price: string
  jobs_per_week: string
  monthly_budget: string
  hear_about_us: string
  assets_acknowledged: boolean
  video_watched_1: boolean
  video_watched_2: boolean
}

function toCamel(row: SubmissionRow) {
  return {
    id: row.id,
    submittedAt: row.created_at,
    businessName: row.business_name,
    legalName: row.legal_name,
    mainService: row.main_service,
    serviceForAds: row.service_for_ads,
    website: row.website,
    targetArea: row.target_area,
    phone: row.phone,
    hasRunAds: row.has_run_ads,
    adPlatforms: row.ad_platforms || [],
    hasAdAccount: row.has_ad_account,
    adAccountId: row.ad_account_id,
    avgJobPrice: row.avg_job_price,
    jobsPerWeek: row.jobs_per_week,
    monthlyBudget: row.monthly_budget,
    hearAboutUs: row.hear_about_us,
    assetsAcknowledged: row.assets_acknowledged,
    videoWatched1: row.video_watched_1,
    videoWatched2: row.video_watched_2,
  }
}

async function sendNotificationEmail(s: ReturnType<typeof toCamel>) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.NOTIFICATION_EMAIL
  if (!apiKey || !to) return

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Higher Level <onboarding@higherleveladz.com>',
      to,
      subject: `New onboarding: ${s.businessName || 'Unnamed'}`,
      html: `
        <h2>New onboarding submission</h2>
        <p><strong>Business:</strong> ${s.businessName || '—'}</p>
        <p><strong>Legal name:</strong> ${s.legalName || '—'}</p>
        <p><strong>Phone:</strong> ${s.phone || '—'}</p>
        <p><strong>Main service:</strong> ${s.mainService || '—'}</p>
        <p><strong>Target area:</strong> ${s.targetArea || '—'}</p>
        <p><strong>Monthly budget:</strong> ${s.monthlyBudget || '—'}</p>
        <p><strong>Avg job price:</strong> ${s.avgJobPrice || '—'}</p>
        <p><a href="https://www.higherleveladz.com/dashboard/onboarding">View full submission →</a></p>
      `,
    }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { data, error } = await supabaseAdmin
      .from('onboarding_submissions')
      .insert({
        business_name: body.businessName ?? '',
        legal_name: body.legalName ?? '',
        main_service: body.mainService ?? '',
        service_for_ads: body.serviceForAds ?? '',
        website: body.website ?? '',
        target_area: body.targetArea ?? '',
        phone: body.phone ?? '',
        has_run_ads: body.hasRunAds ?? '',
        ad_platforms: body.adPlatforms ?? [],
        has_ad_account: body.hasAdAccount ?? '',
        ad_account_id: body.adAccountId ?? '',
        avg_job_price: body.avgJobPrice ?? '',
        jobs_per_week: body.jobsPerWeek ?? '',
        monthly_budget: body.monthlyBudget ?? '',
        hear_about_us: body.hearAboutUs ?? '',
        assets_acknowledged: !!body.assetsAcknowledged,
        video_watched_1: !!body.videoWatched1,
        video_watched_2: !!body.videoWatched2,
      })
      .select()
      .single()

    if (error) throw error

    sendNotificationEmail(toCamel(data as SubmissionRow)).catch(err =>
      console.error('Notification email failed:', err)
    )

    return NextResponse.json({ success: true, id: data.id })
  } catch (err: any) {
    console.error('Submission error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('onboarding_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json((data || []).map((row) => toCamel(row as SubmissionRow)))
  } catch {
    return NextResponse.json([])
  }
}
