// Generado por @cfdi/catalogos-codegen. NO EDITAR.
export enum UsoCFDI {
  ADQUISICION_MERCANCIAS = 'G01',
  DEVOLUCIONES_DESCUENTOS_BONIFICACIONES = 'G02',
  GASTOS_EN_GENERAL = 'G03',
  CONSTRUCCIONES = 'I01',
  MOBILIARIO_Y_EQUIPO_DE_OFICINA = 'I02',
  EQUIPO_DE_TRANSPORTE = 'I03',
  EQUIPO_DE_COMPUTO = 'I04',
  DADOS_TROQUELES_HERRAMENTAL = 'I05',
  COMUNICACIONES_TELEFONICAS = 'I06',
  COMUNICACIONES_SATELITALES = 'I07',
  OTRA_MAQUINARIA = 'I08',
  HONORARIOS_MEDICOS = 'D01',
  GASTOS_MEDICOS_POR_INCAPACIDAD = 'D02',
  GASTOS_FUNERALES = 'D03',
  DONATIVOS = 'D04',
  INTERESES_POR_CREDITOS_HIPOTECARIOS = 'D05',
  APORTACIONES_VOLUNTARIAS_SAR = 'D06',
  PRIMA_SEGUROS_GASTOS_MEDICOS = 'D07',
  GASTOS_TRANSPORTACION_ESCOLAR = 'D08',
  CUENTAS_AHORRO_PENSIONES = 'D09',
  SERVICIOS_EDUCATIVOS = 'D10',
  /** @deprecated Removido del catalogo XLSX del SAT */
  POR_DEFINIR = 'P01',
  SIN_EFECTOS_FISCALES = 'S01',
  PAGOS = 'CP01',
  NOMINA = 'CN01',
}

export type UseCFDIType =
  | 'G01'
  | 'G02'
  | 'G03'
  | 'I01'
  | 'I02'
  | 'I03'
  | 'I04'
  | 'I05'
  | 'I06'
  | 'I07'
  | 'I08'
  | 'D01'
  | 'D02'
  | 'D03'
  | 'D04'
  | 'D05'
  | 'D06'
  | 'D07'
  | 'D08'
  | 'D09'
  | 'D10'
  | 'P01'
  | 'S01'
  | 'CP01'
  | 'CN01';

export const usoCFDIList = [
  {
    value: 'G01',
    label: 'Adquisición de mercancías.',
    deprecated: false,
  },
  {
    value: 'G02',
    label: 'Devoluciones, descuentos o bonificaciones.',
    deprecated: false,
  },
  {
    value: 'G03',
    label: 'Gastos en general.',
    deprecated: false,
  },
  {
    value: 'I01',
    label: 'Construcciones.',
    deprecated: false,
  },
  {
    value: 'I02',
    label: 'Mobiliario y equipo de oficina por inversiones.',
    deprecated: false,
  },
  {
    value: 'I03',
    label: 'Equipo de transporte.',
    deprecated: false,
  },
  {
    value: 'I04',
    label: 'Equipo de computo y accesorios.',
    deprecated: false,
  },
  {
    value: 'I05',
    label: 'Dados, troqueles, moldes, matrices y herramental.',
    deprecated: false,
  },
  {
    value: 'I06',
    label: 'Comunicaciones telefónicas.',
    deprecated: false,
  },
  {
    value: 'I07',
    label: 'Comunicaciones satelitales.',
    deprecated: false,
  },
  {
    value: 'I08',
    label: 'Otra maquinaria y equipo.',
    deprecated: false,
  },
  {
    value: 'D01',
    label: 'Honorarios médicos, dentales y gastos hospitalarios.',
    deprecated: false,
  },
  {
    value: 'D02',
    label: 'Gastos médicos por incapacidad o discapacidad.',
    deprecated: false,
  },
  {
    value: 'D03',
    label: 'Gastos funerales.',
    deprecated: false,
  },
  {
    value: 'D04',
    label: 'Donativos.',
    deprecated: false,
  },
  {
    value: 'D05',
    label: 'Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación).',
    deprecated: false,
  },
  {
    value: 'D06',
    label: 'Aportaciones voluntarias al SAR.',
    deprecated: false,
  },
  {
    value: 'D07',
    label: 'Primas por seguros de gastos médicos.',
    deprecated: false,
  },
  {
    value: 'D08',
    label: 'Gastos de transportación escolar obligatoria.',
    deprecated: false,
  },
  {
    value: 'D09',
    label: 'Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones.',
    deprecated: false,
  },
  {
    value: 'D10',
    label: 'Pagos por servicios educativos (colegiaturas).',
    deprecated: false,
  },
  {
    value: 'P01',
    label: 'Por definir',
    deprecated: true,
    deprecatedReason: 'Removido del catalogo XLSX del SAT',
  },
  {
    value: 'S01',
    label: 'Sin efectos fiscales.',
    deprecated: false,
  },
  {
    value: 'CP01',
    label: 'Pagos',
    deprecated: false,
  },
  {
    value: 'CN01',
    label: 'Nómina',
    deprecated: false,
  },
];
