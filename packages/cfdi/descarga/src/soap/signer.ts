import { createHash } from 'crypto';
import type { CredentialLike } from '../types';

/**
 * Canonicaliza de forma simplificada un fragmento XML para su firma.
 * El SAT acepta C14N exclusivo; esta implementacion cubre los casos del
 * webservice de descarga masiva (atributos en orden de aparicion, sin
 * normalizacion de espacios internos).
 */
export function canonicalize(xml: string): string {
  // Eliminar la declaracion XML si existe
  return xml.replace(/<\?xml[^?]*\?>\s*/g, '').trim();
}

/**
 * Calcula el digest SHA-256 en Base64 del contenido canonicalizado.
 */
export function digestSha256(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('base64');
}

/**
 * Estructura con los componentes de firma SOAP necesarios para armar
 * el header de seguridad WS-Security.
 */
export interface SoapSignatureComponents {
  /** Digest Base64 del body canonicalizado */
  bodyDigest: string;
  /** Firma RSA-SHA256 Base64 del SignedInfo canonicalizado */
  signatureValue: string;
  /** Certificado X.509 en Base64 DER (sin encabezados PEM) */
  x509Certificate: string;
  /** ID del body para referencia en SignedInfo */
  bodyId: string;
}

/**
 * Genera todos los componentes criptograficos necesarios para firmar
 * un mensaje SOAP con WS-Security usando la FIEL.
 *
 * El patron es:
 * 1. Calcular digest SHA-256 del body
 * 2. Construir el SignedInfo con la referencia al body
 * 3. Firmar el SignedInfo con RSA-SHA256 usando la llave privada de la FIEL
 *
 * @param bodyXml - Contenido XML del body SOAP (sin el elemento Body en si)
 * @param credential - Credencial FIEL con metodos sign() y certificate
 * @param bodyId - ID a asignar al body para la referencia (default: "_0")
 */
export function signSoapBody(
  bodyXml: string,
  credential: CredentialLike,
  bodyId = '_0'
): SoapSignatureComponents {
  const canonBody = canonicalize(bodyXml);
  const bodyDigest = digestSha256(canonBody);

  const signedInfo = buildSignedInfo(bodyDigest, bodyId);
  const canonSignedInfo = canonicalize(signedInfo);
  const signatureValue = credential.sign(canonSignedInfo);

  const pemCert = credential.certificate.toPem();
  const x509Certificate = pemCert
    .replace(/-----BEGIN CERTIFICATE-----/g, '')
    .replace(/-----END CERTIFICATE-----/g, '')
    .replace(/\s+/g, '');

  return {
    bodyDigest,
    signatureValue,
    x509Certificate,
    bodyId,
  };
}

/**
 * Construye el elemento SignedInfo para WS-Security.
 * Referencia al body SOAP identificado por bodyId.
 */
function buildSignedInfo(bodyDigest: string, bodyId: string): string {
  return `<ds:SignedInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">` +
    `<ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>` +
    `<ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>` +
    `<ds:Reference URI="#${bodyId}">` +
    `<ds:Transforms>` +
    `<ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>` +
    `</ds:Transforms>` +
    `<ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>` +
    `<ds:DigestValue>${bodyDigest}</ds:DigestValue>` +
    `</ds:Reference>` +
    `</ds:SignedInfo>`;
}

/**
 * Construye el header WS-Security completo con la firma y el certificado.
 */
export function buildSecurityHeader(
  components: SoapSignatureComponents,
  tokenValue: string
): string {
  const { bodyDigest, signatureValue, x509Certificate, bodyId } = components;
  const signedInfo = buildSignedInfo(bodyDigest, bodyId);

  return `<s:Header>
  <h:Security xmlns:h="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
              xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
    <u:Timestamp>
      <u:Created>${tokenValue}</u:Created>
    </u:Timestamp>
    <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
      ${signedInfo}
      <ds:SignatureValue>${signatureValue}</ds:SignatureValue>
      <ds:KeyInfo>
        <o:SecurityTokenReference xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
          <o:KeyIdentifier ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3SubjectKeyIdentifier"
                           EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">
            ${x509Certificate.substring(0, 40)}
          </o:KeyIdentifier>
        </o:SecurityTokenReference>
      </ds:KeyInfo>
    </ds:Signature>
  </h:Security>
</s:Header>`;
}
