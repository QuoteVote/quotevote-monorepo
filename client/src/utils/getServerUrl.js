export const getBaseServerUrl = () => {
  let effectiveUrl = 'https://api.quote.vote'

  try {
    if (import.meta.env.VITE_SERVER) {
      return import.meta.env.VITE_SERVER
    }
  } catch (e) {}

  try {

    const hasReactAppServer = typeof process !== 'undefined' && process.env && process.env.REACT_APP_SERVER;
    if (hasReactAppServer) {
      return process.env.REACT_APP_SERVER
    }
  } catch (e) {}

  return effectiveUrl
}

export const getGraphqlServerUrl = () => {
  const baseUrl = getBaseServerUrl()
  return `${baseUrl}/graphql`
}

export const getGraphqlWsServerUrl = () => {
  const baseUrl = getBaseServerUrl()
  if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
    return baseUrl.replace('http://', 'ws://').replace('https://', 'ws://') + '/graphql'
  }
  const replacedUrl = baseUrl.replace('https://', 'wss://').replace('http://', 'ws://')
  return `${replacedUrl}/graphql`
}
