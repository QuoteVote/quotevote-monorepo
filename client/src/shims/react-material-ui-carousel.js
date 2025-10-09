// Re-export the real package so that relative imports to
// `src/shims/react-material-ui-carousel` resolve during build.
//
// The file used to exist during earlier iterations and was removed
// during cleanup; some components still import the shim with a
// relative path (../../../shims/react-material-ui-carousel). Re-adding
// a tiny re-export keeps the production build simple and avoids
// changing multiple source files.

export { default } from 'react-material-ui-carousel'
