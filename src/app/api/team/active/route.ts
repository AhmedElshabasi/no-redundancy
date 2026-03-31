import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { teamId?: string }
    const teamId = body.teamId?.trim()
    if (!teamId) {
      return NextResponse.json({ error: 'teamId required' }, { status: 400 })
    }
    const cookieStore = await cookies()
    cookieStore.set('nr-team-id', teamId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 400,
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
}
