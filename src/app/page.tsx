'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError('Incorrect password. Try again.')
      return
    }
    if (data.role === 'agency') {
      router.push('/dashboard')
    } else {
      router.push('/client')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0E1A' }}>
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#6366F1' }}>
              <span className="text-white font-bold text-sm">HL</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Higher Level</span>
          </div>
          <p className="text-sm" style={{ color: '#6B7280' }}>Campaign Intelligence Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#6B7280' }}>
              Access Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:outline-none text-sm transition-colors"
              style={{ background: '#111827', border: '1px solid #1F2937' }}
              onFocus={e => (e.target.style.borderColor = '#6366F1')}
              onBlur={e => (e.target.style.borderColor = '#1F2937')}
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold rounded-lg text-white text-sm transition-opacity disabled:opacity-50"
            style={{ background: '#6366F1' }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className="text-center text-xs mt-8" style={{ color: '#374151' }}>
          Higher Level Agency · Confidential
        </p>
      </div>
    </div>
  )
}
