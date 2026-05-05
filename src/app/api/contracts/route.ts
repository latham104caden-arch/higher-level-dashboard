import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import {
  generatePaymentSchedule,
  ContractType,
  PaymentPlan,
} from '@/lib/contracts'

export const dynamic = 'force-dynamic'

function rowToContract(r: any) {
  return {
    id: r.id,
    clientId: r.client_id,
    contractType: r.contract_type,
    signedDate: r.signed_date,
    startDate: r.start_date,
    paymentPlan: r.payment_plan,
    commissionPercent: r.commission_percent !== null ? Number(r.commission_percent) : null,
    status: r.status,
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'agency') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('contracts')
    .select('*')
    .order('start_date', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data || []).map(rowToContract))
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'agency') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const {
    clientId,
    contractType,
    signedDate,
    startDate,
    paymentPlan,
    commissionPercent,
    notes,
  } = body as {
    clientId: string
    contractType: ContractType
    signedDate: string
    startDate: string
    paymentPlan: PaymentPlan | null
    commissionPercent: number | null
    notes?: string
  }

  if (!clientId || !contractType || !signedDate || !startDate) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (!['month_to_month', 'three_month', 'commission'].includes(contractType)) {
    return NextResponse.json({ error: 'Invalid contract type' }, { status: 400 })
  }
  if (contractType === 'three_month' && !['upfront', 'split_2'].includes(paymentPlan || '')) {
    return NextResponse.json({ error: 'Three-month requires payment plan' }, { status: 400 })
  }
  if (contractType === 'commission' && (commissionPercent === null || commissionPercent <= 0)) {
    return NextResponse.json({ error: 'Commission requires percent' }, { status: 400 })
  }

  const { data: contractRow, error: contractErr } = await supabaseAdmin
    .from('contracts')
    .insert({
      client_id: clientId,
      contract_type: contractType,
      signed_date: signedDate,
      start_date: startDate,
      payment_plan: contractType === 'three_month' ? paymentPlan : null,
      commission_percent: contractType === 'commission' ? commissionPercent : null,
      status: 'active',
      notes: notes || null,
    })
    .select()
    .single()

  if (contractErr) return NextResponse.json({ error: contractErr.message }, { status: 500 })

  const schedule = generatePaymentSchedule({
    contractType,
    startDate,
    paymentPlan: contractType === 'three_month' ? paymentPlan : null,
  })

  if (schedule.length > 0) {
    const rows = schedule.map((p) => ({
      contract_id: contractRow.id,
      client_id: clientId,
      amount: p.amount,
      due_date: p.dueDate,
      status: 'scheduled' as const,
    }))
    const { error: payErr } = await supabaseAdmin.from('payments').insert(rows)
    if (payErr) {
      return NextResponse.json({ error: payErr.message }, { status: 500 })
    }
  }

  return NextResponse.json(rowToContract(contractRow))
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'agency') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, status, notes } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const updates: Record<string, any> = { updated_at: new Date().toISOString() }
  if (status) updates.status = status
  if (typeof notes === 'string') updates.notes = notes

  const { data, error } = await supabaseAdmin
    .from('contracts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(rowToContract(data))
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'agency') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  await supabaseAdmin.from('payments').delete().eq('contract_id', id)
  const { error } = await supabaseAdmin.from('contracts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
