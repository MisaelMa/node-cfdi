// Config de build LOCAL de @cfdi/xml.
//
// Replica el rig compartido (@recreando/vite) pero emite DOS entrypoints:
//   - index   → librería completa (incluye la clase `CFDI`: sellado/timbrado, Node)
//   - browser → solo construcción del CFDI (Comprobante + elements, browser-safe)
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
      // tsconfig-base mapea @cfdi/* -> ../node_modules/@cfdi/*/src (para desarrollar
      // desde src). Sin esto, vite-plugin-dts reescribe los imports a rutas relativas
      // inexistentes en el paquete publicado (#113). Los workspaces son dependencias,
      // asi que deben quedar como import por nombre.
      aliasesExclude: [/^@cfdi\//, /^@clir\//, /^@saxon-he\//, /^@sat\//, /^@renapo\//],
      exclude: ['node_modules/**'],
    }),
  ],
});
