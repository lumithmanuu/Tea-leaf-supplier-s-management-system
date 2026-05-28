import { useState } from 'react'
import { authUtils } from '../utils/auth'
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../design-tokens'

export function Profile() {
  const user = authUtils.getUser()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    position: 'Factory Officer',
  })

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setIsEditing(false)
    alert('Profile updated successfully!')
  }

  const initials = (formData.name || user?.email?.charAt(0) || 'U').toUpperCase()

  return (
    <div className="profile-modal-view">
      {/* Hero Section with Avatar */}
      <div className="profile-hero">
        <div className="profile-hero-background" />
        <div className="profile-hero-content">
          <div className="profile-avatar-large">{initials}</div>
          <div className="profile-hero-info">
            <h1 className="profile-hero-name">{formData.name || 'User'}</h1>
            <p className="profile-hero-email">{formData.email}</p>
            <span className="profile-position-badge">{formData.position}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        {/* Account Information Card */}
        <section className="profile-card profile-info-card">
          <div className="profile-card-header">
            <div>
              <h2 className="profile-card-title">Account Information</h2>
              <p className="profile-card-subtitle">Manage your personal details</p>
            </div>
            <button
              className={`profile-edit-btn ${isEditing ? 'editing' : ''}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <span className="edit-icon">✓</span>
                  <span>Done</span>
                </>
              ) : (
                <>
                  <span className="edit-icon">✎</span>
                  <span>Edit</span>
                </>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Your job title"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="your@email.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="+94 7X XXX XXXX"
                  className="form-input"
                />
              </div>
            </div>

            {isEditing && (
              <div className="profile-form-actions">
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </section>

        {/* Account Statistics */}
        <section className="profile-card profile-stats-section">
          <h2 className="profile-card-title">Account Status</h2>
          <div className="profile-stats-grid">
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">📅</span>
              </div>
              <div className="stat-info">
                <p className="stat-label">Member Since</p>
                <p className="stat-value">{new Date().getFullYear()}</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">🔐</span>
              </div>
              <div className="stat-info">
                <p className="stat-label">Account Status</p>
                <p className="stat-value">Active</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">✓</span>
              </div>
              <div className="stat-info">
                <p className="stat-label">Verification</p>
                <p className="stat-value">Verified</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
