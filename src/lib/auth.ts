import { cookies } from 'next/headers'
import { CLIENTS } from './clients'
import { CREATORS } from './creators'

export type Session = {
  role: 'agency' | 'client' | 'creator' | 'demo'
  clientId?: string
  creatorId?: string
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
  const agencyPasswords = [
    process.env.AGENCY_PASSWORD,
    'cadenlatham',
    'hunterlatham',
  ].filter(Boolean) as string[]
  if (agencyPasswords.includes(password)) {
    return { role: 'agency' }
  }
  if (password === (process.env.DEMO_PASSWORD || 'Preview2026')) {
    return { role: 'demo' }
  }
  for (const [id, client] of Object.entries(CLIENTS)) {
    if (password === client.password) {
      return { role: 'client', clientId: id }
    }
  }
  for (const [id, creator] of Object.entries(CREATORS)) {
    if (password === creator.password) {
      return { role: 'creator', creatorId: id }
    }
  }
  return null
}
