export const getBaseServerUrl = () => {
  let effectiveUrl = 'https://api.quote.vote'

  // 1. Priority: Check process.env (allows manual override in Netlify UI)
  try {
    if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SERVER) {
      effectiveUrl = process.env.REACT_APP_SERVER
      console.log('Using REACT_APP_SERVER from env:', effectiveUrl)
      return effectiveUrl
    }
  } catch (e) {
    console.warn('Error accessing process.env:', e)
  }

  // 2. Fallback: Use window.location to detect Netlify deploy preview
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : ''

  if (currentUrl && currentUrl.includes('deploy-preview')) {
    console.log('Detected Netlify preview deploy:', currentUrl)
    // Sample currentUrl: https://deploy-preview-237--quotevote.netlify.app
    // Also supports: https://deploy-preview-275--quotevote-monorepo.netlify.app
    const prMatch = currentUrl.match(/deploy-preview-(\d+)/)
    if (prMatch && prMatch[1]) {
      const PR_NUMBER = prMatch[1]
      effectiveUrl = `https://quotevote-api-quotevote-monorepo-pr-${PR_NUMBER}.up.railway.app`
      console.log('Connecting to Railway PR backend:', effectiveUrl)
    }
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