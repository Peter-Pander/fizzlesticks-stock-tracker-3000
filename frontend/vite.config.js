import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // Uncomment and adjust the rewrite function if your backend doesn't expect the '/api' prefix:
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
