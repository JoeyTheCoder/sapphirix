import { defineConfig } from 'vite'

export default defineConfig({
  // Add this to handle asset paths
  resolve: {
    alias: {
      '/img/': '/src/img/',
    },
  },
}) 