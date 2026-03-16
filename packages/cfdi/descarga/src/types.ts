export enum TipoSolicitud {
  CFDI = 'CFDI',
  Metadata = 'Metadata',
}

export enum TipoDescarga {
  Emitidos = 'RfcEmisor',
  Recibidos = 'RfcReceptor',
}

export enum EstadoSolicitud {
  Aceptada = 1,
  EnProceso = 2,
  Terminada = 3,
  Error = 4,
  Rechazada = 5,
  Vencida = 6,
}

export interface SolicitudParams {
  rfcSolicitante: string;
  /** Fecha en formato YYYY-MM-DD */
  fechaInicio: string;
  /** Fecha en formato YYYY-MM-DD */
  fechaFin: string;
  tipoSolicitud: TipoSolicitud;
  tipoDescarga: TipoDescarga;
  /** RFC emisor para filtrar (opcional) */
  rfcEmisor?: string;
  /** RFC receptor para filtrar (opcional) */
  rfcReceptor?: string;
}

export interface SolicitudResult {
  idSolicitud: string;
  codEstatus: string;
  mensaje: string;
}

export interface VerificacionResult {
  estado: EstadoSolicitud;
  estadoDescripcion: string;
  codEstatus: string;
  mensaje: string;
  idsPaquetes: string[];
  numeroCfdis: number;
}

/**
 * Duck type para el certificado/credencial FIEL.
 * Compatible con las clases del paquete @cfdi/csd sin importarlo directamente.
 */
export interface CredentialLike {
  certificate: { toDer(): Buffer; toPem(): string };
  sign(data: string): string;
  rfc(): string;
}

/**
 * Duck type para el token SAT.
 * Compatible con el resultado de @sat/auth sin importarlo directamente.
 */
export interface SatTokenLike {
  value: string;
  created: Date;
  expires: Date;
}

/** Descripcion textual del estado de solicitud */
export const ESTADO_DESCRIPCION: Record<EstadoSolicitud, string> = {
  [EstadoSolicitud.Aceptada]: 'Aceptada',
  [EstadoSolicitud.EnProceso]: 'En proceso',
  [EstadoSolicitud.Terminada]: 'Terminada',
  [EstadoSolicitud.Error]: 'Error',
  [EstadoSolicitud.Rechazada]: 'Rechazada',
  [EstadoSolicitud.Vencida]: 'Vencida',
};
