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
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0C0F' }}>
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-md flex items-center justify-center font-semibold text-sm"
              style={{ background: 'rgba(94,106,210,0.12)', border: '1px solid rgba(94,106,210,0.25)', color: '#5E6AD2' }}
            >
              HL
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#F4F5F8' }}>Higher Level</p>
              <p className="text-xs" style={{ color: '#5C606C' }}>Client Portal</p>
            </div>
          </div>
        </div>

        <div className="card p-8 sm:p-10">
          <h1 className="font-serif italic text-3xl text-center mb-1" style={{ color: '#F4F5F8' }}>
            Client Portal
          </h1>
          <p className="text-sm text-center mb-6" style={{ color: '#8A8F98' }}>
            Sign in to view your campaign results.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#8A8F98' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="Enter your password"
                autoFocus
                className="w-full px-4 py-2.5 rounded-md text-sm font-medium outline-none transition-colors"
                style={{
                  background: '#1A1B20',
                  border: error ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  color: '#F4F5F8',
                }}
              />
              {error && (
                <p className="text-xs mt-2 font-medium" style={{ color: '#F59E0B' }}>{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-2.5 rounded-md font-medium text-sm transition-colors"
              style={{
                background: loading || !password ? '#1A1B20' : '#5E6AD2',
                color: loading || !password ? '#5C606C' : '#F4F5F8',
                cursor: loading || !password ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-xs text-center mt-6" style={{ color: '#5C606C' }}>
          Powered by Higher Level
        </p>
      </div>
    </div>
  )
}
