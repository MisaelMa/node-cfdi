import type {
  AceptacionRechazoParams,
  AceptacionRechazoResult,
  PendientesResult,
} from '../types';

/**
 * Construye el envelope SOAP para aceptar o rechazar la cancelacion
 * de un CFDI emitido por un tercero.
 *
 * SOAPAction: http://cancelacfd.sat.gob.mx/IAceptacionRechazoService/ProcesarRespuesta
 */
export function buildAceptacionRechazoRequest(
  params: AceptacionRechazoParams,
  token: string,
  cert: string,
  signatureValue: string,
  fecha: string
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
    <ProcesarRespuesta xmlns="http://cancelacfd.sat.gob.mx/">
      <RfcReceptor>${params.rfcReceptor}</RfcReceptor>
      <UUID>${params.uuid}</UUID>
      <Respuesta>${params.respuesta}</Respuesta>
      <Fecha>${fecha}</Fecha>
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
            <X509Certificate>${cert}</X509Certificate>
          </X509Data>
        </KeyInfo>
      </Signature>
    </ProcesarRespuesta>
  </s:Body>
</s:Envelope>`;
}

/**
 * Construye el envelope SOAP para consultar las solicitudes de cancelacion
 * pendientes de aceptar/rechazar.
 */
export function buildConsultaPendientesRequest(
  rfcReceptor: string,
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
    <ConsultaPendientes xmlns="http://cancelacfd.sat.gob.mx/">
      <RfcReceptor>${rfcReceptor}</RfcReceptor>
    </ConsultaPendientes>
  </s:Body>
</s:Envelope>`;
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

export function parseAceptacionRechazoResponse(xml: string): AceptacionRechazoResult {
  if (xml.includes('<faultcode>') || xml.includes(':Fault>')) {
    const faultString = extractTag(xml, 'faultstring');
    throw new Error(
      `SOAP Fault: ${faultString || 'Error desconocido del servicio'}`
    );
  }

  const uuid = extractAttr(xml, 'UUID') || extractTag(xml, 'UUID');
  const codEstatus = extractAttr(xml, 'CodEstatus') || extractTag(xml, 'CodEstatus');
  const mensaje = extractAttr(xml, 'Mensaje') || extractTag(xml, 'Mensaje');

  return { uuid, codEstatus, mensaje };
}

export function parsePendientesResponse(xml: string): PendientesResult[] {
  if (xml.includes('<faultcode>') || xml.includes(':Fault>')) {
    const faultString = extractTag(xml, 'faultstring');
    throw new Error(
      `SOAP Fault: ${faultString || 'Error desconocido del servicio'}`
    );
  }

  const results: PendientesResult[] = [];
  const uuidPattern = /<(?:[a-zA-Z0-9_]+:)?UUID[^>]*>([^<]+)<\/(?:[a-zA-Z0-9_]+:)?UUID>/gi;
  let match: RegExpExecArray | null;

  while ((match = uuidPattern.exec(xml)) !== null) {
    const block = xml.substring(
      Math.max(0, match.index - 500),
      match.index + match[0].length + 500
    );
    results.push({
      uuid: match[1].trim(),
      rfcEmisor: extractTag(block, 'RfcEmisor') || extractAttr(block, 'RfcEmisor'),
      fechaSolicitud: extractTag(block, 'FechaSolicitud') || extractAttr(block, 'FechaSolicitud'),
    });
  }

  return results;
}
