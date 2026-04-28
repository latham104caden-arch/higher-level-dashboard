import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  cookieStore.delete('hl_session')

  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  const proto = request.headers.get('x-forwarded-proto') ?? 'https'
  const target = host ? `${proto}://${host}/` : new URL('/', request.url).toString()

  return NextResponse.redirect(target)
}
