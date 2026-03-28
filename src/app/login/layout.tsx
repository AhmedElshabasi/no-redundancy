import type { ReactNode } from 'react'
import './sign-in-reference.css'

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <div id="sign-in-reference-root">{children}</div>
}
