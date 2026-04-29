// Generado por @cfdi/catalogos-codegen. NO EDITAR.
export enum RegimenFiscal {
  GENERAL_DE_LEY_PERSONAS_MORALES = '601',
  PERSONAS_MORALES_CON_FINES_NO_LUCRATIVOS = '603',
  SUELDOS_Y_SALARIOS_E_INGRESOS_ASIMILADOS_A_SALARIOS = '605',
  ARRENDAMIENTO = '606',
  REGIMEN_DE_ENAJENACION_O_ADQUISICION_DE_BIENES = '607',
  DEMAS_INGRESOS = '608',
  /** @deprecated Removido del catalogo XLSX del SAT */
  CODE_609 = '609',
  RESIDENTES_EN_EL_EXTRANJERO_SIN_ESTABLECIMIENTO_PERMANENTE_EN_MEXICO = '610',
  INGRESOS_POR_DIVIDENDOS_SOCIOS_Y_ACCIONISTAS = '611',
  PERSONAS_FISICAS_CON_ACTIVIDADES_EMPRESARIALES_Y_PROFESIONALES = '612',
  INGRESOS_POR_INTERESES = '614',
  REGIMEN_DE_LOS_INGRESOS_POR_OBTENCION_DE_PREMIOS = '615',
  SIN_OBLIGACIONES_FISCALES = '616',
  SOCIEDADES_COOPERATIVAS_DE_PRODUCCION_QUE_OPTAN_POR_DIFERIR_SUS_INGRESOS = '620',
  INCORPORACION_FISCAL = '621',
  ACTIVIDADES_AGRICOLAS_GANADERAS_SILVICOLAS_Y_PESQUERAS = '622',
  OPCIONAL_PARA_GRUPOS_DE_SOCIEDADES = '623',
  COORDINADOS = '624',
  REGIMEN_DE_LAS_ACTIVIDADES_EMPRESARIALES_CON_INGRESOS_A_TRAVES_DE_PLATAFORMAS_TECNOLOGICAS = '625',
  REGIMEN_SIMPLIFICADO_DE_CONFIANZA = '626',
  /** @deprecated Removido del catalogo XLSX del SAT */
  CODE_628 = '628',
  /** @deprecated Removido del catalogo XLSX del SAT */
  CODE_629 = '629',
  /** @deprecated Removido del catalogo XLSX del SAT */
  CODE_630 = '630',
}

export type RegimenFiscalType =
  | '601'
  | '603'
  | '605'
  | '606'
  | '607'
  | '608'
  | '609'
  | '610'
  | '611'
  | '612'
  | '614'
  | '615'
  | '616'
  | '620'
  | '621'
  | '622'
  | '623'
  | '624'
  | '625'
  | '626'
  | '628'
  | '629'
  | '630';

export const RegimenFiscalList = [
  {
    value: '601',
    descripcion: 'General de Ley Personas Morales',
    personType: {
      fisica: 'No',
      moral: 'Sí',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '603',
    descripcion: 'Personas Morales con Fines no Lucrativos',
    personType: {
      fisica: 'No',
      moral: 'Sí',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '605',
    descripcion: 'Sueldos y Salarios e Ingresos Asimilados a Salarios',
    personType: {
      fisica: 'Sí',
      moral: 'No',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '606',
    descripcion: 'Arrendamiento',
    personType: {
      fisica: 'Sí',
      moral: 'No',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '607',
    descripcion: 'Régimen de Enajenación o Adquisición de Bienes',
    personType: {
      fisica: 'Sí',
      moral: 'No',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '608',
    descripcion: 'Demás ingresos',
    personType: {
      fisica: 'Sí',
      moral: 'No',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '609',
    descripcion: 'Consolidación',
    personType: {
      fisica: '',
      moral: '',
    },
    startDate: '',
    endingDate: '',
    deprecated: true,
    deprecatedReason: 'Removido del catalogo XLSX del SAT',
  },
  {
    value: '610',
    descripcion: 'Residentes en el Extranjero sin Establecimiento Permanente en México',
    personType: {
      fisica: 'Sí',
      moral: 'Sí',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '611',
    descripcion: 'Ingresos por Dividendos (socios y accionistas)',
    personType: {
      fisica: 'Sí',
      moral: 'No',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '612',
    descripcion: 'Personas Físicas con Actividades Empresariales y Profesionales',
    personType: {
      fisica: 'Sí',
      moral: 'No',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '614',
    descripcion: 'Ingresos por intereses',
    personType: {
      fisica: 'Sí',
      moral: 'No',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '615',
    descripcion: 'Régimen de los ingresos por obtención de premios',
    personType: {
      fisica: 'Sí',
      moral: 'No',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '616',
    descripcion: 'Sin obligaciones fiscales',
    personType: {
      fisica: 'Sí',
      moral: 'No',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '620',
    descripcion: 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos',
    personType: {
      fisica: 'No',
      moral: 'Sí',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '621',
    descripcion: 'Incorporación Fiscal',
    personType: {
      fisica: 'Sí',
      moral: 'No',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '622',
    descripcion: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras',
    personType: {
      fisica: 'No',
      moral: 'Sí',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '623',
    descripcion: 'Opcional para Grupos de Sociedades',
    personType: {
      fisica: 'No',
      moral: 'Sí',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '624',
    descripcion: 'Coordinados',
    personType: {
      fisica: 'No',
      moral: 'Sí',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '625',
    descripcion: 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas',
    personType: {
      fisica: 'Sí',
      moral: 'No',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '626',
    descripcion: 'Régimen Simplificado de Confianza',
    personType: {
      fisica: 'Sí',
      moral: 'Sí',
    },
    startDate: '01/01/2022',
    endingDate: '',
    deprecated: false,
  },
  {
    value: '628',
    descripcion: 'Hidrocarburos',
    personType: {
      fisica: '',
      moral: '',
    },
    startDate: '',
    endingDate: '',
    deprecated: true,
    deprecatedReason: 'Removido del catalogo XLSX del SAT',
  },
  {
    value: '629',
    descripcion: 'De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales',
    personType: {
      fisica: '',
      moral: '',
    },
    startDate: '',
    endingDate: '',
    deprecated: true,
    deprecatedReason: 'Removido del catalogo XLSX del SAT',
  },
  {
    value: '630',
    descripcion: 'Enajenación de acciones en bolsa de valores',
    personType: {
      fisica: '',
      moral: '',
    },
    startDate: '',
    endingDate: '',
    deprecated: true,
    deprecatedReason: 'Removido del catalogo XLSX del SAT',
  },
];
