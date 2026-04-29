// Generado por @cfdi/catalogos-codegen. NO EDITAR.
export enum ObjetoImp {
  NO_OBJETO_DE_IMPUESTO = '01',
  SI_OBJETO_DE_IMPUESTO = '02',
  SI_OBJETO_DEL_IMPUESTO_Y_NO_OBLIGADO_AL_DESGLOSE = '03',
  SI_OBJETO_DEL_IMPUESTO_Y_NO_CAUSA_IMPUESTO = '04',
  SI_OBJETO_DEL_IMPUESTO_IVA_CREDITO_PODEBI = '05',
  SI_OBJETO_DEL_IVA_NO_TRASLADO_IVA = '06',
  NO_TRASLADO_DEL_IVA_SI_DESGLOSE_IEPS = '07',
  NO_TRASLADO_DEL_IVA_NO_DESGLOSE_IEPS = '08',
}

export type ObjetoImpType =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08';

export const ObjetoImpList = [
  {
    value: '01',
    descripcion: 'No objeto de impuesto.',
    deprecated: false,
  },
  {
    value: '02',
    descripcion: 'Sí objeto de impuesto.',
    deprecated: false,
  },
  {
    value: '03',
    descripcion: 'Sí objeto del impuesto y no obligado al desglose.',
    deprecated: false,
  },
  {
    value: '04',
    descripcion: 'Sí objeto del impuesto y no causa impuesto.',
    deprecated: false,
  },
  {
    value: '05',
    descripcion: 'Sí objeto del impuesto, IVA crédito PODEBI.',
    deprecated: false,
  },
  {
    value: '06',
    descripcion: 'Sí objeto del IVA, No traslado IVA.',
    deprecated: false,
  },
  {
    value: '07',
    descripcion: 'No traslado del IVA, Sí desglose IEPS.',
    deprecated: false,
  },
  {
    value: '08',
    descripcion: 'No traslado del IVA, No desglose IEPS.',
    deprecated: false,
  },
];
