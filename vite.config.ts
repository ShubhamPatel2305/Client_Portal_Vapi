import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import resolve from '@rollup/plugin-node-resolve'; // Import node-resolve

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis', // Ensures globalThis is used
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        resolve(), // Add the resolve plugin to handle module resolution
      ],
    },
    commonjsOptions: {
      include: [/node_modules/],
    }
  },
});
