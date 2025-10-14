import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { existsSync } from 'fs'
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
  // Prefer resolving package subpath imports via local shims so Vite can
  // statically analyze and rewrite them during transform. Using shims avoids
  // Node's ESM loader needing to resolve bare package subpaths at runtime.
  { find: 'react/jsx-dev-runtime', replacement: resolve(__dirname, 'src', 'shims', 'react-jsx-dev-runtime.js') },
  { find: 'react/jsx-runtime', replacement: resolve(__dirname, 'src', 'shims', 'react-jsx-runtime.js') },
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
  // Note: avoid broad 'react' / 'react-dom' aliases here to allow package
  // subpath imports (like 'react/jsx-runtime') to resolve to their explicit
  // .js targets. Specific aliases for 'react/jsx-runtime' are used above.
  // Route all @emotion/* imports through local shims, which resolve to the hoisted root CJS dev builds when available.
  // This prevents accidental resolution of client-local copies during Vitest runs and makes it easier to control resolution in both development and tests.
  // Prefer resolving the exact hoisted ESM build for @emotion/styled so
  // deep-subpath imports (e.g. '@emotion/styled/dist/emotion-styled.development.esm.js')
  // will resolve to the correct file instead of being appended to a local shim
  // path. This avoids Vite trying to load '<shim>.js/dist/...' which causes ENOENT.
  { find: '@emotion/styled/dist/emotion-styled.development.esm.js', replacement: resolve(__dirname, '..', 'node_modules', '@emotion', 'styled', 'dist', 'emotion-styled.development.esm.js') },
  { find: '@emotion/styled', replacement: resolve(__dirname, '..', 'node_modules', '@emotion', 'styled', 'dist', 'emotion-styled.development.esm.js') },
  { find: '@emotion/react', replacement: resolve(__dirname, 'src', 'shims', 'emotion-react-shim.js') },
  // Point @mui/styled-engine and its ESM subpath to a local shim that re-exports Emotion's styled default
  // Let subpath imports under '@mui/styled-engine/esm/*' resolve to the
  // hoisted package esm directory so Rollup/Vite can statically analyze
  // named exports. Default imports from '@mui/styled-engine' will point at
  // our local shim which ensures a single Emotion runtime.
  { find: '@mui/styled-engine/esm/', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'styled-engine', 'esm') + '/' },
  { find: '@mui/styled-engine/esm', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'styled-engine', 'esm', 'index.js') },
  { find: '@mui/styled-engine', replacement: resolve(__dirname, 'src', 'shims', 'mui-styled-engine.js') },
  // Ensure Rollup can statically resolve named exports from Emotion's serialize
  // package when node_modules are hoisted to the repo root (CI). This points
  // the package specifier to the explicit ESM build used during bundling.
  // Prefer the client-local node_modules path (Netlify installs node_modules in the project),
  // but fall back to the repo root hoisted layout if present. This avoids hard ENOENTs
  // when CI's node_modules layout differs from local dev.
  { find: '@emotion/serialize', replacement: (
    existsSync(resolve(__dirname, 'node_modules', '@emotion', 'serialize', 'dist', 'serialize.esm.js'))
      ? resolve(__dirname, 'node_modules', '@emotion', 'serialize', 'dist', 'serialize.esm.js')
      : resolve(__dirname, '..', 'node_modules', '@emotion', 'serialize', 'dist', 'serialize.esm.js')
  ) },
  // Prefer string-prefix aliases so subpath imports (e.g. '@mui/styles/makeStyles')
  // resolve to the package directory. Put the trailing-slash alias first so
  // imports like '@mui/styles/withStyles' map to the styles folder, not to
  // the index.js file (which would cause index.js/withStyles to be requested).
  { find: '@mui/styles/', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'styles') + '/' },
  { find: '@mui/styles', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'styles', 'index.js') },
  // Map icons to a lightweight shim during dev and tests to avoid opening many files
  { find: '@mui/icons-material', replacement: resolve(__dirname, 'src', 'shims', 'mui-icons-material') },
  { find: '@mui/icons-material/', replacement: resolve(__dirname, 'src', 'shims', 'mui-icons-material') + '/' },
  // Support older material-ui v4 imports that reference '@material-ui/icons'
  { find: '@material-ui/icons', replacement: resolve(__dirname, 'src', 'shims', 'mui-icons-material') },
  { find: '@material-ui/icons/', replacement: resolve(__dirname, 'src', 'shims', 'mui-icons-material') + '/' },
  // Map specific legacy v4 subpath imports to pkg equivalents first so
  // they don't accidentally resolve against the generic shim file.
  { find: '@material-ui/core/styles', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'styles', 'index.js') },
  { find: '@material-ui/core/styles/', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'styles') + '/' },
  // Map specific v4 subpath imports that point at individual files to local shims
  { find: '@material-ui/core/Fade', replacement: resolve(__dirname, 'src', 'shims', 'material-ui-core-Fade.js') },
  // Map common v4 subpath imports to their v5 @mui/material ESM counterparts
  { find: '@material-ui/core/IconButton', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'IconButton', 'index.js') },
  { find: '@material-ui/core/Button', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'Button', 'index.js') },
  { find: '@material-ui/core/Grid', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'Grid', 'index.js') },
  { find: '@material-ui/core/Box', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'Box', 'index.js') },
  { find: '@material-ui/core/Typography', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'Typography', 'index.js') },
  { find: '@material-ui/core/Slide', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'Slide', 'index.js') },
  { find: '@material-ui/core/Divider', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'Divider', 'index.js') },
  // Map legacy v4 imports to a local shim that re-exports @mui/material
  // common symbols so Rollup can statically resolve named exports.
  { find: '@material-ui/core', replacement: resolve(__dirname, 'src', 'shims', 'material-ui-core-index.js') },
  { find: '@material-ui/core/', replacement: resolve(__dirname, 'src', 'shims', 'material-ui-core-index.js') + '/' },
  // Ensure core @mui packages resolve to the monorepo root to avoid multiple instances.
  { find: '@mui/material', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm') },
  { find: '@mui/material/', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm') + '/' },
  { find: '@mui/system', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'system', 'esm') },
  { find: '@mui/system/', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'system', 'esm') + '/' },
  // ensure '@mui/styles' direct import resolves too
  { find: '@mui/styles', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'styles', 'index.js') },
  // shim legacy Hidden import
  { find: '@material-ui/core/Hidden', replacement: resolve(__dirname, 'src', 'shims', 'material-ui-core-Hidden.js') },
  // Map common v4 subpath imports to their v5 @mui/material ESM counterparts.
  // This helps Rollup statically resolve named exports for imports like
  // '@material-ui/core/IconButton' during CI when node_modules are hoisted.
  { find: '@material-ui/core/IconButton', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'IconButton', 'index.js') },
  { find: '@material-ui/core/Button', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'Button', 'index.js') },
  { find: '@material-ui/core/Grid', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'Grid', 'index.js') },
  { find: '@material-ui/core/Box', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'Box', 'index.js') },
  { find: '@material-ui/core/Typography', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'Typography', 'index.js') },
  { find: '@material-ui/core/Divider', replacement: resolve(__dirname, '..', 'node_modules', '@mui', 'material', 'esm', 'Divider', 'index.js') },
        // Compatibility aliases for packages that import internal cheerio paths
        // which are blocked by package exports in newer cheerio versions.
        // Redirect requests like 'cheerio/lib/utils' -> cheerio/dist/commonjs/utils.js
  // Compatibility shim that re-exports the commonjs build. This file exists
  // in the hoisted repo-root node_modules and points at the packaged CJS bundle.
  { find: 'cheerio/lib/utils', replacement: resolve(__dirname, 'node_modules', 'cheerio', 'lib', 'utils.js') },
  { find: 'cheerio/lib', replacement: resolve(__dirname, '..', 'node_modules', 'cheerio', 'lib', 'index.js') },
  // Ensure direct 'cheerio' imports resolve to the packaged ESM bundle.
  { find: 'cheerio', replacement: resolve(__dirname, '..', 'node_modules', 'cheerio', 'dist', 'esm', 'index.js') },
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
          '@material-ui/icons',
          '@emotion/styled',
          '@emotion/react',
          'react-material-ui-carousel',
        'react/jsx-dev-runtime',
        'react/jsx-runtime',
        'cheerio',
        'cheerio/lib/utils',
        '@apollo/client',
        'react-router-dom',
      ],
    },
  }
})
