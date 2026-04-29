import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Certificate } from '../src/Certificate';
import { PrivateKey } from '../src/PrivateKey';

/**
 * Tests portados de `e.firma` (https://www.npmjs.com/package/e.firma) para
 * validar paridad: detección CSD/FIEL por extensiones, AC version, subjectType,
 * verifyIssuedBy, rsaEncrypt + rsaDecrypt, strict mode.
 */

const FIXTURES = resolve(__dirname, '../../../files/certificados/efirma');
const f = (name: string) => resolve(FIXTURES, name);

const KEY_PASSWORD = '12345678a';

describe('Compatibilidad e.firma', () => {
  describe('Certificate.certificateType (por extensiones)', () => {
    it('detecta FIEL en goodCertificate.cer', async () => {
      const cert = await Certificate.fromFile(f('goodCertificate.cer'));
      expect(cert.certificateType()).toBe('FIEL');
      expect(cert.isFiel()).toBe(true);
      expect(cert.isCsd()).toBe(false);
    });

    it('detecta CSD en CSD_Certificate.cer', async () => {
      const cert = await Certificate.fromFile(f('CSD_Certificate.cer'));
      expect(cert.certificateType()).toBe('CSD');
      expect(cert.isCsd()).toBe(true);
      expect(cert.isFiel()).toBe(false);
    });

    it('detecta FIEL en ipnCertificate.cer (persona moral)', async () => {
      const cert = await Certificate.fromFile(f('ipnCertificate.cer'));
      expect(cert.certificateType()).toBe('FIEL');
    });
  });

  describe('Certificate.isValid / isExpired (vigencia)', () => {
    it('expiredCertificate.cer no está vigente', async () => {
      const cert = await Certificate.fromFile(f('expiredCertificate.cer'));
      expect(cert.isValid()).toBe(false);
      expect(cert.isExpired()).toBe(true);
    });
  });

  describe('Certificate.acVersion', () => {
    it('goodCertificate.cer fue emitido por AC5', async () => {
      const cert = await Certificate.fromFile(f('goodCertificate.cer'));
      expect(cert.acVersion()).toBe(5);
    });

    it('ipnCertificate.cer fue emitido por AC5', async () => {
      const cert = await Certificate.fromFile(f('ipnCertificate.cer'));
      expect(cert.acVersion()).toBe(5);
    });
  });

  describe('Certificate.subjectType', () => {
    it('ipnCertificate.cer es persona MORAL', async () => {
      const cert = await Certificate.fromFile(f('ipnCertificate.cer'));
      expect(cert.subjectType()).toBe('MORAL');
    });

    it('goodCertificate.cer es persona FISICA', async () => {
      const cert = await Certificate.fromFile(f('goodCertificate.cer'));
      expect(cert.subjectType()).toBe('FISICA');
    });
  });

  describe('Certificate serialNumber', () => {
    it('goodCertificate.cer tiene el serial esperado', async () => {
      const cert = await Certificate.fromFile(f('goodCertificate.cer'));
      expect(cert.serialNumber()).toBe(
        '3330303031303030303030353030303033323832'
      );
    });
  });

  describe('Certificate.verifyIssuedBy / verifyIntegrity', () => {
    it('ipnCertificate.cer fue emitido por AC5_SAT.cer', async () => {
      const subject = await Certificate.fromFile(f('ipnCertificate.cer'));
      const ac5 = await Certificate.fromFile(f('AC5_SAT.cer'));
      expect(subject.verifyIssuedBy(ac5)).toBe(true);
      expect(subject.verifyIntegrity(ac5)).toBe(true);
    });

    it('ipnCertificate.cer NO fue emitido por AC4_SAT.cer', async () => {
      const subject = await Certificate.fromFile(f('ipnCertificate.cer'));
      const ac4 = await Certificate.fromFile(f('AC4_SAT.cer'));
      expect(subject.verifyIssuedBy(ac4)).toBe(false);
    });

    it('un cert ajeno (00001000000506724016.cer) no es emitido por AC5', async () => {
      const stranger = await Certificate.fromFile(f('00001000000506724016.cer'));
      const ac5 = await Certificate.fromFile(f('AC5_SAT.cer'));
      expect(stranger.verifyIssuedBy(ac5)).toBe(false);
    });
  });

  describe('Certificate.rsaEncrypt + PrivateKey.rsaDecrypt', () => {
    it('round-trip de mensaje', async () => {
      const cert = await Certificate.fromFile(f('goodCertificate.cer'));
      const key = await PrivateKey.fromFile(
        f('goodPrivateKeyEncrypt.key'),
        KEY_PASSWORD
      );
      const message = 'Hola Mundo!';
      const enc = cert.rsaEncrypt(message);
      const dec = key.rsaDecrypt(enc);
      expect(dec).toBe(message);
    });
  });

  describe('Certificate.verify (firma directa)', () => {
    it('firma con key + verify directo en cert', async () => {
      const cert = await Certificate.fromFile(f('goodCertificate.cer'));
      const key = await PrivateKey.fromFile(
        f('goodPrivateKeyEncrypt.key'),
        KEY_PASSWORD
      );
      const message = 'Hola Mundo!';
      const sig = key.sign(message);
      expect(cert.verify(message, sig)).toBe(true);
    });

    it('verify con datos diferentes retorna false', async () => {
      const cert = await Certificate.fromFile(f('goodCertificate.cer'));
      const key = await PrivateKey.fromFile(
        f('goodPrivateKeyEncrypt.key'),
        KEY_PASSWORD
      );
      const sig = key.sign('uno');
      expect(cert.verify('otro', sig)).toBe(false);
    });
  });

  describe('Certificate.fromFile con archivo inválido', () => {
    it('lanza al cargar invalid.der', async () => {
      await expect(Certificate.fromFile(f('invalid.der'))).rejects.toThrow();
    });
  });

  describe('PrivateKey strict mode', () => {
    it('acepta llave PKCS#8 cifrada del SAT', async () => {
      const key = await PrivateKey.fromFile(
        f('goodPrivateKeyEncrypt.key'),
        KEY_PASSWORD,
        { strict: true }
      );
      expect(key).toBeInstanceOf(PrivateKey);
    });

    it('rechaza llave desencriptada en modo strict', async () => {
      await expect(
        PrivateKey.fromFile(f('goodPrivateKeyDecrypt.key'), '', { strict: true })
      ).rejects.toThrow(/Llave privada no válida/);
    });

    it('en modo no-strict permite llave desencriptada', async () => {
      const key = await PrivateKey.fromFile(f('goodPrivateKeyDecrypt.key'), '');
      expect(key).toBeInstanceOf(PrivateKey);
    });
  });

  describe('Certificate.getPEM equivalencia con e.firma', () => {
    it('toPem() incluye los marcadores de cert', async () => {
      const cert = await Certificate.fromFile(f('ipnCertificate.cer'));
      const pem = cert.toPem();
      expect(pem).toContain('-----BEGIN CERTIFICATE-----');
      expect(pem).toContain('-----END CERTIFICATE-----');
    });
  });
});
