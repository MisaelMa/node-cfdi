/**
 * Tipos para la generacion de XML de Contabilidad Electronica
 * conforme al Anexo 24 de la RMF del SAT.
 *
 * @see https://www.sat.gob.mx/consultas/42150/contabilidad-electronica
 */

export interface ContribuyenteInfo {
  rfc: string;
  mes: string;
  anio: number;
  tipoEnvio: TipoEnvio;
}

export enum TipoEnvio {
  Normal = 'N',
  Complementaria = 'C',
}

export enum TipoAjuste {
  Cierre = 'C',
  Apertura = 'A',
}

export enum NaturalezaCuenta {
  Deudora = 'D',
  Acreedora = 'A',
}

export interface CuentaBalanza {
  numCta: string;
  saldoIni: number;
  debe: number;
  haber: number;
  saldoFin: number;
}

export interface CuentaCatalogo {
  codAgrup: string;
  numCta: string;
  desc: string;
  subCtaDe?: string;
  nivel: number;
  natur: NaturalezaCuenta;
}

export interface PolizaDetalle {
  numUnidad: string;
  concepto: string;
  debe: number;
  haber: number;
  numCta: string;
}

export interface Poliza {
  numPoliza: string;
  fecha: string;
  concepto: string;
  detalle: PolizaDetalle[];
}

export interface TransaccionAuxiliar {
  fecha: string;
  numPoliza: string;
  concepto: string;
  debe: number;
  haber: number;
}

export interface CuentaAuxiliar {
  numCta: string;
  desCta: string;
  saldoIni: number;
  saldoFin: number;
  transacciones: TransaccionAuxiliar[];
}

export enum VersionContabilidad {
  V1_1 = '1.1',
  V1_3 = '1.3',
}
