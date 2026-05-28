import { API_BASE_URL } from './constants'

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed: ${response.status}`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export async function loadAllData() {
  return Promise.all([
    request('/reports/dashboard'),
    request('/suppliers'),
    request('/grades'),
    request('/collections'),
    request('/reports/supplier-ranking'),
    request('/reports/grade-wise'),
  ])
}
