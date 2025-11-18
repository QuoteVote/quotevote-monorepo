import React from 'react'
import { vi, beforeAll, afterAll } from 'vitest'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store'
import { ApolloProvider } from '@apollo/react-hooks'
import { InMemoryCache } from 'apollo-cache-inmemory'
import 'mutationobserver-shim'

// Set environment variables for tests to use localhost API
// This must be done BEFORE importing any modules that use these env vars
process.env.REACT_APP_SERVER = process.env.REACT_APP_SERVER || 'http://localhost:4000'
process.env.REACT_APP_SERVER_WS = process.env.REACT_APP_SERVER_WS || 'ws://localhost:4000'
process.env.REACT_APP_DOMAIN = process.env.REACT_APP_DOMAIN || 'http://localhost:3000'

// Now import apollo client after env vars are set
import client from './config/apollo'

const cache = new InMemoryCache()
cache.writeData({
  data: {
    searchKey: '',
  },
})

// Make these available globally for tests
global.React = React
global.MockedProvider = MockedProvider
global.ApolloProvider = ApolloProvider
global.BrowserRouter = BrowserRouter
global.Provider = Provider
global.store = store
global.client = client
global.cache = cache
global.MutationObserver = window.MutationObserver

// Add jest compatibility for Vitest
global.jest = vi

// Mock fetch for tests
global.fetch = vi.fn()

// Mock date-fns/format to prevent errors
vi.mock('date-fns/format', () => ({
  default: vi.fn((date, formatStr) => {
    if (!date) return ''
    try {
      const d = new Date(date)
      return d.toISOString().split('T')[0] // Return YYYY-MM-DD format
    } catch {
      return ''
    }
  }),
}))

// Suppress console errors from ErrorBoundary during tests
const originalError = console.error
beforeAll(() => {
  console.error = vi.fn()
})

afterAll(() => {
  console.error = originalError
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(() => 'mock-token'),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock window.location to prevent deploy preview detection in tests
// This ensures tests always use the localhost API
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:3000',
    href: 'http://localhost:3000',
    hostname: 'localhost',
    port: '3000',
    protocol: 'http:',
    search: '',
    pathname: '/',
  },
  writable: true,
})
