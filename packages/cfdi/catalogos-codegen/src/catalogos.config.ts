import * as formaPago from './overrides/FormaPago';
import * as metodoPago from './overrides/MetodoPago';
import * as tipoComprobante from './overrides/TipoComprobante';
import * as impuesto from './overrides/Impuesto';
import * as usoCFDI from './overrides/UsoCFDI';
import * as exportacion from './overrides/Exportacion';
import * as regimenFiscal from './overrides/RegimenFiscal';
import * as tipoRelacion from './overrides/TipoRelacion';
import * as estado from './overrides/Estado';

export interface ExtraColumn {
  /** Llave en el objeto resultante. Soporta dot-notation: `personType.fisica`. */
  key: string;
  /** Letra de columna en el XLSX: `D`, `E`, ... */
  column: string;
}

export interface CatalogoSpec {
  /** Nombre del simpleType en `catCFDI.xsd`, p.ej. `c_FormaPago`. */
  simpleType: string;
  /**
   * Descripciones override por codigo. Se usan SOLO cuando el XLSX no
   * tiene descripcion (codigo deprecated). Util para mantener documentado
   * un codigo que el SAT removio del XLSX pero sigue en el XSD.
   */
  descriptions?: Record<string, string>;
  /** Nombre del archivo y exports en `@cfdi/catalogos`. */
  exportName: string;
  /** Nombre de la hoja en `catCFDI.xlsx`. */
  sheetName: string;
  /** Columna del codigo en el XLSX (tipicamente `A`). */
  codeColumn: string;
  /** Columna de la descripcion en el XLSX (tipicamente `B`). */
  descColumn: string;
  /** Llave usada para la descripcion en el objeto: `label` o `descripcion`. */
  descKey: 'label' | 'descripcion';
  /** Columnas extra a leer (vigencia, personType, etc.). */
  extraColumns?: ExtraColumn[];
  /** Mapa codigo -> nombre del miembro del enum. Si vacio, no se emite enum. */
  enumNames?: Record<string, string>;
  /** Override del nombre del enum. Default: `exportName`. */
  enumExport?: string;
  /** Override del nombre del type union. Default: `${exportName}Type`. */
  typeExport?: string;
  /** Override del nombre de la lista. Default: `${exportName}List`. */
  listExport?: string;
  /** Filas de cabecera a saltar al leer la hoja. Default: 4 (titulo + version + headers). */
  headerRows?: number;
  /** Si los codigos XLSX son numericos pero el XSD los espera con leading zeros, longitud objetivo. */
  codePadStart?: number;
}

export const CATALOGOS: CatalogoSpec[] = [
  {
    simpleType: 'c_FormaPago',
    exportName: 'FormaPago',
    sheetName: 'c_FormaPago',
    codeColumn: 'A',
    descColumn: 'B',
    descKey: 'label',
    enumNames: formaPago.enumNames,
    codePadStart: 2,
  },
  {
    simpleType: 'c_MetodoPago',
    exportName: 'MetodoPago',
    sheetName: 'c_MetodoPago',
    codeColumn: 'A',
    descColumn: 'B',
    descKey: 'label',
    enumNames: metodoPago.enumNames,
  },
  {
    simpleType: 'c_TipoDeComprobante',
    exportName: 'TipoComprobante',
    sheetName: 'c_TipoDeComprobante',
    codeColumn: 'A',
    descColumn: 'B',
    descKey: 'label',
    enumNames: tipoComprobante.enumNames,
    typeExport: 'TypeComprobante',
  },
  {
    simpleType: 'c_Impuesto',
    exportName: 'Impuesto',
    sheetName: 'c_Impuesto',
    codeColumn: 'A',
    descColumn: 'B',
    descKey: 'label',
    enumNames: impuesto.enumNames,
    codePadStart: 3,
  },
  {
    simpleType: 'c_UsoCFDI',
    exportName: 'UsoCFDI',
    sheetName: 'c_UsoCFDI',
    codeColumn: 'A',
    descColumn: 'B',
    descKey: 'label',
    enumNames: usoCFDI.enumNames,
    descriptions: usoCFDI.descriptions,
    typeExport: 'UseCFDIType',
    listExport: 'usoCFDIList',
  },
  {
    simpleType: 'c_RegimenFiscal',
    exportName: 'RegimenFiscal',
    sheetName: 'c_RegimenFiscal',
    codeColumn: 'A',
    descColumn: 'B',
    descKey: 'descripcion',
    descriptions: regimenFiscal.descriptions,
    extraColumns: [
      { key: 'personType.fisica', column: 'C' },
      { key: 'personType.moral', column: 'D' },
      { key: 'startDate', column: 'E' },
      { key: 'endingDate', column: 'F' },
    ],
  },
  // Nuevos catalogos pequenos del XSD (sin enum, solo type union + List)
  {
    simpleType: 'c_Moneda',
    exportName: 'Moneda',
    sheetName: 'c_Moneda',
    codeColumn: 'A',
    descColumn: 'B',
    descKey: 'descripcion',
  },
  {
    simpleType: 'c_Exportacion',
    exportName: 'Exportacion',
    sheetName: 'c_Exportacion',
    codeColumn: 'A',
    descColumn: 'B',
    descKey: 'descripcion',
    enumNames: exportacion.enumNames,
    enumExport: 'ExportacionEnum',
    codePadStart: 2,
  },
  {
    simpleType: 'c_Periodicidad',
    exportName: 'Periodicidad',
    sheetName: 'c_Periodicidad',
    codeColumn: 'A',
    descColumn: 'B',
    descKey: 'descripcion',
  },
  {
    simpleType: 'c_Meses',
    exportName: 'Meses',
    sheetName: 'c_Meses',
    codeColumn: 'A',
    descColumn: 'B',
    descKey: 'descripcion',
  },
  {
    simpleType: 'c_TipoRelacion',
    exportName: 'TipoRelacion',
    sheetName: 'c_TipoRelacion',
    codeColumn: 'A',
    descColumn: 'B',
    descKey: 'descripcion',
    descriptions: tipoRelacion.descriptions,
    codePadStart: 2,
  },
  {
    simpleType: 'c_ObjetoImp',
    exportName: 'ObjetoImp',
    sheetName: 'c_ObjetoImp',
    codeColumn: 'A',
    descColumn: 'B',
    descKey: 'descripcion',
    codePadStart: 2,
  },
  {
    simpleType: 'c_TipoFactor',
    exportName: 'TipoFactor',
    sheetName: 'c_TipoFactor',
    codeColumn: 'A',
    descColumn: 'A', // El XLSX no tiene columna separada de descripcion; el codigo es la descripcion
    descKey: 'descripcion',
  },
  {
    simpleType: 'c_Pais',
    exportName: 'Pais',
    sheetName: 'c_Pais',
    codeColumn: 'A',
    descColumn: 'B',
    descKey: 'descripcion',
  },
  {
    simpleType: 'c_Estado',
    exportName: 'Estado',
    sheetName: 'c_Estado',
    codeColumn: 'A',
    descColumn: 'B',
    descKey: 'descripcion',
    descriptions: estado.descriptions,
  },
];
