// Connection test utility for debugging backend connectivity
import { FALLBACK_CONFIG, testBackendConnection, findWorkingBackend } from '../config/fallback'

export const performConnectionTest = async () => {
  console.log('🔍 Starting backend connection test...')
  
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : ''
  console.log('📍 Current URL:', currentUrl)
  
  // Test environment variable backend first
  if (process.env.REACT_APP_SERVER) {
    const envBackend = process.env.REACT_APP_SERVER.replace('/graphql', '')
    console.log('🧪 Testing environment backend:', envBackend)
    
    const envWorking = await testBackendConnection(envBackend)
    if (envWorking) {
      console.log('✅ Environment backend is working!')
      return envBackend
    } else {
      console.log('❌ Environment backend failed')
    }
  }
  
  // Test PR-specific backends if on deploy preview
  if (currentUrl.includes('deploy-preview')) {
    const prMatch = currentUrl.match(/deploy-preview-(\d+)--quotevote\.netlify\.app/)
    
    if (prMatch && prMatch[1]) {
      const PR_NUMBER = prMatch[1]
      console.log(`📋 Testing PR ${PR_NUMBER} backends...`)
      
      const railwayUrls = FALLBACK_CONFIG.RAILWAY_PATTERNS.map((pattern) => 
        pattern.replace('{PR}', PR_NUMBER)
      )
      
      const workingPRBackend = await findWorkingBackend(railwayUrls)
      if (workingPRBackend) {
        console.log('✅ Found working PR backend:', workingPRBackend)
        return workingPRBackend
      }
    }
  }
  
  // Test fallback backends
  console.log('🔄 Testing fallback backends...')
  const workingFallback = await findWorkingBackend(FALLBACK_CONFIG.FALLBACK_BACKENDS)
  
  if (workingFallback) {
    console.log('✅ Found working fallback backend:', workingFallback)
    return workingFallback
  }
  
  console.error('❌ No working backend found! This will cause login issues.')
  return null
}

// Test login endpoint specifically
export const testLoginEndpoint = async (backendUrl) => {
  try {
    console.log('🔐 Testing login endpoint:', `${backendUrl}/graphql`)
    
    const response = await fetch(`${backendUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            __schema {
              mutationType {
                fields {
                  name
                }
              }
            }
          }
        `,
      }),
    })
    
    if (response.ok) {
      const data = await response.json()
      const mutations = data.data?.__schema?.mutationType?.fields || []
      const hasLogin = mutations.some(field => 
        field.name.toLowerCase().includes('login') || 
        field.name.toLowerCase().includes('auth')
      )
      
      console.log('🔐 Login mutations available:', hasLogin)
      return hasLogin
    }
    
    return false
  } catch (error) {
    console.error('❌ Login endpoint test failed:', error)
    return false
  }
}

// Run comprehensive connection test on app startup
export const runStartupConnectionTest = async () => {
  console.log('🚀 Running startup connection test for PR #255...')
  
  const workingBackend = await performConnectionTest()
  
  if (workingBackend) {
    const loginWorks = await testLoginEndpoint(workingBackend)
    
    if (loginWorks) {
      console.log('✅ Backend and login are working! Reviewers should be able to login.')
    } else {
      console.warn('⚠️ Backend works but login endpoint may have issues.')
    }
    
    return { backend: workingBackend, loginWorks }
  }
  
  console.error('❌ Critical: No working backend found. Login will fail.')
  return { backend: null, loginWorks: false }
}
