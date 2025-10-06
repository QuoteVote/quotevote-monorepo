// CommonJS shim that delegates to the hoisted @emotion/react development CJS build.
const path = require('path')
let pkg
try {
  // client/src/shims -> ../../.. -> <repo root>/node_modules
  pkg = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', '@emotion', 'react', 'dist', 'emotion-react.development.cjs.js'))
} catch (e) {
  // eslint-disable-next-line global-require
  pkg = require('@emotion/react')
}

module.exports = pkg
module.exports.default = pkg.default || pkg
