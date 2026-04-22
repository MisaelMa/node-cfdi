import type { SolicitudParams, SolicitudResult } from '../types';

const NS_DM_SOLICITUD =
  'http://DescargaMasivaTerceros.sat.gob.mx/';

/**
 * Construye el envelope SOAP para solicitar una descarga masiva.
 *
 * La firma digital y el token de autenticacion se incluyen en el header
 * como Security WS-Security. El body contiene los parametros de la solicitud
 * firmados por la FIEL del solicitante.
 */
export function buildSolicitarRequest(
  params: SolicitudParams,
  token: string,
  cert: string,
  signatureValue: string
): string {
  const {
    rfcSolicitante,
    fechaInicio,
    fechaFin,
    tipoSolicitud,
    tipoDescarga,
    rfcEmisor,
    rfcReceptor,
    estadoComprobante,
  } = params;

  // Construir el atributo de filtro segun el tipo de descarga
  const filtroAttr =
    tipoDescarga === 'RfcEmisor'
      ? `RfcEmisor="${rfcEmisor ?? rfcSolicitante}"`
      : `RfcReceptor="${rfcReceptor ?? rfcSolicitante}"`;

  const estadoAttr =
    estadoComprobante != null
      ? ` EstadoComprobante="${estadoComprobante}"`
      : '';

  return `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:des="http://DescargaMasivaTerceros.sat.gob.mx/"
            xmlns:xd="http://www.w3.org/2000/09/xmldsig#">
  <s:Header>
    <h:Security xmlns:h="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
                xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
      <u:Timestamp>
        <u:Created>${token}</u:Created>
      </u:Timestamp>
      <xd:Signature>
        <xd:SignedInfo>
          <xd:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
          <xd:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
          <xd:Reference URI="#_0">
            <xd:Transforms>
              <xd:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
            </xd:Transforms>
            <xd:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
            <xd:DigestValue></xd:DigestValue>
          </xd:Reference>
        </xd:SignedInfo>
        <xd:SignatureValue>${signatureValue}</xd:SignatureValue>
        <xd:KeyInfo>
          <xd:X509Data>
            <xd:X509Certificate>${cert}</xd:X509Certificate>
          </xd:X509Data>
        </xd:KeyInfo>
      </xd:Signature>
    </h:Security>
  </s:Header>
  <s:Body>
    <des:SolicitaDescarga>
      <des:solicitud ${filtroAttr}
                     FechaInicial="${fechaInicio}T00:00:00"
                     FechaFinal="${fechaFin}T23:59:59"
                     RfcSolicitante="${rfcSolicitante}"
                     TipoSolicitud="${tipoSolicitud}"${estadoAttr}>
        <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
                      Id="SelloDigital">
          <ds:SignedInfo>
            <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
            <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
            <ds:Reference URI="">
              <ds:Transforms>
                <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
              </ds:Transforms>
              <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
              <ds:DigestValue></ds:DigestValue>
            </ds:Reference>
          </ds:SignedInfo>
          <ds:SignatureValue>${signatureValue}</ds:SignatureValue>
          <ds:KeyInfo>
            <ds:X509Data>
              <ds:X509Certificate>${cert}</ds:X509Certificate>
            </ds:X509Data>
          </ds:KeyInfo>
        </ds:Signature>
      </des:solicitud>
    </des:SolicitaDescarga>
  </s:Body>
</s:Envelope>`;
}

/**
 * Extrae el contenido de una etiqueta XML por nombre local (soporta namespaces).
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
 * Extrae la etiqueta de apertura completa (incluyendo atributos) de un
 * elemento XML por nombre local. Soporta elementos de auto-cierre.
 */
function extractOpeningTag(xml: string, localName: string): string {
  const pattern = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${localName}((?:\\s+[^>]*)?)(?:\\/>|>)`,
    'i'
  );
  const match = xml.match(pattern);
  return match ? match[0] : '';
}

/**
 * Extrae el valor de un atributo XML por nombre.
 */
function extractAttr(xml: string, attrName: string): string {
  const pattern = new RegExp(`${attrName}="([^"]*)"`, 'i');
  const match = xml.match(pattern);
  return match ? match[1] : '';
}

/**
 * Parsea la respuesta SOAP del servicio SolicitaDescarga.
 * Lanza Error si la respuesta contiene un SOAP Fault.
 */
export function parseSolicitarResponse(xml: string): SolicitudResult {
  if (xml.includes('<faultcode>') || xml.includes(':Fault>')) {
    const faultString = extractTag(xml, 'faultstring');
    throw new Error(
      `SOAP Fault: ${faultString || 'Error desconocido del servicio'}`
    );
  }

  // Los atributos estan en el elemento de apertura (puede ser auto-cerrado />)
  const openingTag =
    extractOpeningTag(xml, 'SolicitaDescargaResult') ||
    extractOpeningTag(
      xml,
      'RespuestaSolicitudDescMasivaTercerosSolicitud'
    );

  const context = openingTag || xml;

  const idSolicitud = extractAttr(context, 'IdSolicitud');
  const codEstatus = extractAttr(context, 'CodEstatus');
  const mensaje = extractAttr(context, 'Mensaje');

  return { idSolicitud, codEstatus, mensaje };
}

export { NS_DM_SOLICITUD };
