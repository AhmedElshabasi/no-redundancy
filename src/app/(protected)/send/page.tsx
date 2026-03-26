import Link from 'next/link'
import { SendUpload } from './SendUpload'

export default function SendPage() {
  return (
    <main>
      <div className="hero">
        <h1>
          Drop files.<em>Send them.</em>
        </h1>
        <p>Upload (as your account). Everything you upload shows up in Receive for logged-in users.</p>
      </div>

      <div className="tabs">
        <Link className="tab-btn active" href="/send">
          ↑ SEND
        </Link>
        <Link className="tab-btn" href="/receive">
          ↓ RECEIVE
        </Link>
      </div>

      <SendUpload />
    </main>
  )
}

