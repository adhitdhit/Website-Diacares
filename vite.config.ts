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
    
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Arahkan ke backend lokal
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
})