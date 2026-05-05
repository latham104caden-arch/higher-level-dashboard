import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import { supabaseAdmin } from '@/lib/supabase'
import { ContractsClient } from './ContractsClient'

export const dynamic = 'force-dynamic'

export default async function ContractsPage() {
  const session = await getSession()
  if (!session || session.role !== 'agency') redirect('/')

  const [contractsRes, paymentsRes] = await Promise.all([
    supabaseAdmin.from('contracts').select('*').order('start_date', { ascending: false }),
    supabaseAdmin.from('payments').select('*').order('due_date', { ascending: true }),
  ])

  const contracts = (contractsRes.data || []).map((r: any) => ({
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
  }))

  const payments = (paymentsRes.data || []).map((r: any) => ({
    id: r.id,
    contractId: r.contract_id,
    clientId: r.client_id,
    amount: Number(r.amount),
    dueDate: r.due_date,
    paidDate: r.paid_date,
    status: r.status,
    notes: r.notes,
    createdAt: r.created_at,
  }))

  const clients = Object.values(CLIENTS).map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
    color: c.color,
  }))

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="mb-10">
        <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Agency View</p>
        <h1 className="font-serif italic text-4xl sm:text-5xl tracking-tight mb-3" style={{ color: '#F4F5F8' }}>
          Contracts
        </h1>
        <p className="text-base" style={{ color: '#8A8F98' }}>
          Track every contract, payment, and what each client is worth.
        </p>
      </div>

      <ContractsClient
        clients={clients}
        initialContracts={contracts}
        initialPayments={payments}
      />
    </main>
  )
}
