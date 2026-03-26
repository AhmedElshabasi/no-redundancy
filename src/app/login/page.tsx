import { redirect } from 'next/navigation'
import { supabaseServerClientOrNull } from '@/lib/supabaseServer'
import { LoginForm } from './LoginForm'
import styles from './ucalgary-login.module.css'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const supabase = supabaseServerClientOrNull()
  const user = supabase ? (await supabase.auth.getUser()).data.user : null

  if (user) redirect('/receive')

  return (
    <div className={styles.loginScreen}>
      <div className={styles.lines} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <div className={styles.logoIcon} aria-hidden="true">
            <svg viewBox="0 0 48 48" width="44" height="44" role="img" focusable="false">
              <defs>
                <linearGradient id="ucg" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#cf0722" />
                  <stop offset="1" stopColor="#f0b21f" />
                </linearGradient>
              </defs>
              <rect x="6" y="6" width="36" height="36" rx="10" fill="url(#ucg)" opacity="0.95" />
              <path
                d="M16 24c0-4.4 3.6-8 8-8 2.3 0 4.4 1 5.9 2.6l-2.1 2.1A5 5 0 0 0 24 19a5 5 0 1 0 0 10c1.7 0 3.3-.8 4.2-2.1H24v-3h9c.1.4.1.8.1 1.2 0 5.5-4 9.9-9.1 9.9C19.1 35 16 29.9 16 24Z"
                fill="#111"
                opacity="0.85"
              />
            </svg>
          </div>
          <div className={styles.logoText}>
            NoRedundancy <em>UCalgary Project Intelligence</em>
          </div>
        </div>

        <h2>Sign in</h2>
        <p>{supabase ? 'Use your UCalgary email to continue.' : 'Configure Supabase env vars to enable login.'}</p>

        <LoginForm />

        <div className={styles.footer}>
          By continuing you agree to the demo terms. This is a UI skin on top of your existing Supabase auth flow.
        </div>
      </div>
    </div>
  )
}

