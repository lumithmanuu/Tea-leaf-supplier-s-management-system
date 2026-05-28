import { VIEWS } from '../utils/constants'

export function Sidebar({ activeView, onViewChange }) {
  return (
    <aside className="sidebar">
      <div className="brand sidebar-brand">
        <div className="brand-mark sidebar-brand-icon">◌</div>
        <div>
          <strong className="sidebar-brand-name">Ceylon Leaf</strong>
          <span className="sidebar-brand-sub">Supplier MGMT</span>
        </div>
      </div>

      <div className="nav-group">
        <p className="nav-label sidebar-nav-label">Navigation</p>
        <nav className="nav-list" aria-label="Primary navigation">
          {VIEWS.map((view) => (
            <button
              key={view.id}
              type="button"
              className={view.id === activeView ? 'nav-item active' : 'nav-item'}
              onClick={() => onViewChange(view.id)}
            >
              <span className="nav-icon nav-item-icon">{view.label[0]}</span>
              <span className="nav-item-label">{view.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="user-chip">
          <span className="avatar sidebar-footer-avatar">AK</span>
          <div>
            <strong className="sidebar-footer-name">Admin Kavindu</strong>
            <span className="sidebar-footer-role">Factory Officer</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
