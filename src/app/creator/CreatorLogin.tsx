'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { creatorLogin } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3.5 rounded-xl text-sm font-black transition-all"
      style={{
        background: pending
          ? 'rgba(139,92,246,0.1)'
          : 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(236,72,153,0.2))',
        border: '1px solid rgba(139,92,246,0.35)',
        color: pending ? '#484D6D' : '#A78BFA',
        cursor: pending ? 'not-allowed' : 'pointer',
      }}
    >
      {pending ? 'Signing in…' : 'Enter Portal →'}
    </button>
  )
}

export function CreatorLogin() {
  const [state, action] = useFormState(creatorLogin, { error: '' })

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-xs font-bold mb-2" style={{ color: '#7B82A0' }}>
          Creator Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Enter your creator password"
          autoFocus
          className="w-full px-4 py-3.5 rounded-xl text-sm font-bold outline-none transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${state.error ? 'rgba(239,68,68,0.4)' : 'rgba(139,92,246,0.25)'}`,
            color: '#E8ECFF',
          }}
        />
        {state.error && (
          <p className="text-xs mt-2 font-bold" style={{ color: '#EF4444' }}>
            {state.error}
          </p>
        )}
      </div>

      <SubmitButton />
    </form>
  )
}
