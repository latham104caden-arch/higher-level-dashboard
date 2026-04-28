import Link from 'next/link'

export function ClientNav({ client, active }: { client: { name: string; color: string }; active: string }) {
  const links = [
    { href: '/client', label: 'Overview' },
    { href: '/client/performance', label: 'Performance' },
    { href: '/client/grow', label: 'Grow' },
    { href: '/client/learn', label: 'Learn' },
    { href: '/client/quiz', label: 'Quiz' },
    { href: '/client/audit', label: 'Site Audit' },
  ]
  return (
    <header
      className="px-4 py-3 sticky top-0 z-10"
      style={{
        background: 'rgba(8,11,20,0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${client.color}33, ${client.color}55)`,
                border: `1px solid ${client.color}44`,
                color: client.color,
              }}
            >
              {client.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-black text-xs leading-tight truncate" style={{ color: '#E8ECFF' }}>{client.name}</p>
              <p className="text-xs" style={{ color: '#484D6D' }}>Campaign Portal</p>
            </div>
          </div>
        </div>
        <nav
          className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            scrollbarWidth: 'none',
          }}
        >
          {links.map(n => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-shrink-0"
              style={n.label === active
                ? { background: 'rgba(33,209,159,0.12)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }
                : { color: '#7B82A0', border: '1px solid transparent' }
              }
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/logout"
            className="px-3 py-1.5 rounded-lg text-xs font-bold ml-auto flex-shrink-0"
            style={{ color: '#484D6D', border: '1px solid transparent' }}
          >
            Sign out
          </Link>
        </nav>
      </div>
    </header>
  )
}
