import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths'; // only if you are using custom tsconfig paths

export default defineConfig({
  test: {},
  plugins: [tsconfigPaths()], // only if you are using custom tsconfig paths
});
