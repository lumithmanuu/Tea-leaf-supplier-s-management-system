import { useState } from 'react'
import { authUtils } from '../utils/auth'
import { VIEWS } from '../utils/constants'
import { Profile } from '../pages/Profile'

export function Sidebar({ activeView, onViewChange, onLogout }) {
  const user = authUtils.getUser()
  const [showProfileModal, setShowProfileModal] = useState(false)

  const initials = (user?.email?.charAt(0) || 'A').toUpperCase()

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
        <button
          type="button"
          className="profile-section-btn"
          onClick={() => setShowProfileModal(!showProfileModal)}
        >
          <span className="avatar sidebar-footer-avatar">{initials}</span>
          <div className="profile-info">
            <strong className="sidebar-footer-name">
              Profile
            </strong>
          </div>
        </button>

        {showProfileModal && (
          <>
            <div className="profile-drawer-overlay" onClick={() => setShowProfileModal(false)} />
            <div className="profile-drawer">
              <div className="profile-drawer-header">
                <h2>My Profile</h2>
                <button
                  type="button"
                  className="profile-drawer-close"
                  onClick={() => setShowProfileModal(false)}
                >
                  ✕
                </button>
              </div>
              <div className="profile-drawer-content">
                <Profile />
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          className="sidebar-signout-btn"
          onClick={onLogout}
          title="Sign out from your account"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
