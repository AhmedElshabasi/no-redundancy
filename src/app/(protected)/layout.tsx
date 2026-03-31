import { redirect } from 'next/navigation'
import { supabaseServerClientOrNull } from '@/lib/supabaseServer'
import type { UploadPackageRow } from '@/types/uploadWorkspace'
import { UploadsWorkspaceProvider } from '@/contexts/UploadsWorkspaceContext'
import { MainPageShell } from '@/components/MainPageShell'
import './main-page-reference.css'

export const dynamic = 'force-dynamic'

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = supabaseServerClientOrNull()
  if (!supabase) redirect('/login?missing_env=1')

  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user) redirect('/login')

  const { data: uploads, error: uploadsError } = await supabase
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

  const list = (uploads ?? []) as UploadPackageRow[]
  let serverTotalBytes = 0
  for (const u of list) {
    for (const f of u.upload_files || []) {
      serverTotalBytes += typeof f.size === 'number' ? f.size : 0
    }
  }

  return (
    <UploadsWorkspaceProvider
      value={{
        initialUploads: list,
        serverUploadCount: list.length,
        serverTotalBytes,
        loadError: uploadsError?.message ?? null,
      }}
    >
      <MainPageShell userEmail={user.email ?? null} fileShare={children} />
    </UploadsWorkspaceProvider>
  )
}
