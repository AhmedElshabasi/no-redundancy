'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUploadsWorkspace } from '@/contexts/UploadsWorkspaceContext'
import { supabaseBrowser } from '@/lib/supabaseBrowser'
import type { UploadNoteRow, UploadPackageRow } from '@/types/uploadWorkspace'

function ext(name: string) {
  const parts = name.split('.')
  return parts.length > 1 ? parts.pop()!.slice(0, 4).toUpperCase() : 'FILE'
}

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  if (b < 1073741824) return `${(b / 1048576).toFixed(1)} MB`
  return `${(b / 1073741824).toFixed(2)} GB`
}

function formatWhen(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatNoteTime(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function initialsFromEmail(email: string | null): string {
  if (!email) return '·'
  const local = email.split('@')[0] || ''
  const parts = local.split(/[._-]+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  if (local.length >= 2) return local.slice(0, 2).toUpperCase()
  return (local[0] || '?').toUpperCase() + (local[1] || '?').toUpperCase()
}

function displayNameFromEmail(email: string | null): string {
  if (!email) return 'Unknown'
  const local = email.split('@')[0] || ''
  const parts = local.split(/[._-]+/).filter(Boolean)
  if (parts.length >= 2) {
    return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ')
  }
  return local || email
}

function packageSummary(u: UploadPackageRow) {
  const files = u.upload_files || []
  const total = files.reduce((s, f) => s + (typeof f.size === 'number' ? f.size : 0), 0)
  const primary = files[0]?.original_name ?? 'Upload'
  const meta =
    files.length === 0
      ? 'No files'
      : `${files.length} file${files.length === 1 ? '' : 's'} • ${fmtSize(total)}`
  const badge = files[0] ? ext(files[0].original_name) : '…'
  return { primary, meta, badge }
}

function sortNotesDesc(notes: UploadNoteRow[] | null | undefined): UploadNoteRow[] {
  const list = [...(notes || [])]
  list.sort((a, b) => {
    const ta = a.created_at ? new Date(a.created_at).getTime() : 0
    const tb = b.created_at ? new Date(b.created_at).getTime() : 0
    return tb - ta
  })
  return list
}

export function RecentTransfersPanel() {
  const router = useRouter()
  const { initialUploads, loadError } = useUploadsWorkspace()
  const [addNoteFor, setAddNoteFor] = useState<UploadPackageRow | null>(null)
  const [newNoteBody, setNewNoteBody] = useState('')
  const [noteBusy, setNoteBusy] = useState(false)
  const [noteError, setNoteError] = useState<string | null>(null)

  useEffect(() => {
    if (!addNoteFor) {
      setNewNoteBody('')
      setNoteError(null)
    }
  }, [addNoteFor])

  const copyFirstLink = useCallback(async (u: UploadPackageRow) => {
    const path = u.upload_files?.[0]?.storage_path
    if (!path || !supabaseBrowser) return
    const { data, error } = await supabaseBrowser.storage.from('uploads').createSignedUrl(path, 3600)
    if (error || !data?.signedUrl || !navigator.clipboard) return
    void navigator.clipboard.writeText(data.signedUrl)
  }, [])

  const submitNewNote = useCallback(async () => {
    if (!addNoteFor || !supabaseBrowser) return
    const body = newNoteBody.trim()
    if (!body) {
      setNoteError('Write something before posting.')
      return
    }
    setNoteError(null)
    setNoteBusy(true)
    try {
      const { error } = await supabaseBrowser.from('upload_notes').insert({
        upload_id: addNoteFor.id,
        body,
      })
      if (error) throw error
      setNewNoteBody('')
      router.refresh()
    } catch (e: unknown) {
      setNoteError(e instanceof Error ? e.message : 'Could not add note.')
    } finally {
      setNoteBusy(false)
    }
  }, [addNoteFor, newNoteBody, router])

  const dialogNotes = useMemo(
    () => (addNoteFor ? sortNotesDesc(addNoteFor.upload_notes) : []),
    [addNoteFor],
  )

  return (
    <div className="recent-transfers-page">
      {addNoteFor ? (
        <div
          className="confirm-overlay"
          role="presentation"
          onClick={() => !noteBusy && setAddNoteFor(null)}
        >
          <div
            className="confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-note-dialog-title"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 440 }}
          >
            <h2 id="add-note-dialog-title" className="confirm-dialog-title">
              Add a note
            </h2>
            <p className="confirm-dialog-body" style={{ marginBottom: 12 }}>
              Leave a message for <strong>{displayNameFromEmail(addNoteFor.uploader_email)}</strong> about this
              upload. Other members of this team can see notes.
            </p>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--muted)' }}>
                Upload note (when they shared it)
              </div>
              <div className="rt-upload-note rt-upload-note--dialog">
                {addNoteFor.note?.trim() ? addNoteFor.note : '—'}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--muted)' }}>
                Notes from others
              </div>
              {dialogNotes.length === 0 ? (
                <p className="confirm-dialog-body" style={{ margin: 0, opacity: 0.85 }}>
                  No notes yet.
                </p>
              ) : (
                <ul className="rt-note-thread">
                  {dialogNotes.map((n) => (
                    <li key={n.id} className="rt-note-item">
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>
                        {(n.author_email ?? 'Someone') + ' · ' + formatNoteTime(n.created_at)}
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{n.body}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <label htmlFor="rt-new-note" style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Your note
            </label>
            <textarea
              id="rt-new-note"
              className="rt-note-textarea"
              rows={3}
              value={newNoteBody}
              onChange={(e) => setNewNoteBody(e.target.value)}
              placeholder="e.g. Thanks — reviewed the PDF."
              disabled={noteBusy}
            />
            {noteError ? (
              <p style={{ color: 'var(--red)', fontSize: 13, marginTop: 8 }}>{noteError}</p>
            ) : null}

            <div className="confirm-dialog-actions" style={{ marginTop: 16 }}>
              <button type="button" className="secondary-btn" onClick={() => setAddNoteFor(null)} disabled={noteBusy}>
                Close
              </button>
              <button type="button" className="primary-btn" onClick={() => void submitNewNote()} disabled={noteBusy}>
                {noteBusy ? 'Posting…' : 'Post note'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="rt-hero">
        <div className="rt-hero-inner">
          <div>
            <div className="rt-kicker">Transfer intelligence</div>
            <h1>Uploads</h1>
            <p>
              Track every file handoff, see what got opened, and catch links that are about to die before someone pings
              you saying the download is broken.
            </p>
          </div>
          <div className="rt-live-chip">
            <span className="rt-live-dot" />
            Live session activity
          </div>
        </div>
      </section>

      <div className="rt-layout">
        <section className="card">
          <div className="card-header">
            <div className="card-title">↗ Transfer history</div>
            <div className="rt-toolbar">
              <input
                className="rt-search"
                type="text"
                placeholder="Search file, uploader, or note"
                readOnly
              />
              <select className="rt-sort" defaultValue="newest">
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="largest">Largest first</option>
                <option value="most-opened">Most opened</option>
              </select>
            </div>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {loadError ? (
              <div className="empty-state" style={{ margin: 24 }}>
                {loadError}
              </div>
            ) : null}
            <div className="rt-table-wrap">
              <table className="rt-table">
                <thead>
                  <tr>
                    <th>upload</th>
                    <th>uploader</th>
                    <th>Upload note</th>
                    <th>When</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {initialUploads.length === 0 && !loadError ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="empty-state" style={{ margin: 16, border: 'none' }}>
                          No uploads yet. Shared packages will show up here.
                        </div>
                      </td>
                    </tr>
                  ) : null}
                  {initialUploads.map((u) => {
                    const { primary, meta, badge } = packageSummary(u)
                    const email = u.uploader_email
                    const name = displayNameFromEmail(email)
                    const firstPath = u.upload_files?.[0]?.storage_path ?? null
                    const uploadNote = u.note?.trim()

                    return (
                      <tr key={u.id}>
                        <td>
                          <div className="rt-file">
                            <div className="rt-file-badge">{badge}</div>
                            <div>
                              <div className="rt-file-name">{primary}</div>
                              <div className="rt-file-meta">
                                {meta}
                                {u.is_rubric ? (
                                  <span className="rt-rubric-tag" title="Rubric">
                                    Rubric
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="rt-user">
                            <div className="rt-avatar">{initialsFromEmail(email)}</div>
                            <div>
                              <div className="rt-file-name">{name}</div>
                              <div className="rt-user-meta">{email ?? '—'}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="rt-upload-note" title={uploadNote || undefined}>
                            {uploadNote ? uploadNote : '—'}
                          </div>
                        </td>
                        <td>
                          <div className="rt-date-meta">{formatWhen(u.created_at)}</div>
                        </td>
                        <td>
                          <div className="rt-actions">
                            <button type="button" className="rt-btn" onClick={() => setAddNoteFor(u)}>
                              Add note
                            </button>
                            {firstPath ? (
                              <button type="button" className="rt-btn" onClick={() => void copyFirstLink(u)}>
                                Copy link
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
