import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/', // vajalik Vercelis, et kõik route’id toimiks
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist', // vaikimisi 'dist', võid säilitada või eemaldada
  },
});
