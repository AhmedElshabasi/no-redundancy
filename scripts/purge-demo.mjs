import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const BUCKET = 'uploads'

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

async function purgeDemo() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  console.log('[purge] Fetching storage paths from upload_files…')
  const { data: fileRows, error: filesErr } = await supabase
    .from('upload_files')
    .select('storage_path')

  if (filesErr) throw filesErr

  const paths = (fileRows || [])
    .map((r) => r.storage_path)
    .filter(Boolean)

  console.log(`[purge] Deleting ${paths.length} storage objects from bucket "${BUCKET}"…`)
  for (const batch of chunk(paths, 50)) {
    const { error } = await supabase.storage.from(BUCKET).remove(batch)
    if (error) throw error
  }

  console.log('[purge] Deleting upload rows…')
  const { error: uploadsErr } = await supabase.from('uploads').delete().neq('id', null)
  if (uploadsErr) throw uploadsErr

  console.log('[purge] Done.')
}

purgeDemo().catch((e) => {
  console.error(e)
  process.exit(1)
})

