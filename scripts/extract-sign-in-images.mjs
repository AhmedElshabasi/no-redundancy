import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const html = fs.readFileSync(path.join(root, 'Sign-In Page.html'), 'utf8')

function extractDataUrlAfter(needle) {
  const i = html.indexOf(needle)
  if (i < 0) return null
  const sub = html.slice(i)
  const srcIdx = sub.indexOf('src="')
  if (srcIdx < 0) return null
  const start = srcIdx + 5
  const rest = sub.slice(start)
  const end = rest.indexOf('"')
  if (end < 0) return null
  return rest.slice(0, end)
}

const logoUrl = extractDataUrlAfter('class="login-logo-icon"')
const badgeUrl = extractDataUrlAfter('class="ucalgary-badge"')

if (!logoUrl || !badgeUrl) {
  console.error('Failed to extract images', { logo: !!logoUrl, badge: !!badgeUrl })
  process.exit(1)
}

const outDir = path.join(root, 'public', 'sign-in-ref')
fs.mkdirSync(outDir, { recursive: true })

function dataUrlToBuffer(dataUrl) {
  const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
  if (!m) throw new Error('bad data url')
  return Buffer.from(m[2], 'base64')
}

fs.writeFileSync(path.join(outDir, 'logo-icon.png'), dataUrlToBuffer(logoUrl))
fs.writeFileSync(path.join(outDir, 'badge.png'), dataUrlToBuffer(badgeUrl))
console.log('Wrote', outDir)
