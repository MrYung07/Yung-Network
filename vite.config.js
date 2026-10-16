import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: resolve(projectRoot, 'YungNetworksitoWeb'),
  build: {
    outDir: resolve(projectRoot, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(projectRoot, 'YungNetworksitoWeb/index.html'),
        admin: resolve(projectRoot, 'YungNetworksitoWeb/admin.html')
      }
    }
  }
});
