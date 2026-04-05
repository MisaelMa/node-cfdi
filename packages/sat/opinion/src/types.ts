/**
 * Tipos para la consulta de Opinion de Cumplimiento (32-D) del SAT.
 *
 * La opinion de cumplimiento es un documento que indica si el contribuyente
 * esta al corriente en sus obligaciones fiscales.
 *
 * @see https://www.sat.gob.mx/aplicacion/operacion/66288/genera-tu-constancia-de-situacion-fiscal
 */

export enum ResultadoOpinion {
  Positivo = 'Positivo',
  Negativo = 'Negativo',
  EnSuspenso = 'En suspenso',
  Inscrito = 'Inscrito sin obligaciones',
  NoInscrito = 'No inscrito',
}

export interface OpinionCumplimiento {
  rfc: string;
  nombreContribuyente: string;
  resultado: ResultadoOpinion;
  fechaEmision: string;
  folioOpinion: string;
  /** Obligaciones fiscales reportadas */
  obligaciones: ObligacionFiscal[];
  /** URL para descargar el PDF de la opinion (si disponible) */
  urlPdf?: string;
}

export interface ObligacionFiscal {
  descripcion: string;
  fechaInicio: string;
  fechaFin?: string;
  estado: string;
}

export interface OpinionConfig {
  /** Timeout en ms */
  timeout?: number;
  /** URL base del servicio (para pruebas) */
  baseUrl?: string;
}

/**
 * Duck type para credencial portal.
 * Compatible con los tipos de @sat/scraper.
 */
export interface SesionPortalLike {
  cookies: Record<string, string>;
  rfc: string;
  authenticated: boolean;
}
