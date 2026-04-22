import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
export default defineConfig({
  test: {
    reporters: ['default'],
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['**/node_modules/**', '**/test/**'],
    },
  },
  resolve: {
    alias: {
      '@cfdi/xsd': resolve(__dirname, '../xsd/src/index.ts'),
      '@cfdi/complementos': resolve(__dirname, '../complementos/src/index.ts'),
      '@cfdi/csd': resolve(__dirname, '../csd/src/index.ts'),
      '@cfdi/transform': resolve(__dirname, '../transform/src/index.ts'),
      '@saxon-he/cli': resolve(__dirname, '../../clir/saxon-he/src/index.ts'),
      '@clir/openssl': resolve(__dirname, '../../clir/openssl/src/index.ts'),
    },
  },
});
