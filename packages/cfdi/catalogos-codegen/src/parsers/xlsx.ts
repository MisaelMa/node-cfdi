import fs from 'fs';
import * as XLSX from 'xlsx';

export interface XlsxRow {
  code: string;
  values: Record<string, string>;
  /** Marca el codigo como deprecated. Lo setea `validateCatalogo`. */
  deprecated?: { reason: string };
}

export type RowsBySheet = Map<string, XlsxRow[]>;

export interface SheetSpec {
  sheetName: string;
  /** Nombre del simpleType en el XSD; usado para autodetectar el header del XLSX. */
  simpleType: string;
  codeColumn: string;     // 'A'
  descColumn: string;     // 'B'
  descKey: string;        // 'descripcion' | 'label'
  extraColumns?: { key: string; column: string }[];
  /** Si se omite, se autodetecta la fila del header buscando el `simpleType`. */
  headerRows?: number;
  codePadStart?: number;
}

function colLetterToIndex(letter: string): number {
  let n = 0;
  for (const ch of letter.toUpperCase()) {
    n = n * 26 + (ch.charCodeAt(0) - 64);
  }
  return n - 1;
}

function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function asString(cell: XLSX.CellObject | undefined): string {
  if (!cell) return '';
  if (cell.t === 'd' && cell.v instanceof Date) return formatDate(cell.v);
  if (cell.v instanceof Date) return formatDate(cell.v);
  if (cell.v === undefined || cell.v === null) return '';
  // Para celdas numericas, preferir el valor crudo (`v`) sobre el formateado (`w`)
  // para evitar separadores de miles o formatos locales.
  if (typeof cell.v === 'number') return String(cell.v);
  if (cell.w !== undefined) return String(cell.w).trim();
  return String(cell.v).trim();
}

/**
 * Detecta automaticamente la fila del header (la que tiene el nombre del
 * simpleType `c_Xxx` en la columna A o B) y devuelve el indice de la
 * primera fila de datos.
 *
 * El XLSX del SAT tiene un layout variable (titulo + version + a veces fila
 * extra de subcategoria + headers + datos). Esta busqueda hace al codegen
 * tolerante a esos cambios.
 */
function findFirstDataRow(
  sheet: XLSX.WorkSheet,
  range: XLSX.Range,
  codeIdx: number,
  simpleType: string
): number {
  for (let r = range.s.r; r <= range.e.r; r++) {
    const cell = sheet[XLSX.utils.encode_cell({ r, c: codeIdx })] as
      | XLSX.CellObject
      | undefined;
    if (
      cell &&
      typeof cell.v === 'string' &&
      cell.v.toLowerCase() === simpleType.toLowerCase()
    ) {
      return r + 1;
    }
  }
  // Fallback: 4 filas despues de range.s.r
  return range.s.r + 4;
}

function readSheet(
  workbook: XLSX.WorkBook,
  spec: SheetSpec,
  simpleType: string
): XlsxRow[] {
  const sheet = workbook.Sheets[spec.sheetName];
  if (!sheet) {
    throw new Error(`Hoja "${spec.sheetName}" no encontrada en el XLSX`);
  }
  const range = XLSX.utils.decode_range(sheet['!ref'] ?? 'A1');
  const codeIdx = colLetterToIndex(spec.codeColumn);
  const descIdx = colLetterToIndex(spec.descColumn);
  const extras = (spec.extraColumns ?? []).map(e => ({
    key: e.key,
    idx: colLetterToIndex(e.column),
  }));

  const startRow =
    spec.headerRows !== undefined
      ? range.s.r + spec.headerRows
      : findFirstDataRow(sheet, range, codeIdx, simpleType);

  const rows: XlsxRow[] = [];
  for (let r = startRow; r <= range.e.r; r++) {
    const codeCell = sheet[XLSX.utils.encode_cell({ r, c: codeIdx })] as
      | XLSX.CellObject
      | undefined;
    let code = asString(codeCell);
    if (!code) continue;
    if (spec.codePadStart && /^\d+$/.test(code)) {
      code = code.padStart(spec.codePadStart, '0');
    }
    const values: Record<string, string> = {};
    const descCell = sheet[XLSX.utils.encode_cell({ r, c: descIdx })] as
      | XLSX.CellObject
      | undefined;
    values[spec.descKey] = asString(descCell);
    for (const { key, idx } of extras) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c: idx })] as
        | XLSX.CellObject
        | undefined;
      values[key] = asString(cell);
    }
    rows.push({ code, values });
  }
  return rows;
}

export function parseXlsx(filePath: string, specs: SheetSpec[]): RowsBySheet {
  const buffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
  const result: RowsBySheet = new Map();
  for (const spec of specs) {
    result.set(spec.sheetName, readSheet(workbook, spec, spec.simpleType));
  }
  return result;
}
