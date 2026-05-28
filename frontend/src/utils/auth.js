/**
 * Authentication utilities
 */

export const authUtils = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken')
  },

  /**
   * Get stored user data
   */
  getUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  /**
   * Get auth token
   */
  getToken() {
    return localStorage.getItem('authToken')
  },

  /**
   * Store auth credentials
   */
  setAuth(token, user) {
    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify(user))
  },

  /**
   * Clear auth data (logout)
   */
  logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  },

  /**
   * Get auth header for API requests
   */
  getAuthHeader() {
    const token = authUtils.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },
}
