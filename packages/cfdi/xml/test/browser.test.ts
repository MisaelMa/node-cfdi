import { describe, expect, it, vi } from 'vitest';
import { existsSync, readFileSync } from 'fs';

import { Schema } from '@cfdi/xsd';
import path from 'path';

import * as browserEntry from '../src/browser';
import {
  Comprobante,
  Concepto,
  Emisor,
  Impuestos,
  ObjetoImpEnum,
  Receptor,
  Relacionado,
} from '../src/browser';
import { CFDIComprobante } from '../src/types';

/**
 * Contrato del entrypoint browser-safe (`@cfdi/xml/browser`):
 *
 *  1. Expone SOLO el constructor del CFDI (Comprobante + elements), nunca `CFDI`.
 *  2. Arma el comprobante completo sin `Config` -> sin tocar disco.
 *  3. Su grafo de imports NO alcanza modulos nativos de Node ni paquetes Node-only.
 *
 * El punto 3 es el que realmente protege al front: los puntos 1 y 2 corren en
 * Node, donde `fs` resuelve sin quejarse. Solo un analisis estatico del grafo
 * detecta que un bundler del browser reventaria.
 */

const PKG_ROOT = path.resolve(__dirname, '..');
const PACKAGES = path.resolve(__dirname, '..', '..', '..');
const BROWSER_ENTRY = path.resolve(PKG_ROOT, 'src', 'browser.ts');

const NODE_BUILTINS = new Set([
  'assert', 'buffer', 'child_process', 'cluster', 'console', 'crypto', 'dgram',
  'dns', 'events', 'fs', 'fs/promises', 'http', 'http2', 'https', 'module',
  'net', 'os', 'path', 'perf_hooks', 'process', 'querystring', 'readline',
  'stream', 'string_decoder', 'timers', 'tls', 'tty', 'url', 'util', 'v8',
  'vm', 'worker_threads', 'zlib',
]);

/** Paquetes del monorepo que dependen de fs/openssl/java: prohibidos en browser. */
const NODE_ONLY_PACKAGES = ['@cfdi/csd', '@saxon-he/cli', '@clir/openssl'];

/** Terceros que si corren en el browser. Cualquier otro debe revisarse a mano. */
const BROWSER_SAFE_DEPS = ['xml-js', 'ajv'];

type GraphReport = {
  files: string[];
  nodeBuiltins: string[];
  nodeOnlyPackages: string[];
  externals: string[];
};

const stripCommentsAndTypeImports = (code: string): string =>
  code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^[ \t]*\/\/.*$/gm, '')
    .replace(/\b(?:import|export)\s+type\s[\s\S]*?from\s*['"][^'"]+['"]/g, '');

const readSpecifiers = (file: string): string[] => {
  const code = stripCommentsAndTypeImports(readFileSync(file, 'utf8'));
  const matches = code.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g);
  return [...matches].map(match => match[1]);
};

const resolveRelative = (from: string, specifier: string): string | null => {
  const base = path.resolve(path.dirname(from), specifier);
  const candidates = [`${base}.ts`, `${base}.mts`, path.join(base, 'index.ts')];
  return candidates.find(candidate => existsSync(candidate)) || null;
};

const workspaceDir = (specifier: string): string | null => {
  const [scope, name] = specifier.split('/');
  if (scope === '@cfdi') return path.join(PACKAGES, 'cfdi', name);
  if (scope === '@clir') return path.join(PACKAGES, 'clir', name);
  if (scope === '@saxon-he') return path.join(PACKAGES, 'clir', 'saxon-he');
  return null;
};

/** Un bundler del front solo usa `src/browser.ts` si el package lo declara. */
const declaresBrowserCondition = (dir: string): boolean => {
  const manifest = path.join(dir, 'package.json');
  if (!existsSync(manifest)) return false;
  const { exports } = JSON.parse(readFileSync(manifest, 'utf8'));
  return Boolean(exports?.['.']?.browser);
};

/**
 * Resuelve un workspace package igual que lo haria un bundler del browser:
 * con la condicion "browser" si el package.json la declara, y con el
 * entrypoint por defecto si no. Por eso, quitar la condicion de un
 * package.json pone este test en rojo solo: el walker cae al entrypoint de
 * Node y encuentra `fs`.
 */
