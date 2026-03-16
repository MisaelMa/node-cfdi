import { describe, it, expect } from 'vitest';
import {
  buildAuthToken,
  buildTimestampFragment,
  buildSignedInfoFragment,
} from '../src/token-builder';

const SAMPLE_PARAMS = {
  certificateBase64: 'CERTBASE64==',
  created: '2024-01-01T00:00:00.000Z',
  expires: '2024-01-01T00:05:00.000Z',
  digest: 'DIGESTBASE64==',
  signature: 'SIGNATUREBASE64==',
  tokenId: 'uuid-1234-5678',
};

describe('buildAuthToken', () => {
  it('contiene el namespace SOAP correcto', () => {
    const xml = buildAuthToken(SAMPLE_PARAMS);
    expect(xml).toContain('xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"');
  });

  it('contiene el namespace WSS utility', () => {
    const xml = buildAuthToken(SAMPLE_PARAMS);
    expect(xml).toContain(
      'xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"'
    );
  });

  it('contiene el namespace WSS secext', () => {
    const xml = buildAuthToken(SAMPLE_PARAMS);
    expect(xml).toContain(
      'xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"'
    );
  });

  it('incluye las fechas de Created y Expires', () => {
    const xml = buildAuthToken(SAMPLE_PARAMS);
    expect(xml).toContain('<u:Created>2024-01-01T00:00:00.000Z</u:Created>');
    expect(xml).toContain('<u:Expires>2024-01-01T00:05:00.000Z</u:Expires>');
  });

  it('incluye el BinarySecurityToken con el certificado', () => {
    const xml = buildAuthToken(SAMPLE_PARAMS);
    expect(xml).toContain('CERTBASE64==');
    expect(xml).toContain('o:BinarySecurityToken');
  });

  it('incluye el tokenId en el BinarySecurityToken', () => {
    const xml = buildAuthToken(SAMPLE_PARAMS);
    expect(xml).toContain('u:Id="uuid-1234-5678"');
  });

  it('incluye el DigestValue', () => {
    const xml = buildAuthToken(SAMPLE_PARAMS);
    expect(xml).toContain('<DigestValue>DIGESTBASE64==</DigestValue>');
  });

  it('incluye el SignatureValue', () => {
    const xml = buildAuthToken(SAMPLE_PARAMS);
    expect(xml).toContain('<SignatureValue>SIGNATUREBASE64==</SignatureValue>');
  });

  it('incluye el algoritmo de canonicalizacion C14N', () => {
    const xml = buildAuthToken(SAMPLE_PARAMS);
    expect(xml).toContain(
      'Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"'
    );
  });

  it('incluye el algoritmo de firma RSA-SHA256', () => {
    const xml = buildAuthToken(SAMPLE_PARAMS);
    expect(xml).toContain(
      'Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"'
    );
  });

  it('incluye el algoritmo de digest SHA-256', () => {
    const xml = buildAuthToken(SAMPLE_PARAMS);
    expect(xml).toContain(
      'Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"'
    );
  });

  it('incluye la referencia al Timestamp con URI #_0', () => {
    const xml = buildAuthToken(SAMPLE_PARAMS);
    expect(xml).toContain('URI="#_0"');
  });

  it('incluye el elemento Autentica en el Body', () => {
    const xml = buildAuthToken(SAMPLE_PARAMS);
    expect(xml).toContain(
      '<Autentica xmlns="http://DescargaMasivaTerceros.gob.mx"/>'
    );
  });

  it('incluye SecurityTokenReference apuntando al tokenId', () => {
    const xml = buildAuthToken(SAMPLE_PARAMS);
    expect(xml).toContain('URI="#uuid-1234-5678"');
  });

  it('produce XML bien formado (apertura y cierre de Envelope)', () => {
    const xml = buildAuthToken(SAMPLE_PARAMS);
    expect(xml).toMatch(/^<s:Envelope/);
    expect(xml).toMatch(/<\/s:Envelope>$/);
  });
});

describe('buildTimestampFragment', () => {
  it('incluye el elemento Timestamp con Id _0', () => {
    const result = buildTimestampFragment(
      '2024-01-01T00:00:00.000Z',
      '2024-01-01T00:05:00.000Z'
    );
    expect(result).toContain('u:Id="_0"');
  });

  it('incluye el namespace WSS utility en el Timestamp', () => {
    const result = buildTimestampFragment(
      '2024-01-01T00:00:00.000Z',
      '2024-01-01T00:05:00.000Z'
    );
    expect(result).toContain('xmlns:u=');
  });

  it('incluye Created y Expires con los valores correctos', () => {
    const result = buildTimestampFragment(
      '2024-06-15T12:00:00.000Z',
      '2024-06-15T12:05:00.000Z'
    );
    expect(result).toContain('2024-06-15T12:00:00.000Z');
    expect(result).toContain('2024-06-15T12:05:00.000Z');
  });
});

describe('buildSignedInfoFragment', () => {
  it('incluye el DigestValue proporcionado', () => {
    const result = buildSignedInfoFragment('miDigest==');
    expect(result).toContain('<DigestValue>miDigest==</DigestValue>');
  });

  it('incluye el namespace xmldsig', () => {
    const result = buildSignedInfoFragment('digest');
    expect(result).toContain('xmlns="http://www.w3.org/2000/09/xmldsig#"');
  });

  it('incluye la referencia a _0', () => {
    const result = buildSignedInfoFragment('digest');
    expect(result).toContain('URI="#_0"');
  });
});
