// This file runs before `setupTests.js` and establishes deterministic mocks
// that must be present before other modules bind imported functions.
// Provide a minimal localStorage mock early so modules that initialize
// (for example redux-persist / localforage) don't throw when run under
// the test environment where localStorage may not be present.
if (typeof global.localStorage === 'undefined' || global.localStorage === null) {
  const _storage = {}
  global.localStorage = {
    getItem: (key) => (Object.prototype.hasOwnProperty.call(_storage, key) ? _storage[key] : null),
    setItem: (key, value) => { _storage[key] = String(value) },
    removeItem: (key) => { delete _storage[key] },
    clear: () => { Object.keys(_storage).forEach(k => delete _storage[k]) },
  }
  // Ensure window.localStorage exists in jsdom environments
  if (typeof window !== 'undefined') {
    window.localStorage = global.localStorage
  } else {
    global.window = global.window || {}
    global.window.localStorage = global.localStorage
  }
}

import React from 'react'
import { createTheme, ThemeProvider as MaterialThemeProvider } from '@mui/material/styles'
import { ThemeProvider as StylesThemeProvider } from '@mui/styles'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from './store/store'
import muiThemeObject from './theme'

const themeInstance = createTheme(muiThemeObject)
const AllProviders = ({ children }) => React.createElement(
  MaterialThemeProvider,
  { theme: themeInstance },
  React.createElement(StylesThemeProvider, { theme: themeInstance }, React.createElement(Provider, { store }, React.createElement(BrowserRouter, null, children))),
)

// Add Testing Library custom matchers (toBeInTheDocument etc.)
try {
  // eslint-disable-next-line import/no-extraneous-dependencies,global-require
  require('@testing-library/jest-dom/extend-expect')
} catch (e) {
  // ignore if not installed in the environment
}

// If running under Vitest, mock @testing-library/react so named imports
// receive our wrapped render function. This runs earlier than setupTests.js
// so modules that import render get the mocked version.
// Guard for environments without `vi`.
if (typeof vi !== 'undefined' && typeof vi.mock === 'function') {
  try {
    vi.mock('@testing-library/react', async () => {
      const actual = await vi.importActual('@testing-library/react')
      return {
        ...actual,
        render: (ui, options) => actual.render(ui, { wrapper: AllProviders, ...options }),
      }
    })
    // Stub react-material-ui-carousel used in several components to avoid
    // its requiring legacy v4 imports at test time. The real package depends
    // on @material-ui/core/Fade and Hidden which are missing in this setup
    // path; mocking avoids needing to shim node_modules directly.
    vi.mock('react-material-ui-carousel', () => {
      const React = require('react')
      const Carousel = ({ children }) => React.createElement('div', { 'data-testid': 'carousel' }, children)
      return {
        __esModule: true,
        default: Carousel,
      }
    })

    // Provide quick mocks for legacy v4 paths that some packages require.
    // These delegate to the equivalent @mui/material components when available.
    try {
      vi.mock('@material-ui/core/Fade', () => {
        const actual = require('@mui/material/Fade')
        return { __esModule: true, default: actual && actual.default ? actual.default : actual }
      })
    } catch (e) {
      // ignore
    }
    try {
      vi.mock('@material-ui/core/Hidden', () => {
        const actual = require('@mui/material/Hidden')
        return { __esModule: true, default: actual && actual.default ? actual.default : actual }
      })
    } catch (e) {
      // ignore
    }
    // Provide a partial mock for Apollo hooks that preserves the module's
    // other exports (like ApolloProvider) but replaces useMutation with a
    // stable test-friendly mock. Tests that need to assert mutation calls
    // can override this mock locally.
    try {
      vi.mock('@apollo/react-hooks', async (importOriginal) => {
        const actual = await importOriginal()
        // Return a tuple [mutateFunction, mutationResult] so components that
        // destructure the second element (e.g. { loading }) don't crash.
        const mockMutate = vi.fn()
        const defaultResult = { loading: false, error: null, data: undefined }
        return { ...actual, useMutation: () => [mockMutate, defaultResult] }
      })
    } catch (e) {
      // ignore if mocking fails in non-vitest environments
    }
  } catch (e) {
    // ignore
  }
}
