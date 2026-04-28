'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { creatorLogin } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2.5 rounded-md text-sm font-medium transition-colors"
      style={{
        background: pending ? '#1A1B20' : '#5E6AD2',
        color: pending ? '#5C606C' : '#F4F5F8',
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
        <label className="block text-xs font-medium mb-2" style={{ color: '#8A8F98' }}>
          Creator Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Enter your creator password"
          autoFocus
          className="w-full px-4 py-2.5 rounded-md text-sm font-medium outline-none transition-colors"
          style={{
            background: '#1A1B20',
            border: `1px solid ${state.error ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}`,
            color: '#F4F5F8',
          }}
        />
        {state.error && (
          <p className="text-xs mt-2 font-medium" style={{ color: '#F59E0B' }}>
            {state.error}
          </p>
        )}
      </div>

      <SubmitButton />
    </form>
  )
}
