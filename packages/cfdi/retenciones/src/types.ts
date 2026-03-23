/**
 * Namespace URI for CFDI de Retenciones e información de pagos 1.0.
 * @see http://www.sat.gob.mx/esquemas/retencionpago/1
 */
export const RETENCION_PAGO_NAMESPACE_V1 = 'http://www.sat.gob.mx/esquemas/retencionpago/1';

/**
 * Namespace URI for CFDI de Retenciones e información de pagos 2.0.
 * @see http://www.sat.gob.mx/esquemas/retencionpago/2
 */
export const RETENCION_PAGO_NAMESPACE_V2 = 'http://www.sat.gob.mx/esquemas/retencionpago/2';

/**
 * Clasificación por clave de retención (catálogo c_CveRetenc del SAT).
 * Los valores son ejemplos representativos; el catálogo oficial define el conjunto completo.
 */
export enum TipoRetencion {
  Arrendamiento = '14',
  Dividendos = '16',
  Intereses = '17',
  Fideicomiso = '18',
  EnajenacionAcciones = '19',
  Otro = '99',
}

/** Atributos de comprobante para Retenciones 1.0 (misma forma conceptual que 2.0). */
export interface Retencion10 {
  Version: '1.0';
  CveRetenc: string;
  DescRetenc?: string;
  FechaExp: string;
  LugarExpRet: string;
  NumCert?: string;
  FolioInt?: string;
  emisor: EmisorRetencion;
  receptor: ReceptorRetencion;
  periodo: PeriodoRetencion;
  totales: TotalesRetencion;
  complemento?: ComplementoRetencion[];
}

/** Documento Retenciones 2.0: atributos del nodo raíz y nodos hijos requeridos. */
export interface Retencion20 {
  Version: '2.0';
  CveRetenc: string;
  DescRetenc?: string;
  FechaExp: string;
  LugarExpRet: string;
  NumCert?: string;
  FolioInt?: string;
  emisor: EmisorRetencion;
  receptor: ReceptorRetencion;
  periodo: PeriodoRetencion;
  totales: TotalesRetencion;
  complemento?: ComplementoRetencion[];
}

export interface EmisorRetencion {
  Rfc: string;
  NomDenRazSocE?: string;
  RegimenFiscalE: string;
  CurpE?: string;
}

export interface ReceptorNacional {
  RfcRecep: string;
  NomDenRazSocR?: string;
  CurpR?: string;
}

export interface ReceptorExtranjero {
  NumRegIdTrib?: string;
  NomDenRazSocR: string;
}

export interface ReceptorRetencion {
  NacionalidadR: 'Nacional' | 'Extranjero';
  nacional?: ReceptorNacional;
  extranjero?: ReceptorExtranjero;
}

export interface PeriodoRetencion {
  MesIni: string;
  MesFin: string;
  Ejerc: string;
}

export interface TotalesRetencion {
  montoTotOperacion: string;
  montoTotGrav: string;
  montoTotExent: string;
  montoTotRet: string;
}

/**
 * Contenedor genérico de complementos: XML interno ya serializado
 * (elementos del complemento sin declaración XML).
 */
export interface ComplementoRetencion<TMeta = Record<string, unknown>> {
  innerXml: string;
  meta?: TMeta;
}
