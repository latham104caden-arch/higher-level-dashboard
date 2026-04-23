import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import { AuditClient } from './AuditClient'
import Link from 'next/link'

export default async function ClientAuditPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'agency') redirect('/dashboard')

  const client = CLIENTS[session.clientId as keyof typeof CLIENTS]
  if (!client) redirect('/')

  const NAV = [
    { href: '/client', label: 'Overview' },
    { href: '/client/performance', label: 'Performance' },
    { href: '/client/grow', label: 'Grow' },
    { href: '/client/learn', label: 'Learn' },
    { href: '/client/audit', label: 'Site Audit' },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#080B14' }}>
      <div className="bg-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="page-content">
        <header
          className="px-6 py-4 sticky top-0 z-10"
          style={{
            background: 'rgba(8,11,20,0.85)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
                style={{ background: `linear-gradient(135deg, ${client.color}33, ${client.color}55)`, border: `1px solid ${client.color}44`, color: client.color }}
              >
                {client.name.charAt(0)}
              </div>
              <div>
                <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>{client.name}</p>
                <p className="text-xs" style={{ color: '#484D6D' }}>Campaign Portal</p>
              </div>
            </div>
            <nav className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {NAV.map(n => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={n.href === '/client/audit'
                    ? { background: 'rgba(33,209,159,0.12)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }
                    : { color: '#7B82A0', border: '1px solid transparent' }
                  }
                >
                  {n.label}
                </Link>
              ))}
              <Link href="/logout" className="px-4 py-1.5 rounded-lg text-xs font-bold ml-2" style={{ color: '#484D6D', border: '1px solid transparent' }}>
                Sign out
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-8 py-12">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#21D19F' }}>— Website Health</p>
            <h1 className="text-4xl font-black tracking-tight mb-2" style={{ color: '#E8ECFF' }}>Site Audit</h1>
            <p className="text-base" style={{ color: '#7B82A0' }}>
              A full scan of <span style={{ color: '#E8ECFF', fontWeight: 700 }}>{client.website}</span> — speed, trust signals, conversion elements, and ad readiness.
            </p>
          </div>

          <AuditClient website={client.website} clientColor={client.color} clientName={client.name} />
        </main>
      </div>
    </div>
  )
}
