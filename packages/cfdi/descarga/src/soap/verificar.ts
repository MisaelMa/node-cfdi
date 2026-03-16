import { EstadoSolicitud, ESTADO_DESCRIPCION } from '../types';
import type { VerificacionResult } from '../types';

/**
 * Construye el envelope SOAP para verificar el estado de una solicitud de
 * descarga masiva.
 */
export function buildVerificarRequest(
  idSolicitud: string,
  rfc: string,
  token: string,
  cert: string,
  signatureValue: string
): string {
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
    <des:VerificaSolicitudDescarga>
      <des:solicitud IdSolicitud="${idSolicitud}"
                     RfcSolicitante="${rfc}">
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
    </des:VerificaSolicitudDescarga>
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
 * elemento XML por nombre local.
 */
function extractOpeningTag(xml: string, localName: string): string {
  const pattern = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${localName}((?:\\s+[^>]*)?)(?:\\/?>|>)`,
    'i'
  );
  const match = xml.match(pattern);
  return match ? match[0] : '';
}

/**
 * Extrae el valor de un atributo XML por nombre, buscando en el XML completo.
 */
function extractAttr(xml: string, attrName: string): string {
  const pattern = new RegExp(`${attrName}="([^"]*)"`, 'i');
  const match = xml.match(pattern);
  return match ? match[1] : '';
}

/**
 * Extrae todos los valores de elementos repetidos (IdsPaquetes).
 */
function extractAllTags(xml: string, localName: string): string[] {
  const pattern = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${localName}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${localName}>`,
    'gi'
  );
  const results: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(xml)) !== null) {
    const value = match[1].trim();
    if (value) results.push(value);
  }
  return results;
}

/**
 * Parsea la respuesta SOAP del servicio VerificaSolicitudDescarga.
 * Lanza Error si la respuesta contiene un SOAP Fault.
 */
export function parseVerificarResponse(xml: string): VerificacionResult {
  if (xml.includes('<faultcode>') || xml.includes(':Fault>')) {
    const faultString = extractTag(xml, 'faultstring');
    throw new Error(
      `SOAP Fault: ${faultString || 'Error desconocido del servicio'}`
    );
  }

  // Los atributos del resultado estan en la etiqueta de apertura del elemento
  const openingTag =
    extractOpeningTag(xml, 'VerificaSolicitudDescargaResult') ||
    extractOpeningTag(xml, 'RespuestaVerificaSolicitudDescMasivaTercerosSolicitud');

  const codEstatus = extractAttr(openingTag || xml, 'CodEstatus');
  const mensaje = extractAttr(openingTag || xml, 'Mensaje');
  const estadoRaw = extractAttr(openingTag || xml, 'EstadoSolicitud');
  const numeroCfdisRaw = extractAttr(openingTag || xml, 'NumeroCFDIs');

  // Los IdsPaquetes pueden estar como elementos hijos
  const idsPaquetes = extractAllTags(xml, 'IdsPaquetes');

  const estadoNum = parseInt(estadoRaw, 10) as EstadoSolicitud;
  const estado = Object.values(EstadoSolicitud).includes(estadoNum)
    ? estadoNum
    : EstadoSolicitud.Error;

  return {
    estado,
    estadoDescripcion: ESTADO_DESCRIPCION[estado] ?? 'Desconocido',
    codEstatus,
    mensaje,
    idsPaquetes,
    numeroCfdis: parseInt(numeroCfdisRaw, 10) || 0,
  };
}
