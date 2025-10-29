export const getBaseServerUrl = () => {
  const effectiveUrl = 'https://api.quote.vote'
  if(process.env.DEPLOY_PRIME_URL) {
    console.log('Using Railway preview URL:', process.env.DEPLOY_PRIME_URL)
    const previewUrl = process.env.DEPLOY_PRIME_URL
    // Sample previewUrl: https://deploy-preview-212--quotevote.netlify.app
    const PR_NUMBER = previewUrl.match(/deploy-preview-(\d+)--quotevote\.netlify\.app/)[1]
    const testUrl = `https://quotevote-api-pr-${PR_NUMBER}.up.railway.app`;
    console.log('Test URL:', testUrl)
  } else if (process.env.REACT_APP_SERVER) {
    effectiveUrl = `${process.env.REACT_APP_SERVER}`
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