// Fallback configuration for when backend is not available
export const FALLBACK_CONFIG = {
  // Main production backend
  PRODUCTION_BACKEND: 'https://quotevote-backend.railway.app',
  
  // Railway backend patterns for PR deployments
  RAILWAY_PATTERNS: [
    'https://quotevote-backend-pr-{PR}.up.railway.app',
    'https://quotevote-api-pr-{PR}.up.railway.app', 
    'https://quotevote-monorepo-pr-{PR}.up.railway.app',
    'https://quotevote-server-pr-{PR}.up.railway.app',
  ],
  
  // Fallback backends in order of preference
  FALLBACK_BACKENDS: [
    'https://quotevote-backend.railway.app',
    'https://api.quote.vote',
    'https://quotevote-api.herokuapp.com', // If Heroku is still active
  ],
  
  // Local development
  LOCAL_BACKEND: 'http://localhost:4000',
}

// Test if a backend URL is reachable
export const testBackendConnection = async (url) => {
  try {
    const response = await fetch(`${url}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '{ __typename }', // Simple introspection query
      }),
    })
    return response.ok
  } catch (error) {
    console.warn(`Backend test failed for ${url}:`, error.message)
    return false
  }
}

// Find the first working backend from a list
export const findWorkingBackend = async (urls) => {
  for (const url of urls) {
    console.log(`Testing backend: ${url}`)
    if (await testBackendConnection(url)) {
      console.log(`✅ Backend is working: ${url}`)
      return url
    }
  }
  console.error('❌ No working backend found')
  return null
}
