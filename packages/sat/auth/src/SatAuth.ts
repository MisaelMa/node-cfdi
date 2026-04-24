import { randomUUID } from 'crypto';
import type { SatToken, CredentialLike } from './types';
import {
  canonicalize,
  sha256Digest,
} from './xml-signer';
import {
  buildAuthToken,
  buildTimestampFragment,
  buildSignedInfoFragment,
} from './token-builder';

const AUTH_URL =
  'https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/Autenticacion/Autenticacion.svc';

const SOAP_ACTION =
  'http://DescargaMasivaTerceros.gob.mx/IAutenticacion/Autentica';

/**
 * Realiza autenticacion en los webservices del SAT usando FIEL (eFirma).
 *
 * El proceso genera un token SOAP firmado con la FIEL del contribuyente,
 * lo envia al servicio de autenticacion del SAT y retorna el token de sesion
 * necesario para las solicitudes de descarga masiva.
 *
 * @example
 * ```typescript
 * const fiel = await Credential.create('fiel.cer', 'fiel.key', 'password');
 * const auth = new SatAuth(fiel);
 * const token = await auth.authenticate();
 * console.log(token.value); // token SOAP
 * ```
 */
export class SatAuth {
  constructor(private readonly _credential: CredentialLike) {}

  /**
   * Realiza la autenticacion contra el SAT y retorna el token de sesion.
   *
   * @throws {Error} Si la respuesta del SAT no es exitosa o no contiene token.
   */
  async authenticate(): Promise<SatToken> {
    const now = new Date();
    const expires = new Date(now.getTime() + 5 * 60 * 1000);

    const created = this._toIsoString(now);
    const expiresStr = this._toIsoString(expires);
    const tokenId = `uuid-${randomUUID()}`;

    // Paso 1: Calcular digest del Timestamp canonicalizado
    const timestampFragment = buildTimestampFragment(created, expiresStr);
    const canonicalTimestamp = canonicalize(timestampFragment);
    const digest = sha256Digest(canonicalTimestamp);

    // Paso 2: Construir y firmar el SignedInfo canonicalizado
    const signedInfoFragment = buildSignedInfoFragment(digest);
    const canonicalSignedInfo = canonicalize(signedInfoFragment);
    const signature = this._credential.sign(canonicalSignedInfo);

    // Paso 3: Obtener el certificado en base64
    const certDer = this._credential.certificate.toDer();
    const certificateBase64 = certDer.toString('base64');

    // Paso 4: Construir el envelope SOAP completo
    const envelope = buildAuthToken({
      certificateBase64,
      created,
      expires: expiresStr,
      digest,
      signature,
      tokenId,
    });

    // Paso 5: Enviar la peticion al SAT
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: SOAP_ACTION,
      },
      body: envelope,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `SAT auth request failed: HTTP ${response.status} ${response.statusText}. Body: ${body}`
      );
    }

    const responseText = await response.text();
    return this._parseToken(responseText, now, expires);
  }

  /**
   * Parsea la respuesta SOAP del SAT y extrae el token de sesion.
   */
  private _parseToken(
    soapResponse: string,
    created: Date,
    expires: Date
  ): SatToken {
    // El token viene en el elemento AutenticaResult
    const tokenMatch =
      soapResponse.match(/<AutenticaResult>([^<]+)<\/AutenticaResult>/) ??
      soapResponse.match(/<[^:]*:?AutenticaResult[^>]*>([^<]+)<\/[^:]*:?AutenticaResult>/);

    if (!tokenMatch?.[1]) {
      throw new Error(
        `No se pudo extraer el token de la respuesta del SAT. Respuesta: ${soapResponse.slice(0, 500)}`
      );
    }

    const value = tokenMatch[1].trim();

    if (!value) {
      throw new Error('El token retornado por el SAT esta vacio.');
    }

    return { value, created, expires };
  }

  /**
   * Convierte una fecha a formato ISO 8601 con milisegundos y sufijo Z,
   * tal como lo requiere el SAT.
   */
  private _toIsoString(date: Date): string {
    return date.toISOString();
  }
}
