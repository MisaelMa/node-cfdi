import type { ConsultaParams, ConsultaResult } from './types';

const WEBSERVICE_URL =
  'https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc';
const SOAP_ACTION =
  'http://tempuri.org/IConsultaCFDIService/Consulta';

/**
 * Formatea el total del CFDI al formato requerido por el SAT:
 * 17 caracteres totales, 6 decimales, relleno con ceros a la izquierda.
 * Ejemplo: '1000.00' → '0000001000.000000'
 */
export function formatTotal(total: string): string {
  if (!total || !/^\d+(\.\d+)?$/.test(total.trim())) {
    throw new Error(`Total invalido: '${total}'`);
  }
  const [integer, decimal = ''] = total.trim().split('.');
  const paddedInteger = integer.padStart(10, '0');
  const paddedDecimal = decimal.padEnd(6, '0').slice(0, 6);
  return `${paddedInteger}.${paddedDecimal}`;
}

/**
 * Construye el envelope SOAP para consultar el estado de un CFDI.
 */
export function buildSoapRequest(params: ConsultaParams): string {
  const { rfcEmisor, rfcReceptor, total, uuid } = params;
  const totalFormateado = formatTotal(total);
  const expresion = `?re=${rfcEmisor}&rr=${rfcReceptor}&tt=${totalFormateado}&id=${uuid}`;

  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
  <soap:Header/>
  <soap:Body>
    <tem:Consulta>
      <tem:expresionImpresa><![CDATA[${expresion}]]></tem:expresionImpresa>
    </tem:Consulta>
  </soap:Body>
</soap:Envelope>`;
}

/**
 * Extrae el contenido de texto de una etiqueta XML por su nombre local.
 * Soporta namespaces (e.g., <a:Estado>Vigente</a:Estado>).
 */
function extractTag(xml: string, localName: string): string {
  const pattern = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${localName}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${localName}>`,
    'i'
  );
  const match = xml.match(pattern);
  return match ? match[1].trim() : '';
}

/**
 * Parsea la respuesta SOAP del SAT y retorna un ConsultaResult.
 * Lanza un Error si la respuesta contiene un Fault SOAP.
 */
export function parseSoapResponse(xml: string): ConsultaResult {
  if (xml.includes('<s:Fault>') || xml.includes('<soap:Fault>')) {
    const faultString = extractTag(xml, 'faultstring');
    throw new Error(`SOAP Fault: ${faultString || 'Error desconocido del servicio'}`);
  }

  const codigoEstatus = extractTag(xml, 'CodigoEstatus');
  const esCancelable = extractTag(xml, 'EsCancelable');
  const estado = extractTag(xml, 'Estado');
  const estatusCancelacion = extractTag(xml, 'EstatusCancelacion');
  const validacionEFOS = extractTag(xml, 'ValidacionEFOS');

  return {
    codigoEstatus,
    esCancelable,
    estado,
    estatusCancelacion,
    validacionEFOS,
    activo: estado === 'Vigente',
    cancelado: estado === 'Cancelado',
    noEncontrado: estado === 'No Encontrado',
  };
}

export { WEBSERVICE_URL, SOAP_ACTION };
