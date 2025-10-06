// Shim to ensure @mui/styled-engine resolves to a callable Emotion styled and helpers
// Use package imports so resolution follows the project's hoisted node_modules.
import emStyled from '@emotion/styled'
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

// Re-export provider/global components from the real MUI styled-engine ESM implementation
// Reference the root node_modules directly (three levels up from client/src/shims -> repo root)
export { default as StyledEngineProvider } from '../../../node_modules/@mui/styled-engine/esm/StyledEngineProvider/index.js'
export { default as GlobalStyles } from '../../../node_modules/@mui/styled-engine/esm/GlobalStyles/index.js'

