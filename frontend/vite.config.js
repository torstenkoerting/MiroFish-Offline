import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    open: false,
    host: true,
    allowedHosts: ['simulation.koerting.ai', '.koerting.ai', 'localhost', '127.0.0.1'],
    fs: {
      // locales/ lives at the repo root and is shared with the backend
      allow: [repoRoot],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
