'use client'

import { useState } from 'react'

export function CreatorLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError('Wrong password. Check with Higher Level.')
        setLoading(false)
        return
      }
      if (data.role !== 'creator') {
        setError('This portal is for UGC creators only.')
        setLoading(false)
        return
      }
      window.location.href = '/creator/dashboard'
    } catch {
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: '#8A8F98' }}>
          Creator Password
        </label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your creator password"
            autoFocus
            required
            className="w-full pl-4 pr-11 py-2.5 rounded-md text-sm font-medium outline-none transition-colors"
            style={{
              background: '#1A1B20',
              border: `1px solid ${error ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}`,
              color: '#F4F5F8',
            }}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
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
        {error && (
          <p className="text-xs mt-2 font-medium" style={{ color: '#F59E0B' }}>
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-md text-sm font-medium transition-colors"
        style={{
          background: loading ? '#1A1B20' : '#5E6AD2',
          color: loading ? '#5C606C' : '#F4F5F8',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Signing in…' : 'Enter Portal →'}
      </button>
    </form>
  )
}
