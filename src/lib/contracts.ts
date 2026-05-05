export type ContractType = 'month_to_month' | 'three_month' | 'commission'
export type PaymentPlan = 'upfront' | 'split_2'
export type ContractStatus = 'active' | 'completed' | 'cancelled'
export type PaymentStatus = 'scheduled' | 'paid' | 'late' | 'skipped'

export const CONTRACT_TYPE_LABEL: Record<ContractType, string> = {
  month_to_month: 'Month-to-Month',
  three_month: '3-Month',
  commission: 'Commission',
}

export const M2M_FIRST_MONTH = 1450
export const M2M_RECURRING = 1050
export const THREE_MONTH_RATE = 950

export type Contract = {
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

export type Payment = {
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

export function addMonthsISO(dateISO: string, months: number): string {
  const d = new Date(dateISO + 'T00:00:00')
  const targetMonth = d.getMonth() + months
  d.setMonth(targetMonth)
  return d.toISOString().slice(0, 10)
}

/**
 * Generate the initial payment schedule for a contract.
 * Commission contracts return no payments — Caden logs them manually.
 */
export function generatePaymentSchedule(contract: {
  contractType: ContractType
  startDate: string
  paymentPlan: PaymentPlan | null
}): Array<{ amount: number; dueDate: string }> {
  if (contract.contractType === 'month_to_month') {
    const payments: Array<{ amount: number; dueDate: string }> = []
    payments.push({ amount: M2M_FIRST_MONTH, dueDate: contract.startDate })
    for (let i = 1; i < 12; i++) {
      payments.push({
        amount: M2M_RECURRING,
        dueDate: addMonthsISO(contract.startDate, i),
      })
    }
    return payments
  }

  if (contract.contractType === 'three_month') {
    if (contract.paymentPlan === 'upfront') {
      return [{ amount: THREE_MONTH_RATE * 3, dueDate: contract.startDate }]
    }
    const half = (THREE_MONTH_RATE * 3) / 2
    return [
      { amount: half, dueDate: contract.startDate },
      { amount: half, dueDate: addMonthsISO(contract.startDate, 1) },
    ]
  }

  return []
}

export function nextPaymentForCommission(startDate: string, fromDateISO?: string): string {
  const from = new Date((fromDateISO || new Date().toISOString().slice(0, 10)) + 'T00:00:00')
  const start = new Date(startDate + 'T00:00:00')
  const target = new Date(from.getFullYear(), from.getMonth() + 1, 1)
  if (start > target) return start.toISOString().slice(0, 10)
  return target.toISOString().slice(0, 10)
}
