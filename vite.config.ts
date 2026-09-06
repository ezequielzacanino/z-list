import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Names the cache of each build, so the service worker drops the previous one.
const buildId = Date.now().toString(36)

export default defineConfig({
  plugins: [react()],
  define: { __BUILD_ID__: JSON.stringify(buildId) },
})
