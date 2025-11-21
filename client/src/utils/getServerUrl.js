export const getBaseServerUrl = () => {
  let effectiveUrl = ''

  // 1. Priority: REACT_APP_API_URL (Standardized Env Var)
  if (process.env.REACT_APP_API_URL) {
    effectiveUrl = process.env.REACT_APP_API_URL
  }
  // 2. Legacy Support: REACT_APP_SERVER
  else if (process.env.REACT_APP_SERVER) {
    effectiveUrl = process.env.REACT_APP_SERVER
  }

  // Clean up URL: remove /graphql suffix and trailing slashes
  if (effectiveUrl) {
    effectiveUrl = effectiveUrl.replace(/\/graphql\/?$/, '')
    if (effectiveUrl.endsWith('/')) {
      effectiveUrl = effectiveUrl.slice(0, -1)
    }
  }

  // 3. Fallback if no env var is found
  if (!effectiveUrl) {
    console.error('REACT_APP_API_URL is missing! Defaulting to production API.')
    effectiveUrl = 'https://api.quote.vote'
  }

  // 4. Safety Check: Prevent localhost connection on remote environments
  const isRemoteEnvironment = typeof window !== 'undefined' &&
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1')

  const isLocalhostApi = effectiveUrl.includes('localhost') || effectiveUrl.includes('127.0.0.1')

  if (isRemoteEnvironment && isLocalhostApi) {
    console.warn('Detected localhost API URL on remote environment. Forcing fallback to production API.')
    effectiveUrl = 'https://api.quote.vote'
  }

  console.log('Effective Base URL:', effectiveUrl)
  return effectiveUrl
}

export const getGraphqlServerUrl = () => {
  const baseUrl = getBaseServerUrl()
  return `${baseUrl}/graphql`
}

export const getGraphqlWsServerUrl = () => {
  const baseUrl = getBaseServerUrl()
  // For local development, use ws:// instead of wss://
  if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
    return baseUrl.replace('http://', 'ws://').replace('https://', 'ws://') + '/graphql'
  }
  // For production, use wss:// (secure WebSocket)
  const replacedUrl = baseUrl.replace('https://', 'wss://').replace('http://', 'ws://')
  return `${replacedUrl}/graphql`
}