import { redirect } from 'next/navigation'
import { supabaseServerClientOrNull } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = supabaseServerClientOrNull()
  if (!supabase) redirect('/login?missing_env=1')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  redirect(user ? '/receive' : '/login')
}
