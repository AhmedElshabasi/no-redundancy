"use client";

import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseBrowser'

export function TopNav({ userEmail }: { userEmail: string | null }) {
  const [busy, setBusy] = useState(false)

  const signOut = async () => {
    try {
      setBusy(true)
      if (!supabaseBrowser) return
      await supabaseBrowser.auth.signOut()
      // Refresh so the server-side redirects kick in.
      window.location.href = '/login'
    } finally {
      setBusy(false)
    }
  }

  return (
    <nav>
      <div className="logo">
        FILR<span>.io</span>
      </div>
      <div className="nav-tag">DEMO · SIGN IN TO UPLOAD</div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {userEmail ? (
          <>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
              {userEmail}
            </div>
            <button className="btn-secondary" onClick={signOut} disabled={busy} style={{ width: 'auto' }}>
              {busy ? 'SIGNING OUT…' : 'SIGN OUT'}
            </button>
          </>
        ) : null}
      </div>
    </nav>
  )
}

