// Compatibility shim for the legacy '@material-ui/core/Hidden' import.
// Re-export the @mui/material Hidden component to satisfy packages that still
// import the v4 path.
try {
  // eslint-disable-next-line global-require
  const Hidden = require('@mui/material/Hidden')
  module.exports = Hidden && Hidden.default ? Hidden.default : Hidden
} catch (e) {
  // If @mui/material isn't available, export a minimal stub component to avoid
  // runtime crashes in tests. The stub renders its children.
  const React = require('react')
  module.exports = function HiddenStub({ children }) { return React.createElement(React.Fragment, null, children) }
}
