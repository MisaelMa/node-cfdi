import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import * as XLSX from 'xlsx';
import { parseXsdString } from '../src/parsers/xsd';
import { renderCatalogo, renderIndex } from '../src/renderers/template';
import type { CatalogoSpec } from '../src/catalogos.config';
import { generate } from '../src/generate';

const FIXTURES_DIR = path.resolve(__dirname, 'fixtures');
const XSD_PATH = path.join(FIXTURES_DIR, 'catCFDI.xsd');
const XLSX_PATH = path.join(FIXTURES_DIR, 'catCFDI.xlsx');

function buildMiniXlsx(targetPath: string): void {
  const wb = XLSX.utils.book_new();
  // 4 filas de header (titulo + version + headers) antes de los datos para
  // imitar el formato real del SAT.
  const wsFormaPago = XLSX.utils.aoa_to_sheet([
    ['Catalogo de prueba'],
    ['Version CFDI', 'Version catalogo'],
    [4, 1],
    ['c_FormaPago', 'Descripcion'], // header con simpleType para auto-detect
    ['01', 'Efectivo'],
    ['02', 'Cheque nominativo'],
    ['99', 'Por definir'],
  ]);
  XLSX.utils.book_append_sheet(wb, wsFormaPago, 'c_FormaPago');

  const wsTipoComp = XLSX.utils.aoa_to_sheet([
    ['Catalogo de prueba'],
    ['Version CFDI', 'Version catalogo'],
    [4, 1],
    ['c_TipoDeComprobante', 'Descripcion'],
    ['I', 'Ingreso'],
    ['E', 'Egreso'],
    ['T', 'Traslado'],
    ['P', 'Pago'],
    ['N', 'Nomina'],
  ]);
  XLSX.utils.book_append_sheet(wb, wsTipoComp, 'c_TipoDeComprobante');

  XLSX.writeFile(wb, targetPath);
}

const FORMA_PAGO_SPEC: CatalogoSpec = {
  simpleType: 'c_FormaPago',
  exportName: 'FormaPago',
  sheetName: 'c_FormaPago',
  codeColumn: 'A',
  descColumn: 'B',
  descKey: 'label',
  enumNames: {
    '01': 'EFECTIVO',
    '02': 'CHEQUE_NOMINATIVO',
    '99': 'POR_DEFINIR',
  },
};

const TIPO_COMP_SPEC: CatalogoSpec = {
  simpleType: 'c_TipoDeComprobante',
  exportName: 'TipoComprobante',
  sheetName: 'c_TipoDeComprobante',
  codeColumn: 'A',
  descColumn: 'B',
  descKey: 'label',
  enumNames: {
    I: 'INGRESO',
    E: 'EGRESO',
    T: 'TRASLADO',
    P: 'PAGO',
    N: 'NOMINA',
  },
  typeExport: 'TypeComprobante',
};

describe('parseXsdString', () => {
  it('extrae simpleTypes y enumerations del XSD', () => {
    const content = fs.readFileSync(XSD_PATH, 'utf-8');
    const result = parseXsdString(content);
    expect(result.get('c_FormaPago')).toEqual(['01', '02', '99']);
    expect(result.get('c_TipoDeComprobante')).toEqual(['I', 'E', 'T', 'P', 'N']);
  });
});

describe('renderCatalogo', () => {
  it('emite enum + type union + List con descKey "label"', () => {
    const codes = ['01', '02', '99'];
    const rows = [
      { code: '01', values: { label: 'Efectivo' } },
      { code: '02', values: { label: 'Cheque nominativo' } },
      { code: '99', values: { label: 'Por definir' } },
    ];
    const ts = renderCatalogo(FORMA_PAGO_SPEC, codes, rows);
    expect(ts).toContain('export enum FormaPago {');
    expect(ts).toContain("EFECTIVO = '01',");
    expect(ts).toContain("CHEQUE_NOMINATIVO = '02',");
    expect(ts).toContain('export type FormaPagoType =');
    expect(ts).toContain("| '01'");
    expect(ts).toContain('export const FormaPagoList = [');
    expect(ts).toContain("label: 'Efectivo'");
  });

  it('respeta el override de typeExport', () => {
    const codes = ['I', 'E'];
    const rows = [
      { code: 'I', values: { label: 'Ingreso' } },
      { code: 'E', values: { label: 'Egreso' } },
    ];
    const ts = renderCatalogo(TIPO_COMP_SPEC, codes, rows);
    expect(ts).toContain('export type TypeComprobante =');
    expect(ts).not.toContain('export type TipoComprobanteType');
  });

  it('auto-deriva nombres de enum desde codigos ID-friendly', () => {
    const spec: CatalogoSpec = {
      simpleType: 'c_Moneda',
      exportName: 'Moneda',
      sheetName: 'c_Moneda',
      codeColumn: 'A',
      descColumn: 'B',
      descKey: 'descripcion',
    };
    const codes = ['MXN', 'USD'];
    const rows = [
      { code: 'MXN', values: { descripcion: 'Peso Mexicano' } },
      { code: 'USD', values: { descripcion: 'Dolar estadounidense' } },
    ];
    const ts = renderCatalogo(spec, codes, rows);
    expect(ts).toContain('export enum Moneda {');
    expect(ts).toContain("MXN = 'MXN'");
    expect(ts).toContain("USD = 'USD'");
    expect(ts).toContain('export type MonedaType =');
    expect(ts).toContain('export const MonedaList = [');
  });

  it('auto-deriva nombres de enum desde la descripcion para codigos numericos', () => {
    const spec: CatalogoSpec = {
      simpleType: 'c_Periodicidad',
      exportName: 'Periodicidad',
      sheetName: 'c_Periodicidad',
      codeColumn: 'A',
      descColumn: 'B',
      descKey: 'descripcion',
    };
    const codes = ['01', '02'];
    const rows = [
      { code: '01', values: { descripcion: 'Diario' } },
      { code: '02', values: { descripcion: 'Cada 15 días' } },
    ];
    const ts = renderCatalogo(spec, codes, rows);
    expect(ts).toContain("DIARIO = '01'");
    expect(ts).toContain("CADA_15_DIAS = '02'");
  });
});

