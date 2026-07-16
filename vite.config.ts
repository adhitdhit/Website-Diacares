import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'angler-dawdler-aside.ngrok-free.dev',
      'localhost',
      '127.0.0.1',
    ],
    // Proxy cuma buat dev, production pakai env variable
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // ✅ Tambahin ini buat pastikan build output benar
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})