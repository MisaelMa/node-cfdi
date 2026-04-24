import { defineConfig, mergeConfig } from 'vite';
import baseConfig from '@recreando/vite/lib';

export default mergeConfig(baseConfig, defineConfig({
  build: {
    rollupOptions: {
      external: ['pdfmake', 'pdfmake/build/pdfmake', 'pdfmake/interfaces', 'pdfmake/build/vfs_fonts', 'xml-js'],
    },
  },
}));
