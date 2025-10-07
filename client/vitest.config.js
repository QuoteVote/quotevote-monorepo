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
  // Test setup files. The emotion alias shim has been removed to keep the
  // client test setup minimal. If additional setup is needed, add the relevant
  // setup file here.
  // Use resolved absolute paths so Vitest can run from the monorepo root
  // and still locate client-local setup files.
  setupFiles: [resolve(__dirname, 'src', 'test-setup-mocks.js'), resolve(__dirname, 'src', 'setupTests.js')],
  // Run tests single-threaded to avoid too-many-open-files (EMFILE) on Windows
  threads: false,
    // Ensure Vite's web transform pipeline (including plugin-react) runs during test import-analysis
    // Only transform and run test files with the explicit .test.jsx/.test.tsx/.test.ts
    // extensions. This avoids running legacy `.test.js` placeholders which may be
    // empty or contain JSX that confuses the import analyzer.
    include: ['**/*.test.jsx', '**/*.test.tsx', '**/*.test.ts'],
    transformMode: {
      web: [/\.test\.jsx?$/i, /\.tsx?$/i],
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
      // Route all @emotion/* imports to the hoisted root node_modules CJS builds.
      // This ensures tests use a single Emotion runtime instance, matching how @mui
      // packages are resolved in the monorepo. This avoids context mismatches and
      // adds determinism to module resolution under Vitest.
  { find: '@emotion/styled', replacement: resolve(__dirname, '..', 'node_modules', '@emotion', 'styled', 'dist', 'styled.cjs.js') },
  { find: '@emotion/react', replacement: resolve(__dirname, '..', 'node_modules', '@emotion', 'react', 'dist', 'emotion-react.cjs.js') },
  // Keep the original shims available under separate names in case a
  // fallback is required for special test scenarios.
  { find: '@emotion/styled.local-shim', replacement: resolve(__dirname, 'src', 'shims', 'emotion-styled-shim.js') },
  { find: '@emotion/react.local-shim', replacement: resolve(__dirname, 'src', 'shims', 'emotion-react-shim.js') },
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
  // Map redux-mock-store to the hoisted root package so tests resolve the
  // same install used in the workspace root (npm workspaces hoists this
  // package). Point directly at the CJS bundle present under the root
  // node_modules to avoid Vite trying to load source files that may not
  // exist in the client package folder.
  { find: 'redux-mock-store', replacement: resolve(__dirname, '..', 'node_modules', 'redux-mock-store', 'dist', 'index-cjs.js') },
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
    ],
  },
}) 