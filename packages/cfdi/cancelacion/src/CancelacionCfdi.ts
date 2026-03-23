import type {
  CredentialLike,
  SatTokenLike,
  CancelacionParams,
  CancelacionResult,
  AceptacionRechazoParams,
  AceptacionRechazoResult,
  PendientesResult,
} from './types';
import {
  buildCancelacionXml,
  buildCancelarRequest,
  parseCancelarResponse,
} from './soap/cancelar';
import {
  buildAceptacionRechazoRequest,
  parseAceptacionRechazoResponse,
  buildConsultaPendientesRequest,
  parsePendientesResponse,
} from './soap/aceptacion-rechazo';

const URL_CANCELAR = 'https://cancelacfd.sat.gob.mx/CancelaCFDService.svc';
const URL_ACEPTACION_RECHAZO =
  'https://cancelacfd.sat.gob.mx/AceptacionRechazo/AceptacionRechazoService.svc';

const SOAP_ACTION_CANCELAR =
  'http://cancelacfd.sat.gob.mx/ICancelaCFDService/CancelaCFD';
const SOAP_ACTION_ACEPTACION_RECHAZO =
  'http://cancelacfd.sat.gob.mx/IAceptacionRechazoService/ProcesarRespuesta';
const SOAP_ACTION_PENDIENTES =
  'http://cancelacfd.sat.gob.mx/IAceptacionRechazoService/ConsultaPendientes';

const TIMEOUT_MS = 60_000;

/**
 * Cliente para los webservices de cancelacion de CFDI del SAT.
 *
 * Implementa:
 * - Cancelacion de CFDI con CSD/FIEL
 * - Aceptacion/Rechazo de solicitudes de cancelacion
 * - Consulta de cancelaciones pendientes
 *
 * @example
 * ```typescript
 * const cancelacion = new CancelacionCfdi(token, credential);
 *
 * const result = await cancelacion.cancelar({
 *   rfcEmisor: 'AAA010101AAA',
 *   uuid: 'a3d08a33-d0d8-4f36-a857-ab4b2a5edc7c',
 *   motivo: MotivoCancelacion.SinRelacion,
 * });
 * ```
 */
export class CancelacionCfdi {
  constructor(
    private readonly _token: SatTokenLike,
    private readonly _credential: CredentialLike
  ) {}

  /**
   * Cancela un CFDI ante el SAT.
   */
  async cancelar(params: CancelacionParams): Promise<CancelacionResult> {
    const rfcEmisor = params.rfcEmisor || this._credential.rfc();
    const fecha = new Date().toISOString().replace(/\.\d{3}Z$/, '');
    const { cert, signatureValue, serialNumber } = this._signComponents(
      `CancelaCFD-${params.uuid}`
    );

    const cancelacionXml = buildCancelacionXml(
      params,
      rfcEmisor,
      fecha,
      cert,
      signatureValue,
      serialNumber
    );

    const body = buildCancelarRequest(
      cancelacionXml,
      this._token.value,
      cert,
      signatureValue
    );

    const xml = await this._post(URL_CANCELAR, SOAP_ACTION_CANCELAR, body);
    return parseCancelarResponse(xml);
  }

  /**
   * Acepta o rechaza la cancelacion de un CFDI recibido.
   * El receptor tiene 72 horas para responder.
   */
  async aceptarRechazar(
    params: AceptacionRechazoParams
  ): Promise<AceptacionRechazoResult> {
    const fecha = new Date().toISOString().replace(/\.\d{3}Z$/, '');
    const { cert, signatureValue } = this._signComponents(
      `AceptacionRechazo-${params.uuid}`
    );

    const body = buildAceptacionRechazoRequest(
      params,
      this._token.value,
      cert,
      signatureValue,
      fecha
    );

    const xml = await this._post(
      URL_ACEPTACION_RECHAZO,
      SOAP_ACTION_ACEPTACION_RECHAZO,
      body
    );
    return parseAceptacionRechazoResponse(xml);
  }

  /**
   * Consulta los CFDIs pendientes de aceptar/rechazar cancelacion.
   */
  async consultarPendientes(): Promise<PendientesResult[]> {
    const rfcReceptor = this._credential.rfc();
    const { cert, signatureValue } = this._signComponents(
      `ConsultaPendientes-${rfcReceptor}`
    );

    const body = buildConsultaPendientesRequest(
      rfcReceptor,
      this._token.value,
      cert,
      signatureValue
    );

    const xml = await this._post(
      URL_ACEPTACION_RECHAZO,
      SOAP_ACTION_PENDIENTES,
      body
    );
    return parsePendientesResponse(xml);
  }

  private _signComponents(content: string): {
    cert: string;
    signatureValue: string;
    serialNumber: string;
  } {
    const signatureValue = this._credential.sign(content);
    const pemCert = this._credential.certificate.toPem();
    const cert = pemCert
      .replace(/-----BEGIN CERTIFICATE-----/g, '')
      .replace(/-----END CERTIFICATE-----/g, '')
      .replace(/\s+/g, '');
    const serialNumber = this._credential.certificate.serialNumber();

    return { cert, signatureValue, serialNumber };
  }

  private async _post(
    url: string,
    soapAction: string,
    body: string
  ): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          SOAPAction: `"${soapAction}"`,
        },
        body,
        signal: controller.signal,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error(
          `Timeout: el webservice de cancelacion no respondio en ${TIMEOUT_MS / 1000} segundos`
        );
      }
      throw new Error(
        `Error de red al conectar con el servicio de cancelacion: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      throw new Error(
        `El webservice de cancelacion retorno HTTP ${response.status}: ${response.statusText}`
      );
    }

    return response.text();
  }
}
