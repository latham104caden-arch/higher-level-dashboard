'use client'

import { useState } from 'react'

export function CreatorLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your creator password"
          autoFocus
          required
          className="w-full px-4 py-2.5 rounded-md text-sm font-medium outline-none transition-colors"
          style={{
            background: '#1A1B20',
            border: `1px solid ${error ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}`,
            color: '#F4F5F8',
          }}
        />
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
