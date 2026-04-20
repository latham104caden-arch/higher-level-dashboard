import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  alert?: boolean
}

export function MetricCard({ label, value, sub, trend, alert }: MetricCardProps) {
  return (
    <div className={cn(
      'bg-white rounded-xl border shadow-sm p-5',
      alert ? 'border-red-200 bg-red-50' : 'border-gray-100'
    )}>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={cn('text-2xl font-bold', alert ? 'text-red-600' : 'text-gray-900')}>{value}</p>
      {sub && (
        <p className={cn(
          'text-xs mt-1',
          trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-gray-400'
        )}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {sub}
        </p>
      )}
    </div>
  )
}
