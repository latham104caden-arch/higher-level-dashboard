export function Badge({ label, color }: { label: string; color: string }) {
  const bg = color + '18'
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide"
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  )
}
