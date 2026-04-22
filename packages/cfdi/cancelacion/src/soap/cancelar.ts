import type { CancelacionParams, CancelacionResult, EstatusCancelacion } from '../types';

/**
 * Construye el XML de cancelacion firmado con CSD.
 * Sigue la estructura requerida por el servicio de cancelacion del SAT.
 *
 * @see https://cancelacfd.sat.gob.mx/
 */
export function buildCancelacionXml(
  params: CancelacionParams,
  rfcEmisor: string,
  fecha: string,
  cert: string,
  signatureValue: string,
  serialNumber: string
): string {
  const folioAttr =
    params.motivo === '01' && params.folioSustitucion
      ? ` FolioSustitucion="${params.folioSustitucion}"`
      : '';

  return `<?xml version="1.0" encoding="utf-8"?>
<Cancelacion xmlns="http://cancelacfd.sat.gob.mx"
             xmlns:xsd="http://www.w3.org/2001/XMLSchema"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             RfcEmisor="${rfcEmisor}"
             Fecha="${fecha}">
  <Folios>
    <Folio UUID="${params.uuid}"
           Motivo="${params.motivo}"${folioAttr}/>
  </Folios>
  <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
    <SignedInfo>
      <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
      <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
      <Reference URI="">
        <Transforms>
          <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
        </Transforms>
        <DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
        <DigestValue></DigestValue>
      </Reference>
    </SignedInfo>
    <SignatureValue>${signatureValue}</SignatureValue>
    <KeyInfo>
      <X509Data>
        <X509IssuerSerial>
          <X509SerialNumber>${serialNumber}</X509SerialNumber>
        </X509IssuerSerial>
        <X509Certificate>${cert}</X509Certificate>
      </X509Data>
    </KeyInfo>
  </Signature>
</Cancelacion>`;
}

/**
 * Construye el envelope SOAP para enviar la cancelacion al webservice del SAT.
 */
export function buildCancelarRequest(
  cancelacionXml: string,
  token: string,
  cert: string,
  signatureValue: string
): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
  <s:Header>
    <o:Security xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
                s:mustUnderstand="1">
      <u:Timestamp>
        <u:Created>${token}</u:Created>
      </u:Timestamp>
      <o:BinarySecurityToken
        ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"
        EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">
        ${cert}
      </o:BinarySecurityToken>
    </o:Security>
  </s:Header>
  <s:Body>
    <CancelaCFD xmlns="http://tempuri.org/">
      <Cancelacion>${escapeXmlContent(cancelacionXml)}</Cancelacion>
    </CancelaCFD>
  </s:Body>
</s:Envelope>`;
}

function escapeXmlContent(xml: string): string {
  return xml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function extractTag(xml: string, localName: string): string {
  const pattern = new RegExp(
    `<(?:[a-zA-Z0-9_]+:)?${localName}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_]+:)?${localName}>`,
    'i'
  );
  const match = xml.match(pattern);
  return match ? match[1].trim() : '';
}

function extractAttr(xml: string, attrName: string): string {
  const pattern = new RegExp(`${attrName}="([^"]*)"`, 'i');
  const match = xml.match(pattern);
  return match ? match[1] : '';
}

/**
 * Parsea la respuesta del servicio CancelaCFD.
 */
export function parseCancelarResponse(xml: string): CancelacionResult {
  if (xml.includes('<faultcode>') || xml.includes(':Fault>')) {
    const faultString = extractTag(xml, 'faultstring');
    throw new Error(
      `SOAP Fault: ${faultString || 'Error desconocido del servicio de cancelacion'}`
    );
  }

  const folioTag =
    extractTag(xml, 'Folio') ||
    extractTag(xml, 'CancelaCFDResult');

  const uuid = extractAttr(folioTag || xml, 'UUID') || extractAttr(xml, 'UUID');
  const estatusRaw = extractAttr(folioTag || xml, 'EstatusUUID') || extractAttr(xml, 'EstatusUUID');
  const codEstatus = extractAttr(xml, 'CodEstatus') || extractTag(xml, 'CodEstatus');
  const mensaje = extractAttr(xml, 'Mensaje') || extractTag(xml, 'Mensaje');

  const estatusMap: Record<string, EstatusCancelacion> = {
    '201': 'Cancelado' as EstatusCancelacion,
    '202': 'EnProceso' as EstatusCancelacion,
    Cancelado: 'Cancelado' as EstatusCancelacion,
    EnProceso: 'EnProceso' as EstatusCancelacion,
  };

  const estatus = estatusMap[estatusRaw] ?? ('EnProceso' as EstatusCancelacion);

  return { uuid, estatus, codEstatus, mensaje };
}
