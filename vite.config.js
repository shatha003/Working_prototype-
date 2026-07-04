import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^react-aria\/private\/(.+)$/,
        replacement: 'react-aria/dist/private/$1.js',
      },
      {
        find: /^react-aria\/(.+)$/,
        replacement: 'react-aria/dist/exports/$1.js',
      },
      {
        find: /^react-stately\/private\/(.+)$/,
        replacement: 'react-stately/dist/private/$1.js',
      },
      {
        find: /^react-stately\/(.+)$/,
        replacement: 'react-stately/dist/exports/$1.js',
      },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
