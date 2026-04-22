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
    <div className="min-h-screen" style={{ background: '#080B14' }}>
      <div className="bg-grid" />

      {/* Creator accent orbs */}
      <div
        className="fixed pointer-events-none"
        style={{
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          top: '-200px',
          right: '-100px',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)',
          bottom: '-100px',
          left: '-100px',
          filter: 'blur(60px)',
        }}
      />

      <div className="page-content">
        {/* Header */}
        <header
          className="px-6 py-4 sticky top-0 z-10"
          style={{
            background: 'rgba(8,11,20,0.85)',
            borderBottom: '1px solid rgba(139,92,246,0.12)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))',
                  border: '1px solid rgba(139,92,246,0.35)',
                  color: '#A78BFA',
                }}
              >
                UGC
              </div>
              <div>
                <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>
                  {creator.name}
                </p>
                <p className="text-xs" style={{ color: '#484D6D' }}>
                  Creating for {client?.name || creator.clientId}
                </p>
              </div>
            </div>

            <Link
              href="/logout"
              className="px-4 py-1.5 rounded-lg text-xs font-bold"
              style={{ color: '#484D6D', border: '1px solid transparent' }}
            >
              Sign out
            </Link>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#A78BFA' }}>
              — Creator Portal
            </p>
            <h1 className="text-4xl font-black tracking-tight mb-2" style={{ color: '#E8ECFF' }}>
              Your Content Hub
            </h1>
            <p className="text-base" style={{ color: '#7B82A0' }}>
              See exactly how your videos are performing, what's making money, and what to make next.
            </p>
          </div>

          <CreatorDashboard
            creatorId={session.creatorId!}
            creatorName={creator.name}
            clientName={client?.name || creator.clientId}
            clientColor={client?.color || '#A78BFA'}
            clientWebsite={client?.website || ''}
            ratePerVideo={creator.ratePerVideo}
            bonusPerPurchase={creator.bonusPerPurchase}
            niche={creator.niche}
          />
        </main>
      </div>
    </div>
  )
}
