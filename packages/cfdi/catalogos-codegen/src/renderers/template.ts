import type { CatalogoSpec } from '../catalogos.config';
import type { XlsxRow } from '../parsers/xlsx';

const HEADER = `// Generado por @cfdi/catalogos-codegen. NO EDITAR.\n`;

function jsString(value: string): string {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

const VALID_IDENTIFIER = /^[A-Za-z][A-Za-z0-9_]*$/;
const TS_RESERVED = new Set([
  'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
  'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 'false',
  'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new',
  'null', 'return', 'super', 'switch', 'this', 'throw', 'true', 'try',
  'typeof', 'var', 'void', 'while', 'with', 'yield',
]);

/**
 * Normaliza un texto a UPPER_SNAKE_CASE quitando acentos y caracteres no
 * alfanumericos. Si empieza con digito, antepone `_`.
 */
function toEnumName(text: string): string {
  const normalized = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (!normalized) return '';
  return /^\d/.test(normalized) ? `_${normalized}` : normalized;
}

/**
 * Decide el nombre del miembro de enum para un codigo dado.
 * - Si hay override en `enumNames`, lo usa.
 * - Si el codigo es un identificador valido (ej. 'USD', 'MEX', 'Tasa'), lo usa.
 * - Sino, deriva desde la descripcion.
 */
function deriveEnumName(
  code: string,
  description: string,
  overrides?: Record<string, string>
): string {
  if (overrides && overrides[code]) return overrides[code];
  if (VALID_IDENTIFIER.test(code) && !TS_RESERVED.has(code.toLowerCase())) {
    return code;
  }
  const fromDesc = toEnumName(description);
  if (fromDesc) return fromDesc;
  return toEnumName(`CODE_${code}`);
}

/**
 * Cuando el XLSX no tiene descripcion (codigo deprecated), intenta derivar
 * un label desde el nombre del enum: `POR_DEFINIR` -> `Por definir`.
 * Si el nombre es auto-generado tipo `CODE_xxx`, devuelve string vacio.
 */
function labelFromEnumName(enumName: string): string {
  if (/^_?CODE_/.test(enumName) || /^_\d/.test(enumName)) return '';
  const words = enumName.split('_').filter(Boolean);
  if (words.length === 0) return '';
  return words
    .map((w, i) => {
      if (i === 0) return w.charAt(0) + w.slice(1).toLowerCase();
      return w.toLowerCase();
    })
    .join(' ');
}

function setNested(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.');
  let cursor: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (typeof cursor[key] !== 'object' || cursor[key] === null) {
      cursor[key] = {};
    }
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[parts[parts.length - 1]] = value;
}

function renderValue(value: unknown, indent: string): string {
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') return String(value);
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return renderObjectLiteral(value as Record<string, unknown>, indent);
  }
  return jsString(String(value));
}

function renderObjectLiteral(obj: Record<string, unknown>, indent: string): string {
  const inner = Object.entries(obj)
    .map(([k, v]) => `${indent}  ${k}: ${renderValue(v, indent + '  ')}`)
    .join(',\n');
  return `{\n${inner},\n${indent}}`;
}

/**
 * Calcula los nombres de enum para todos los codigos resolviendo colisiones.
 * Devuelve un mapa code -> enumName que el renderer usa para el `enum` y
 * tambien como fallback de label en el `List`.
 */
function buildEnumNames(
  spec: CatalogoSpec,
  codes: string[],
  rows: XlsxRow[]
): Map<string, string> {
  const rowByCode = new Map(rows.map(r => [r.code, r] as const));
  const result = new Map<string, string>();
  const seen = new Set<string>();
  for (const code of codes) {
    const desc = rowByCode.get(code)?.values[spec.descKey] ?? '';
    let name = deriveEnumName(code, desc, spec.enumNames);
    if (seen.has(name)) {
      name = `${name}_${toEnumName(code) || code}`;
    }
    if (seen.has(name)) {
      throw new Error(
        `${spec.exportName}: nombre de enum "${name}" duplicado al derivar para codigo "${code}". ` +
          `Anade un override en src/overrides/${spec.exportName}.ts.`
      );
    }
    seen.add(name);
    result.set(code, name);
  }
  return result;
}

function renderEnum(
  spec: CatalogoSpec,
  codes: string[],
  rows: XlsxRow[],
  enumNames: Map<string, string>
): string {
  const enumName = spec.enumExport ?? spec.exportName;
  const rowByCode = new Map(rows.map(r => [r.code, r] as const));
  const lines: string[] = [];
  for (const code of codes) {
    const row = rowByCode.get(code);
    if (row?.deprecated) {
      lines.push(`  /** @deprecated ${row.deprecated.reason} */`);
    }
    lines.push(`  ${enumNames.get(code)} = ${jsString(code)},`);
  }
  return `export enum ${enumName} {\n${lines.join('\n')}\n}\n\n`;
}

function renderTypeUnion(spec: CatalogoSpec, codes: string[]): string {
  const typeName = spec.typeExport ?? `${spec.exportName}Type`;
  const lines = codes.map(c => `  | ${jsString(c)}`).join('\n');
  return `export type ${typeName} =\n${lines};\n\n`;
}

function renderList(
  spec: CatalogoSpec,
  rows: XlsxRow[],
  enumNames: Map<string, string>
): string {
  const listName = spec.listExport ?? `${spec.exportName}List`;
  const items = rows
    .map(row => {
      const obj: Record<string, unknown> = {};
      // value primero
      obj.value = row.code;
      // descKey (label o descripcion) segundo. Si esta vacio (codigo deprecated
      // sin descripcion en XLSX), buscar en spec.descriptions override y luego
      // derivar del nombre del enum.
      const descKey = spec.descKey;
      let label = row.values[descKey] ?? '';
      if (!label && spec.descriptions?.[row.code]) {
        label = spec.descriptions[row.code];
      }
      if (!label) {
        label = labelFromEnumName(enumNames.get(row.code) ?? '');
      }
      obj[descKey] = label;
      // extras
      for (const extra of spec.extraColumns ?? []) {
        setNested(obj, extra.key, row.values[extra.key] ?? '');
      }
      // deprecated siempre presente para que el shape sea uniforme y filtrable
      // con `list.filter(x => !x.deprecated)`.
      obj.deprecated = !!row.deprecated;
      if (row.deprecated) {
        obj.deprecatedReason = row.deprecated.reason;
      }
      return `  ${renderObjectLiteral(obj, '  ')}`;
    })
    .join(',\n');
  return `export const ${listName} = [\n${items},\n];\n`;
}

export function renderCatalogo(
  spec: CatalogoSpec,
  codes: string[],
  rows: XlsxRow[]
): string {
  const enumNames = buildEnumNames(spec, codes, rows);
  return (
    HEADER +
    renderEnum(spec, codes, rows, enumNames) +
    renderTypeUnion(spec, codes) +
    renderList(spec, rows, enumNames)
  );
}

export function renderIndex(specs: CatalogoSpec[]): string {
  const exports = specs.map(s => `export * from './${s.exportName}';`).join('\n');
  return `${HEADER}${exports}\n`;
}
