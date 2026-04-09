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

  // 2. For all other environments (including Netlify deploy previews),
  //    use the production API. CORS on api.quote.vote already allows
  //    all *.netlify.app origins.

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