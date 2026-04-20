interface FunnelStep {
  label: string
  value: number
  color: string
}

export function FunnelViz({ steps }: { steps: FunnelStep[] }) {
  const max = steps[0]?.value || 1

  return (
    <div className="space-y-2">
      {steps.map((step, i) => {
        const pct = Math.max((step.value / max) * 100, 2)
        const dropoff = i > 0 && steps[i - 1].value > 0
          ? ((1 - step.value / steps[i - 1].value) * 100).toFixed(0)
          : null

        return (
          <div key={step.label}>
            {dropoff && (
              <div className="text-xs text-red-400 text-center mb-1">
                ↓ {dropoff}% drop-off
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-28 text-right text-xs font-medium text-gray-500 shrink-0">{step.label}</div>
              <div className="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden">
                <div
                  className="h-full rounded-full flex items-center px-3 transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: step.color }}
                >
                  <span className="text-white text-xs font-bold whitespace-nowrap">
                    {step.value.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
