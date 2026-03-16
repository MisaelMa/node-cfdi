import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

export default defineConfig({
  test: {
    reporters: ['default'],
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['**/node_modules/**', '**/test/**'],
    },
    alias: {
      '@cfdi/csd': resolve(__dirname, '../csd/src'),
    },
  },
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@cfdi/csd': resolve(__dirname, '../csd/src'),
    },
  },
});
