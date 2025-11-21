export const getBaseServerUrl = () => {
  let effectiveUrl = 'https://api.quote.vote'

  // Use window.location to detect Netlify deploy preview (FREE - no env var needed!)
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : ''

  // Railway PR deployment logic disabled due to infrastructure reliability issues.
  // Falling back to production API or REACT_APP_SERVER if defined.
  /*
  if(currentUrl && currentUrl.includes('deploy-preview')) {
    console.log('Detected Netlify preview deploy:', currentUrl)
    // Match any netlify site name (e.g. quotevote, quotevote-monorepo, etc.)
    const prMatch = currentUrl.match(/deploy-preview-(\d+)--.+\.netlify\.app/)
    if (prMatch && prMatch[1]) {
      const PR_NUMBER = prMatch[1]
      effectiveUrl = `https://quotevote-api-quotevote-monorepo-pr-${PR_NUMBER}.up.railway.app`
      console.log('Connecting to Railway PR backend:', effectiveUrl)
    }
  } else */

  if (process.env.REACT_APP_SERVER) {
    effectiveUrl = `${process.env.REACT_APP_SERVER}`
  } else if (process.env.REACT_APP_API_URL) {
    // Fallback to REACT_APP_API_URL (used in .env.example and potentially Netlify)
    // Strip /graphql if present as we need the base URL
    effectiveUrl = process.env.REACT_APP_API_URL.replace('/graphql', '')
  }

  // Remove trailing slash if present to ensure consistent formatting
  if (effectiveUrl.endsWith('/')) {
    effectiveUrl = effectiveUrl.slice(0, -1)
  }

  // Safety check: If we are on a remote domain (not localhost) but the API URL is localhost,
  // fallback to production to avoid "Connection Refused" errors.
  if (typeof window !== 'undefined' &&
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1') &&
    (effectiveUrl.includes('localhost') || effectiveUrl.includes('127.0.0.1'))) {
    console.warn('Detected localhost API URL on remote deployment. Falling back to production.')
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