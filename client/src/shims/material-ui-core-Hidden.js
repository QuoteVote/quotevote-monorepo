// Compatibility ESM shim for the legacy '@material-ui/core/Hidden' import.
// Prefer the real MUI Hidden if present, otherwise provide a simple stub.
import React from 'react'
let HiddenExport
try {
  // This path may be aliased to a local shim by Vite config in production.
  // If the package exposes Hidden, re-export it.
  // eslint-disable-next-line import/no-unresolved
  HiddenExport = (await import('@mui/material/Hidden')).default
} catch (e) {
  HiddenExport = function HiddenStub({ children }) { return React.createElement(React.Fragment, null, children) }
}

export default HiddenExport
