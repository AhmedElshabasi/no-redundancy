import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareSupabaseClient } from './src/middlewareAuth'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createMiddlewareSupabaseClient(req, res)

  const pathname = req.nextUrl.pathname
  const isProtected = pathname.startsWith('/send') || pathname.startsWith('/receive')

  // If Supabase isn't configured yet, force users to the login screen.
  if (isProtected && !supabase) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('missing_env', '1')
    return NextResponse.redirect(loginUrl)
  }

  if (!supabase) return res

  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (isProtected && !user) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return res
}

export const config = {
  matcher: ['/send/:path*', '/receive/:path*'],
}

