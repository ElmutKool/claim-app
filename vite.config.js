import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // valikuline, kui tahad kasutada @/
    },
  },
  server: {
    historyApiFallback: true, // <-- oluline ridade uuesti töötamiseks
  },
});
