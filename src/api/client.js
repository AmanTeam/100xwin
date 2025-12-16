const API_BASE = import.meta.env.VITE_API_BASE || '/api'

export const getAuthToken = () => localStorage.getItem('authToken') || ''
export const setAuthToken = (token) => {
  if (token) localStorage.setItem('authToken', token)
  else localStorage.removeItem('authToken')
}

export const apiFetch = async (path, options = {}) => {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }

  const token = getAuthToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(url, {
    ...options,
    headers,
  })

  const contentType = res.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await res.json() : await res.text()

  if (!res.ok) {
    const msg = typeof data === 'object' && data && data.error ? data.error : 'Request failed'
    const err = new Error(msg)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}
