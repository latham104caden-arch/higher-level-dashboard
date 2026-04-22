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
    window.location.href = data.role === 'agency' ? '/dashboard' : '/client'
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#080B14' }}
    >
      {/* Background grid */}
      <div className="bg-grid" />

      {/* Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Ghost text */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-100">
        <span className="ghost-text" style={{ fontSize: '38vw', letterSpacing: '-0.06em' }}>HL</span>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div
          className="rounded-3xl p-10 glass-accent"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl mb-5"
              style={{
                background: 'linear-gradient(135deg, rgba(33,209,159,0.2), rgba(69,182,156,0.1))',
                border: '1px solid rgba(33,209,159,0.3)',
                color: '#21D19F',
                boxShadow: '0 0 40px rgba(33,209,159,0.15)',
              }}
            >
              HL
            </div>
            <h1 className="font-black text-2xl tracking-tight mb-1" style={{ color: '#E8ECFF' }}>
              Higher Level
            </h1>
            <p className="text-sm" style={{ color: '#484D6D' }}>
              Campaign Intelligence Platform
            </p>
          </div>

          {/* Divider */}
          <div
            className="h-px mb-8"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(33,209,159,0.3), transparent)' }}
          />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2.5"
                style={{ color: '#7B82A0' }}
              >
                Access Code
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-5 py-4 rounded-xl text-sm transition-all duration-200 outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${focused ? 'rgba(33,209,159,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    color: '#E8ECFF',
                    boxShadow: focused ? '0 0 0 3px rgba(33,209,159,0.08)' : 'none',
                  }}
                />
                {/* Lock icon */}
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: focused ? '#21D19F' : '#484D6D' }}
                >
                  🔒
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm text-center font-medium"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#EF4444',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-black text-sm tracking-wider transition-all duration-200 disabled:opacity-50"
              style={{
                background: loading
                  ? 'rgba(33,209,159,0.3)'
                  : 'linear-gradient(135deg, #21D19F, #45B69C)',
                color: '#080B14',
                boxShadow: loading ? 'none' : '0 0 30px rgba(33,209,159,0.3), 0 8px 24px rgba(0,0,0,0.3)',
                letterSpacing: '0.08em',
              }}
              onMouseEnter={e => {
                if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin inline-block"
                    style={{ borderColor: 'rgba(8,11,20,0.4)', borderTopColor: '#080B14' }}
                  />
                  AUTHENTICATING
                </span>
              ) : (
                'ACCESS DASHBOARD →'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs mt-8" style={{ color: '#484D6D' }}>
            Higher Level Agency · Confidential Access Only
          </p>
        </div>
      </div>
    </div>
  )
}
