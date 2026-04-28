import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CreatorLogin } from './CreatorLogin'

export default async function CreatorPage() {
  const session = await getSession()
  if (session?.role === 'creator') redirect('/creator/dashboard')

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#0B0C0F' }}
    >
      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-md flex items-center justify-center font-semibold text-base mb-4"
            style={{ background: 'rgba(94,106,210,0.12)', border: '1px solid rgba(94,106,210,0.25)', color: '#5E6AD2' }}
          >
            UGC
          </div>
          <h1 className="font-serif italic text-3xl tracking-tight mb-1" style={{ color: '#F4F5F8' }}>
            Creator Portal
          </h1>
          <p className="text-sm text-center" style={{ color: '#8A8F98' }}>
            Higher Level — for content creators
          </p>
        </div>

        <CreatorLogin />

        <p className="text-center text-xs mt-6" style={{ color: '#5C606C' }}>
          Agency access?{' '}
          <a href="/" style={{ color: '#8A8F98', textDecoration: 'underline' }}>
            Sign in here
          </a>
        </p>
      </div>
    </div>
  )
}
