import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: resolve(__dirname, 'YungNetworksitoWeb'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'YungNetworksitoWeb/index.html'),
        admin: resolve(__dirname, 'YungNetworksitoWeb/admin.html')
      }
    }
  }
});
