import axios from 'axios'

/** Shared HTTP client. Components never import this module; sagas do. */
const api = axios.create({
  // In development, Vite proxies this same-origin path to the Express API.
  // This works inside the Figma preview too, where localhost is not the preview's origin.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
})

// Attach JWT from stored user on every request
api.interceptors.request.use(config => {
  try {
    const raw = localStorage.getItem('lv_user')
    if (raw) {
      const { token } = JSON.parse(raw) as { token?: string }
      if (token) config.headers['Authorization'] = `Bearer ${token}`
    }
  } catch { /* ignore */ }
  return config
})

export default api
