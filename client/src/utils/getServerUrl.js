export const getBaseServerUrl = () => {
  // Default to production backend
  let effectiveUrl = 'https://api.quote.vote'
  
  // Check for explicit server override first
  if (process.env.REACT_APP_SERVER) {
    effectiveUrl = process.env.REACT_APP_SERVER
    console.log('🔧 Using REACT_APP_SERVER env var:', effectiveUrl)
    return effectiveUrl
  }
  
  // Use window.location to detect Netlify deploy preview (FREE - no env var needed!)
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : ''
  
  console.log('🔍 Current URL:', currentUrl)
  
  if(currentUrl && currentUrl.includes('deploy-preview')) {
    console.log('✅ Detected Netlify preview deploy:', currentUrl)
    console.log('📡 Using production backend for preview deploys (Railway PR environments not auto-created)')
    // Keep production backend for preview deploys since Railway doesn't auto-create PR environments
    // This allows reviewers to test UI changes without backend setup
  } else {
    console.log('🌐 Using production backend:', effectiveUrl)
  }

  console.log('✅ Final Backend URL:', effectiveUrl)
  console.log('📡 GraphQL endpoint will be:', `${effectiveUrl}/graphql`)
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