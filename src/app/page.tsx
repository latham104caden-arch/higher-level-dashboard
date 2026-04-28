'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)

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
    if (!res.ok) { setError('Access denied. Invalid credentials.'); return }
    if (data.role === 'agency') window.location.href = '/dashboard'
    else if (data.role === 'creator') window.location.href = '/creator/dashboard'
    else if (data.role === 'demo') window.location.href = '/demo/dashboard'
    else window.location.href = '/client'
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#0B0C0F' }}
    >
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="card p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-12 h-12 rounded-md flex items-center justify-center font-semibold text-base mb-4"
              style={{
                background: 'rgba(94,106,210,0.12)',
                border: '1px solid rgba(94,106,210,0.25)',
                color: '#5E6AD2',
              }}
            >
              HL
            </div>
            <h1 className="font-serif italic text-3xl tracking-tight mb-1" style={{ color: '#F4F5F8' }}>
              Higher Level
            </h1>
            <p className="text-sm" style={{ color: '#8A8F98' }}>
              Campaign Intelligence Platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#8A8F98' }}>
                Access Code
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="••••••••••••"
                required
                className="w-full px-4 py-2.5 rounded-md text-sm transition-colors outline-none"
                style={{
                  background: '#1A1B20',
                  border: `1px solid ${focused ? 'rgba(94,106,210,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: '#F4F5F8',
                }}
              />
            </div>

            {error && (
              <div
                className="rounded-md px-3 py-2 text-sm text-center font-medium"
                style={{
                  background: 'rgba(245,158,11,0.06)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  color: '#F59E0B',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
              style={{ background: '#5E6AD2', color: '#F4F5F8' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin inline-block"
                    style={{ borderColor: 'rgba(244,245,248,0.3)', borderTopColor: '#F4F5F8' }}
                  />
                  Authenticating
                </span>
              ) : (
                'Access Dashboard →'
              )}
            </button>
          </form>

          <p className="text-center text-xs mt-8" style={{ color: '#5C606C' }}>
            Higher Level Agency · Confidential Access Only
          </p>
          <p className="text-center text-xs mt-2" style={{ color: '#5C606C' }}>
            UGC Creator?{' '}
            <a href="/creator" style={{ color: '#8A8F98', textDecoration: 'underline' }}>
              Creator portal →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
