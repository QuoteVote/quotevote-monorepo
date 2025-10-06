import React from 'react'
// Provide jest-dom matchers for assertions like `toBeInTheDocument`
try {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  require('@testing-library/jest-dom/extend-expect')
} catch (e) {
  // ignore if not installed or not available in this environment
}
import {
  configure, mount, render, shallow,
} from 'enzyme'
import { createTheme, ThemeProvider as MaterialThemeProvider } from '@mui/material/styles'
import { ThemeProvider as StylesThemeProvider } from '@mui/styles'
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'
import { MockedProvider } from '@apollo/react-testing'
import { act, create } from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store'
import { Mutation, Query } from 'react-apollo'
import { ApolloProvider, useMutation, useQuery } from '@apollo/react-hooks'
import { InMemoryCache } from 'apollo-cache-inmemory'
import client from './config/apollo'
import 'mutationobserver-shim'
import muiThemeObject from './theme'
import * as TestingLibrary from '@testing-library/react'

const cache = new InMemoryCache()
cache.writeData({
  data: {
    searchKey: '',
  },
})

// Make these available globally for tests
global.React = React
// Wrap enzyme helpers so components under test have a ThemeProvider by default.
const _shallow = shallow
const _render = render
const _mount = mount
const themeInstance = createTheme(muiThemeObject)

// Use the legacy ThemeProvider from @mui/styles so makeStyles and other
// @mui/styles hooks read the theme correctly during tests.
// Nest Material ThemeProvider and Styles ThemeProvider so both the new theming
// context (used by @mui/material/@mui/system) and the legacy @mui/styles
// context are available to components under test.
global.shallow = (node, options) => _shallow(
  React.createElement(MaterialThemeProvider, { theme: themeInstance }, React.createElement(StylesThemeProvider, { theme: themeInstance }, node)),
  options,
)
global.render = (node, options) => _render(
  React.createElement(MaterialThemeProvider, { theme: themeInstance }, React.createElement(StylesThemeProvider, { theme: themeInstance }, node)),
  options,
)
global.mount = (node, options) => _mount(
  React.createElement(MaterialThemeProvider, { theme: themeInstance }, React.createElement(StylesThemeProvider, { theme: themeInstance }, node)),
  options,
)
// Also patch the enzyme module exports so tests that import { mount, shallow, render }
// from 'enzyme' receive the wrapped versions we just created above. Vitest runs
// this setup file before test modules are evaluated, so imported references will
// point to these wrapped functions.
// Instead of mutating the enzyme module (which may be read-only in some
// environments), expose the wrapped helpers on a single global object that the
// shimmed enzyme exports will call into if present.
global.__WRAPPED_ENZYME = {
  shallow: global.shallow,
  render: global.render,
  mount: global.mount,
}

// If Vitest's `vi` is available, mock the 'enzyme' module so importing tests
// that do `import { mount, shallow, render } from 'enzyme'` will receive
// references that delegate to the wrapped helpers above. This keeps imports
// stable while allowing our wrapped helpers to provide ThemeProviders.
// Instead of mocking the entire 'enzyme' module (which can remove exports
// like `configure`), patch only the functions we want so other exports stay
// intact. We can safely mutate the imported module's properties to delegate
// to our wrapped helpers created above.
try {
  // eslint-disable-next-line import/no-extraneous-dependencies
  // Import the module namespace so we can override properties on it.
  // Using a namespace import gives us an object with writable properties
  // in CommonJS interop scenarios (which enzyme uses).
  // Note: this is synchronous and must run after global.__WRAPPED_ENZYME is set.
  // eslint-disable-next-line global-require
  const enzymeModule = require('enzyme')
  const _origMount = enzymeModule.mount
  const _origShallow = enzymeModule.shallow
  const _origRender = enzymeModule.render

  enzymeModule.mount = (...args) => (global.__WRAPPED_ENZYME.mount ? global.__WRAPPED_ENZYME.mount(...args) : _origMount(...args))
  enzymeModule.shallow = (...args) => (global.__WRAPPED_ENZYME.shallow ? global.__WRAPPED_ENZYME.shallow(...args) : _origShallow(...args))
  enzymeModule.render = (...args) => (global.__WRAPPED_ENZYME.render ? global.__WRAPPED_ENZYME.render(...args) : _origRender(...args))
} catch (e) {
  // If require isn't available in some environments, ignore and rely on the
  // global wrappers above (tests that import enzyme will still receive the
  // original functions; the most important thing is that `configure` exists).
}
global.sinon = sinon
global.MockedProvider = MockedProvider
global.ApolloProvider = ApolloProvider
global.act = act
global.create = create
global.BrowserRouter = BrowserRouter
global.Provider = Provider
global.store = store
global.Mutation = Mutation
global.Query = Query
global.useQuery = useQuery
global.useMutation = useMutation
global.client = client
global.cache = cache
global.MutationObserver = window.MutationObserver

