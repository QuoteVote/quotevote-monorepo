import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      include: /\.(jsx|js)$/,
    }),
    // Plugin to fix react/jsx-runtime module resolution
    {
      name: 'resolve-jsx-runtime',
      enforce: 'pre',
      resolveId(id) {
        // Handle react/jsx-runtime imports
        if (id === 'react/jsx-runtime') {
          return resolve(__dirname, '../node_modules/react/jsx-runtime.js')
        }
        if (id === 'react/jsx-dev-runtime') {
          return resolve(__dirname, '../node_modules/react/jsx-dev-runtime.js')
        }
        return null
      },
    },
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    env: {
      REACT_APP_SERVER: 'http://localhost:4000',
      REACT_APP_SERVER_WS: 'ws://localhost:4000',
      REACT_APP_DOMAIN: 'http://localhost:3000',
    },
    server: {
      deps: {
        inline: ['@floating-ui/react'],
      },
    },
  },
  resolve: {
    alias: [
      {
        find: /^react\/jsx-runtime$/,
        replacement: resolve(__dirname, '../node_modules/react/jsx-runtime.js'),
      },
      {
        find: /^react\/jsx-dev-runtime$/,
        replacement: resolve(__dirname, '../node_modules/react/jsx-dev-runtime.js'),
      },
      {
        find: '@',
        replacement: resolve(__dirname, 'src'),
      },
      {
        find: /^layouts$/,
        replacement: resolve(__dirname, 'src/layouts'),
      },
      {
        find: /^components\/(.*)$/,
        replacement: resolve(__dirname, 'src/components/$1'),
      },
      {
        find: /^components$/,
        replacement: resolve(__dirname, 'src/components'),
      },
      {
        find: /^config$/,
        replacement: resolve(__dirname, 'src/config'),
      },
      {
        find: /^store$/,
        replacement: resolve(__dirname, 'src/store'),
      },
      {
        find: /^store\/(.*)$/,
        replacement: resolve(__dirname, 'src/store/$1'),
      },
      {
        find: /^assets\/(.*)$/,
        replacement: resolve(__dirname, 'src/assets/$1'),
      },
      {
        find: /^assets$/,
        replacement: resolve(__dirname, 'src/assets'),
      },
      {
        find: /^utils\/(.*)$/,
        replacement: resolve(__dirname, 'src/utils/$1'),
      },
      {
        find: /^utils$/,
        replacement: resolve(__dirname, 'src/utils'),
      },
      {
        find: /^views$/,
        replacement: resolve(__dirname, 'src/views'),
      },
      {
        find: /^mui-pro\/(.*)$/,
        replacement: resolve(__dirname, 'src/mui-pro/$1'),
      },
      {
        find: /^mui-pro$/,
        replacement: resolve(__dirname, 'src/mui-pro'),
      },
      {
        find: /^hoc$/,
        replacement: resolve(__dirname, 'src/hoc'),
      },
      {
        find: /^themes$/,
        replacement: resolve(__dirname, 'src/themes'),
      },
      {
        find: /^themes\/(.*)$/,
        replacement: resolve(__dirname, 'src/themes/$1'),
      },
    ],
    conditions: ['import', 'module', 'browser', 'default'],
    mainFields: ['browser', 'module', 'main'],
  },
  optimizeDeps: {
    esbuildOptions: {
      jsx: 'automatic',
    },
  },
})
