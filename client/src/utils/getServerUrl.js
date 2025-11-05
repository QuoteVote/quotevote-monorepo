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
    // Sample currentUrl: https://deploy-preview-237--quotevote.netlify.app
    const prMatch = currentUrl.match(/deploy-preview-(\d+)--quotevote\.netlify\.app/)
    console.log('🔍 Regex match result:', prMatch)
    
    if (prMatch && prMatch[1]) {
      const PR_NUMBER = prMatch[1]
      console.log('✅ Extracted PR number:', PR_NUMBER)
      
      // IMPORTANT: Railway PR environments must be manually created!
      // Check if Railway PR backend exists, otherwise fall back to production
      const railwayPrUrl = `https://quotevote-api-quotevote-monorepo-pr-${PR_NUMBER}.up.railway.app`
      
      console.log('🚂 Railway PR backend URL:', railwayPrUrl)
      console.log('⚠️ NOTE: If Railway PR environment does not exist, will fall back to production backend')
      console.log('⚠️ To create Railway PR environment, trigger a deployment in Railway dashboard')
      
      // Use Railway PR backend if it exists, otherwise production will be used
      effectiveUrl = railwayPrUrl
    } else {
      console.warn('⚠️ Could not extract PR number from URL, using production backend')
    }
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