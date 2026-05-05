'use client'

import { useMemo, useState } from 'react'

type ContractType = 'month_to_month' | 'three_month' | 'commission'
type PaymentPlan = 'upfront' | 'split_2'
type ContractStatus = 'active' | 'completed' | 'cancelled'
type PaymentStatus = 'scheduled' | 'paid' | 'late' | 'skipped'

type Contract = {
  id: string
  clientId: string
  contractType: ContractType
  signedDate: string
  startDate: string
  paymentPlan: PaymentPlan | null
  commissionPercent: number | null
  status: ContractStatus
  notes: string | null
  createdAt: string
  updatedAt: string
}

type Payment = {
  id: string
  contractId: string
  clientId: string
  amount: number
  dueDate: string
  paidDate: string | null
  status: PaymentStatus
  notes: string | null
  createdAt: string
}

type ClientInfo = {
  id: string
  name: string
  type: string
  color: string
}

const TYPE_LABEL: Record<ContractType, string> = {
  month_to_month: 'Month-to-Month',
  three_month: '3-Month',
  commission: 'Commission',
}

const STATUS_COLOR: Record<PaymentStatus, { bg: string; fg: string }> = {
  scheduled: { bg: 'rgba(94,106,210,0.15)', fg: '#A5ADE8' },
  paid: { bg: 'rgba(33,209,159,0.12)', fg: '#21D19F' },
  late: { bg: 'rgba(229,72,77,0.12)', fg: '#E5484D' },
  skipped: { bg: 'rgba(255,255,255,0.05)', fg: '#5C606C' },
}

