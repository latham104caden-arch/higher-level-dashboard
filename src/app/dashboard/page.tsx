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
    <div className="min-h-screen" style={{ background: '#0B0C0F' }}>
      <header
        className="px-6 py-4 sticky top-0 z-10"
        style={{ background: '#0B0C0F', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center font-semibold text-xs"
              style={{
                background: 'rgba(94,106,210,0.12)',
                border: '1px solid rgba(94,106,210,0.25)',
                color: '#5E6AD2',
              }}
            >
              HL
            </div>
            <div>
              <p className="font-semibold text-sm tracking-tight" style={{ color: '#F4F5F8' }}>Higher Level</p>
              <p className="text-xs" style={{ color: '#5C606C' }}>Agency Dashboard</p>
            </div>
          </div>
          <nav className="flex items-center gap-0">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              style={{ background: 'rgba(94,106,210,0.12)', color: '#F4F5F8' }}
            >
              Clients
            </Link>
            <Link href="/dashboard/audit" className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors" style={{ color: '#8A8F98' }}>
              Site Audit
            </Link>
            <Link href="/dashboard/library" className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors" style={{ color: '#8A8F98' }}>
              Ad Library
            </Link>
            <Link href="/dashboard/onboarding" className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors" style={{ color: '#8A8F98' }}>
              Onboarding
            </Link>
            <Link href="/logout" className="px-3 py-1.5 rounded-md text-sm font-medium ml-2" style={{ color: '#5C606C' }}>
              Sign out
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 sm:py-14">
        <div className="mb-12">
          <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Agency View</p>
          <h1 className="font-serif italic text-4xl sm:text-5xl tracking-tight mb-3" style={{ color: '#F4F5F8' }}>
            Active Clients
          </h1>
          <p className="text-base" style={{ color: '#8A8F98' }}>
            Select a client to view their live campaign intelligence
          </p>
        </div>

        <ClientCards clients={Object.values(CLIENTS)} />
        <UpcomingCampaigns />
        <MiniGame />
      </main>
    </div>
  )
}
