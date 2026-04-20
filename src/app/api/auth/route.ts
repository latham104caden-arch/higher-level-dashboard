import { NextRequest, NextResponse } from 'next/server'
import { validateLogin, createSessionToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const session = validateLogin(password)

  if (!session) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = createSessionToken(session)
  const res = NextResponse.json({ ok: true, role: session.role, clientId: session.clientId })
  res.cookies.set('hl_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return res
}
