import { FALLBACK_CONFIG } from '../config/fallback'

export const getBaseServerUrl = () => {
  // Priority order:
  // 1. Environment variable (for production/staging)
  // 2. Railway PR backend (for deploy previews)
  // 3. Production fallback
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : ''

  // Check if we have an explicit environment variable
  if (process.env.REACT_APP_SERVER) {
    const envUrl = process.env.REACT_APP_SERVER.replace('/graphql', '')
    // eslint-disable-next-line no-console
    console.log('Using environment backend:', envUrl)
    return envUrl
  }
  
  // Check for Netlify deploy preview
  if (currentUrl && currentUrl.includes('deploy-preview')) {
    // eslint-disable-next-line no-console
    console.log('🚀 Detected Netlify preview deploy:', currentUrl)
    const prMatch = currentUrl.match(/deploy-preview-(\d+)--quotevote\.netlify\.app/)
    
    if (prMatch && prMatch[1]) {
      const PR_NUMBER = prMatch[1]
      // eslint-disable-next-line no-console
      console.log(`📋 PR Number: ${PR_NUMBER}`)

      // Generate Railway URLs for this PR
      const railwayUrls = FALLBACK_CONFIG.RAILWAY_PATTERNS.map((pattern) => pattern.replace('{PR}', PR_NUMBER))

      // eslint-disable-next-line no-console
      console.log('🔍 Trying Railway backends for PR:', railwayUrls)
      // eslint-disable-next-line no-console
      console.log('🔄 Fallback backends available:', FALLBACK_CONFIG.FALLBACK_BACKENDS)
      // For now, return the first Railway URL
      // TODO: Implement async backend testing in a future update
      return railwayUrls[0]
    }
  }
  
  // Default to production backend
  // eslint-disable-next-line no-console
  console.log('🌐 Using production backend:', FALLBACK_CONFIG.PRODUCTION_BACKEND)
  return FALLBACK_CONFIG.PRODUCTION_BACKEND
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