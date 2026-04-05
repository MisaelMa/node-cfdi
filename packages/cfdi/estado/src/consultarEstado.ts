import type { ConsultaParams, ConsultaResult } from './types';
import { buildSoapRequest, parseSoapResponse, WEBSERVICE_URL, SOAP_ACTION } from './soap';

const TIMEOUT_MS = 30_000;

/**
 * Consulta el estado de un CFDI en el webservice del SAT.
 *
 * @param params - RFC emisor, RFC receptor, total y UUID del CFDI.
 * @returns Resultado con el estado actual del comprobante y helpers booleanos.
 * @throws Error si hay un problema de red, timeout o respuesta SOAP invalida.
 */
export async function consultarEstado(
  params: ConsultaParams
): Promise<ConsultaResult> {
  const body = buildSoapRequest(params);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(WEBSERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: SOAP_ACTION,
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
      `Error de red al consultar el estado del CFDI: ${err instanceof Error ? err.message : String(err)}`
    );
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new Error(
      `El webservice del SAT retorno HTTP ${response.status}: ${response.statusText}`
    );
  }

  const xml = await response.text();
  return parseSoapResponse(xml);
}
