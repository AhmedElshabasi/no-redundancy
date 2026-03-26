"use client";

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabaseBrowser'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') || '/receive'

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setError(null)
    setBusy(true)

    try {
      if (!supabaseBrowser) {
        throw new Error('Configure Supabase env vars (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).')
      }
      if (mode === 'signup') {
        const { error: signUpError } = await supabaseBrowser.auth.signUp({
          email,
          password,
        })
        if (signUpError) throw signUpError
        // If email confirmations are disabled, user will be signed in immediately.
        router.push(nextPath)
        return
      }

      const { error: signInError } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) throw signInError
      router.push(nextPath)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Authentication failed.'
      setError(message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-row">
      <div className="auth-title">{mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}</div>
      <input
        className="auth-input"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="auth-input"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error ? <div className="error-msg">{error}</div> : null}
      <div className="auth-actions">
        <button className="generate-btn" onClick={submit} disabled={busy || !email || !password}>
          {busy ? 'PLEASE WAIT…' : mode === 'signin' ? 'SIGN IN' : 'SIGN UP'}
        </button>
        <button
          className="btn-secondary"
          onClick={() => setMode((m) => (m === 'signin' ? 'signup' : 'signin'))}
          disabled={busy}
        >
          {mode === 'signin' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}

