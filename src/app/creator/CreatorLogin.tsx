'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CreatorLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
        return
      }
      if (data.role === 'creator') {
        router.push('/creator/dashboard')
      } else {
        setError('This portal is for UGC creators only.')
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold mb-2" style={{ color: '#7B82A0' }}>
          Creator Password
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter your creator password"
          autoFocus
          className="w-full px-4 py-3.5 rounded-xl text-sm font-bold outline-none transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : 'rgba(139,92,246,0.25)'}`,
            color: '#E8ECFF',
          }}
        />
        {error && (
          <p className="text-xs mt-2 font-bold" style={{ color: '#EF4444' }}>
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !password}
        className="w-full py-3.5 rounded-xl text-sm font-black transition-all"
        style={{
          background: loading || !password
            ? 'rgba(139,92,246,0.1)'
            : 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(236,72,153,0.2))',
          border: '1px solid rgba(139,92,246,0.35)',
          color: loading || !password ? '#484D6D' : '#A78BFA',
          cursor: loading || !password ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Signing in…' : 'Enter Portal →'}
      </button>
    </form>
  )
}
