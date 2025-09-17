import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API requests during development to the backend server
    proxy: {
      '/game': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/check': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});