import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps the production build deployable from any path (Vercel, static hosts, file servers).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'es2020',
    sourcemap: false,
  },
});
