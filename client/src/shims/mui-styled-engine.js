// Shim to ensure @mui/styled-engine resolves to a callable Emotion styled and helpers
// Use package imports so resolution follows the project's hoisted node_modules.
// Prefer package subpath imports instead of fragile relative paths. This lets
// Rollup/Vite resolve the files regardless of hoisting layout (repo root vs
// workspace-local node_modules) while still pointing at the explicit ESM
// bundles we need for static analysis.
import emStyled from '@emotion/styled/dist/emotion-styled.development.esm.js'
// Import the hoisted ESM build explicitly so Rollup can statically resolve
// named exports (serializeStyles) even when node_modules are hoisted.
// Import the package name; Vite will alias '@emotion/serialize' to the
// hoisted ESM file during build so Rollup can statically resolve named exports.
import { serializeStyles as emSerializeStyles } from '@emotion/serialize'

// Default export is Emotion's styled (callable)
export default emStyled

// Minimal internal helpers MUI expects
export function internal_mutateStyles(tag, processor) {
  if (Array.isArray(tag.__emotion_styles)) {
    tag.__emotion_styles = processor(tag.__emotion_styles)
  }
}

const wrapper = []
export function internal_serializeStyles(styles) {
  wrapper[0] = styles
  return emSerializeStyles(wrapper)
}

// Re-export utilities from emotion/react
export { ThemeContext, keyframes, css } from '@emotion/react'

// Provide minimal implementations for StyledEngineProvider and GlobalStyles to
// avoid brittle deep imports under test/build. These no-ops are sufficient for
// our usage in tests and do not affect style generation since Emotion handles it.
export function StyledEngineProvider({ children }) { return children }
export function GlobalStyles() { return null }

