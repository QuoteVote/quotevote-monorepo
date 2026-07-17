const ANONYMOUS_SESSION_STORAGE_KEY = 'anonymous-vote-session-id'

export const getAnonymousSessionId = () => {
  if (typeof window === 'undefined') {
    return ''
  }

  const existingSessionId = localStorage.getItem(ANONYMOUS_SESSION_STORAGE_KEY)
  if (existingSessionId) {
    return existingSessionId
  }

  const sessionId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`

  localStorage.setItem(ANONYMOUS_SESSION_STORAGE_KEY, sessionId)
  return sessionId
}