describe('renderIndex', () => {
  it('emite barrel exports', () => {
    const idx = renderIndex([FORMA_PAGO_SPEC, TIPO_COMP_SPEC]);
    expect(idx).toContain("export * from './FormaPago';");
    expect(idx).toContain("export * from './TipoComprobante';");
  });
});

describe('generate (integracion)', () => {
  let tmpOut: string;

  beforeAll(() => {
    if (!fs.existsSync(XLSX_PATH)) {
      buildMiniXlsx(XLSX_PATH);
    }
  });

  afterEach(() => {
    if (tmpOut && fs.existsSync(tmpOut)) {
      fs.rmSync(tmpOut, { recursive: true, force: true });
    }
  });

  it('escribe archivos TS para los specs pasados', async () => {
    tmpOut = fs.mkdtempSync(path.join(os.tmpdir(), 'catalogos-codegen-'));
    const result = await generate({
      skipDownload: true,
      filesDir: FIXTURES_DIR,
      outDir: tmpOut,
      catalogos: [FORMA_PAGO_SPEC, TIPO_COMP_SPEC],
    });
    expect(result.written).toHaveLength(3); // 2 catalogos + index
    expect(fs.existsSync(path.join(tmpOut, 'FormaPago.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tmpOut, 'TipoComprobante.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tmpOut, 'index.ts'))).toBe(true);

    const formaPagoTs = fs.readFileSync(path.join(tmpOut, 'FormaPago.ts'), 'utf-8');
    expect(formaPagoTs).toContain("EFECTIVO = '01'");
    expect(formaPagoTs).toContain("label: 'Efectivo'");
  });

  it('falla cuando un codigo del XSD no esta en el override de enumNames', async () => {
    tmpOut = fs.mkdtempSync(path.join(os.tmpdir(), 'catalogos-codegen-'));
    const incompleteSpec: CatalogoSpec = {
      ...FORMA_PAGO_SPEC,
      enumNames: { '01': 'EFECTIVO', '02': 'CHEQUE_NOMINATIVO' }, // falta '99'
    };
    await expect(
      generate({
        skipDownload: true,
        filesDir: FIXTURES_DIR,
        outDir: tmpOut,
        catalogos: [incompleteSpec],
      })
    ).rejects.toThrow(/sin enumName en overrides.*99/);
  });

  it('falla cuando el XLSX tiene un codigo que no esta en el XSD', async () => {
    tmpOut = fs.mkdtempSync(path.join(os.tmpdir(), 'catalogos-codegen-'));
    // XSD con menos codigos que el XLSX (XLSX tiene '99' que no esta en XSD)
    const xsdPath = path.join(tmpOut, 'catCFDI.xsd');
    const xlsxLink = path.join(tmpOut, 'catCFDI.xlsx');
    fs.writeFileSync(
      xsdPath,
      `<?xml version="1.0"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:simpleType name="c_FormaPago">
    <xs:restriction base="xs:string">
      <xs:enumeration value="01"/>
      <xs:enumeration value="02"/>
    </xs:restriction>
  </xs:simpleType>
</xs:schema>`
    );
    fs.copyFileSync(XLSX_PATH, xlsxLink);
    await expect(
      generate({
        skipDownload: true,
        filesDir: tmpOut,
        outDir: path.join(tmpOut, 'out'),
        catalogos: [FORMA_PAGO_SPEC],
      })
    ).rejects.toThrow(/XLSX tiene codigos que no estan en el XSD.*99/);
  });
});
