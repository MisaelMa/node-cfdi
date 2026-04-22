/**
 * Tipos para scraping del portal SAT.
 *
 * El portal SAT (portalcfdi.facturaelectronica.sat.gob.mx) permite
 * iniciar sesion con FIEL o CIEC para consultar CFDIs, opinion de
 * cumplimiento, constancia de situacion fiscal, etc.
 */

export enum TipoAutenticacion {
  FIEL = 'fiel',
  CIEC = 'ciec',
}

export interface CredencialCIEC {
  tipo: TipoAutenticacion.CIEC;
  rfc: string;
  password: string;
}

export interface CredencialFIEL {
  tipo: TipoAutenticacion.FIEL;
  certificatePem: string;
  privateKeyPem: string;
  password: string;
}

export type CredencialPortal = CredencialCIEC | CredencialFIEL;

export interface SesionSAT {
  cookies: Record<string, string>;
  csrfToken?: string;
  rfc: string;
  authenticated: boolean;
  expiresAt?: Date;
}

export interface ConsultaCfdiParams {
  rfcEmisor?: string;
  rfcReceptor?: string;
  fechaInicio: string;
  fechaFin: string;
  tipoComprobante?: string;
  estadoCfdi?: 'vigente' | 'cancelado' | 'todos';
}

export interface CfdiConsultaResult {
  uuid: string;
  rfcEmisor: string;
  nombreEmisor: string;
  rfcReceptor: string;
  nombreReceptor: string;
  fechaEmision: string;
  fechaCertificacion: string;
  total: number;
  efecto: string;
  estado: string;
}

export interface ScraperConfig {
  /** Tiempo maximo de espera por request (ms) */
  timeout?: number;
  /** User-Agent a usar en las peticiones */
  userAgent?: string;
  /** URL base del portal (para pruebas) */
  baseUrl?: string;
}
