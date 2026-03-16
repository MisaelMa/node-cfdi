import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Certificate } from '../src/Certificate';

const CERTS_DIR = resolve(
  __dirname,
  '../../../files/certificados'
);
const CSD_CER = resolve(CERTS_DIR, 'LAN7008173R5.cer');
const CSD_CER_PEM = resolve(CERTS_DIR, 'LAN7008173R5.cer.pem');

describe('Certificate', () => {
  describe('fromFile (DER)', () => {
    it('carga el certificado desde archivo .cer (DER)', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      expect(cert).toBeInstanceOf(Certificate);
    });

    it('carga el certificado desde archivo .pem', async () => {
      const cert = await Certificate.fromFile(CSD_CER_PEM);
      expect(cert).toBeInstanceOf(Certificate);
    });
  });

  describe('fromPem', () => {
    it('carga el certificado desde PEM string', () => {
      const pem = readFileSync(CSD_CER_PEM, 'ascii');
      const cert = Certificate.fromPem(pem);
      expect(cert).toBeInstanceOf(Certificate);
    });
  });

  describe('fromDer', () => {
    it('carga el certificado desde buffer DER', () => {
      const der = readFileSync(CSD_CER);
      const cert = Certificate.fromDer(der);
      expect(cert).toBeInstanceOf(Certificate);
    });
  });

  describe('serialNumber', () => {
    it('retorna el numero de serie en hex', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      const serial = cert.serialNumber();
      expect(serial).toBeTruthy();
      expect(typeof serial).toBe('string');
    });
  });

  describe('noCertificado', () => {
    it('retorna el numero de certificado SAT legible (20 digitos)', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      const noCer = cert.noCertificado();
      // El numero de certificado SAT tiene 20 caracteres numericos
      expect(noCer).toMatch(/^\d{20}$/);
    });

    it('el numero de certificado coincide en DER y PEM', async () => {
      const certDer = await Certificate.fromFile(CSD_CER);
      const certPem = await Certificate.fromFile(CSD_CER_PEM);
      expect(certDer.noCertificado()).toBe(certPem.noCertificado());
    });
  });

  describe('rfc', () => {
    it('extrae el RFC del subject', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      const rfc = cert.rfc();
      expect(rfc).toBeTruthy();
      // RFC persona moral: 12 chars, persona fisica: 13 chars
      expect(rfc.length).toBeGreaterThanOrEqual(12);
      expect(rfc.length).toBeLessThanOrEqual(13);
    });

    it('el RFC del CSD es LAN7008173R5', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      expect(cert.rfc()).toBe('LAN7008173R5');
    });
  });

  describe('legalName', () => {
    it('extrae el nombre legal del subject', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      const name = cert.legalName();
      expect(name).toBeTruthy();
      expect(typeof name).toBe('string');
    });

    it('el nombre legal contiene CINDEMEX', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      expect(cert.legalName().toUpperCase()).toContain('CINDEMEX');
    });
  });

  describe('subject e issuer', () => {
    it('retorna subject como objeto', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      const sub = cert.subject();
      expect(typeof sub).toBe('object');
      expect(Object.keys(sub).length).toBeGreaterThan(0);
    });

    it('retorna issuer como objeto', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      const iss = cert.issuer();
      expect(typeof iss).toBe('object');
      expect(Object.keys(iss).length).toBeGreaterThan(0);
    });
  });

  describe('validFrom / validTo', () => {
    it('retorna fecha de inicio de vigencia como Date', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      expect(cert.validFrom()).toBeInstanceOf(Date);
    });

    it('retorna fecha de fin de vigencia como Date', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      expect(cert.validTo()).toBeInstanceOf(Date);
    });

    it('la fecha de fin es posterior a la de inicio', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      expect(cert.validTo().getTime()).toBeGreaterThan(cert.validFrom().getTime());
    });
  });

  describe('isExpired', () => {
    it('el certificado de prueba del SAT esta vencido', async () => {
      // El CSD de prueba vence en 2020, por lo que debe estar vencido
      const cert = await Certificate.fromFile(CSD_CER);
      expect(cert.isExpired()).toBe(true);
    });
  });

  describe('fingerprint', () => {
    it('retorna fingerprint SHA-1 en formato XX:XX:XX', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      const fp = cert.fingerprint();
      expect(fp).toMatch(/^[0-9A-F]{2}(:[0-9A-F]{2})+$/);
      // SHA-1 produce 20 bytes = 40 hex chars = 59 con separadores
      expect(fp.length).toBe(59);
    });

    it('fingerprint es consistente entre llamadas', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      expect(cert.fingerprint()).toBe(cert.fingerprint());
    });
  });

  describe('publicKey', () => {
    it('retorna la llave publica en PEM', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      const pk = cert.publicKey();
      expect(pk).toContain('-----BEGIN PUBLIC KEY-----');
    });
  });

  describe('isCsd / isFiel', () => {
    it('el certificado LAN7008173R5 es CSD', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      expect(cert.isCsd()).toBe(true);
    });

    it('isFiel retorna false para un CSD', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      expect(cert.isFiel()).toBe(false);
    });
  });

  describe('toPem / toDer', () => {
    it('toPem retorna string PEM valido', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      const pem = cert.toPem();
      expect(pem).toContain('-----BEGIN CERTIFICATE-----');
      expect(pem).toContain('-----END CERTIFICATE-----');
    });

    it('toDer retorna Buffer', async () => {
      const cert = await Certificate.fromFile(CSD_CER);
      const der = cert.toDer();
      expect(der).toBeInstanceOf(Buffer);
      expect(der.length).toBeGreaterThan(0);
    });

    it('round-trip DER -> Certificate -> DER produce el mismo contenido', async () => {
      const cert1 = await Certificate.fromFile(CSD_CER);
      const der1 = cert1.toDer();
      const cert2 = Certificate.fromDer(der1);
      expect(cert2.noCertificado()).toBe(cert1.noCertificado());
    });
  });
});
