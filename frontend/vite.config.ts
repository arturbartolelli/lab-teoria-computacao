import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BACKEND_URL = 'http://localhost:8080'
const proxy = { '/api': BACKEND_URL }

export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
})
