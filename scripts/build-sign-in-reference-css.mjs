import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import postcss from 'postcss'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const html = fs.readFileSync(path.join(root, 'Sign-In Page.html'), 'utf8')
const start = html.indexOf('<style>')
const end = html.indexOf('/* ════════════════════════════════════════\n   APP SHELL')
if (start < 0 || end < 0) throw new Error('style bounds not found')
let css = html.slice(start + 7, end).trim()

const SCOPE = '#sign-in-reference-root'

css = css.replace(/^:root\s*\{/m, `${SCOPE} {`)

css = css.replace(/^\*, \*::before, \*::after \{[^}]+\}/m, `${SCOPE}, ${SCOPE} *, ${SCOPE} *::before, ${SCOPE} *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}`)

css = css.replace(/^html \{[^}]+\}\s*\nbody \{[^}]+\}/m, `${SCOPE} {
  font-family: var(--sans);
  min-height: 100vh;
}`)

css = css.replace(/@keyframes (lineDrift|fadeUp|popIn)/g, '@keyframes si-$1')
css = css.replace(/animation: (lineDrift|fadeUp|popIn)/g, 'animation: si-$1')

const ast = postcss.parse(css)
ast.walkRules((rule) => {
  let p = rule.parent
  while (p && p.type === 'rule') p = p.parent
  if (p && p.type === 'atrule' && p.name === 'keyframes') return

  const sel = rule.selector?.trim()
  if (!sel) return
  if (sel.startsWith(SCOPE)) return

  rule.selector = sel
    .split(',')
    .map((s) => `${SCOPE} ${s.trim()}`)
    .join(', ')
})

const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
`

const finalCss = fontImport + ast.toString()
fs.writeFileSync(path.join(root, 'src', 'app', 'login', 'sign-in-reference.css'), finalCss)
console.log('Wrote sign-in-reference.css', finalCss.length, 'chars')