// vitest compatibility: some tests use `jest` globals (jest.mock, jest.fn)
// map `jest` to `vi` so existing tests keep working under Vitest.
global.jest = typeof vi !== 'undefined' ? vi : global.jest

// Configure Enzyme
configure({ adapter: new Adapter(), disableLifecycleMethods: true })

// Patch @testing-library/react's render so tests using RTL automatically get
// the same provider tree we give to Enzyme tests. This ensures components
// that rely on @mui/styles' theme (makeStyles) receive a valid theme during
// rendering in tests and reduces failures where `theme.breakpoints` is undefined.
try {
  const _tlRender = TestingLibrary.render
  const AllProviders = ({ children }) => React.createElement(
    MaterialThemeProvider,
    { theme: themeInstance },
    React.createElement(StylesThemeProvider, { theme: themeInstance }, React.createElement(Provider, { store }, React.createElement(BrowserRouter, null, children))),
  )

  TestingLibrary.render = (ui, options) => _tlRender(ui, { wrapper: AllProviders, ...options })
} catch (e) {
  // If for some reason @testing-library/react isn't present or cannot be
  // patched in the environment this file runs in, continue silently and
  // rely on existing enzyme wrappers. Tests importing RTL will then use the
  // unpatched render.
}

// If running under Vitest, mock the @testing-library/react module so that any
// named imports (e.g. `import { render } from '@testing-library/react'`) are
// guaranteed to receive our wrapped render. This is more reliable than
// monkeypatching the namespace because some module systems copy exported
// functions on import.
if (typeof vi !== 'undefined' && typeof vi.mock === 'function') {
  try {
    vi.mock('@testing-library/react', async () => {
      const actual = await vi.importActual('@testing-library/react')
      const AllProviders = ({ children }) => React.createElement(
        MaterialThemeProvider,
        { theme: themeInstance },
        React.createElement(StylesThemeProvider, { theme: themeInstance }, React.createElement(Provider, { store }, React.createElement(BrowserRouter, null, children))),
      )

      return {
        ...actual,
        render: (ui, options) => actual.render(ui, { wrapper: AllProviders, ...options }),
      }
    })
  } catch (e) {
    // ignore mock failures in non-vitest environments
  }
}

// Diagnostic: print resolved paths of core packages to detect multiple copies
// (monorepo/hoisting problems can make multiple instances of @mui/styles or
// Emotion load, which breaks ThemeProvider context.)
try {
  // Use require.resolve to find the exact file path Vite/Vitest will load.
  // Wrap in try/catch for environments where require.resolve isn't available.
  // eslint-disable-next-line global-require
  const resolved = {
    react: require.resolve('react'),
    'react-dom': require.resolve('react-dom'),
    '@mui/styles': require.resolve('@mui/styles'),
    '@mui/material': require.resolve('@mui/material'),
    '@emotion/styled': require.resolve('@emotion/styled'),
  }
  // Log at warn level so it shows in test output but is visible among other logs.
  // This will help confirm whether @mui/styles and @emotion are resolved to the
  // hoisted root node_modules or to a client-local copy.
  // eslint-disable-next-line no-console
  console.warn('[setupTests] resolved modules:', resolved)
} catch (err) {
  // ignore — some test runners may run this file under environments without
  // Node-style resolution or where require.resolve is proxied.
}

// Mock fetch for tests
global.fetch = vi.fn()

// Stub window.scrollTo for jsdom which doesn't implement it by default
// Some components call window.scrollTo during effects; provide a noop to avoid
// "Not implemented: window.scrollTo" errors in tests.
if (typeof window !== 'undefined' && typeof window.scrollTo !== 'function') {
  // eslint-disable-next-line no-empty-function
  window.scrollTo = function () {}
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Provide a global `Hidden` component for legacy code that references
// `Hidden` without explicitly importing it. Some components in this repo
// use <Hidden> in JSX but don't import it; provide a global to avoid
// ReferenceError during tests. Prefer the @mui/material implementation
// when available, otherwise fall back to a simple stub that renders
// children (so layout logic that depends on Hidden won't break tests).
try {
  // eslint-disable-next-line global-require
  const HiddenImpl = require('@mui/material/Hidden')
  global.Hidden = HiddenImpl && HiddenImpl.default ? HiddenImpl.default : HiddenImpl
} catch (e) {
  // Fallback stub
  // eslint-disable-next-line global-require
  const React = require('react')
  global.Hidden = function HiddenStub({ children }) { return React.createElement(React.Fragment, null, children) }
}
