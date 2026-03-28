import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { supabaseServerClientOrNull } from '@/lib/supabaseServer'
import { PlatformAuthClient } from './PlatformAuthClient'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const supabase = supabaseServerClientOrNull()
  const user = supabase ? (await supabase.auth.getUser()).data.user : null

  if (user) redirect('/receive')

  return (
    <Suspense
      fallback={
        <div id="screen-login" className="screen active" aria-hidden style={{ background: 'var(--ink)' }} />
      }
    >
      <PlatformAuthClient supabaseConfigured={Boolean(supabase)} />
    </Suspense>
  )
}
