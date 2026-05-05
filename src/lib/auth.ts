import { cookies } from 'next/headers'
import { CLIENTS } from './clients'
import { CREATORS } from './creators'

export type AgencyUserId = 'caden' | 'hunter'

export type Session = {
  role: 'agency' | 'client' | 'creator' | 'demo'
  clientId?: string
  creatorId?: string
  userId?: AgencyUserId
}

export const AGENCY_USERS: Record<AgencyUserId, { name: string }> = {
  caden: { name: 'Caden' },
  hunter: { name: 'Hunter' },
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
  if (password === 'cadenlatham') {
    return { role: 'agency', userId: 'caden' }
  }
  if (password === 'hunterlatham') {
    return { role: 'agency', userId: 'hunter' }
  }
  if (process.env.AGENCY_PASSWORD && password === process.env.AGENCY_PASSWORD) {
    return { role: 'agency', userId: 'caden' }
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
