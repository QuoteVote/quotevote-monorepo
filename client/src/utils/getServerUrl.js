export const getBaseServerUrl = () => {
  let effectiveUrl = 'https://api.quote.vote'
  
  // Use window.location to detect Netlify deploy preview (FREE - no env var needed!)
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : ''
  
  console.log('🔍 Current URL:', currentUrl)
  console.log('🔍 Environment:', process.env.NODE_ENV)
  console.log('🔍 REACT_APP_SERVER:', process.env.REACT_APP_SERVER)
  
  if(currentUrl && currentUrl.includes('deploy-preview')) {
    console.log('✅ Detected Netlify preview deploy:', currentUrl)
    // Sample currentUrl: https://deploy-preview-237--quotevote.netlify.app
    const prMatch = currentUrl.match(/deploy-preview-(\d+)--quotevote\.netlify\.app/)
    if (prMatch && prMatch[1]) {
      const PR_NUMBER = prMatch[1]
      effectiveUrl = `https://quotevote-api-quotevote-monorepo-pr-${PR_NUMBER}.up.railway.app`
      console.log('🚂 Connecting to Railway PR backend:', effectiveUrl)
      console.log('🚂 GraphQL endpoint will be:', `${effectiveUrl}/graphql`)
    } else {
      console.warn('⚠️ Could not extract PR number from URL:', currentUrl)
    }
  } else if (process.env.REACT_APP_SERVER) {
    effectiveUrl = `${process.env.REACT_APP_SERVER}`
    console.log('🔧 Using REACT_APP_SERVER:', effectiveUrl)
  } else {
    console.log('🌐 Using production URL:', effectiveUrl)
  }

  console.log('✅ Final Base URL:', effectiveUrl)
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