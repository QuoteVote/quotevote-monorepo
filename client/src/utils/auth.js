import { jwtDecode } from 'jwt-decode'

export function isAuthenticated() {
  const token = localStorage.getItem('token')
  if (!token) return false
  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000
    if (decoded.exp && decoded.exp < currentTime) {
      return false
    }
    return true
  } catch (err) {
    return false
  }
}

export function requireAuth(action) {
  return (...args) => {
    if (!isAuthenticated()) {
      window.location.assign(
        `https://quote.vote/invite?from=${window.location.pathname}`,
      )
      return
    }
    action(...args)
  }
}
