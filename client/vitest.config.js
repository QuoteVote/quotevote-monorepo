import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic', include: '**/*.{js,jsx,ts,tsx}' })],
  test: {
    globals: true,
    environment: 'jsdom',
    deps: {
      inline: ['@mui/material', '@mui/system', '@mui/styled-engine', '@emotion/react', '@emotion/styled', 'cheerio', 'cheerio/lib/utils'],
    },
    setupFiles: [resolve(__dirname, 'src', 'test-setup-mocks.js'), resolve(__dirname, 'src', 'setupTests.js')],
    threads: false,
    include: ['**/*.test.jsx', '**/*.test.tsx', '**/*.test.ts'],
  // Also transform files under node_modules for packages that ship package
  // subpath imports or untranspiled ESM/CJS code (cheerio, @mui/*). This
  // ensures Vite rewrites problematic imports (like 'cheerio/lib/utils'
  // and 'react/jsx-runtime') before Node's ESM loader attempts to resolve
  // them and hit package.exports restrictions.
  transformMode: { web: ['**/*.test.jsx', '**/*.test.tsx', '**/*.test.ts', 'node_modules/**'] },
  },
  server: {
    deps: {
      inline: ['@mui/material', '@mui/system', '@mui/styled-engine', '@emotion/react', '@emotion/styled', 'cheerio', 'cheerio/lib/utils'],
    },
  },
  resolve: {
    alias: [
  { find: 'react/jsx-dev-runtime', replacement: resolve(__dirname, '..', 'node_modules', 'react', 'jsx-dev-runtime.js') },
  { find: 'react/jsx-runtime', replacement: resolve(__dirname, '..', 'node_modules', 'react', 'jsx-runtime.js') },
      { find: '@', replacement: resolve(__dirname, 'src') },
  // Resolve the hoisted ESM build for @emotion/styled so deep-subpath
  // imports don't get appended to a local shim file path.
  { find: '@emotion/styled/dist/emotion-styled.development.esm.js', replacement: resolve(__dirname, '..', 'node_modules', '@emotion', 'styled', 'dist', 'emotion-styled.development.esm.js') },
  { find: '@emotion/styled', replacement: resolve(__dirname, '..', 'node_modules', '@emotion', 'styled', 'dist', 'styled.cjs.js') },
      { find: '@emotion/react', replacement: resolve(__dirname, '..', 'node_modules', '@emotion', 'react', 'dist', 'emotion-react.cjs.js') },
      { find: '@emotion/styled.local-shim', replacement: resolve(__dirname, 'src', 'shims', 'emotion-styled-shim.js') },
      { find: '@emotion/react.local-shim', replacement: resolve(__dirname, 'src', 'shims', 'emotion-react-shim.js') },
      { find: '@material-ui/core/Hidden', replacement: resolve(__dirname, 'src', 'shims', 'material-ui-core-Hidden.js') },
  // Map common v4 subpath imports to their v5 @mui/material ESM counterparts for Vitest
  { find: '@material-ui/core/IconButton', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'IconButton', 'index.js') },
  { find: '@material-ui/core/Button', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'Button', 'index.js') },
  { find: '@material-ui/core/Grid', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'Grid', 'index.js') },
  { find: '@material-ui/core/Box', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'Box', 'index.js') },
  { find: '@material-ui/core/Typography', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'Typography', 'index.js') },
  { find: '@material-ui/core/Divider', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'Divider', 'index.js') },
      { find: '@mui/styled-engine/esm', replacement: resolve(__dirname, 'src', 'shims', 'mui-styled-engine.js') },
      { find: '@mui/styled-engine', replacement: resolve(__dirname, 'src', 'shims', 'mui-styled-engine.js') },
      { find: '@mui/styles', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'styles', 'index.js') },
      { find: '@material-ui/core/Fade', replacement: resolve(__dirname, 'src', 'shims', 'material-ui-core-Fade.js') },
      { find: '@mui/styles/', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'styles') + '/' },
  { find: '@mui/icons-material', replacement: resolve(__dirname, 'src', 'shims', 'mui-icons-material') },
  { find: '@mui/icons-material/', replacement: resolve(__dirname, 'src', 'shims', 'mui-icons-material') + '/' },
  // Support older material-ui v4 imports that reference '@material-ui/icons'
  { find: '@material-ui/icons', replacement: resolve(__dirname, 'src', 'shims', 'mui-icons-material') },
  { find: '@material-ui/icons/', replacement: resolve(__dirname, 'src', 'shims', 'mui-icons-material') + '/' },
  // Map legacy material-ui core imports to a local shim that re-exports
  // common symbols from @mui/material. This avoids package-subpath resolution
  // issues in CI where node_modules are hoisted.
  { find: '@material-ui/core', replacement: resolve(__dirname, 'src', 'shims', 'material-ui-core-index.js') },
  { find: '@material-ui/core/', replacement: resolve(__dirname, 'src', 'shims', 'material-ui-core-index.js') + '/' },
  { find: '@material-ui/core/styles', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'styles', 'index.js') },
  { find: '@material-ui/core/styles/', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'styles') + '/' },
      { find: '@mui/material/', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm') + '/' },
      { find: '@mui/system', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'system', 'esm') },
      { find: '@mui/system/', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'system', 'esm') + '/' },
      { find: 'redux-mock-store', replacement: resolve(__dirname, '..', 'node_modules', 'redux-mock-store', 'dist', 'index-cjs.js') },
      { find: 'assets', replacement: resolve(__dirname, 'src/assets') },
      { find: 'layouts', replacement: resolve(__dirname, 'src/layouts') },
      { find: 'components', replacement: resolve(__dirname, 'src/components') },
      { find: 'config', replacement: resolve(__dirname, 'src/config') },
      { find: 'store', replacement: resolve(__dirname, 'src/store') },
      { find: 'utils', replacement: resolve(__dirname, 'src/utils') },
      { find: 'views', replacement: resolve(__dirname, 'src/views') },
      { find: 'mui-pro', replacement: resolve(__dirname, 'src/mui-pro') },
      { find: 'hoc', replacement: resolve(__dirname, 'src/hoc') },
      { find: 'themes', replacement: resolve(__dirname, 'src/themes') },
  { find: 'cheerio/lib/utils', replacement: resolve(__dirname, 'node_modules', 'cheerio', 'lib', 'utils.js') },
  { find: 'cheerio/lib', replacement: resolve(__dirname, '..', 'node_modules', 'cheerio', 'lib', 'index.js') },
  { find: 'cheerio', replacement: resolve(__dirname, '..', 'node_modules', 'cheerio', 'dist', 'esm', 'index.js') },
    ],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@mui/material',
      '@material-ui/core',
      '@mui/system',
      '@emotion/styled',
      '@emotion/react',
      '@material-ui/icons',
      'cheerio',
      'cheerio/lib/utils',
    ],
  },
})