// Generado por @cfdi/catalogos-codegen. NO EDITAR.
export enum ExportacionEnum {
  NoAplica = '01',
  Definitiva = '02',
  Temporal = '03',
  DefinitivaCFDIRelacionado = '04',
}

export type ExportacionType =
  | '01'
  | '02'
  | '03'
  | '04';

export const ExportacionList = [
  {
    value: '01',
    descripcion: 'No aplica',
    deprecated: false,
  },
  {
    value: '02',
    descripcion: 'Definitiva con clave A1',
    deprecated: false,
  },
  {
    value: '03',
    descripcion: 'Temporal',
    deprecated: false,
  },
  {
    value: '04',
    descripcion: 'Definitiva con clave distinta a A1 o cuando no existe enajenación en términos del CFF',
    deprecated: false,
  },
];
