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
        jsxRuntime: 'automatic',
        babel: {
          plugins: [
            ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
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
      alias: {
        '@': resolve(__dirname, 'src'),
        // Add aliases for common directories
        layouts: resolve(__dirname, 'src/layouts'),
        components: resolve(__dirname, 'src/components'),
        config: resolve(__dirname, 'src/config'),
        store: resolve(__dirname, 'src/store'),
        assets: resolve(__dirname, 'src/assets'),
        utils: resolve(__dirname, 'src/utils'),
        views: resolve(__dirname, 'src/views'),
        'mui-pro': resolve(__dirname, 'src/mui-pro'),
        hoc: resolve(__dirname, 'src/hoc'),
        themes: resolve(__dirname, 'src/themes'),
        'react/jsx-runtime': 'react/jsx-runtime.js',
      },
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
      'process.env.DEPLOY_PRIME_URL': JSON.stringify(env.DEPLOY_PRIME_URL),
      global: 'window',
    },
    optimizeDeps: {
      esbuildOptions: {
        jsx: 'classic',
      },
      include: [
        'react',
        'react-dom',
        '@material-ui/core',
        '@material-ui/icons',
        '@apollo/client',
        'react-router-dom',
      ],
    },
  }
})
