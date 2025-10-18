// Shim around @testing-library/react render so components under test receive theme and providers
// IMPORTANT: this file is alias target for '@testing-library/react' in Vitest and Vite.
// To avoid circular resolution (alias -> shim -> alias), require the real package via
// a direct path into client/node_modules so we bypass the alias.
let rtl
try {
  // prefer client local node_modules if present
  rtl = require('../../node_modules/@testing-library/react')
} catch (e) {
  // fallback to repo root (hoisted) node_modules
  // eslint-disable-next-line global-require
  rtl = require('../../../node_modules/@testing-library/react')
}
const React = require('react')
const { createTheme, ThemeProvider: MaterialThemeProvider } = require('@mui/material/styles')
const { ThemeProvider: StylesThemeProvider } = require('@mui/styles')
const { BrowserRouter } = require('react-router-dom')
const { Provider: ReduxProvider } = require('react-redux')
const store = require('../store/store')
const muiThemeObject = require('../theme').default || require('../theme')

const themeInstance = createTheme(muiThemeObject)

function AllProviders({ children }) {
  return (
    React.createElement(MaterialThemeProvider, { theme: themeInstance },
      React.createElement(StylesThemeProvider, { theme: themeInstance },
        React.createElement(ReduxProvider, { store },
          React.createElement(BrowserRouter, null, children)
        )
      )
    )
  )
}

// Re-export everything from the real testing library
module.exports = {
  ...rtl,
  render(ui, options) {
    const wrapper = ({ children }) => React.createElement(AllProviders, null, children)
    return rtl.render(ui, { wrapper, ...options })
  },
  renderWithProviders(ui, options) {
    const wrapper = ({ children }) => React.createElement(AllProviders, null, children)
    return rtl.render(ui, { wrapper, ...options })
  },
}
