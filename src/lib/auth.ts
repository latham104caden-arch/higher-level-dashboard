import { cookies } from 'next/headers'
import { CLIENTS } from './clients'

export type Session = {
  role: 'agency' | 'client'
  clientId?: string
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('hl_session')?.value
  if (!token) return null
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    return JSON.parse(decoded) as Session
  } catch {
    return null
  }
}

export function createSessionToken(session: Session): string {
  return Buffer.from(JSON.stringify(session)).toString('base64')
}

export function validateLogin(password: string): Session | null {
  if (password === (process.env.AGENCY_PASSWORD || 'HigherLevel2026')) {
    return { role: 'agency' }
  }
  for (const [id, client] of Object.entries(CLIENTS)) {
    if (password === client.password) {
      return { role: 'client', clientId: id }
    }
  }
  return null
}
