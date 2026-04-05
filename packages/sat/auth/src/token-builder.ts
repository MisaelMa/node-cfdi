/**
 * Parametros necesarios para construir el envelope SOAP de autenticacion.
 */
export interface BuildAuthTokenParams {
  /** Certificado en base64 (DER) */
  certificateBase64: string;
  /** Fecha/hora de creacion en ISO 8601 */
  created: string;
  /** Fecha/hora de expiracion en ISO 8601 */
  expires: string;
  /** Digest SHA-256 del Timestamp canonicalizado, en base64 */
  digest: string;
  /** Firma RSA-SHA256 del SignedInfo canonicalizado, en base64 */
  signature: string;
  /** UUID que identifica el BinarySecurityToken */
  tokenId: string;
}

/**
 * Construye el envelope SOAP completo para la peticion de autenticacion
 * al servicio de descarga masiva del SAT.
 */
export function buildAuthToken(params: BuildAuthTokenParams): string {
  const {
    certificateBase64,
    created,
    expires,
    digest,
    signature,
    tokenId,
  } = params;

  return `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">` +
    `<s:Header>` +
    `<o:Security xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" s:mustUnderstand="1">` +
    `<u:Timestamp u:Id="_0">` +
    `<u:Created>${created}</u:Created>` +
    `<u:Expires>${expires}</u:Expires>` +
    `</u:Timestamp>` +
    `<o:BinarySecurityToken u:Id="${tokenId}" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3" EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">${certificateBase64}</o:BinarySecurityToken>` +
    `<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">` +
    `<SignedInfo>` +
    `<CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>` +
    `<SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>` +
    `<Reference URI="#_0">` +
    `<Transforms>` +
    `<Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>` +
    `</Transforms>` +
    `<DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>` +
    `<DigestValue>${digest}</DigestValue>` +
    `</Reference>` +
    `</SignedInfo>` +
    `<SignatureValue>${signature}</SignatureValue>` +
    `<KeyInfo>` +
    `<o:SecurityTokenReference>` +
    `<o:Reference ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3" URI="#${tokenId}"/>` +
    `</o:SecurityTokenReference>` +
    `</KeyInfo>` +
    `</Signature>` +
    `</o:Security>` +
    `</s:Header>` +
    `<s:Body>` +
    `<Autentica xmlns="http://DescargaMasivaTerceros.gob.mx"/>` +
    `</s:Body>` +
    `</s:Envelope>`;
}

/**
 * Construye el fragmento XML del elemento Timestamp usado para calcular
 * el digest de la firma.
 */
export function buildTimestampFragment(created: string, expires: string): string {
  return (
    `<u:Timestamp xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" u:Id="_0">` +
    `<u:Created>${created}</u:Created>` +
    `<u:Expires>${expires}</u:Expires>` +
    `</u:Timestamp>`
  );
}

/**
 * Construye el fragmento XML del SignedInfo usado para calcular la firma.
 */
export function buildSignedInfoFragment(digest: string): string {
  return (
    `<SignedInfo xmlns="http://www.w3.org/2000/09/xmldsig#">` +
    `<CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>` +
    `<SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>` +
    `<Reference URI="#_0">` +
    `<Transforms>` +
    `<Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>` +
    `</Transforms>` +
    `<DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>` +
    `<DigestValue>${digest}</DigestValue>` +
    `</Reference>` +
    `</SignedInfo>`
  );
}
