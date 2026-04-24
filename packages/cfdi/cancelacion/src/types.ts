/**
 * Motivo de cancelacion segun el SAT (Anexo 20).
 * @see https://www.sat.gob.mx/consultas/91447/consulta-de-cancelacion-de-cfdi
 */
export enum MotivoCancelacion {
  /** Comprobante emitido con errores con relacion */
  ConRelacion = '01',
  /** Comprobante emitido con errores sin relacion */
  SinRelacion = '02',
  /** No se llevo a cabo la operacion */
  NoOperacion = '03',
  /** Operacion nominativa relacionada en la factura global */
  FacturaGlobal = '04',
}

export enum EstatusCancelacion {
  EnProceso = 'EnProceso',
  Cancelado = 'Cancelado',
  CancelacionRechazada = 'Rechazada',
  Plazo = 'Plazo',
}

export enum RespuestaAceptacionRechazo {
  Aceptacion = 'Aceptacion',
  Rechazo = 'Rechazo',
}

export interface CancelacionParams {
  rfcEmisor: string;
  uuid: string;
  motivo: MotivoCancelacion;
  /** UUID del CFDI que sustituye (requerido cuando motivo = '01') */
  folioSustitucion?: string;
}

export interface CancelacionResult {
  uuid: string;
  estatus: EstatusCancelacion;
  codEstatus: string;
  mensaje: string;
}

export interface AceptacionRechazoParams {
  rfcReceptor: string;
  uuid: string;
  respuesta: RespuestaAceptacionRechazo;
}

export interface AceptacionRechazoResult {
  uuid: string;
  codEstatus: string;
  mensaje: string;
}

export interface PendientesResult {
  uuid: string;
  rfcEmisor: string;
  fechaSolicitud: string;
}

/**
 * Duck type para el certificado/credencial CSD o FIEL.
 * Compatible con las clases del paquete @cfdi/csd sin importarlo directamente.
 */
export interface CredentialLike {
  certificate: {
    toDer(): Buffer;
    toPem(): string;
    serialNumber(): string;
  };
  sign(data: string): string;
  rfc(): string;
}

/**
 * Duck type para el token SAT.
 */
export interface SatTokenLike {
  value: string;
  created: Date;
  expires: Date;
}
