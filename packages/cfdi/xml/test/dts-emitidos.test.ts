import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { build } from 'vite';
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

// Regresion #113: los .d.ts publicados importaban
// '../../node_modules/@cfdi/complementos/src' (ruta inexistente en el paquete).
// Construimos con la config real de la libreria en un directorio temporal y
// verificamos que ningun .d.ts emitido referencie node_modules ni rutas a src de otros paquetes.
function dtsFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? dtsFiles(p) : p.endsWith('.d.ts') ? [p] : [];
  });
}

describe('.d.ts emitidos por el build', () => {
  let outDir: string;

  beforeAll(async () => {
    outDir = mkdtempSync(join(tmpdir(), 'cfdi-xml-dts-'));
    await build({
      root: resolve(__dirname, '..'),
      configFile: resolve(__dirname, '../vite.config.lib.mts'),
      logLevel: 'silent',
      build: { outDir, emptyOutDir: true },
    });
  }, 120_000);

  afterAll(() => rmSync(outDir, { recursive: true, force: true }));

  it('no contienen rutas relativas a node_modules', () => {
    const files = dtsFiles(outDir);
    expect(files.length).toBeGreaterThan(0);
    const offenders = files.filter((f) => /node_modules/.test(readFileSync(f, 'utf8')));
    expect(offenders.map((f) => f.replace(outDir, ''))).toEqual([]);
  });

  it('importan los workspaces por nombre de paquete', () => {
    const src = readFileSync(join(outDir, 'elements/Concepto.d.ts'), 'utf8');
    expect(src).toMatch(/from '@cfdi\/complementos'/);
  });
});
