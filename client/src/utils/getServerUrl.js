export const getBaseServerUrl = () => {
  let effectiveUrl = 'https://api.quote.vote'
  
  // Check for Netlify deploy preview using REACT_APP_ prefixed variable
  const deployUrl = process.env.REACT_APP_DEPLOY_PRIME_URL || window.location.origin
  
  if(deployUrl && deployUrl.includes('deploy-preview')) {
    console.log('Using Railway preview URL for deploy:', deployUrl)
    // Sample deployUrl: https://deploy-preview-212--quotevote.netlify.app
    const prMatch = deployUrl.match(/deploy-preview-(\d+)--quotevote\.netlify\.app/)
    if (prMatch && prMatch[1]) {
      const PR_NUMBER = prMatch[1]
      effectiveUrl = `https://quotevote-api-quotevote-monorepo-pr-${PR_NUMBER}.up.railway.app`
      console.log('Connecting to Railway PR backend:', effectiveUrl)
    }
  } else if (process.env.REACT_APP_SERVER) {
    effectiveUrl = `${process.env.REACT_APP_SERVER}`
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
  const replacedUrl = baseUrl.replace('https://', 'wss://')
  return `${replacedUrl}/graphql`
}