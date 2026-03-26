import type { Metadata } from 'next'
import './globals.css'
import './filr.css'

export const metadata: Metadata = {
  title: 'FILR — Drop. Share. Gone.',
  description: 'Demo file sharing app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
