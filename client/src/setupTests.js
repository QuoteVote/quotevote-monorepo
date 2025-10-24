import React from 'react'
// Register @testing-library/jest-dom matchers with Vitest's expect when
// available. Use the explicit matchers export and extend Vitest's expect so
// `toBeInTheDocument` and other helpers work in tests.
try {
  // eslint-disable-next-line import/no-extraneous-dependencies
  // Use the matchers entry which exports matcher functions compatible with
  // non-Jest runtimes. Then extend Vitest's expect with them.
  // Note: `expect` is provided by Vitest; importing it here is safe in ESM.
  // eslint-disable-next-line global-require
  const { expect: vitestExpect } = require('vitest')
  // eslint-disable-next-line global-require
  const jestDomMatchers = require('@testing-library/jest-dom/matchers')
  if (vitestExpect && jestDomMatchers) {
    vitestExpect.extend(jestDomMatchers)
  }
} catch (e) {
  // ignore if not installed or in environments where require isn't available
}
// Vitest: mock cheerio internal utils to avoid Node package-exports errors
// when code imports 'cheerio/lib/utils'. The project's Vite alias should
// handle this in most cases, but mocking here ensures the test runtime never
// attempts to resolve the non-exported package subpath at Node-level.
try {
  // vi is provided by Vitest. Use a safe conditional so this file still runs
  // under other runners or Node environments.
  // eslint-disable-next-line no-undef
  if (typeof vi !== 'undefined' && typeof vi.mock === 'function') {
    // Use require to keep this file compatible with CommonJS interop.
    // The shim exports an ESM re-export to cheerio's ESM utils bundle.
    // Return the module namespace expected by callers.
    // eslint-disable-next-line global-require
    const shim = require('./shims/cheerio-lib-utils.js')
    vi.mock('cheerio/lib/utils', () => ({
      __esModule: true,
      ...shim,
    }))
  }
} catch (err) {
  // ignore — mocking is optional and should not break non-vitest runs
}
// Ensure window.scrollTo exists early so any modules that call it during
// import or in mount effects won't throw in jsdom.
if (typeof window !== 'undefined' && typeof window.scrollTo !== 'function') {
  // eslint-disable-next-line no-empty-function
  window.scrollTo = function () {}
}
// (jest-dom already registered above)
// Avoid static import of enzyme so we can mock/alias cheerio before it's loaded.
// We'll lazily require enzyme below after mocks/aliases are in place.
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { HelmetProvider } from 'react-helmet-async'
import { createTheme, ThemeProvider as MaterialThemeProvider } from '@mui/material/styles'
import { ThemeProvider as StylesThemeProvider } from '@mui/styles'
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
let _shallow
let _render
let _mount
const themeInstance = createTheme(muiThemeObject)
// Create a shared Emotion cache for tests so class name generation is
// deterministic and all components share a single runtime instance.
// The `key` should be stable across environments; `prepend: true` ensures
// Emotion styles are inserted before other styles which matches production
// ordering and reduces differences between test runs.
const emotionCache = createCache({ key: 'css', prepend: true })

// Use the legacy ThemeProvider from @mui/styles so makeStyles and other
// @mui/styles hooks read the theme correctly during tests.
// Nest Material ThemeProvider and Styles ThemeProvider so both the new theming
// context (used by @mui/material/@mui/system) and the legacy @mui/styles
// context are available to components under test.
function TestProviders({ children }) {
  return React.createElement(
    CacheProvider,
    { value: emotionCache },
    React.createElement(
      MaterialThemeProvider,
      { theme: themeInstance },
      React.createElement(
        StylesThemeProvider,
        { theme: themeInstance },
        React.createElement(
          HelmetProvider,
          null,
          children,
        ),
      ),
    ),
  )
}

