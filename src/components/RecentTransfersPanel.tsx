export function RecentTransfersPanel() {
  return (
    <div className="recent-transfers-page">
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
              <input className="rt-search" type="text" placeholder="Search file, recipient, or note" readOnly />
              <select className="rt-sort" defaultValue="newest">
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="largest">Largest first</option>
                <option value="most-opened">Most opened</option>
              </select>
            </div>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="rt-table-wrap">
              <table className="rt-table">
                <thead>
                  <tr>
                    <th>Transfer</th>
                    <th>Recipient</th>
                    <th>Status</th>
                    <th>When</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="rt-file">
                        <div className="rt-file-badge">PDF</div>
                        <div>
                          <div className="rt-file-name">Capstone_Final_Report.pdf</div>
                          <div className="rt-file-meta">4.2 MB • 1 file • final submission package</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="rt-user">
                        <div className="rt-avatar">ML</div>
                        <div>
                          <div className="rt-file-name">Maria Lee</div>
                          <div className="rt-user-meta">maria.lee@ucalgary.ca</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="rt-status opened">Opened 3 times</span>
                    </td>
                    <td>
                      <div className="rt-date-meta">Today, 2:14 PM</div>
                      <div className="rt-date-meta">Expires in 18h</div>
                    </td>
                    <td>
                      <div className="rt-actions">
                        <button type="button" className="rt-btn">
                          Copy link
                        </button>
                        <button type="button" className="rt-btn">
                          Extend
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="rt-file">
                        <div className="rt-file-badge">ZIP</div>
                        <div>
                          <div className="rt-file-name">UI_Assets_Review.zip</div>
                          <div className="rt-file-meta">812 MB • 14 files • design handoff</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="rt-user">
                        <div className="rt-avatar" style={{ background: 'var(--blue)' }}>
                          AR
                        </div>
                        <div>
                          <div className="rt-file-name">Alex Raman</div>
                          <div className="rt-user-meta">alex.r@ucalgary.ca</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="rt-status sent">Sent</span>
                    </td>
                    <td>
                      <div className="rt-date-meta">Today, 11:08 AM</div>
                      <div className="rt-date-meta">Expires in 46h</div>
                    </td>
                    <td>
                      <div className="rt-actions">
                        <button type="button" className="rt-btn primary">
                          Resend
                        </button>
                        <button type="button" className="rt-btn">
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="rt-file">
                        <div className="rt-file-badge">DOCX</div>
                        <div>
                          <div className="rt-file-name">Meeting_Notes_TA.docx</div>
                          <div className="rt-file-meta">284 KB • 1 file • feedback summary</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="rt-user">
                        <div
                          className="rt-avatar"
                          style={{ background: 'var(--gold)', color: '#362700' }}
                        >
                          SK
                        </div>
                        <div>
                          <div className="rt-file-name">Sam Khan</div>
                          <div className="rt-user-meta">sam.khan@ucalgary.ca</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="rt-status expiring">Expiring soon</span>
                    </td>
                    <td>
                      <div className="rt-date-meta">Yesterday, 7:42 PM</div>
                      <div className="rt-date-meta">Expires in 2h</div>
                    </td>
                    <td>
                      <div className="rt-actions">
                        <button type="button" className="rt-btn primary">
                          Extend
                        </button>
                        <button type="button" className="rt-btn">
                          Copy link
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="rt-file">
                        <div className="rt-file-badge">PPT</div>
                        <div>
                          <div className="rt-file-name">Midterm_Presentation_v3.pptx</div>
                          <div className="rt-file-meta">19.6 MB • 1 file • committee deck</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="rt-user">
                        <div className="rt-avatar" style={{ background: '#7a4ab5' }}>
                          JH
                        </div>
                        <div>
                          <div className="rt-file-name">Jayden Hall</div>
                          <div className="rt-user-meta">jayden.h@ucalgary.ca</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="rt-status expired">Expired</span>
                    </td>
                    <td>
                      <div className="rt-date-meta">Mar 25, 9:16 AM</div>
                      <div className="rt-date-meta">Expired 6h ago</div>
                    </td>
                    <td>
                      <div className="rt-actions">
                        <button type="button" className="rt-btn primary">
                          Generate new link
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>


      </div>
    </div>
  )
}
