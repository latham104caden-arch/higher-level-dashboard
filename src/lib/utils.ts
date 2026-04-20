export function fmt(n: number, decimals = 2): string {
  if (!n || isNaN(n)) return '—'
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export function fmtCurrency(n: number): string {
  if (!n || isNaN(n)) return '—'
  return '$' + fmt(n)
}

export function fmtPct(n: number): string {
  if (!n || isNaN(n)) return '—'
  return fmt(n) + '%'
}

export function fmtX(n: number): string {
  if (!n || isNaN(n)) return '—'
  return fmt(n) + 'x'
}

export function fmtInt(n: number): string {
  if (!n || isNaN(n)) return '0'
  return Math.round(n).toLocaleString('en-US')
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
