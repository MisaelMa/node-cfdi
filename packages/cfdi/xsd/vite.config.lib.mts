// Config de build LOCAL de @cfdi/xsd.
//
// Replica el rig compartido (@recreando/vite) pero emite DOS entrypoints:
//   - index   → registra el lector de schemas desde disco (Node)
//   - browser → solo la clase `Schema`, sin `fs` (front)
//
// La condicion "browser" en los `exports` del package.json es la que hace que
// un bundler del front resuelva a `browser.mjs` sin tocar los imports.
//
// Mantener el `external` en sync con node_modules/@recreando/vite/vite.config.lib.mts.
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        browser: 'src/browser.ts',
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
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
      exclude: ['node_modules/**'],
    }),
  ],
});
