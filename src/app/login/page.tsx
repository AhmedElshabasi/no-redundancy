import { redirect } from 'next/navigation'
import { supabaseServerClientOrNull } from '@/lib/supabaseServer'
import { LoginForm } from './LoginForm'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const supabase = supabaseServerClientOrNull()
  const user = supabase ? (await supabase.auth.getUser()).data.user : null

  if (user) redirect('/receive')

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">FILR DEMO</div>
        <div style={{ marginBottom: 10, color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 12 }}>
          {supabase ? 'Sign in to upload and browse.' : 'Configure Supabase env vars to enable login/upload.'}
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

