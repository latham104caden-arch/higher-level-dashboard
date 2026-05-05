import { NextRequest, NextResponse } from 'next/server'
import { getSession, AgencyUserId } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type TimeEntryRow = {
  id: string
  user_id: AgencyUserId
  punch_in: string
  punch_out: string | null
  submitted: boolean
  created_at: string
}

function toCamel(row: TimeEntryRow) {
  return {
    id: row.id,
    userId: row.user_id,
    punchIn: row.punch_in,
    punchOut: row.punch_out,
    submitted: row.submitted,
    createdAt: row.created_at,
  }
}

function startOfDayISO() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now.toISOString()
}

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'agency' || !session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('time_entries')
    .select('*')
    .eq('user_id', session.userId)
    .gte('punch_in', startOfDayISO())
    .order('punch_in', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json((data || []).map((r) => toCamel(r as TimeEntryRow)))
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'agency' || !session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { action } = await req.json()
  const userId = session.userId

  if (action === 'punch_in') {
    const { data: open } = await supabaseAdmin
      .from('time_entries')
      .select('id')
      .eq('user_id', userId)
      .is('punch_out', null)
      .maybeSingle()

    if (open) {
      return NextResponse.json({ error: 'Already punched in' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('time_entries')
      .insert({ user_id: userId, punch_in: new Date().toISOString() })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(toCamel(data as TimeEntryRow))
  }

  if (action === 'punch_out') {
    const { data: open, error: findErr } = await supabaseAdmin
      .from('time_entries')
      .select('*')
      .eq('user_id', userId)
      .is('punch_out', null)
      .order('punch_in', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (findErr) return NextResponse.json({ error: findErr.message }, { status: 500 })
    if (!open) return NextResponse.json({ error: 'Not punched in' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('time_entries')
      .update({ punch_out: new Date().toISOString() })
      .eq('id', open.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(toCamel(data as TimeEntryRow))
  }

  if (action === 'submit_day') {
    const { error } = await supabaseAdmin
      .from('time_entries')
      .update({ submitted: true })
      .eq('user_id', userId)
      .eq('submitted', false)
      .gte('punch_in', startOfDayISO())
      .not('punch_out', 'is', null)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
