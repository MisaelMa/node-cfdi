import type {
  CredentialLike,
  SatTokenLike,
  SolicitudParams,
  SolicitudResult,
  VerificacionResult,
} from './types';
import {
  buildSolicitarRequest,
  parseSolicitarResponse,
} from './soap/solicitar';
import {
  buildVerificarRequest,
  parseVerificarResponse,
} from './soap/verificar';
import {
  buildDescargarRequest,
  parseDescargarResponse,
} from './soap/descargar';

const URL_SOLICITAR =
  'https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/SolicitaDescargaService.svc';
const URL_VERIFICAR =
  'https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/VerificaSolicitudDescargaService.svc';
const URL_DESCARGAR =
  'https://cfdidescargamasiva.clouda.sat.gob.mx/DescargaMasivaService.svc';

const SOAP_ACTION_SOLICITAR =
  'http://DescargaMasivaTerceros.sat.gob.mx/ISolicitaDescargaService/SolicitaDescarga';
const SOAP_ACTION_VERIFICAR =
  'http://DescargaMasivaTerceros.sat.gob.mx/IVerificaSolicitudDescargaService/VerificaSolicitudDescarga';
const SOAP_ACTION_DESCARGAR =
  'http://DescargaMasivaTerceros.sat.gob.mx/IDescargaMasivaTercerosService/Descargar';

const TIMEOUT_MS = 60_000;

/**
 * Cliente para el webservice de Descarga Masiva del SAT.
 *
 * Implementa los 3 pasos del proceso:
 * 1. solicitar() - Registra la solicitud y obtiene un IdSolicitud
 * 2. verificar() - Consulta el estado y obtiene los IdsPaquetes cuando termina
 * 3. descargar() - Descarga el ZIP de cada paquete
 *
 * El token de autenticacion debe obtenerse previamente con el paquete @sat/auth.
 * La credencial FIEL se usa para firmar las peticiones SOAP.
 *
 * @example
 * ```typescript
 * const descarga = new DescargaMasiva(token, fiel);
 *
 * const solicitud = await descarga.solicitar({
 *   rfcSolicitante: 'AAA010101AAA',
 *   fechaInicio: '2024-01-01',
 *   fechaFin: '2024-01-31',
 *   tipoSolicitud: TipoSolicitud.CFDI,
 *   tipoDescarga: TipoDescarga.Emitidos,
 * });
 *
 * // Esperar a que el SAT procese (puede tardar minutos u horas)
 * const verificacion = await descarga.verificar(solicitud.idSolicitud);
 *
 * if (verificacion.estado === EstadoSolicitud.Terminada) {
 *   for (const idPaquete of verificacion.idsPaquetes) {
 *     const zip = await descarga.descargar(idPaquete);
 *     // Procesar el ZIP...
 *   }
 * }
 * ```
 */
export class DescargaMasiva {
  constructor(
    private readonly _token: SatTokenLike,
    private readonly _credential: CredentialLike
  ) {}

  /**
   * Paso 1: Solicita una descarga masiva de CFDIs al SAT.
   *
   * @param params - Parametros de la solicitud (RFC, fechas, tipo, etc.)
   * @returns IdSolicitud para consultar el estado con verificar()
   */
  async solicitar(params: SolicitudParams): Promise<SolicitudResult> {
    const { cert, signatureValue } = this._signComponents(
      `SolicitudDescarga-${params.rfcSolicitante}`
    );
    const body = buildSolicitarRequest(
      params,
      this._token.value,
      cert,
      signatureValue
    );

    const xml = await this._post(URL_SOLICITAR, SOAP_ACTION_SOLICITAR, body);
    return parseSolicitarResponse(xml);
  }

  /**
   * Paso 2: Verifica el estado de una solicitud previa.
   *
   * Cuando estado === EstadoSolicitud.Terminada (3), la respuesta incluye
   * los idsPaquetes listos para descargar.
   *
   * @param idSolicitud - ID obtenido en solicitar()
   */
  async verificar(idSolicitud: string): Promise<VerificacionResult> {
    const rfc = this._credential.rfc();
    const { cert, signatureValue } = this._signComponents(
      `VerificaSolicitud-${idSolicitud}`
    );
    const body = buildVerificarRequest(
      idSolicitud,
      rfc,
      this._token.value,
      cert,
      signatureValue
    );

    const xml = await this._post(URL_VERIFICAR, SOAP_ACTION_VERIFICAR, body);
    return parseVerificarResponse(xml);
  }

  /**
   * Paso 3: Descarga un paquete ZIP de CFDIs por su ID.
   *
   * El ZIP contiene los XMLs de los CFDIs de la solicitud.
   *
   * @param idPaquete - ID del paquete obtenido en verificar()
   * @returns Buffer con el contenido del ZIP
   */
  async descargar(idPaquete: string): Promise<Buffer> {
    const rfc = this._credential.rfc();
    const { cert, signatureValue } = this._signComponents(
      `Descarga-${idPaquete}`
    );
    const body = buildDescargarRequest(
      idPaquete,
      rfc,
      this._token.value,
      cert,
      signatureValue
    );

    const xml = await this._post(URL_DESCARGAR, SOAP_ACTION_DESCARGAR, body);
    return parseDescargarResponse(xml);
  }

  /**
   * Genera los componentes de firma (certificado y valor de firma) a partir
   * del contenido a firmar y la credencial FIEL.
   */
  private _signComponents(content: string): {
    cert: string;
    signatureValue: string;
  } {
    const signatureValue = this._credential.sign(content);
    const pemCert = this._credential.certificate.toPem();
    const cert = pemCert
      .replace(/-----BEGIN CERTIFICATE-----/g, '')
      .replace(/-----END CERTIFICATE-----/g, '')
      .replace(/\s+/g, '');

    return { cert, signatureValue };
  }

  /**
   * Realiza una peticion HTTP POST SOAP con timeout.
   */
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
          `Timeout: el webservice del SAT no respondio en ${TIMEOUT_MS / 1000} segundos`
        );
      }
      throw new Error(
        `Error de red al conectar con el SAT: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      throw new Error(
        `El webservice del SAT retorno HTTP ${response.status}: ${response.statusText}`
      );
    }

    return response.text();
  }
}
