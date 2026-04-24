/** Configuración común para integrar un PAC (Proveedor Autorizado de Certificación). */
export interface PacConfig {
  /** URL base o URL completa del servicio (p. ej. WSDL de timbrado). */
  baseUrl?: string;
  user: string;
  password: string;
  /** Si es true, se usan endpoints de demostración del PAC. */
  sandbox: boolean;
}

/** Solicitud de timbrado: CFDI en XML (cadena). */
export interface TimbradoRequest {
  xmlCfdi: string;
}

/** Respuesta de timbrado exitosa con datos del Timbre Fiscal Digital. */
export interface TimbradoResult {
  uuid: string;
  fechaTimbrado: string;
  selloCFD: string;
  selloSAT: string;
  noCertificadoSAT: string;
  cadenaOriginalSAT: string;
  xmlTimbrado: string;
}

/** Resultado de una solicitud de cancelación ante el PAC. */
export interface CancelacionPacResult {
  uuid: string;
  estatus: string;
  acuse: string;
}

/** Resultado de consultar el estatus de un UUID (p. ej. pendiente de timbrado o estado SAT). */
export interface ConsultaEstatusResult {
  uuid: string;
  estatus: string;
  xml?: string;
}

/** Contrato mínimo para un proveedor PAC. */
export interface PacProvider {
  timbrar(request: TimbradoRequest): Promise<TimbradoResult>;
  cancelar(
    uuid: string,
    rfcEmisor: string,
    motivo: string,
    folioSustitucion?: string,
  ): Promise<CancelacionPacResult>;
  consultarEstatus(uuid: string): Promise<ConsultaEstatusResult>;
}

/** Identificadores de PAC soportados por el ecosistema. */
export enum PacProviderType {
  Finkok = 'Finkok',
  SW = 'SW',
  ComercioDigital = 'ComercioDigital',
  Prodigia = 'Prodigia',
  Diverza = 'Diverza',
}
