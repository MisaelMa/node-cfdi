/**
 * Token de sesion devuelto por el servicio de autenticacion del SAT.
 */
export interface SatToken {
  /** Valor del token SOAP (Bearer) */
  value: string;
  /** Fecha y hora de creacion */
  created: Date;
  /** Fecha y hora de expiracion */
  expires: Date;
}

/**
 * Interfaz de duck typing para usar un Credential de @cfdi/csd sin
 * importarlo como dependencia de produccion.
 */
export interface CredentialLike {
  certificate: {
    /** Retorna el certificado en formato DER (Buffer) */
    toDer(): Buffer;
    /** Retorna el certificado en formato PEM */
    toPem(): string;
  };
  /**
   * Firma la cadena `data` con la llave privada usando RSA-SHA256.
   * Retorna la firma en base64.
   */
  sign(data: string): string;
}
