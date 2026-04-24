import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        /^@cfdi\//,
        /^@clir\//,
        /^@saxon-he\//,
        /^@sat\//,
        /^@renapo\//,
        /^node:/,
        'assert',
        'buffer',
        'child_process',
        'console',
        'crypto',
        'events',
        'fs',
        'http',
        'https',
        'net',
        'os',
        'path',
        'stream',
        'url',
        'util',
        'zlib',
        'xml-js',
        'node-forge',
        'pdf-parse',
      ],
      output: {
        exports: 'named',
      },
    },
    minify: 'esbuild',
    sourcemap: false,
    target: 'esnext',
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      exclude: ['node_modules/**'],
    }),
  ],
});
