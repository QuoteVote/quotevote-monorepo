import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react({
        // Use classic runtime so transformed JSX doesn't import react/jsx-runtime
        // which simplifies resolution in this hoisted monorepo environment.
        jsxRuntime: 'classic',
        babel: {
          plugins: [
            ['@babel/plugin-transform-react-jsx', { runtime: 'classic' }],
          ],
        },
      }),
      svgr({
        svgrOptions: {
          icon: true,
          typescript: false,
        },
        include: '**/*.svg',
      }),
    ],
    resolve: {
      alias: [
        { find: 'react/jsx-dev-runtime', replacement: resolve(__dirname, 'node_modules', 'react', 'jsx-dev-runtime', 'index.js') },
        { find: 'react/jsx-runtime', replacement: resolve(__dirname, 'node_modules', 'react', 'jsx-runtime', 'index.js') },
        { find: '@', replacement: resolve(__dirname, 'src') },
        // Add aliases for common directories
        { find: 'layouts', replacement: resolve(__dirname, 'src/layouts') },
        { find: 'components', replacement: resolve(__dirname, 'src/components') },
        { find: 'config', replacement: resolve(__dirname, 'src/config') },
        { find: 'store', replacement: resolve(__dirname, 'src/store') },
        { find: 'assets', replacement: resolve(__dirname, 'src/assets') },
        { find: 'utils', replacement: resolve(__dirname, 'src/utils') },
        { find: 'views', replacement: resolve(__dirname, 'src/views') },
        { find: 'mui-pro', replacement: resolve(__dirname, 'src/mui-pro') },
        { find: 'hoc', replacement: resolve(__dirname, 'src/hoc') },
        { find: 'themes', replacement: resolve(__dirname, 'src/themes') },
        // Point react and react-dom to the monorepo root copies so imports from node_modules/@mui/* resolve
        { find: 'react', replacement: resolve(__dirname, '..', 'node_modules', 'react', 'index.js') },
        { find: 'react-dom', replacement: resolve(__dirname, '..', 'node_modules', 'react-dom', 'index.js') },
  // Route all @emotion/* imports through local shims, which resolve to the hoisted root CJS dev builds when available.
  // This prevents accidental resolution of client-local copies during Vitest runs and makes it easier to control resolution in both development and tests.
  { find: '@emotion/styled', replacement: resolve(__dirname, 'src', 'shims', 'emotion-styled-shim.js') },
  { find: '@emotion/react', replacement: resolve(__dirname, 'src', 'shims', 'emotion-react-shim.js') },
  // Point @mui/styled-engine and its ESM subpath to a local shim that re-exports Emotion's styled default
  { find: '@mui/styled-engine/esm', replacement: resolve(__dirname, 'src', 'shims', 'mui-styled-engine.js') },
  { find: '@mui/styled-engine', replacement: resolve(__dirname, 'src', 'shims', 'mui-styled-engine.js') },
  // Ensure subpath imports like '@mui/styles/makeStyles' resolve to the hoisted package directory
  // Keep subpath suffix ($1) so imports like '@mui/styles/makeStyles' -> <root>/node_modules/@mui/styles/makeStyles
  { find: /^@mui\/styles(\/.*)?$/, replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'styles') + '$1' },
  // Map icons to a lightweight shim during dev and tests to avoid opening many files
  // Map any import of @mui/icons-material or subpaths to a lightweight root shim
  { find: /^@mui\/icons-material(\/.*)?$/, replacement: resolve(__dirname, 'src', 'shims', 'mui-icons-root.js') },
  // Also ensure core @mui packages resolve to the monorepo root to avoid multiple instances.
  // Map @mui material subpaths (e.g. @mui/material/styles) to the ESM build so Vite can
  // statically resolve imports during transform/import-analysis.
  { find: /^@mui\/material(\/.*)?$/, replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm') + '$1' },
  { find: /^@mui\/system(\/.*)?$/, replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'system', 'esm') + '$1' },
  // ensure '@mui/styles' direct import resolves too
  { find: '@mui/styles', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'styles', 'index.js') },
  // shim legacy Hidden import
  { find: '@material-ui/core/Hidden', replacement: resolve(__dirname, 'src', 'shims', 'material-ui-core-Hidden.js') },
        // Compatibility aliases for packages that import internal cheerio paths
        // which are blocked by package exports in newer cheerio versions.
        // Redirect requests like 'cheerio/lib/utils' -> cheerio/dist/commonjs/utils.js
        { find: 'cheerio/lib/utils', replacement: resolve(__dirname, 'node_modules/cheerio/dist/commonjs/utils.js') },
        { find: 'cheerio/lib', replacement: resolve(__dirname, 'node_modules/cheerio/dist/commonjs/index.js') },
      ],
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Add any global SCSS variables or imports
        },
      },
    },
    server: {
      port: 3000,
      open: true,
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..'],
      },
    },
    preview: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: 'build',
      sourcemap: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
      },
    },
    define: {
      // Handle any global variables that need to be defined
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.PUBLIC_URL': JSON.stringify(''),
      // Map REACT_APP_ environment variables
      'process.env.REACT_APP_SERVER': JSON.stringify(env.REACT_APP_SERVER),
      'process.env.REACT_APP_SERVER_WS': JSON.stringify(
        env.REACT_APP_SERVER_WS,
      ),
      'process.env.REACT_APP_DOMAIN': JSON.stringify(env.REACT_APP_DOMAIN),
      global: 'window',
    },
    optimizeDeps: {
      esbuildOptions: {
        jsx: 'classic',
      },
      include: [
        'react',
        'react-dom',
          '@mui/material',
          '@mui/icons-material',
          '@emotion/styled',
          '@emotion/react',
          'react-material-ui-carousel',
        'react/jsx-dev-runtime',
        'react/jsx-runtime',
        '@apollo/client',
        'react-router-dom',
      ],
    },
  }
})
