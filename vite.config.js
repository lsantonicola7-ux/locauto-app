import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In dev, proxy API calls to a local express or just skip
      '/.netlify': 'http://localhost:3001',
    },
  },
})
