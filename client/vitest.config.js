import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react({
      // Ensure plugin handles .js test files containing JSX and use classic runtime
      // so JSX compiles to React.createElement instead of importing react/jsx-runtime.
      jsxRuntime: 'classic',
      include: '**/*.{js,jsx,ts,tsx}',
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup-mocks.js', './src/setupTests.js'],
    // Run tests single-threaded to avoid too-many-open-files (EMFILE) on Windows
    threads: false,
    // Ensure Vite's web transform pipeline (including plugin-react) runs during test import-analysis
    transformMode: {
      // Ensure files with .js that contain JSX are transformed by the web pipeline.
      // Include common test filename patterns like *.test.js and regular .js/.jsx
      web: [/\.test\.jsx?$/i, /\.jsx?$/i, /\.tsx?$/i],
    },
  },
  resolve: {
    // Use an ordered alias array so the more-specific jsx runtime paths are matched
    // before the generic `react` alias which would otherwise catch `react/*` imports.
    alias: [
      { find: 'react/jsx-dev-runtime', replacement: resolve(__dirname, 'node_modules', 'react', 'jsx-dev-runtime', 'index.js') },
      { find: 'react/jsx-runtime', replacement: resolve(__dirname, 'node_modules', 'react', 'jsx-runtime', 'index.js') },
      { find: '@', replacement: resolve(__dirname, 'src') },
      // Point react and react-dom to the hoisted root so all packages use the same instances
      { find: 'react', replacement: resolve(__dirname, '..', 'node_modules', 'react', 'index.js') },
    { find: 'react-dom', replacement: resolve(__dirname, '..', 'node_modules', 'react-dom', 'index.js') },
  // Route @emotion/* imports through our local shims which attempt to
  // require the hoisted root CJS builds first and fall back to the local
  // package. This adds determinism to module resolution under Vitest.
  // Point emotion directly to the hoisted CJS dev build if available.
  // Route emotion imports through local shims to make resolution deterministic
  { find: '@emotion/styled', replacement: resolve(__dirname, 'src', 'shims', 'emotion-styled-shim.js') },
  { find: '@emotion/react', replacement: resolve(__dirname, 'src', 'shims', 'emotion-react-shim.js') },
  { find: '@material-ui/core/Hidden', replacement: resolve(__dirname, 'src', 'shims', 'material-ui-core-Hidden.js') },
    // Point @mui/styled-engine and its ESM subpath to a local shim that re-exports Emotion's styled default
    { find: '@mui/styled-engine/esm', replacement: resolve(__dirname, 'src', 'shims', 'mui-styled-engine.js') },
    { find: '@mui/styled-engine', replacement: resolve(__dirname, 'src', 'shims', 'mui-styled-engine.js') },
  // Ensure subpath imports like '@mui/styles/makeStyles' resolve to the hoisted package
  { find: /^@mui\/styles(\/.*)?$/, replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'styles') + '$1' },
  // Map any import of @mui/icons-material (including subpaths) to the lightweight root shim
  { find: /^@mui\/icons-material(\/.*)?$/, replacement: resolve(__dirname, 'src', 'shims', 'mui-icons-root.js') },
  // Ensure all code resolves the same single copy of @mui/styles (avoid multiple copies causing context mismatch)
  { find: '@mui/styles', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'styles', 'index.js') },
  // Provide compatibility shim for legacy v4 imports used by some third-party packages
  { find: '@material-ui/core/Fade', replacement: resolve(__dirname, 'src', 'shims', 'material-ui-core-Fade.js') },
    { find: /^@mui\/material(\/.*)?$/, replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm') + '$1' },
    { find: /^@mui\/system(\/.*)?$/, replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'system', 'esm') + '$1' },
    // Map redux-mock-store to a client-local stub for import-analysis resolution
    { find: 'redux-mock-store', replacement: resolve(__dirname, 'node_modules', 'redux-mock-store', 'index.js') },
      { find: 'assets', replacement: resolve(__dirname, 'src/assets') },
      // Match Vite aliases used in development build so tests resolve the same imports
      { find: 'layouts', replacement: resolve(__dirname, 'src/layouts') },
  { find: 'components', replacement: resolve(__dirname, 'src/components') },
  { find: 'config', replacement: resolve(__dirname, 'src/config') },
      { find: 'store', replacement: resolve(__dirname, 'src/store') },
      { find: 'utils', replacement: resolve(__dirname, 'src/utils') },
      { find: 'views', replacement: resolve(__dirname, 'src/views') },
      { find: 'mui-pro', replacement: resolve(__dirname, 'src/mui-pro') },
      { find: 'hoc', replacement: resolve(__dirname, 'src/hoc') },
      { find: 'themes', replacement: resolve(__dirname, 'src/themes') },
      // Compatibility aliases for cheerio legacy internal imports (matches vite.config.js)
      { find: 'cheerio/lib/utils', replacement: resolve(__dirname, 'node_modules/cheerio/dist/commonjs/utils.js') },
      { find: 'cheerio/lib', replacement: resolve(__dirname, 'node_modules/cheerio/dist/commonjs/index.js') },
    ],
  },
  // Prebundle core dependencies so Vitest/Vite can resolve ESM imports from packages like MUI and React
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
  '@mui/material',
  '@mui/system',
      '@emotion/styled',
      '@emotion/react',
      'react-material-ui-carousel',
    ],
  },
}) 