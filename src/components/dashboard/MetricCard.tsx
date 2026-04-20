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
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: alert
          ? 'rgba(239, 68, 68, 0.08)'
          : 'rgba(20, 23, 40, 0.8)',
        border: alert
          ? '1px solid rgba(239, 68, 68, 0.2)'
          : '1px solid rgba(168, 174, 210, 0.08)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Glow accent top-right */}
      {!alert && (
        <div
          className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20 blur-xl"
          style={{ background: '#21D19F' }}
        />
      )}
      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#A0A4B8' }}>
        {label}
      </p>
      <p
        className="text-2xl font-bold"
        style={{ color: alert ? '#EF4444' : '#D8DDEF' }}
      >
        {value}
      </p>
      {sub && (
        <p className={cn('text-xs mt-1.5 font-medium')}>
          <span style={{ color: trend === 'up' ? '#21D19F' : trend === 'down' ? '#EF4444' : '#A0A4B8' }}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {sub}
          </span>
        </p>
      )}
    </div>
  )
}
