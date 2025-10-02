import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'layouts': resolve(__dirname, 'src/layouts'),
      'components': resolve(__dirname, 'src/components'),
      'config': resolve(__dirname, 'src/config'),
      'store': resolve(__dirname, 'src/store'),
      'assets': resolve(__dirname, 'src/assets'),
      'utils': resolve(__dirname, 'src/utils'),
      'views': resolve(__dirname, 'src/views'),
      'mui-pro': resolve(__dirname, 'src/mui-pro'),
      'hoc': resolve(__dirname, 'src/hoc'),
    },
  },
}) 