function formatMoney(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function ContractsClient({
  clients,
  initialContracts,
  initialPayments,
}: {
  clients: ClientInfo[]
  initialContracts: Contract[]
  initialPayments: Payment[]
}) {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts)
  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [showAddForm, setShowAddForm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [expandedClient, setExpandedClient] = useState<string | null>(null)

  const totals = useMemo(() => {
    const made = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
    const worth = payments.reduce((s, p) => s + p.amount, 0)
    const today = todayISO()
    const upcoming = payments
      .filter((p) => p.status === 'scheduled' && p.dueDate >= today)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    const next = upcoming[0]
    const mrr = contracts
      .filter((c) => c.status === 'active' && c.contractType === 'month_to_month')
      .length * 1050
    return { made, worth, next, mrr }
  }, [payments, contracts])

  const byClient = useMemo(() => {
    const map = new Map<string, { contracts: Contract[]; payments: Payment[] }>()
    for (const c of clients) {
      map.set(c.id, { contracts: [], payments: [] })
    }
    for (const c of contracts) {
      const e = map.get(c.clientId)
      if (e) e.contracts.push(c)
    }
    for (const p of payments) {
      const e = map.get(p.clientId)
      if (e) e.payments.push(p)
    }
    return map
  }, [clients, contracts, payments])

  async function refreshAll() {
    const [cRes, pRes] = await Promise.all([fetch('/api/contracts'), fetch('/api/payments')])
    if (cRes.ok) setContracts(await cRes.json())
    if (pRes.ok) setPayments(await pRes.json())
  }

  async function markPaid(p: Payment, paidDate: string) {
    setPayments((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, status: 'paid', paidDate } : x))
    )
    try {
      const res = await fetch('/api/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, status: 'paid', paidDate }),
      })
      if (!res.ok) throw new Error()
      const updated: Payment = await res.json()
      setPayments((prev) => prev.map((x) => (x.id === p.id ? updated : x)))
    } catch {
      setPayments((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, status: p.status, paidDate: p.paidDate } : x))
      )
      alert('Failed to update')
    }
  }

  async function unmarkPaid(p: Payment) {
    setPayments((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, status: 'scheduled', paidDate: null } : x))
    )
    try {
      const res = await fetch('/api/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, status: 'scheduled' }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setPayments((prev) => prev.map((x) => (x.id === p.id ? p : x)))
    }
  }

  async function deletePayment(id: string) {
    if (!confirm('Delete this payment?')) return
    const prev = payments
    setPayments((p) => p.filter((x) => x.id !== id))
    try {
      const res = await fetch('/api/payments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setPayments(prev)
    }
  }

  async function addCommissionPayment(contract: Contract, amount: number, dueDate: string) {
    setBusy(true)
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: contract.id,
          clientId: contract.clientId,
          amount,
          dueDate,
          status: 'scheduled',
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      const created: Payment = await res.json()
      setPayments((prev) => [...prev, created])
    } catch (err: any) {
      alert(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function deleteContract(id: string) {
    if (!confirm('Delete this contract and all its payments? This cannot be undone.')) return
    setBusy(true)
    try {
      const res = await fetch('/api/contracts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
      setContracts((prev) => prev.filter((c) => c.id !== id))
      setPayments((prev) => prev.filter((p) => p.contractId !== id))
    } catch {
      alert('Failed to delete')
    } finally {
      setBusy(false)
    }
  }

  const cardStyle = {
    background: '#15161A',
    border: '1px solid rgba(255,255,255,0.08)',
  }

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Made" value={formatMoney(totals.made)} accent="#21D19F" />
        <StatCard label="Total Worth" value={formatMoney(totals.worth)} accent="#5E6AD2" />
        <StatCard label="MRR (M2M)" value={formatMoney(totals.mrr)} accent="#FFB800" />
        <StatCard
          label="Next Payment"
          value={
            totals.next
              ? `${formatMoney(totals.next.amount)} · ${formatDate(totals.next.dueDate)}`
              : '—'
          }
          accent="#A5ADE8"
        />
      </div>

      {/* Add Contract */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold" style={{ color: '#F4F5F8' }}>
          Clients
        </h2>
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="px-4 py-2 rounded-md text-sm font-bold transition-opacity"
          style={{ background: '#5E6AD2', color: '#F4F5F8' }}
        >
          {showAddForm ? 'Cancel' : '+ New Contract'}
        </button>
      </div>

      {showAddForm && (
        <AddContractForm
          clients={clients}
          onClose={() => setShowAddForm(false)}
          onCreated={async () => {
            await refreshAll()
            setShowAddForm(false)
          }}
        />
      )}

      {/* Per-client cards */}
      <div className="space-y-4">
        {clients.map((client) => {
          const data = byClient.get(client.id)!
          const activeContract = data.contracts.find((c) => c.status === 'active') || data.contracts[0] || null
          const clientPaid = data.payments
            .filter((p) => p.status === 'paid')
            .reduce((s, p) => s + p.amount, 0)
          const clientWorth = data.payments.reduce((s, p) => s + p.amount, 0)
          const today = todayISO()
          const nextPayment = data.payments
            .filter((p) => p.status === 'scheduled' && p.dueDate >= today)
            .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]
          const isExpanded = expandedClient === client.id

          return (
            <div key={client.id} className="rounded-xl overflow-hidden" style={cardStyle}>
              <button
                onClick={() => setExpandedClient(isExpanded ? null : client.id)}
                className="w-full p-5 sm:p-6 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: client.color }}
                    />
                    <div>
                      <h3 className="font-semibold text-lg" style={{ color: '#F4F5F8' }}>
                        {client.name}
                      </h3>
                      <p className="text-xs" style={{ color: '#5C606C' }}>
                        {client.type === 'ecommerce' ? 'Ecommerce' : 'Service'}
                        {activeContract && (
                          <>
                            {' · '}
                            {TYPE_LABEL[activeContract.contractType]}
                            {activeContract.commissionPercent !== null &&
                              ` (${activeContract.commissionPercent}%)`}
                            {activeContract.paymentPlan === 'upfront' && ' · Upfront'}
                            {activeContract.paymentPlan === 'split_2' && ' · Split 2'}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <Stat label="Made" value={formatMoney(clientPaid)} small />
                    <Stat label="Worth" value={formatMoney(clientWorth)} small />
                    <Stat
                      label="Next"
                      value={nextPayment ? formatDate(nextPayment.dueDate) : '—'}
                      sub={nextPayment ? formatMoney(nextPayment.amount) : undefined}
                      small
                    />
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-5 sm:px-6 py-5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  {data.contracts.length === 0 ? (
                    <p className="text-sm py-2" style={{ color: '#5C606C' }}>
                      No contract yet. Click "+ New Contract" above to add one.
                    </p>
                  ) : (
                    data.contracts.map((contract) => (
                      <ContractDetail
                        key={contract.id}
                        contract={contract}
                        payments={data.payments.filter((p) => p.contractId === contract.id)}
                        onMarkPaid={markPaid}
                        onUnmarkPaid={unmarkPaid}
                        onDeletePayment={deletePayment}
                        onAddPayment={addCommissionPayment}
                        onDeleteContract={deleteContract}
                        busy={busy}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: '#15161A', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: '#5C606C' }}>
        {label}
      </p>
      <p className="text-lg sm:text-xl font-mono font-semibold" style={{ color: accent }}>
        {value}
      </p>
    </div>
  )
}

function Stat({ label, value, sub, small }: { label: string; value: string; sub?: string; small?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: '#5C606C' }}>
        {label}
      </p>
      <p className={`font-mono font-semibold ${small ? 'text-sm' : 'text-base'}`} style={{ color: '#F4F5F8' }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs font-mono" style={{ color: '#8A8F98' }}>
          {sub}
        </p>
      )}
    </div>
  )
}

function ContractDetail({
  contract,
  payments,
  onMarkPaid,
  onUnmarkPaid,
  onDeletePayment,
  onAddPayment,
  onDeleteContract,
  busy,
}: {
  contract: Contract
  payments: Payment[]
  onMarkPaid: (p: Payment, paidDate: string) => void
  onUnmarkPaid: (p: Payment) => void
  onDeletePayment: (id: string) => void
  onAddPayment: (c: Contract, amount: number, dueDate: string) => void
  onDeleteContract: (id: string) => void
  busy: boolean
}) {
  const [newAmount, setNewAmount] = useState('')
  const [newDate, setNewDate] = useState(todayISO())

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <DetailField label="Type" value={TYPE_LABEL[contract.contractType]} />
        <DetailField label="Signed" value={formatDate(contract.signedDate)} />
        <DetailField label="Start" value={formatDate(contract.startDate)} />
        {contract.paymentPlan && (
          <DetailField
            label="Plan"
            value={contract.paymentPlan === 'upfront' ? 'Upfront' : 'Split 2'}
          />
        )}
        {contract.commissionPercent !== null && (
          <DetailField label="Commission" value={`${contract.commissionPercent}%`} />
        )}
        <DetailField label="Status" value={contract.status} />
      </div>

      {contract.notes && (
        <p className="text-sm rounded-md p-3" style={{ background: '#0B0C0F', color: '#8A8F98', border: '1px solid rgba(255,255,255,0.05)' }}>
          {contract.notes}
        </p>
      )}

      <div>
        <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#5C606C' }}>
          Payments
        </p>
        <div className="space-y-1.5">
          {payments.length === 0 ? (
            <p className="text-sm py-1" style={{ color: '#5C606C' }}>
              {contract.contractType === 'commission'
                ? 'No payments logged. Add one below when commission is earned.'
                : 'No payments scheduled.'}
            </p>
          ) : (
            payments
              .slice()
              .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
              .map((p) => (
                <PaymentRow
                  key={p.id}
                  payment={p}
                  onMarkPaid={onMarkPaid}
                  onUnmarkPaid={onUnmarkPaid}
                  onDelete={onDeletePayment}
                />
              ))
          )}
        </div>
      </div>

      {contract.contractType === 'commission' && (
        <div className="rounded-md p-3" style={{ background: '#0B0C0F', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#5C606C' }}>
            Add Commission Payment
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="flex-1 min-w-[120px] px-3 py-2 rounded-md text-sm outline-none"
              style={{ background: '#15161A', border: '1px solid rgba(255,255,255,0.1)', color: '#F4F5F8' }}
            />
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="px-3 py-2 rounded-md text-sm outline-none"
              style={{ background: '#15161A', border: '1px solid rgba(255,255,255,0.1)', color: '#F4F5F8' }}
            />
            <button
              onClick={() => {
                const amt = parseFloat(newAmount)
                if (!amt || amt <= 0) return alert('Enter a valid amount')
                onAddPayment(contract, amt, newDate)
                setNewAmount('')
              }}
              disabled={busy}
              className="px-4 py-2 rounded-md text-sm font-bold disabled:opacity-40"
              style={{ background: '#5E6AD2', color: '#F4F5F8' }}
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => onDeleteContract(contract.id)}
          disabled={busy}
          className="text-xs font-medium disabled:opacity-40"
          style={{ color: '#E5484D' }}
        >
          Delete contract
        </button>
      </div>
    </div>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: '#5C606C' }}>
        {label}
      </p>
      <p className="text-sm" style={{ color: '#F4F5F8' }}>
        {value}
      </p>
    </div>
  )
}

function PaymentRow({
  payment,
  onMarkPaid,
  onUnmarkPaid,
  onDelete,
}: {
  payment: Payment
  onMarkPaid: (p: Payment, paidDate: string) => void
  onUnmarkPaid: (p: Payment) => void
  onDelete: (id: string) => void
}) {
  const color = STATUS_COLOR[payment.status]
  const isPast = payment.status === 'scheduled' && payment.dueDate < todayISO()
  const displayStatus = isPast ? 'late' : payment.status
  const displayColor = isPast ? STATUS_COLOR.late : color

  return (
    <div
      className="flex items-center gap-3 rounded-md px-3 py-2 group"
      style={{ background: '#0B0C0F', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <span className="font-mono text-sm flex-shrink-0" style={{ color: '#F4F5F8' }}>
        {formatMoney(payment.amount)}
      </span>
      <span className="text-xs flex-1" style={{ color: '#8A8F98' }}>
        Due {formatDate(payment.dueDate)}
        {payment.paidDate && (
          <span style={{ color: '#21D19F' }}> · Paid {formatDate(payment.paidDate)}</span>
        )}
      </span>
      <span
        className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
        style={{ background: displayColor.bg, color: displayColor.fg }}
      >
        {displayStatus}
      </span>
      {payment.status === 'paid' ? (
        <button
          onClick={() => onUnmarkPaid(payment)}
          className="text-xs"
          style={{ color: '#5C606C' }}
        >
          Undo
        </button>
      ) : (
        <button
          onClick={() => onMarkPaid(payment, todayISO())}
          className="text-xs font-bold"
          style={{ color: '#21D19F' }}
        >
          Mark Paid
        </button>
      )}
      <button
        onClick={() => onDelete(payment.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
        style={{ color: '#5C606C' }}
        aria-label="Delete payment"
      >
        ×
      </button>
    </div>
  )
}

function AddContractForm({
  clients,
  onClose,
  onCreated,
}: {
  clients: ClientInfo[]
  onClose: () => void
  onCreated: () => void
}) {
  const [clientId, setClientId] = useState(clients[0]?.id || '')
  const [signedDate, setSignedDate] = useState(todayISO())
  const [startDate, setStartDate] = useState(todayISO())
  const [contractType, setContractType] = useState<ContractType>('month_to_month')
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>('upfront')
  const [commissionPercent, setCommissionPercent] = useState('')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)

  const selected = clients.find((c) => c.id === clientId)
  const isEcomm = selected?.type === 'ecommerce'

  const availableTypes: ContractType[] = isEcomm
    ? ['commission']
    : ['month_to_month', 'three_month']

  const effectiveType = availableTypes.includes(contractType)
    ? contractType
    : availableTypes[0]

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      const body: any = {
        clientId,
        contractType: effectiveType,
        signedDate,
        startDate,
        notes: notes || undefined,
      }
      if (effectiveType === 'three_month') body.paymentPlan = paymentPlan
      if (effectiveType === 'commission') {
        const pct = parseFloat(commissionPercent)
        if (!pct || pct <= 0) {
          alert('Enter commission percent')
          setBusy(false)
          return
        }
        body.commissionPercent = pct
      }
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      onCreated()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setBusy(false)
    }
  }

  const inputStyle = {
    background: '#0B0C0F',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#F4F5F8',
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl p-6 space-y-4"
      style={{ background: '#15161A', border: '1px solid rgba(94,106,210,0.3)' }}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Client">
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full px-3 py-2 rounded-md text-sm outline-none"
            style={inputStyle}
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.type === 'ecommerce' ? 'Ecomm' : 'Service'})
              </option>
            ))}
          </select>
        </Field>

        <Field label="Contract Type">
          <select
            value={effectiveType}
            onChange={(e) => setContractType(e.target.value as ContractType)}
            className="w-full px-3 py-2 rounded-md text-sm outline-none"
            style={inputStyle}
          >
            {availableTypes.map((t) => (
              <option key={t} value={t}>
                {TYPE_LABEL[t]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Signed Date">
          <input
            type="date"
            value={signedDate}
            onChange={(e) => setSignedDate(e.target.value)}
            className="w-full px-3 py-2 rounded-md text-sm outline-none"
            style={inputStyle}
          />
        </Field>

        <Field label="Start Date">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 rounded-md text-sm outline-none"
            style={inputStyle}
          />
        </Field>

        {effectiveType === 'three_month' && (
          <Field label="Payment Plan">
            <select
              value={paymentPlan}
              onChange={(e) => setPaymentPlan(e.target.value as PaymentPlan)}
              className="w-full px-3 py-2 rounded-md text-sm outline-none"
              style={inputStyle}
            >
              <option value="upfront">Upfront ($2,850)</option>
              <option value="split_2">Split into 2 ($1,425 + $1,425)</option>
            </select>
          </Field>
        )}

        {effectiveType === 'commission' && (
          <Field label="Commission %">
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 15"
              value={commissionPercent}
              onChange={(e) => setCommissionPercent(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-sm outline-none"
              style={inputStyle}
            />
          </Field>
        )}
      </div>

      <Field label="Notes (optional)">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-md text-sm outline-none resize-none"
          style={inputStyle}
        />
      </Field>

      {effectiveType === 'month_to_month' && (
        <p className="text-xs" style={{ color: '#8A8F98' }}>
          Schedule: $1,450 first month, $1,050 each month after (12 months auto-generated).
        </p>
      )}
      {effectiveType === 'three_month' && paymentPlan === 'upfront' && (
        <p className="text-xs" style={{ color: '#8A8F98' }}>
          Schedule: single payment of $2,850 on start date.
        </p>
      )}
      {effectiveType === 'three_month' && paymentPlan === 'split_2' && (
        <p className="text-xs" style={{ color: '#8A8F98' }}>
          Schedule: $1,425 on start date, $1,425 one month later.
        </p>
      )}
      {effectiveType === 'commission' && (
        <p className="text-xs" style={{ color: '#8A8F98' }}>
          No auto-schedule. Add commission payments manually each month after the contract is created.
        </p>
      )}

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-md text-sm font-medium"
          style={{ color: '#8A8F98' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy}
          className="px-4 py-2 rounded-md text-sm font-bold disabled:opacity-40"
          style={{ background: '#5E6AD2', color: '#F4F5F8' }}
        >
          {busy ? 'Creating...' : 'Create Contract'}
        </button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: '#5C606C' }}>
        {label}
      </label>
      {children}
    </div>
  )
}
