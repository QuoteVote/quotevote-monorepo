import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Root-level Vitest config to run tests across the monorepo with the
// same alias map and memory-friendly settings used by the client.
export default defineConfig({
  plugins: [
    react({ jsxRuntime: 'classic', include: '**/*.{js,jsx,ts,tsx}' }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    threads: false,
    include: ['**/*.test.jsx', '**/*.test.ts', '**/*.test.tsx'],
    setupFiles: ['client/src/test-setup-emotion-alias.cjs', 'client/src/test-setup-mocks.js', 'client/src/setupTests.js'],
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'client', 'src') },
      { find: 'store', replacement: resolve(__dirname, 'client', 'src', 'store') },
      { find: 'assets', replacement: resolve(__dirname, 'client', 'src', 'assets') },
      { find: 'components', replacement: resolve(__dirname, 'client', 'src', 'components') },
  { find: 'utils', replacement: resolve(__dirname, 'client', 'src', 'utils') },
      { find: 'themes', replacement: resolve(__dirname, 'client', 'src', 'themes') },
      { find: 'views', replacement: resolve(__dirname, 'client', 'src', 'views') },
      { find: 'mui-pro', replacement: resolve(__dirname, 'client', 'src', 'mui-pro') },
      // Ensure react and react-dom resolve to the root hoisted copies
      { find: 'react', replacement: resolve(__dirname, 'node_modules', 'react', 'index.js') },
      { find: 'react-dom', replacement: resolve(__dirname, 'node_modules', 'react-dom', 'index.js') },
      // emotion and MUI: prefer hoisted root builds to ensure a single runtime
      { find: '@emotion/styled', replacement: resolve(__dirname, 'node_modules', '@emotion', 'styled', 'dist', 'emotion-styled.development.cjs.js') },
      { find: '@emotion/react', replacement: resolve(__dirname, 'node_modules', '@emotion', 'react', 'dist', 'emotion-react.development.cjs.js') },
  { find: /^@mui\/styles(\/.*)?$/, replacement: resolve(__dirname, 'node_modules', '@mui', 'styles') + '$1' },
  { find: '@mui/styles', replacement: resolve(__dirname, 'node_modules', '@mui', 'styles', 'node', 'index.js') },
  // Map MUI icons to lightweight mocks during tests to avoid opening many ESM
  // icon files (reduces EMFILE on Windows and stabilizes snapshots).
  // Deep imports like '@mui/icons-material/Face' -> point to small mock files
  // under client/src/test/mocks/mui-icons/Face.js
  { find: /^@mui\/icons-material\/(.*)$/, replacement: resolve(__dirname, 'client', 'src', 'test', 'mocks', 'mui-icons') + '/$1.js' },
  // Exact root import (named exports) -> use the full shim that provides
  // named exports used across the codebase. Use an exact-regex so we don't
  // accidentally perform prefix replacement which would create invalid
  // paths when the replacement is a file.
  { find: /^@mui\/icons-material$/, replacement: resolve(__dirname, 'client', 'src', 'shims', 'mui-icons-root.js') },
    // Preserve subpaths (e.g. @mui/material/Badge) so deep imports still resolve
  { find: /^@mui\/(material|system)(\/.*)?$/, replacement: resolve(__dirname, 'node_modules', '@mui') + '/$1$2' },
      // GraphQL alias used in client code
      { find: '@/graphql', replacement: resolve(__dirname, 'client', 'src', 'graphql') },
  { find: 'themes/SecondTheme', replacement: resolve(__dirname, 'client', 'src', 'themes', 'SecondTheme') },
      // Server-specific path alias used in server tests
      { find: '~', replacement: resolve(__dirname, 'server') },
    ],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@emotion/react', '@emotion/styled', '@mui/material', '@mui/system'],
  },
})
