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
      className="relative overflow-hidden rounded-2xl p-5 glass-accent"
      style={{
        background: alert ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: alert ? '1px solid rgba(239,68,68,0.15)' : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Corner glow */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-30"
        style={{ background: alert ? '#EF4444' : '#21D19F' }}
      />

      <p
        className="text-xs font-semibold uppercase tracking-widest mb-2"
        style={{ color: '#7B82A0' }}
      >
        {label}
      </p>
      <p
        className="text-2xl font-bold tracking-tight"
        style={{ color: alert ? '#EF4444' : '#E8ECFF' }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-1.5 font-medium" style={{
          color: trend === 'up' ? '#21D19F' : trend === 'down' ? '#EF4444' : '#7B82A0'
        }}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {sub}
        </p>
      )}
    </div>
  )
}
