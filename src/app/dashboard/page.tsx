import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import Link from 'next/link'
import { ClientCards } from './ClientCards'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'client') redirect('/client')

  return (
    <div className="min-h-screen" style={{ background: '#0B0D1A' }}>
      {/* Header */}
      <header
        className="px-6 py-4 sticky top-0 z-10"
        style={{
          background: 'rgba(20,23,40,0.9)',
          borderBottom: '1px solid rgba(168,174,210,0.08)',
          backdropFilter: 'blur(12px)',
        }}
      >
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
          <Link href="/logout" className="text-xs transition-colors" style={{ color: '#484D6D' }}>
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

        <ClientCards clients={Object.values(CLIENTS)} />
      </main>
    </div>
  )
}
