'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const [show, setShow] = useState(false)

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
            <Image
              src="/logo.png"
              alt="Higher Level"
              width={420}
              height={96}
              priority
              className="w-full max-w-xs h-auto mb-5"
            />
            <p className="text-sm" style={{ color: '#8A8F98' }}>
              Campaign Intelligence Platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#8A8F98' }}>
                Access Code
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-4 pr-11 py-2.5 rounded-md text-sm transition-colors outline-none"
                  style={{
                    background: '#1A1B20',
                    border: `1px solid ${focused ? 'rgba(94,106,210,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    color: '#F4F5F8',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded flex items-center justify-center transition-colors"
                  style={{ color: show ? '#F4F5F8' : '#8A8F98' }}
                >
                  {show ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
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
