import { supabaseServerClient } from '@/lib/supabaseServer'
import Link from 'next/link'

type UploadFile = {
  id: string
  original_name: string
  mime: string | null
  size: number | null
  storage_path: string
}

type UploadRow = {
  id: string
  uploader_email: string | null
  note: string | null
  created_at: string | null
  upload_files: UploadFile[] | null
}

function ext(name: string) {
  const parts = name.split('.')
  return parts.length > 1 ? parts.pop()!.slice(0, 5).toUpperCase() : 'FILE'
}

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  if (b < 1073741824) return `${(b / 1048576).toFixed(1)} MB`
  return `${(b / 1073741824).toFixed(2)} GB`
}

export default async function ReceivePage() {
  const supabase = supabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected layout should already ensure auth; this is just extra safety.
  if (!user) return null

  const { data: uploads, error } = await supabase
    .from('uploads')
    .select(
      `
        id,
        uploader_email,
        note,
        created_at,
        upload_files(
          id,
          original_name,
          mime,
          size,
          storage_path
        )
      `,
    )
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <main>
        <div className="error-msg">{error.message}</div>
      </main>
    )
  }

  return (
    <main>
      <div className="hero">
        <h1>
          Receive.<em>Browse.</em>
        </h1>
        <p>All uploads from all users (demo). Downloads are shown only after you sign in.</p>
      </div>

      <div className="tabs">
        <Link className="tab-btn" href="/send">
          ↑ SEND
        </Link>
        <Link className="tab-btn active" href="/receive">
          ↓ RECEIVE
        </Link>
      </div>

      <div className="receive-panel">
        <div className="receive-header">Uploads</div>
        <div className="receive-body">
          {(!uploads || uploads.length === 0) && (
            <div className="error-msg" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
              No uploads yet.
            </div>
          )}

          {uploads && uploads.length > 0 ? (
            <div className="download-list">
              {(uploads as UploadRow[]).map((u) => (
                <div key={u.id} className="upload-card">
                  <div className="upload-meta">
                    <div className="who">Uploaded by {u.uploader_email || 'unknown'}</div>
                    <div className="when">
                      {u.created_at ? new Date(u.created_at).toLocaleString() : ''}
                    </div>
                  </div>
                  {u.note ? (
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
                      Note: {u.note}
                    </div>
                  ) : null}
                  <div className="upload-files">
                    {(u.upload_files || []).map((f) => {
                      const publicUrl = supabase.storage
                        .from('uploads')
                        .getPublicUrl(f.storage_path).data.publicUrl
                      return (
                        <div key={f.id} className="download-row">
                          <div className="left">
                            <div className="name">{f.original_name}</div>
                            <div className="sub">
                              {ext(f.original_name)} · {fmtSize(typeof f.size === 'number' ? f.size : 0)}
                            </div>
                          </div>
                          <a className="dl-btn" href={publicUrl} download={f.original_name}>
                            DOWNLOAD
                          </a>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}

