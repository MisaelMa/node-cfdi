import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { canonicalize, sha256Digest, signRsaSha256 } from '../src/xml-signer';

describe('canonicalize', () => {
  it('elimina la declaracion XML', () => {
    const input = '<?xml version="1.0" encoding="UTF-8"?><root/>';
    const result = canonicalize(input);
    expect(result).not.toContain('<?xml');
    expect(result).toContain('<root');
  });

  it('ordena atributos alfabeticamente', () => {
    const input = '<elem z="3" a="1" m="2"/>';
    const result = canonicalize(input);
    const aIdx = result.indexOf('a=');
    const mIdx = result.indexOf('m=');
    const zIdx = result.indexOf('z=');
    expect(aIdx).toBeLessThan(mIdx);
    expect(mIdx).toBeLessThan(zIdx);
  });

  it('conserva el contenido de texto', () => {
    const input =
      '<u:Timestamp xmlns:u="http://example.com" u:Id="_0">' +
      '<u:Created>2024-01-01T00:00:00.000Z</u:Created>' +
      '<u:Expires>2024-01-01T00:05:00.000Z</u:Expires>' +
      '</u:Timestamp>';
    const result = canonicalize(input);
    expect(result).toContain('2024-01-01T00:00:00.000Z');
    expect(result).toContain('2024-01-01T00:05:00.000Z');
  });

  it('normaliza saltos de linea CRLF a LF', () => {
    const input = '<root>\r\n<child/>\r\n</root>';
    const result = canonicalize(input);
    expect(result).not.toContain('\r\n');
    expect(result).toContain('\n');
  });

  it('maneja XML sin atributos', () => {
    const input = '<root><child>texto</child></root>';
    const result = canonicalize(input);
    expect(result).toBe('<root><child>texto</child></root>');
  });

  it('ordena atributos del Timestamp alfabeticamente (u:Id antes que xmlns:u)', () => {
    const input =
      '<u:Timestamp xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" u:Id="_0">' +
      '<u:Created>2024-01-01T00:00:00.000Z</u:Created>' +
      '</u:Timestamp>';
    const result = canonicalize(input);
    // Orden alfabetico: 'u' < 'x', por lo que u:Id aparece antes que xmlns:u
    const idIdx = result.indexOf('u:Id=');
    const xmlnsIdx = result.indexOf('xmlns:u=');
    expect(idIdx).toBeLessThan(xmlnsIdx);
  });
});

describe('sha256Digest', () => {
  it('retorna base64 valido', () => {
    const result = sha256Digest('hello world');
    // Base64 valido: solo caracteres base64
    expect(result).toMatch(/^[A-Za-z0-9+/]+=*$/);
  });

  it('retorna el hash correcto para string conocido', () => {
    // SHA-256 de "hello world" en base64
    const expected = 'uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek=';
    const result = sha256Digest('hello world');
    expect(result).toBe(expected);
  });

  it('retorna resultados distintos para strings distintos', () => {
    const a = sha256Digest('abc');
    const b = sha256Digest('xyz');
    expect(a).not.toBe(b);
  });

  it('es determinista', () => {
    const a = sha256Digest('test-data');
    const b = sha256Digest('test-data');
    expect(a).toBe(b);
  });
});

describe('signRsaSha256', () => {
  it('produce una firma verificable con la llave publica correspondiente', () => {
    // Generar un par de llaves RSA para la prueba
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });

    const data = 'datos de prueba para firma';
    const signature = signRsaSha256(data, privateKey);

    // Verificar que la firma sea base64 valido
    expect(signature).toMatch(/^[A-Za-z0-9+/]+=*$/);

    // Verificar la firma con la llave publica
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(data, 'utf8');
    const isValid = verifier.verify(publicKey, signature, 'base64');
    expect(isValid).toBe(true);
  });

  it('retorna base64 no vacio', () => {
    const { privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });
    const result = signRsaSha256('test', privateKey);
    expect(result.length).toBeGreaterThan(0);
  });

  it('firmas distintas para datos distintos', () => {
    const { privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });
    const a = signRsaSha256('datos A', privateKey);
    const b = signRsaSha256('datos B', privateKey);
    expect(a).not.toBe(b);
  });
});
