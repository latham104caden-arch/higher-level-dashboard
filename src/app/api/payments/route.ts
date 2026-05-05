import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function rowToPayment(r: any) {
  return {
    id: r.id,
    contractId: r.contract_id,
    clientId: r.client_id,
    amount: Number(r.amount),
    dueDate: r.due_date,
    paidDate: r.paid_date,
    status: r.status,
    notes: r.notes,
    createdAt: r.created_at,
  }
}

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'agency') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('payments')
    .select('*')
    .order('due_date', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map(rowToPayment))
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'agency') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { contractId, clientId, amount, dueDate, status, paidDate, notes } = await req.json()
  if (!contractId || !clientId || !amount || !dueDate) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('payments')
    .insert({
      contract_id: contractId,
      client_id: clientId,
      amount,
      due_date: dueDate,
      status: status || 'scheduled',
      paid_date: paidDate || null,
      notes: notes || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(rowToPayment(data))
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'agency') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, status, paidDate, amount, dueDate, notes } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const updates: Record<string, any> = {}
  if (status) {
    updates.status = status
    if (status === 'paid') {
      updates.paid_date = paidDate || new Date().toISOString().slice(0, 10)
    }
    if (status === 'scheduled') {
      updates.paid_date = null
    }
  }
  if (paidDate !== undefined) updates.paid_date = paidDate
  if (amount !== undefined) updates.amount = amount
  if (dueDate !== undefined) updates.due_date = dueDate
  if (notes !== undefined) updates.notes = notes

  const { data, error } = await supabaseAdmin
    .from('payments')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(rowToPayment(data))
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'agency') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabaseAdmin.from('payments').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
