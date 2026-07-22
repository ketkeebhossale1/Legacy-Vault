import axios from 'axios'

/** Shared HTTP client. Components never import this module; sagas do. */
const api = axios.create({
  // In development, Vite proxies this same-origin path to the Express API.
  // This works inside the Figma preview too, where localhost is not the preview's origin.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

export default api
