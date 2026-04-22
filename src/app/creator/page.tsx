import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CreatorLogin } from './CreatorLogin'

export default async function CreatorPage() {
  const session = await getSession()
  if (session?.role === 'creator') redirect('/creator/dashboard')

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#080B14' }}
    >
      <div className="bg-grid" />

      {/* Accent orb — purple/violet for creator identity */}
      <div
        className="fixed pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          top: '-100px',
          right: '-100px',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
          bottom: '-50px',
          left: '-50px',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 w-full max-w-sm px-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))',
              border: '1px solid rgba(139,92,246,0.35)',
              color: '#A78BFA',
            }}
          >
            UGC
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-1" style={{ color: '#E8ECFF' }}>
            Creator Portal
          </h1>
          <p className="text-sm text-center" style={{ color: '#7B82A0' }}>
            Higher Level — for content creators
          </p>
        </div>

        <CreatorLogin />

        <p className="text-center text-xs mt-8" style={{ color: '#2A2D40' }}>
          Agency access?{' '}
          <a href="/" style={{ color: '#484D6D', textDecoration: 'underline' }}>
            Sign in here
          </a>
        </p>
      </div>
    </div>
  )
}
