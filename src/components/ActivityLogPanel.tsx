export function ActivityLogPanel() {
  return (
    <div className="activity-log-page">
      <section className="al-hero">
        <div className="al-hero-inner">
          <div>
            <div className="al-kicker">Workspace monitoring</div>
            <h1>Activity Log</h1>
            <p>
              Track meaningful actions across uploads, transfers, and access. This is where you catch what happened,
              who touched what, and whether it matters.
            </p>
          </div>
          <div className="al-live-chip">
            <span className="al-live-dot" />
            Live audit trail
          </div>
        </div>
      </section>

      <section className="al-stats">
        <div className="al-stat red">
          <div className="al-stat-label">Events today</div>
          <div className="al-stat-value">146</div>
          <div className="al-stat-sub">Across uploads, opens, and shares</div>
        </div>
        <div className="al-stat gold">
          <div className="al-stat-label">Flagged</div>
          <div className="al-stat-value">7</div>
          <div className="al-stat-sub">Need review or follow-up</div>
        </div>
        <div className="al-stat blue">
          <div className="al-stat-label">Users active</div>
          <div className="al-stat-value">19</div>
          <div className="al-stat-sub">Touched the workspace today</div>
        </div>
        <div className="al-stat green">
          <div className="al-stat-label">Blocked attempts</div>
          <div className="al-stat-value">8</div>
          <div className="al-stat-sub">Stopped before access</div>
        </div>
      </section>

      <div className="al-layout">
        <section className="card">
          <div className="card-header">
            <div className="card-title">🕘 Timeline</div>
            <div className="al-toolbar">
              <input className="al-search" type="text" placeholder="Search file, user, or action" readOnly />
              <select className="al-filter" defaultValue="all-events">
                <option value="all-events">All events</option>
                <option value="uploads">Uploads</option>
                <option value="shares">Shares</option>
                <option value="opens">Opens</option>
                <option value="expired">Expired links</option>
                <option value="failed">Failed access</option>
              </select>
              <select className="al-filter" defaultValue="all-sev">
                <option value="all-sev">All severity</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <div className="card-body">
            <div className="activity-timeline">
              <div className="activity-item">
                <div className="activity-icon info">↗</div>
                <div className="activity-content">
                  <div className="activity-top">
                    <div>
                      <div className="activity-title">Share link created</div>
                      <div className="activity-meta">Maria Lee • Capstone_Final_Report.pdf • 2:14 PM</div>
                    </div>
                    <span className="activity-badge info">Info</span>
                  </div>
                  <div className="activity-desc">Created link for the capstone report.</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon success">↓</div>
                <div className="activity-content">
                  <div className="activity-top">
                    <div>
                      <div className="activity-title">File opened</div>
                      <div className="activity-meta">Alex Raman • UI_Assets_Review.zip • 11:31 AM</div>
                    </div>
                    <span className="activity-badge success">Opened</span>
                  </div>
                  <div className="activity-desc">UI assets file accessed successfully.</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon warn">!</div>
                <div className="activity-content">
                  <div className="activity-top">
                    <div>
                      <div className="activity-title">Link expiring soon</div>
                      <div className="activity-meta">Sam Khan • Meeting_Notes_TA.docx • 9:42 AM</div>
                    </div>
                    <span className="activity-badge warn">Warning</span>
                  </div>
                  <div className="activity-desc">File not opened yet. Expires in 2 hours.</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon danger">×</div>
                <div className="activity-content">
                  <div className="activity-top">
                    <div>
                      <div className="activity-title">Failed access</div>
                      <div className="activity-meta">Unknown • Midterm_Presentation_v3.pptx • 8:07 AM</div>
                    </div>
                    <span className="activity-badge danger">Critical</span>
                  </div>
                  <div className="activity-desc">Attempted to access expired link.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="rt-side-stack">
          <section className="card">
            <div className="card-header">
              <div className="card-title">⚠ Needs attention</div>
            </div>
            <div className="card-body">
              <div className="rt-mini-list">
                <div className="rt-mini-item">
                  <div>
                    <div className="rt-mini-title">Meeting_Notes_TA.docx</div>
                    <div className="rt-mini-sub">
                      Recipient has not opened the link and it dies in 2 hours.
                    </div>
                  </div>
                  <div className="rt-metric">
                    <div className="rt-metric-value">2h</div>
                    <div className="rt-mini-sub">left</div>
                  </div>
                </div>
                <div className="rt-mini-item">
                  <div>
                    <div className="rt-mini-title">Midterm_Presentation_v3.pptx</div>
                    <div className="rt-mini-sub">Expired. If they still need it, resend now.</div>
                  </div>
                  <div className="rt-metric">
                    <div className="rt-metric-value">0</div>
                    <div className="rt-mini-sub">active links</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="card">
            <div className="card-header">
              <div className="card-title">📊 Quick breakdown</div>
            </div>
            <div className="card-body">
              <div className="rt-mini-list">
                <div className="rt-mini-item">
                  <div>
                    <div className="rt-mini-title">Opened links</div>
                    <div className="rt-mini-sub">Transfers that were clicked at least once.</div>
                  </div>
                  <div className="rt-metric">
                    <div className="rt-metric-value">14</div>
                    <div className="rt-mini-sub">of 18</div>
                  </div>
                </div>
                <div className="rt-mini-item">
                  <div>
                    <div className="rt-mini-title">Largest transfer</div>
                    <div className="rt-mini-sub">UI_Assets_Review.zip moved the most data this week.</div>
                  </div>
                  <div className="rt-metric">
                    <div className="rt-metric-value">812</div>
                    <div className="rt-mini-sub">MB</div>
                  </div>
                </div>
                <div className="rt-mini-item">
                  <div>
                    <div className="rt-mini-title">Average time to open</div>
                    <div className="rt-mini-sub">How fast recipients actually respond after receiving a link.</div>
                  </div>
                  <div className="rt-metric">
                    <div className="rt-metric-value">38m</div>
                    <div className="rt-mini-sub">avg</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
