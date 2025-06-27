import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import terser from "@rollup/plugin-terser";
import url from '@rollup/plugin-url';

export default defineConfig({
  build: {
    //assetsInlineLimit: 0,
    lib: {
      entry: "src/index.ts",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['@cfdi/utils', 'pdfmake/build/pdfmake', 'pdfmake/interfaces', "pdfmake/build/vfs_fonts"], // Dependencias externas
      plugins: [
        terser({
          compress: {
            drop_console: true,        // Elimina console.log
            drop_debugger: true,       // Elimina debugger
            passes: 2,                 // Más agresivo
          },
          mangle: {
            properties: false,          // Ofusca propiedades
            keep_classnames: false,    // No mantiene nombres de clases
            keep_fnames: false,        // No mantiene nombres de funciones
          },
          format: {
            comments: false,           // Elimina comentarios
          },
        }),
      ],
    },
    minify: "terser",
    sourcemap: false,
    target: "esnext",
  },
 /*  plugins: [
    dts({
      insertTypesEntry: true,
    })
  ], */
});
