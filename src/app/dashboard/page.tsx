import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CLIENTS } from '@/lib/clients'
import Link from 'next/link'
import { ClientCards } from './ClientCards'
import { MiniGame } from './MiniGame'
import { UpcomingCampaigns } from './UpcomingCampaigns'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'client') redirect('/client')

  return (
    <div className="min-h-screen" style={{ background: '#080B14' }}>
      {/* Background layers */}
      <div className="bg-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Ghost text background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-end pr-12 opacity-100">
        <span className="ghost-text" style={{ fontSize: '22vw' }}>HL</span>
      </div>

      <div className="page-content">
        {/* Header */}
        <header
          className="px-6 py-4 sticky top-0 z-10"
          style={{
            background: 'rgba(8,11,20,0.8)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
                style={{
                  background: 'linear-gradient(135deg, #21D19F22, #21D19F44)',
                  border: '1px solid rgba(33,209,159,0.3)',
                  color: '#21D19F',
                }}
              >
                HL
              </div>
              <div>
                <p className="font-black text-sm tracking-tight" style={{ color: '#E8ECFF' }}>Higher Level</p>
                <p className="text-xs" style={{ color: '#484D6D' }}>Agency Dashboard</p>
              </div>
            </div>
            <nav className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Link
                href="/dashboard"
                className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{ background: 'rgba(33,209,159,0.12)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }}
              >
                Clients
              </Link>
              <Link href="/dashboard/audit" className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all" style={{ color: '#7B82A0', border: '1px solid transparent' }}>
                Site Audit
              </Link>
              <Link href="/dashboard/library" className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all" style={{ color: '#7B82A0', border: '1px solid transparent' }}>
                Ad Library
              </Link>
              <Link href="/logout" className="px-4 py-1.5 rounded-lg text-xs font-bold ml-2" style={{ color: '#484D6D', border: '1px solid transparent' }}>
                Sign out
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-14">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#21D19F' }}>
              — Agency View
            </p>
            <h1 className="text-5xl font-black tracking-tight mb-3" style={{ color: '#E8ECFF' }}>
              Active Clients
            </h1>
            <p className="text-base" style={{ color: '#7B82A0' }}>
              Select a client to view their live campaign intelligence
            </p>
          </div>

          <ClientCards clients={Object.values(CLIENTS)} />
          <UpcomingCampaigns />
          <MiniGame />
        </main>
      </div>
    </div>
  )
}
