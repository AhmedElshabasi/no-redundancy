import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

function envOk() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export function supabaseServerClientOrNull() {
  if (!envOk()) return null

  // envOk() ensures these exist, but TS can't narrow automatically.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: async () => {
        const cookieStore = await cookies()
        return cookieStore.getAll().map((c) => ({ name: c.name, value: c.value }))
      },
    },
  })
}

export function supabaseServerClient() {
  const client = supabaseServerClientOrNull()
  if (!client) {
    throw new Error('Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).')
  }
  return client
}

