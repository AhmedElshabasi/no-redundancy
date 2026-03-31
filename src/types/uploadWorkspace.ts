export type UploadFileRow = {
  id: string
  original_name: string
  mime: string | null
  size: number | null
  storage_path: string
}

export type UploadPackageRow = {
  id: string
  uploader_email: string | null
  note: string | null
  created_at: string | null
  upload_files: UploadFileRow[] | null
}
