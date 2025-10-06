// CommonJS shim that delegates to the hoisted @emotion/styled development CJS build.
// This ensures Vite/Vitest aliasing can point to a stable module that re-exports the
// root-installed Emotion package even when a client-local copy exists.
const path = require('path')
let pkg
try {
  // Resolve from the repository root node_modules (three levels up from src/shims)
  // client/src/shims -> ../../.. -> <repo root>/node_modules
  pkg = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', '@emotion', 'styled', 'dist', 'emotion-styled.development.cjs.js'))
} catch (e) {
  // Fallback to requiring the installed package (client-local) if hoisted one isn't available
  // This keeps the shim robust in different install layouts.
  // eslint-disable-next-line global-require
  pkg = require('@emotion/styled')
}

// Export in a way that works for both CommonJS and ESM consumers.
module.exports = pkg
module.exports.default = pkg.default || pkg
