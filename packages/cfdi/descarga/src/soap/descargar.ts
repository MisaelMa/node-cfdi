/**
 * Construye el envelope SOAP para descargar un paquete ZIP de CFDIs.
 */
export function buildDescargarRequest(
  idPaquete: string,
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
    <des:PeticionDescargaMasivaTercerosEntrada>
      <des:peticionDescarga IdPaquete="${idPaquete}"
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
      </des:peticionDescarga>
    </des:PeticionDescargaMasivaTercerosEntrada>
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
 * Parsea la respuesta SOAP del servicio DescargaMasiva.
 * El paquete ZIP viene codificado en Base64 dentro del elemento Paquete.
 * Retorna el contenido binario del ZIP como Buffer.
 *
 * @param xml - Cuerpo de la respuesta SOAP como string
 * @throws Error si la respuesta contiene un SOAP Fault o no hay paquete
 */
export function parseDescargarResponse(xml: string): Buffer {
  if (xml.includes('<faultcode>') || xml.includes(':Fault>')) {
    const faultString = extractTag(xml, 'faultstring');
    throw new Error(
      `SOAP Fault: ${faultString || 'Error desconocido del servicio'}`
    );
  }

  const paqueteB64 =
    extractTag(xml, 'Paquete') ||
    extractTag(xml, 'RespuestaDescargaMasivaTercerosSalida');

  if (!paqueteB64) {
    throw new Error(
      'La respuesta del SAT no contiene el elemento Paquete con el ZIP'
    );
  }

  return Buffer.from(paqueteB64.replace(/\s+/g, ''), 'base64');
}
