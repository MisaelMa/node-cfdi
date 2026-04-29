import fs from 'fs';
import path from 'path';
import { SatResources } from '@sat/recursos';
import { CATALOGOS, type CatalogoSpec } from './catalogos.config';
import { parseXsd, type CodesByType } from './parsers/xsd';
import { parseXlsx, type RowsBySheet, type SheetSpec, type XlsxRow } from './parsers/xlsx';
import { renderCatalogo, renderIndex } from './renderers/template';

export interface GenerateOptions {
  /** Forzar redescarga de XSD/XLSX aunque existan localmente. */
  forceDownload?: boolean;
  /** Sobrescribir el directorio de descarga. Default: `<repo>/packages/files/4.0`. */
  filesDir?: string;
  /** Sobrescribir el directorio de salida. Default: `<repo>/packages/cfdi/catalogos/src`. */
  outDir?: string;
  /** Saltar la descarga (asume XSD/XLSX ya presentes en `filesDir`). Util para tests. */
  skipDownload?: boolean;
  /** Subset de catalogos a generar. Default: `CATALOGOS` (los 15 del config). */
  catalogos?: CatalogoSpec[];
  /** URL del XLSX del SAT. Override opcional; si no, usa env var SAT_XLSX_URL. */
  xlsxUrl?: string;
}

export interface GenerateResult {
  written: string[];
  filesDir: string;
  outDir: string;
}

function defaultFilesDir(): string {
  return path.resolve(__dirname, '..', '..', '..', 'files', '4.0');
}

function defaultOutDir(): string {
  return path.resolve(__dirname, '..', '..', 'catalogos', 'src');
}

function specToSheetSpec(spec: CatalogoSpec): SheetSpec {
  return {
    sheetName: spec.sheetName,
    simpleType: spec.simpleType,
    codeColumn: spec.codeColumn,
    descColumn: spec.descColumn,
    descKey: spec.descKey,
    extraColumns: spec.extraColumns,
    headerRows: spec.headerRows,
    codePadStart: spec.codePadStart,
  };
}

function validateCatalogo(
  spec: CatalogoSpec,
  codesByType: CodesByType,
  rowsBySheet: RowsBySheet
): { codes: string[]; rows: XlsxRow[] } {
  const codes = codesByType.get(spec.simpleType);
  if (!codes) {
    throw new Error(
      `${spec.exportName}: simpleType "${spec.simpleType}" no encontrado en catCFDI.xsd`
    );
  }
  const rows = rowsBySheet.get(spec.sheetName);
  if (!rows) {
    throw new Error(
      `${spec.exportName}: hoja "${spec.sheetName}" no encontrada en catCFDI.xlsx`
    );
  }

  const xsdSet = new Set(codes);
  const xlsxSet = new Set(rows.map(r => r.code));

  const onlyInXsd = [...xsdSet].filter(c => !xlsxSet.has(c));
  const onlyInXlsx = [...xlsxSet].filter(c => !xsdSet.has(c));

  // Codigos en XLSX que no estan en XSD: error duro (XSD es la fuente de
  // verdad para validacion). Esto detecta hojas/columnas mal configuradas.
  if (onlyInXlsx.length > 0) {
    throw new Error(
      `${spec.exportName}: el XLSX tiene codigos que no estan en el XSD: ` +
        `${onlyInXlsx.join(', ')}. Probablemente las columnas codeColumn/descColumn ` +
        `o headerRows estan mal en catalogos.config.ts.`
    );
  }

  // Codigos en XSD que no estan en XLSX: warning. El SAT a veces mantiene
  // codigos deprecated en el XSD pero los quita del XLSX. Se emiten en el
  // type/enum con descripcion vacia.
  if (onlyInXsd.length > 0) {
    console.warn(
      `[warn] ${spec.exportName}: codigos en XSD sin descripcion en XLSX: ` +
        `${onlyInXsd.join(', ')} (se emiten con descripcion vacia)`
    );
  }

  if (spec.enumNames) {
    const missing = codes.filter(c => !spec.enumNames![c]);
    if (missing.length > 0) {
      throw new Error(
        `${spec.exportName}: codigos sin enumName en overrides: ${missing.join(', ')}.\n` +
          `Anade entradas a src/overrides/${spec.exportName}.ts y vuelve a ejecutar.`
      );
    }
  }

  // Reordenar las filas siguiendo el orden de codigos del XSD; los codigos
  // ausentes en XLSX se rellenan con un row vacio para que el render siempre
  // emita una entrada por cada codigo del XSD.
  const rowByCode = new Map(rows.map(r => [r.code, r] as const));
  const today = new Date();
  const orderedRows: XlsxRow[] = codes.map(c => {
    const row = rowByCode.get(c);
    if (!row) {
      const values: Record<string, string> = { [spec.descKey]: '' };
      for (const extra of spec.extraColumns ?? []) values[extra.key] = '';
      return {
        code: c,
        values,
        deprecated: { reason: 'Removido del catalogo XLSX del SAT' },
      };
    }
    // Si tiene endingDate con fecha pasada, marcar como deprecated.
    const endingDateStr = row.values['endingDate'];
    if (endingDateStr) {
      const endDate = parseDate(endingDateStr);
      if (endDate && endDate < today) {
        return {
          ...row,
          deprecated: { reason: `Vigencia terminada ${endingDateStr}` },
        };
      }
    }
    return row;
  });

  return { codes, rows: orderedRows };
}

