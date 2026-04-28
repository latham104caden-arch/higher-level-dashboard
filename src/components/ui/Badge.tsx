export function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium"
      style={{ backgroundColor: color + '14', color, border: `1px solid ${color}28` }}
    >
      {label}
    </span>
  )
}
