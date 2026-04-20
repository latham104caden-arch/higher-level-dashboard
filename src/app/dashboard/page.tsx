import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'client') redirect('/client')

  return (
    <div className="min-h-screen" style={{ background: '#0B0D1A' }}>
      {/* Header */}
      <header style={{ background: 'rgba(20,23,40,0.9)', borderBottom: '1px solid rgba(168,174,210,0.08)', backdropFilter: 'blur(12px)' }} className="px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #21D19F, #45B69C)', color: '#0B0D1A' }}
            >
              HL
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: '#D8DDEF' }}>Higher Level</p>
              <p className="text-xs" style={{ color: '#484D6D' }}>Agency Dashboard</p>
            </div>
          </div>
          <Link href="/logout" className="text-xs transition-colors" style={{ color: '#484D6D' }}
            onMouseEnter={(e: any) => e.target.style.color = '#A0A4B8'}
            onMouseLeave={(e: any) => e.target.style.color = '#484D6D'}
          >
            Sign out
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#21D19F' }}>Agency View</p>
          <h1 className="text-3xl font-bold" style={{ color: '#D8DDEF' }}>Active Clients</h1>
          <p className="text-sm mt-1" style={{ color: '#A0A4B8' }}>Select a client to view their live campaign report</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(CLIENTS).map(client => (
            <Link key={client.id} href={`/dashboard/${client.id}`}>
              <div
                className="rounded-2xl p-6 cursor-pointer group relative overflow-hidden transition-all duration-200"
                style={{
                  background: 'rgba(20, 23, 40, 0.8)',
                  border: '1px solid rgba(168, 174, 210, 0.08)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.border = '1px solid rgba(33, 209, 159, 0.2)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(33, 209, 159, 0.08)'
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.border = '1px solid rgba(168, 174, 210, 0.08)'
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)'
                }}
              >
                {/* Background glow */}
                <div
                  className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
                  style={{ background: client.color }}
                />

                <div className="flex items-start justify-between mb-5 relative">
                  <div>
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 font-bold text-sm"
                      style={{ background: client.color, color: 'white' }}
                    >
                      {client.name.charAt(0)}
                    </div>
                    <h2 className="font-bold text-lg" style={{ color: '#D8DDEF' }}>{client.name}</h2>
                    <p className="text-sm capitalize" style={{ color: '#A0A4B8' }}>{client.type} · Meta Ads</p>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(33,209,159,0.1)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }}
                  >
                    LIVE
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs mb-5" style={{ color: '#484D6D' }}>
                  <span>{client.accountId}</span>
                </div>

                <div
                  className="flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2"
                  style={{ color: '#21D19F' }}
                >
                  View Report <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
