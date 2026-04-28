import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CREATORS } from '@/lib/creators'
import { CLIENTS } from '@/lib/clients'
import Link from 'next/link'
import { CreatorDashboard } from './CreatorDashboard'

export default async function CreatorDashboardPage() {
  const session = await getSession()
  if (!session) redirect('/creator')
  if (session.role !== 'creator') redirect('/creator')

  const creator = CREATORS[session.creatorId!]
  if (!creator) redirect('/creator')

  const client = CLIENTS[creator.clientId as keyof typeof CLIENTS]

  return (
    <div className="min-h-screen" style={{ background: '#0B0C0F' }}>
      <header
        className="px-6 py-4 sticky top-0 z-10"
        style={{ background: '#0B0C0F', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center font-medium text-xs"
              style={{ background: 'rgba(94,106,210,0.12)', border: '1px solid rgba(94,106,210,0.25)', color: '#5E6AD2' }}
            >
              UGC
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#F4F5F8' }}>
                {creator.name}
              </p>
              <p className="text-xs" style={{ color: '#5C606C' }}>
                Creating for {client?.name || creator.clientId}
              </p>
            </div>
          </div>

          <Link prefetch={false} href="/logout" className="px-3 py-1.5 rounded-md text-sm font-medium" style={{ color: '#5C606C' }}>
            Sign out
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 sm:py-14">
        <div className="mb-10">
          <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Creator Portal</p>
          <h1 className="font-serif italic text-3xl sm:text-4xl tracking-tight mb-2" style={{ color: '#F4F5F8' }}>
            Your Content Hub
          </h1>
          <p className="text-base" style={{ color: '#8A8F98' }}>
            See exactly how your videos are performing, what's making money, and what to make next.
          </p>
        </div>

        <CreatorDashboard
          creatorId={session.creatorId!}
          creatorName={creator.name}
          clientName={client?.name || creator.clientId}
          clientColor={client?.color || '#5E6AD2'}
          clientWebsite={client?.website || ''}
          ratePerVideo={creator.ratePerVideo}
          bonusPerPurchase={creator.bonusPerPurchase}
          niche={creator.niche}
        />
      </main>
    </div>
  )
}
