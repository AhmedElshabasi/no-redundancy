"use client";

import { useMemo, useRef, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseBrowser'

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

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export function SendUpload() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [queue, setQueue] = useState<File[]>([])
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const totalBytes = useMemo(() => queue.reduce((a, f) => a + f.size, 0), [queue])

  const addFiles = (newFiles: File[]) => {
    setQueue((prev) => {
      const next = [...prev]
      for (const f of newFiles) {
        if (!next.find((x) => x.name === f.name && x.size === f.size)) next.push(f)
      }
      return next
    })
  }

  const removeAt = (idx: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== idx))
  }

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length) addFiles(files)
    e.currentTarget.value = ''
  }

  const upload = async () => {
    setError(null)
    if (!queue.length) return

    setBusy(true)
    try {
      if (!supabaseBrowser) {
        throw new Error('Configure Supabase env vars to enable uploads.')
      }
      const {
        data: { user },
        error: userErr,
      } = await supabaseBrowser.auth.getUser()

      if (userErr) throw userErr
      if (!user) throw new Error('Not signed in.')

      // Create an upload package row (so Receive can display it).
      const { data: uploadRow, error: uploadErr } = await supabaseBrowser
        .from('uploads')
        .insert({
          user_id: user.id,
          uploader_email: user.email ?? null,
          note: note.trim() || null,
        })
        .select('id')
        .single()

      if (uploadErr) throw uploadErr
      const uploadId: string = uploadRow.id

      for (const f of queue) {
        const fileId = crypto.randomUUID()
        const storagePath = `demo/${user.id}/${uploadId}/${fileId}__${sanitizeFilename(f.name)}`

        const { error: storageUploadErr } = await supabaseBrowser.storage
          .from('uploads')
          .upload(storagePath, f, {
            contentType: f.type || undefined,
            upsert: false,
          })

        if (storageUploadErr) throw storageUploadErr

        const { error: insertFileErr } = await supabaseBrowser.from('upload_files').insert({
          upload_id: uploadId,
          original_name: f.name,
          mime: f.type || 'application/octet-stream',
          size: f.size,
          storage_path: storagePath,
        })

        if (insertFileErr) throw insertFileErr
      }

      setQueue([])
      setNote('')
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Upload failed.'
      setError(message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div
        className={`drop-zone ${dragOver ? 'dragover' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const dropped = Array.from(e.dataTransfer.files || [])
          if (dropped.length) addFiles(dropped)
        }}
      >
        <h2>Drop files to upload</h2>
        <p>Up to whatever your Supabase limits allow (demo app).</p>
      </div>

      <input
        id="file-input"
        ref={inputRef}
        type="file"
        multiple
        onChange={onPick}
      />

      <div className="file-queue" id="file-queue">
        {queue.map((f, i) => (
          <div className="file-item" key={`${f.name}-${f.size}-${i}`}>
            <div className="file-ext">{ext(f.name)}</div>
            <div className="file-meta">
              <div className="file-name">{f.name}</div>
              <div className="file-size">{fmtSize(f.size)}</div>
            </div>
            <button className="remove-btn" onClick={() => removeAt(i)} aria-label={`Remove ${f.name}`}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="field">
        <label>Transfer note (optional)</label>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a message..." />
      </div>

      <button className="generate-btn" disabled={busy || queue.length === 0} onClick={upload}>
        {busy ? `UPLOADING… ${fmtSize(totalBytes)}` : `Upload (${queue.length} file${queue.length === 1 ? '' : 's'})`}
      </button>

      {error ? <div className="error-msg">{error}</div> : null}
    </div>
  )
}