const resolveWorkspace = (specifier: string): string | null => {
  const dir = workspaceDir(specifier);
  if (!dir) return null;

  const browserEntry = path.join(dir, 'src', 'browser.ts');
  if (declaresBrowserCondition(dir) && existsSync(browserEntry)) {
    return browserEntry;
  }
  return path.join(dir, 'src', 'index.ts');
};

/** Recorre el grafo de imports desde `entry` y clasifica cada especificador. */
const walkGraph = (entry: string): GraphReport => {
  const visited = new Set<string>();
  const nodeBuiltins = new Set<string>();
  const nodeOnlyPackages = new Set<string>();
  const externals = new Set<string>();
  const pending = [entry];

  while (pending.length) {
    const file = pending.pop() as string;
    if (visited.has(file)) continue;
    visited.add(file);

    for (const specifier of readSpecifiers(file)) {
      const clean = specifier.replace(/^node:/, '');
      const label = `${path.relative(PACKAGES, file)} -> ${specifier}`;

      if (specifier.startsWith('.')) {
        const resolved = resolveRelative(file, specifier);
        if (resolved) pending.push(resolved);
        continue;
      }

      if (NODE_BUILTINS.has(clean)) {
        nodeBuiltins.add(label);
        continue;
      }

      if (NODE_ONLY_PACKAGES.some(pkg => clean === pkg || clean.startsWith(`${pkg}/`))) {
        nodeOnlyPackages.add(label);
        continue;
      }

      const workspace = resolveWorkspace(clean);
      if (workspace) {
        if (existsSync(workspace)) pending.push(workspace);
        continue;
      }

      externals.add(clean);
    }
  }

  return {
    files: [...visited],
    nodeBuiltins: [...nodeBuiltins],
    nodeOnlyPackages: [...nodeOnlyPackages],
    externals: [...externals],
  };
};

const comprobanteFixture: CFDIComprobante = {
  Serie: 'A',
  Folio: '1',
  Fecha: '2024-01-15T12:00:00',
  FormaPago: '01',
  CondicionesDePago: 'Contado',
  SubTotal: '100.00',
  Moneda: 'MXN',
  Total: '116.00',
  TipoDeComprobante: 'I',
  MetodoPago: 'PUE',
  LugarExpedicion: '97000',
  Exportacion: '01',
};

const buildCfdi = (): Comprobante => {
  const cfdi = new Comprobante();
  cfdi.comprobante(comprobanteFixture);
  cfdi.emisor(
    new Emisor({
      Rfc: 'XAXX010101000',
      Nombre: 'Empresa Ejemplo',
      RegimenFiscal: '601',
    })
  );
  cfdi.receptor(
    new Receptor({
      Rfc: 'XAXX010101000',
      Nombre: 'Receptor Ejemplo',
      UsoCFDI: 'G03',
      DomicilioFiscalReceptor: '97000',
      RegimenFiscalReceptor: '601',
    })
  );
  cfdi.concepto(
    new Concepto({
      ClaveProdServ: '01010101',
      NoIdentificacion: '12345',
      Cantidad: '1',
      ClaveUnidad: 'H87',
      Unidad: 'Pieza',
      Descripcion: 'Producto de prueba',
      ValorUnitario: '100.00',
      Importe: '100.00',
      ObjetoImp: ObjetoImpEnum.NoobjetoDeimpuesto,
    })
  );
  cfdi.impuesto(new Impuestos({ TotalImpuestosTrasladados: '16.00' }));
  return cfdi;
};

describe('browser entrypoint - superficie de exportacion', () => {
  it('deberia exportar el constructor del CFDI y sus elements', () => {
    expect(browserEntry.Comprobante).toBeTypeOf('function');
    expect(browserEntry.Emisor).toBeTypeOf('function');
    expect(browserEntry.Receptor).toBeTypeOf('function');
    expect(browserEntry.Concepto).toBeTypeOf('function');
    expect(browserEntry.Concepts).toBe(browserEntry.Concepto);
    expect(browserEntry.Impuestos).toBeTypeOf('function');
    expect(browserEntry.Relacionado).toBeTypeOf('function');
  });

  it('NO deberia exportar la clase CFDI (arrastra fs, csd y saxon)', () => {
    expect(browserEntry).not.toHaveProperty('CFDI');
  });
});

