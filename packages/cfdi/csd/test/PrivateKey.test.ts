import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { PrivateKey } from '../src/PrivateKey';
import { Certificate } from '../src/Certificate';

const CERTS_DIR = resolve(
  __dirname,
  '../../../files/certificados'
);
const CSD_CER = resolve(CERTS_DIR, 'LAN7008173R5.cer');
const CSD_KEY = resolve(CERTS_DIR, 'LAN7008173R5.key');
const CSD_KEY_PEM = resolve(CERTS_DIR, 'LAN7008173R5.key.pem');
const KEY_PASSWORD = '12345678a';

describe('PrivateKey', () => {
  describe('fromFile (DER cifrado)', () => {
    it('carga la llave privada desde archivo .key con contrasena', async () => {
      const key = await PrivateKey.fromFile(CSD_KEY, KEY_PASSWORD);
      expect(key).toBeInstanceOf(PrivateKey);
    });

    it('lanza error con contrasena incorrecta', async () => {
      await expect(
        PrivateKey.fromFile(CSD_KEY, 'contrasena_incorrecta')
      ).rejects.toThrow();
    });
  });

  describe('fromPem', () => {
    it('carga la llave privada desde PEM sin cifrado', () => {
      const pem = readFileSync(CSD_KEY_PEM, 'ascii');
      const key = PrivateKey.fromPem(pem);
      expect(key).toBeInstanceOf(PrivateKey);
    });
  });

  describe('fromDer', () => {
    it('carga la llave privada desde buffer DER cifrado', () => {
      const der = readFileSync(CSD_KEY);
      const key = PrivateKey.fromDer(der, KEY_PASSWORD);
      expect(key).toBeInstanceOf(PrivateKey);
    });
  });

  describe('toPem', () => {
    it('retorna la llave privada en formato PEM', async () => {
      const key = await PrivateKey.fromFile(CSD_KEY, KEY_PASSWORD);
      const pem = key.toPem();
      expect(pem).toContain('-----BEGIN PRIVATE KEY-----');
      expect(pem).toContain('-----END PRIVATE KEY-----');
    });
  });

  describe('sign', () => {
    it('firma datos y retorna base64', async () => {
      const key = await PrivateKey.fromFile(CSD_KEY, KEY_PASSWORD);
      const data = 'cadena original de prueba';
      const signature = key.sign(data);
      expect(typeof signature).toBe('string');
      expect(signature.length).toBeGreaterThan(0);
      // Base64 valido
      expect(() => Buffer.from(signature, 'base64')).not.toThrow();
    });

    it('firmas de la misma cadena son verificables', async () => {
      const keyFile = await PrivateKey.fromFile(CSD_KEY, KEY_PASSWORD);
      const cert = await Certificate.fromFile(CSD_CER);
      const data = 'datos a firmar';
      const signature = keyFile.sign(data);

      // Verificar con crypto nativo
      const crypto = await import('crypto');
      const pubKey = crypto.createPublicKey({ key: cert.publicKey(), format: 'pem' });
      const verifier = crypto.createVerify('RSA-SHA256');
      verifier.update(data, 'utf8');
      expect(verifier.verify(pubKey, signature, 'base64')).toBe(true);
    });

    it('la firma cambia con datos diferentes', async () => {
      const key = await PrivateKey.fromFile(CSD_KEY, KEY_PASSWORD);
      const sig1 = key.sign('datos 1');
      const sig2 = key.sign('datos 2');
      expect(sig1).not.toBe(sig2);
    });

    it('firma con algoritmo alternativo SHA512', async () => {
      const key = await PrivateKey.fromFile(CSD_KEY, KEY_PASSWORD);
      const sig = key.sign('datos', 'SHA512');
      expect(typeof sig).toBe('string');
      expect(sig.length).toBeGreaterThan(0);
    });
  });

  describe('belongsToCertificate', () => {
    it('la llave pertenece al certificado correspondiente', async () => {
      const key = await PrivateKey.fromFile(CSD_KEY, KEY_PASSWORD);
      const cert = await Certificate.fromFile(CSD_CER);
      expect(key.belongsToCertificate(cert)).toBe(true);
    });

    it('la llave PEM pertenece al certificado correspondiente', () => {
      const keyPem = readFileSync(CSD_KEY_PEM, 'ascii');
      const key = PrivateKey.fromPem(keyPem);
      const certPem = readFileSync(`${CSD_CER}.pem`, 'ascii');
      const cert = Certificate.fromPem(certPem);
      expect(key.belongsToCertificate(cert)).toBe(true);
    });

    it('llave y certificado son consistentes entre DER y PEM', async () => {
      const keyDer = await PrivateKey.fromFile(CSD_KEY, KEY_PASSWORD);
      const keyPem = PrivateKey.fromPem(readFileSync(CSD_KEY_PEM, 'ascii'));
      const cert = await Certificate.fromFile(CSD_CER);
      expect(keyDer.belongsToCertificate(cert)).toBe(true);
      expect(keyPem.belongsToCertificate(cert)).toBe(true);
    });
  });
});
