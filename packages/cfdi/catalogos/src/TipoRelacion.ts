// Generado por @cfdi/catalogos-codegen. NO EDITAR.
export enum TipoRelacion {
  NOTA_DE_CREDITO_DE_LOS_DOCUMENTOS_RELACIONADOS = '01',
  NOTA_DE_DEBITO_DE_LOS_DOCUMENTOS_RELACIONADOS = '02',
  DEVOLUCION_DE_MERCANCIA_SOBRE_FACTURAS_O_TRASLADOS_PREVIOS = '03',
  SUSTITUCION_DE_LOS_CFDI_PREVIOS = '04',
  TRASLADOS_DE_MERCANCIAS_FACTURADOS_PREVIAMENTE = '05',
  FACTURA_GENERADA_POR_LOS_TRASLADOS_PREVIOS = '06',
  CFDI_POR_APLICACION_DE_ANTICIPO = '07',
  /** @deprecated Removido del catalogo XLSX del SAT */
  CODE_08 = '08',
  /** @deprecated Removido del catalogo XLSX del SAT */
  CODE_09 = '09',
}

export type TipoRelacionType =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09';

export const TipoRelacionList = [
  {
    value: '01',
    descripcion: 'Nota de crédito de los documentos relacionados',
    deprecated: false,
  },
  {
    value: '02',
    descripcion: 'Nota de débito de los documentos relacionados',
    deprecated: false,
  },
  {
    value: '03',
    descripcion: 'Devolución de mercancía sobre facturas o traslados previos',
    deprecated: false,
  },
  {
    value: '04',
    descripcion: 'Sustitución de los CFDI previos',
    deprecated: false,
  },
  {
    value: '05',
    descripcion: 'Traslados de mercancías facturados previamente',
    deprecated: false,
  },
  {
    value: '06',
    descripcion: 'Factura generada por los traslados previos',
    deprecated: false,
  },
  {
    value: '07',
    descripcion: 'CFDI por aplicación de anticipo',
    deprecated: false,
  },
  {
    value: '08',
    descripcion: 'Factura generada por pagos en parcialidades',
    deprecated: true,
    deprecatedReason: 'Removido del catalogo XLSX del SAT',
  },
  {
    value: '09',
    descripcion: 'Factura generada por pagos diferidos',
    deprecated: true,
    deprecatedReason: 'Removido del catalogo XLSX del SAT',
  },
];
