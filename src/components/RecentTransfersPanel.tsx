'use client'

import { useCallback, useState } from 'react'
import { useUploadsWorkspace } from '@/contexts/UploadsWorkspaceContext'
import { supabaseBrowser } from '@/lib/supabaseBrowser'
import type { UploadPackageRow } from '@/types/uploadWorkspace'

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

function publicFileUrl(storagePath: string) {
  if (!supabaseBrowser) return null
  const { data } = supabaseBrowser.storage.from('uploads').getPublicUrl(storagePath)
  return data.publicUrl ?? null
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

export function RecentTransfersPanel() {
  const { initialUploads, loadError } = useUploadsWorkspace()
  const [noteDialog, setNoteDialog] = useState<{ title: string; body: string } | null>(null)

  const copyFirstLink = useCallback((u: UploadPackageRow) => {
    const path = u.upload_files?.[0]?.storage_path
    if (!path) return
    const url = publicFileUrl(path)
    if (!url || !navigator.clipboard) return
    void navigator.clipboard.writeText(url)
  }, [])

  return (
    <div className="recent-transfers-page">
      {noteDialog ? (
        <div
          className="confirm-overlay"
          role="presentation"
          onClick={() => setNoteDialog(null)}
        >
          <div
            className="confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="note-dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="note-dialog-title" className="confirm-dialog-title">
              {noteDialog.title}
            </h2>
            <p className="confirm-dialog-body" style={{ whiteSpace: 'pre-wrap' }}>
              {noteDialog.body}
            </p>
            <div className="confirm-dialog-actions">
              <button type="button" className="secondary-btn" onClick={() => setNoteDialog(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="rt-hero">
        <div className="rt-hero-inner">
          <div>
            <div className="rt-kicker">Transfer intelligence</div>
            <h1>Recent transfers</h1>
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
                    <th>When</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {initialUploads.length === 0 && !loadError ? (
                    <tr>
                      <td colSpan={4}>
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
                    const firstUrl = u.upload_files?.[0]?.storage_path
                      ? publicFileUrl(u.upload_files[0].storage_path)
                      : null

                    return (
                      <tr key={u.id}>
                        <td>
                          <div className="rt-file">
                            <div className="rt-file-badge">{badge}</div>
                            <div>
                              <div className="rt-file-name">{primary}</div>
                              <div className="rt-file-meta">{meta}</div>
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
                          <div className="rt-date-meta">{formatWhen(u.created_at)}</div>
                        </td>
                        <td>
                          <div className="rt-actions">
                            <button
                              type="button"
                              className="rt-btn"
                              onClick={() =>
                                setNoteDialog({
                                  title: 'Note',
                                  body: u.note?.trim() ? u.note : 'No note for this upload.',
                                })
                              }
                            >
                              Note
                            </button>
                            {firstUrl ? (
                              <button
                                type="button"
                                className="rt-btn"
                                onClick={() => copyFirstLink(u)}
                              >
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
