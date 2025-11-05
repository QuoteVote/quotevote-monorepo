export const getBaseServerUrl = () => {
  // Default to production backend
  let effectiveUrl = 'https://api.quote.vote'

  // Check for explicit server override first
  if (process.env.REACT_APP_SERVER) {
    effectiveUrl = process.env.REACT_APP_SERVER
    return effectiveUrl
  }

  // Use window.location to detect Netlify deploy preview (FREE - no env var needed!)
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : ''

  if (currentUrl && currentUrl.includes('deploy-preview')) {
    // Keep production backend for preview deploys since Railway doesn't auto-create PR environments
    // This allows reviewers to test UI changes without backend setup
  }

  return effectiveUrl
}

export const getGraphqlServerUrl = () => {
  const baseUrl = getBaseServerUrl()
  return `${baseUrl}/graphql`
}

export const getGraphqlWsServerUrl = () => {
  const baseUrl = getBaseServerUrl()
  const replacedUrl = baseUrl.replace('https://', 'wss://')
  return `${replacedUrl}/graphql`
}
