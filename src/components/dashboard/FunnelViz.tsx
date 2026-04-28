interface FunnelStep {
  label: string
  value: number
  color: string
}

export function FunnelViz({ steps }: { steps: FunnelStep[] }) {
  const max = steps[0]?.value || 1

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const pct = Math.max((step.value / max) * 100, 2)
        const dropoff = i > 0 && steps[i - 1].value > 0
          ? ((1 - step.value / steps[i - 1].value) * 100).toFixed(0)
          : null

        return (
          <div key={step.label}>
            {dropoff && (
              <div className="text-xs text-center mb-1.5" style={{ color: '#5C606C' }}>
                ↓ {dropoff}% drop-off
              </div>
            )}
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-medium" style={{ color: '#F4F5F8' }}>{step.label}</p>
              <p className="text-sm font-semibold tnum" style={{ color: '#F4F5F8' }}>{step.value.toLocaleString()}</p>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: step.color }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
