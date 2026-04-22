import { defineConfig, mergeConfig } from 'vite';
import baseConfig from '@recreando/vite/lib';

export default mergeConfig(baseConfig, defineConfig({
  build: {
    rollupOptions: {
      external: ['xml-js'],
    },
  },
}));
