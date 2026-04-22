'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { validateLogin, createSessionToken } from '@/lib/auth'

export async function creatorLogin(
  _prevState: { error: string },
  formData: FormData,
) {
  const password = (formData.get('password') as string) || ''
  const session = validateLogin(password)

  if (!session) return { error: 'Wrong password. Check with Higher Level.' }
  if (session.role !== 'creator') return { error: 'This portal is for UGC creators only.' }

  const token = createSessionToken(session)
  const cookieStore = await cookies()
  cookieStore.set('hl_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  redirect('/creator/dashboard')
}