describe('browser entrypoint - construccion sin filesystem', () => {
  it('deberia instanciar Comprobante sin Config sin cargar schemas de disco', () => {
    const setConfig = vi.spyOn(Schema.of(), 'setConfig');

    new Comprobante();
    new Comprobante({ debug: false });

    expect(setConfig).not.toHaveBeenCalled();
    setConfig.mockRestore();
  });

  it('deberia armar el JSON completo del CFDI listo para timbrar en el server', () => {
    const json = buildCfdi().getJsonCdfi();
    const comprobante = json['cfdi:Comprobante'];

    expect(comprobante._attributes).toMatchObject({
      ...comprobanteFixture,
      Version: '4.0',
      'xmlns:cfdi': 'http://www.sat.gob.mx/cfd/4',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    });
    expect(comprobante['cfdi:Emisor']._attributes.Rfc).toBe('XAXX010101000');
    expect(comprobante['cfdi:Receptor']._attributes.UsoCFDI).toBe('G03');
    expect(comprobante['cfdi:Conceptos']['cfdi:Concepto']).toHaveLength(1);
    expect(comprobante['cfdi:Impuestos']._attributes).toMatchObject({
      TotalImpuestosTrasladados: '16.00',
    });
  });

  it('deberia dejar Sello, NoCertificado y Certificado vacios (sellado = server)', () => {
    const { _attributes } = buildCfdi().getJsonCdfi()['cfdi:Comprobante'];

    expect(_attributes.Sello).toBe('');
    expect(_attributes.NoCertificado).toBe('');
    expect(_attributes.Certificado).toBe('');
  });

  it('deberia serializar a XML sin sellar y reiniciar el comprobante', () => {
    const cfdi = buildCfdi();
    const xml = cfdi.getXmlCdfi();

    expect(xml).toContain('<?xml version="1.0" encoding="utf-8"?>');
    expect(xml).toContain('<cfdi:Comprobante');
    expect(xml).toContain('Version="4.0"');
    expect(xml).toContain('<cfdi:Emisor');
    expect(xml).toContain('<cfdi:Concepto');

    const reiniciado = cfdi.getJsonCdfi()['cfdi:Comprobante'];
    expect(reiniciado['cfdi:Conceptos']).toBeUndefined();
  });

  it('deberia relacionar CFDIs sin tocar disco', () => {
    const cfdi = new Comprobante();
    const relacionado = new Relacionado({ TipoRelacion: '01' });
    relacionado.addRelation('AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE');
    cfdi.relacionados(relacionado);

    const relacionados =
      cfdi.getJsonCdfi()['cfdi:Comprobante']['cfdi:CfdiRelacionados'];

    expect(relacionados._attributes).toEqual({ TipoRelacion: '01' });
    expect(relacionados['cfdi:CfdiRelacionado']).toEqual([
      { _attributes: { UUID: 'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE' } },
    ]);
  });
});

describe('browser entrypoint - grafo de imports browser-safe', () => {
  const report = walkGraph(BROWSER_ENTRY);

  it('deberia resolver el grafo completo desde src/browser.ts', () => {
    expect(report.files.length).toBeGreaterThan(1);
    expect(report.files).toContain(
      path.resolve(PKG_ROOT, 'src', 'elements', 'Comprobante.ts')
    );
  });

  it('deberia resolver @cfdi/xsd por su entrypoint browser, no por el de Node', () => {
    const xsd = path.resolve(PACKAGES, 'cfdi', 'xsd', 'src');

    expect(report.files).toContain(path.join(xsd, 'browser.ts'));
    expect(report.files).not.toContain(path.join(xsd, 'index.ts'));
    expect(report.files).not.toContain(path.join(xsd, 'loader.node.ts'));
  });

  it('NO deberia alcanzar src/cfdi.ts ni utils/FileSystem.ts', () => {
    expect(report.files).not.toContain(path.resolve(PKG_ROOT, 'src', 'cfdi.ts'));
    expect(report.files).not.toContain(
      path.resolve(PKG_ROOT, 'src', 'utils', 'FileSystem.ts')
    );
  });

  it('NO deberia alcanzar modulos nativos de Node', () => {
    expect(report.nodeBuiltins).toEqual([]);
  });

  it('NO deberia alcanzar paquetes Node-only del monorepo', () => {
    expect(report.nodeOnlyPackages).toEqual([]);
  });

  it('solo deberia depender de terceros browser-safe', () => {
    const desconocidos = report.externals.filter(
      dep => !BROWSER_SAFE_DEPS.some(safe => dep === safe || dep.startsWith(`${safe}/`))
    );

    expect(desconocidos).toEqual([]);
  });
});
