// Re-export the hoisted ESM build so Rollup can statically analyze exports.
// This file intentionally points at the hoisted ESM bundle under the repo root
// node_modules. Netlify and workspace installs hoist packages to the repo root
// which makes this path valid in CI.
export * from '../../../node_modules/@emotion/styled/dist/emotion-styled.development.esm.js'
export { default } from '../../../node_modules/@emotion/styled/dist/emotion-styled.development.esm.js'