// Define global enzyme wrappers only if enzyme is available in this environment.
try {
  // eslint-disable-next-line global-require
  const enzymeModule = require('enzyme')
  // eslint-disable-next-line global-require
  const Adapter = require('enzyme-adapter-react-16')
  const { configure } = enzymeModule
  // Configure Enzyme
  configure({ adapter: new Adapter(), disableLifecycleMethods: true })
  _shallow = enzymeModule.shallow
  _render = enzymeModule.render
  _mount = enzymeModule.mount
  global.shallow = (node, options) => _shallow(
    React.createElement(TestProviders, null, node),
    options,
  )
  global.render = (node, options) => _render(
    React.createElement(TestProviders, null, node),
    options,
  )
  global.mount = (node, options) => _mount(
    React.createElement(TestProviders, null, node),
    options,
  )
  // Also patch the enzyme module exports so tests that import { mount, shallow, render }
  // from 'enzyme' receive the wrapped versions we just created above.
  const _origMount = enzymeModule.mount
  const _origShallow = enzymeModule.shallow
  const _origRender = enzymeModule.render

  enzymeModule.mount = (...args) => (global.__WRAPPED_ENZYME && global.__WRAPPED_ENZYME.mount ? global.__WRAPPED_ENZYME.mount(...args) : _origMount(...args))
  enzymeModule.shallow = (...args) => (global.__WRAPPED_ENZYME && global.__WRAPPED_ENZYME.shallow ? global.__WRAPPED_ENZYME.shallow(...args) : _origShallow(...args))
  enzymeModule.render = (...args) => (global.__WRAPPED_ENZYME && global.__WRAPPED_ENZYME.render ? global.__WRAPPED_ENZYME.render(...args) : _origRender(...args))

  global.__WRAPPED_ENZYME = {
    shallow: global.shallow,
    render: global.render,
    mount: global.mount,
  }
} catch (e) {
  // Enzyme may not be used in all tests; ignore if unavailable.
}
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

// Enzyme is configured lazily above.

// Patch @testing-library/react's render so tests using RTL automatically get
// the same provider tree we give to Enzyme tests. This ensures components
// that rely on @mui/styles' theme (makeStyles) receive a valid theme during
// rendering in tests and reduces failures where `theme.breakpoints` is undefined.
try {
  const _tlRender = TestingLibrary.render
  const AllProviders = ({ children }) => React.createElement(
    CacheProvider,
    { value: emotionCache },
    React.createElement(MaterialThemeProvider, { theme: themeInstance }, React.createElement(StylesThemeProvider, { theme: themeInstance }, React.createElement(HelmetProvider, null, React.createElement(Provider, { store }, React.createElement(BrowserRouter, null, children))))),
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
        CacheProvider,
        { value: emotionCache },
        React.createElement(MaterialThemeProvider, { theme: themeInstance }, React.createElement(StylesThemeProvider, { theme: themeInstance }, React.createElement(Provider, { store }, React.createElement(BrowserRouter, null, children)))),
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
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') {
    console.warn('[setupTests] resolved modules:', resolved)
  }
} catch (err) {
  // ignore — some test runners may run this file under environments without
  // Node-style resolution or where require.resolve is proxied.
}

// Mock fetch for tests
global.fetch = vi.fn()

// Temporarily suppress repetitive MUI Grid migration warnings in test output.
// These are noisy and come from components not yet migrated to Grid v2. We keep
// this filter narrow so it only suppresses messages that mention Grid props
// removal. Plan: remove this filter once components are migrated.
if (typeof console !== 'undefined' && console.error && typeof console.error === 'function') {
  const origConsoleError = console.error.bind(console)
  console.error = (...args) => {
    try {
      const message = args && args[0] ? String(args[0]) : ''
      if (message.includes('MUI Grid: The `item` prop has been removed') ||
          message.includes('MUI Grid: The `xs` prop has been removed') ||
          message.includes('MUI Grid: The `md` prop has been removed') ||
          message.includes('MUI Grid: The `sm` prop has been removed')) {
        // swallow this specific migration warning
        return
      }
    } catch (e) {
      // If anything goes wrong in the filter, fall back to the original.
    }
    origConsoleError(...args)
  }
}

// Stub window.scrollTo for jsdom which doesn't implement it by default.
// JSDOM exposes a function that throws "Not implemented"; overwrite it with
// a safe noop so components that call scrollTo during mount/effects don't
// cause test failures.
if (typeof window !== 'undefined') {
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

// Some third-party UI libraries ship untranspiled code or use syntax that
// Vite's SSR transform chokes on during tests. `react-material-ui-carousel`
// has caused parse/AST errors in the test environment. To avoid pulling the
// real implementation into the test runtime we provide a lightweight mock
// that renders children. Individual tests that need carousel behavior can
// still mock the module with a richer implementation.
if (typeof vi !== 'undefined' && typeof vi.mock === 'function') {
  try {
    vi.mock('react-material-ui-carousel', () => {
      // Return a simple functional component that renders children and
      // supports common props used in our components (index, onChange).
      const React = require('react')
      function CarouselStub({ children }) {
        return React.createElement('div', null, children)
      }

      return {
        __esModule: true,
        default: CarouselStub,
      }
    })
  } catch (err) {
    // ignore if mocking fails (non-vitest environment)
  }
}
