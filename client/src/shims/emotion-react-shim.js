// ESM shim that re-exports the real @emotion/react package.
// Using ESM exports lets Rollup statically analyze named exports like CacheProvider.
// Prefer the hoisted package via normal resolution; if you need to prefer a CJS
// build in the future we can add a dynamic fallback, but exporting from the
// package entrypoint is sufficient for Vite/Rollup to resolve named exports.

// Re-export the hoisted ESM build directly to avoid hitting the
// Vite alias for '@emotion/react' (which points to this file).
// Using the explicit dist ESM file ensures Rollup can statically
// analyze named exports like CacheProvider.
export * from '../../../node_modules/@emotion/react/dist/emotion-react.development.esm.js'
export { default } from '../../../node_modules/@emotion/react/dist/emotion-react.development.esm.js'
