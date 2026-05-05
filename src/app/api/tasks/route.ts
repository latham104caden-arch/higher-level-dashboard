import { NextRequest, NextResponse } from 'next/server'
import { getSession, AgencyUserId } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type TaskRow = {
  id: string
  title: string
  assigned_to: AgencyUserId
  completed: boolean
  completed_at: string | null
  created_by: AgencyUserId
  created_at: string
}

function toCamel(row: TaskRow) {
  return {
    id: row.id,
    title: row.title,
    assignedTo: row.assigned_to,
    completed: row.completed,
    completedAt: row.completed_at,
    createdBy: row.created_by,
    createdAt: row.created_at,
  }
}

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'agency') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('tasks')
    .select('*')
    .order('completed', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map((r) => toCamel(r as TaskRow)))
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'agency' || !session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, assignedTo } = await req.json()
  if (!title || !assignedTo || !['caden', 'hunter'].includes(assignedTo)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('tasks')
    .insert({
      title: String(title).trim().slice(0, 500),
      assigned_to: assignedTo,
      created_by: session.userId,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(toCamel(data as TaskRow))
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'agency') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, completed } = await req.json()
  if (!id || typeof completed !== 'boolean') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('tasks')
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(toCamel(data as TaskRow))
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'agency') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const { error } = await supabaseAdmin.from('tasks').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