/** Parsea una fecha en formato `DD/MM/YYYY` (formato del XLSX del SAT). */
function parseDate(s: string): Date | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

export async function generate(opts: GenerateOptions = {}): Promise<GenerateResult> {
  const filesDir = opts.filesDir ?? defaultFilesDir();
  const outDir = opts.outDir ?? defaultOutDir();
  const catalogos = opts.catalogos ?? CATALOGOS;

  if (!opts.skipDownload) {
    const sat = new SatResources({
      version: '4.0',
      outputDir: filesDir,
      xlsxUrl: opts.xlsxUrl,
    });
    const xsdPathLocal = path.join(filesDir, 'catCFDI.xsd');
    const cfdvPathLocal = path.join(filesDir, 'cfdv40.xsd');
    const haveXsd = fs.existsSync(xsdPathLocal) && fs.existsSync(cfdvPathLocal);
    if (opts.forceDownload || !haveXsd) {
      await sat.download();
    }
    await sat.downloadXlsx({ force: opts.forceDownload });
  }

  const xsdPath = path.join(filesDir, 'catCFDI.xsd');
  const xlsxPath = path.join(filesDir, 'catCFDI.xlsx');

  if (!fs.existsSync(xsdPath)) {
    throw new Error(`No existe ${xsdPath}. Ejecuta sin --skip-download.`);
  }
  if (!fs.existsSync(xlsxPath)) {
    throw new Error(`No existe ${xlsxPath}. Ejecuta sin --skip-download.`);
  }

  const codesByType = parseXsd(xsdPath);
  const rowsBySheet = parseXlsx(xlsxPath, catalogos.map(specToSheetSpec));

  fs.mkdirSync(outDir, { recursive: true });
  const written: string[] = [];

  for (const spec of catalogos) {
    const { codes, rows } = validateCatalogo(spec, codesByType, rowsBySheet);
    const tsContent = renderCatalogo(spec, codes, rows);
    const outPath = path.join(outDir, `${spec.exportName}.ts`);
    fs.writeFileSync(outPath, tsContent, 'utf-8');
    written.push(outPath);
  }

  const indexPath = path.join(outDir, 'index.ts');
  fs.writeFileSync(indexPath, renderIndex(catalogos), 'utf-8');
  written.push(indexPath);

  return { written, filesDir, outDir };
}

export { validateCatalogo };
