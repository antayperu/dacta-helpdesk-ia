import axios from 'axios'

const AUTH_KEY = 'dacta_auth'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

function getStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getToken() {
  return getStoredAuth()?.token ?? null
}

export async function login(correo, contrasena) {
  const { data } = await api.post('/auth/login', { correo, contrasena })
  localStorage.setItem(AUTH_KEY, JSON.stringify(data))
  return data
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}

export function getUsuarioActual() {
  return getStoredAuth()
}

export function getRol() {
  return getStoredAuth()?.rol ?? null
}

export function isAuthenticated() {
  const auth = getStoredAuth()
  if (!auth?.token) return false
  try {
    const payload = JSON.parse(atob(auth.token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}
