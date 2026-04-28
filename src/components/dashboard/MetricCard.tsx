interface MetricCardProps {
  label: string
  value: string
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  alert?: boolean
}

export function MetricCard({ label, value, sub, trend, alert }: MetricCardProps) {
  const valueColor = alert ? '#F59E0B' : '#F4F5F8'
  const trendColor = trend === 'up' ? '#21D19F' : trend === 'down' ? '#F59E0B' : '#8A8F98'
  return (
    <div className="p-5" style={{ background: '#15161A' }}>
      <p className="text-xs font-medium mb-2" style={{ color: '#5C606C' }}>
        {label}
      </p>
      <p className="text-2xl font-semibold tracking-tight tnum" style={{ color: valueColor }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-1.5 font-medium" style={{ color: trendColor }}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {sub}
        </p>
      )}
    </div>
  )
}
