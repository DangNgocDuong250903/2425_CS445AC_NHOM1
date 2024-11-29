import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "~", replacement: resolve(__dirname, "./src") }]
  },
  server: {
    // port: 3000,
    proxy: {
      '/v1/api': {
        target: 'http://localhost:3052',
        changeOrigin: true,
        secure: false,
        credentials: true,
      },
    },
  },
})


