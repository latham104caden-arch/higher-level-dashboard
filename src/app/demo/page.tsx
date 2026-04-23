'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DemoLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      if (password === 'Preview2026') {
        router.push('/demo/dashboard')
      } else {
        setError('Incorrect password. Try again.')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#080B14' }}>
      <div className="bg-grid" />

      {/* Orbs */}
      <div
        className="fixed pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)',
          top: '-150px',
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
          background: 'radial-gradient(circle, rgba(33,209,159,0.06) 0%, transparent 70%)',
          bottom: '-100px',
          left: '-100px',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Agency Badge */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.15))',
                border: '1px solid rgba(251,191,36,0.35)',
                color: '#FCD34D',
              }}
            >
              HL
            </div>
            <div>
              <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>Higher Level</p>
              <p className="text-xs" style={{ color: '#484D6D' }}>Client Portal</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-10 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(30px)',
          }}
        >
          <div
            className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl opacity-10"
            style={{ background: '#F59E0B' }}
          />

          <h1 className="text-2xl font-black tracking-tight text-center mb-1.5" style={{ color: '#E8ECFF' }}>
            Client Portal
          </h1>
          <p className="text-sm text-center mb-8" style={{ color: '#7B82A0' }}>
            Sign in to view your campaign results.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#484D6D' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="Enter your password"
                autoFocus
                className="w-full px-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  color: '#E8ECFF',
                }}
              />
              {error && (
                <p className="text-xs mt-2 font-medium" style={{ color: '#EF4444' }}>{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all duration-200"
              style={{
                background: loading || !password
                  ? 'rgba(255,255,255,0.06)'
                  : 'linear-gradient(135deg, #F59E0B, #FCD34D)',
                color: loading || !password ? '#484D6D' : '#0A0600',
                cursor: loading || !password ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-xs text-center mt-6" style={{ color: '#2A2F4A' }}>
          Powered by Higher Level
        </p>
      </div>
    </div>
  )
}
