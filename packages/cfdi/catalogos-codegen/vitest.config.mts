import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    reporters: ['default'],
  },
  resolve: {
    alias: {
      '@sat/recursos': resolve(__dirname, '../../sat/recursos/src/index.ts'),
    },
  },
});
