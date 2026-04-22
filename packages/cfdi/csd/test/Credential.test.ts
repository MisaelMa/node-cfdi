import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Credential } from '../src/Credential';

const CERTS_DIR = resolve(
  __dirname,
  '../../../files/certificados'
);
const CSD_CER = resolve(CERTS_DIR, 'LAN7008173R5.cer');
const CSD_KEY = resolve(CERTS_DIR, 'LAN7008173R5.key');
const CSD_CER_PEM = resolve(CERTS_DIR, 'LAN7008173R5.cer.pem');
const CSD_KEY_PEM = resolve(CERTS_DIR, 'LAN7008173R5.key.pem');
const KEY_PASSWORD = '12345678a';
const RFC_ESPERADO = 'LAN7008173R5';

describe('Credential', () => {
  describe('create', () => {
    it('crea un Credential desde archivos .cer y .key', async () => {
      const cred = await Credential.create(CSD_CER, CSD_KEY, KEY_PASSWORD);
      expect(cred).toBeInstanceOf(Credential);
    });

    it('crea un Credential desde archivos PEM', async () => {
      const cred = await Credential.create(CSD_CER_PEM, CSD_KEY_PEM, KEY_PASSWORD);
      expect(cred).toBeInstanceOf(Credential);
    });

    it('lanza error con contrasena incorrecta', async () => {
      await expect(
        Credential.create(CSD_CER, CSD_KEY, 'mal_password')
      ).rejects.toThrow();
    });
  });

  describe('fromPem', () => {
    it('crea un Credential desde strings PEM', () => {
      const cerPem = readFileSync(CSD_CER_PEM, 'ascii');
      const keyPem = readFileSync(CSD_KEY_PEM, 'ascii');
      const cred = Credential.fromPem(cerPem, keyPem);
      expect(cred).toBeInstanceOf(Credential);
    });
  });

  describe('isCsd / isFiel', () => {
    it('el Credential con CSD de prueba es CSD', async () => {
      const cred = await Credential.create(CSD_CER, CSD_KEY, KEY_PASSWORD);
      expect(cred.isCsd()).toBe(true);
    });

    it('isFiel es false para un CSD', async () => {
      const cred = await Credential.create(CSD_CER, CSD_KEY, KEY_PASSWORD);
      expect(cred.isFiel()).toBe(false);
    });
  });

  describe('rfc', () => {
    it('retorna el RFC del titular', async () => {
      const cred = await Credential.create(CSD_CER, CSD_KEY, KEY_PASSWORD);
      expect(cred.rfc()).toBe(RFC_ESPERADO);
    });
  });

  describe('legalName', () => {
    it('retorna el nombre legal del titular', async () => {
      const cred = await Credential.create(CSD_CER, CSD_KEY, KEY_PASSWORD);
      const name = cred.legalName();
      expect(name).toBeTruthy();
      expect(name.toUpperCase()).toContain('CINDEMEX');
    });
  });

  describe('serialNumber / noCertificado', () => {
    it('serialNumber retorna el numero de serie hex', async () => {
      const cred = await Credential.create(CSD_CER, CSD_KEY, KEY_PASSWORD);
      expect(cred.serialNumber()).toBeTruthy();
    });

    it('noCertificado retorna 20 digitos', async () => {
      const cred = await Credential.create(CSD_CER, CSD_KEY, KEY_PASSWORD);
      expect(cred.noCertificado()).toMatch(/^\d{20}$/);
    });
  });

  describe('sign / verify', () => {
    it('firma datos y verifica la firma', async () => {
      const cred = await Credential.create(CSD_CER, CSD_KEY, KEY_PASSWORD);
      const data = '||cadena|original|de|prueba||';
      const signature = cred.sign(data);

      expect(typeof signature).toBe('string');
      expect(signature.length).toBeGreaterThan(0);
      expect(cred.verify(data, signature)).toBe(true);
    });

    it('verifica firma incorrecta retorna false', async () => {
      const cred = await Credential.create(CSD_CER, CSD_KEY, KEY_PASSWORD);
      const data = 'datos originales';
      cred.sign(data);
      const firmaFalsa = Buffer.from('firma_falsa').toString('base64');
      expect(cred.verify(data, firmaFalsa)).toBe(false);
    });

    it('firma con datos diferentes no verifica como firma de datos originales', async () => {
      const cred = await Credential.create(CSD_CER, CSD_KEY, KEY_PASSWORD);
      const firmaOtrosDatos = cred.sign('datos diferentes');
      expect(cred.verify('datos originales', firmaOtrosDatos)).toBe(false);
    });

    it('firma desde PEM equivale a firma desde DER', async () => {
      const credDer = await Credential.create(CSD_CER, CSD_KEY, KEY_PASSWORD);
      const cerPem = readFileSync(CSD_CER_PEM, 'ascii');
      const keyPem = readFileSync(CSD_KEY_PEM, 'ascii');
      const credPem = Credential.fromPem(cerPem, keyPem);

      const data = 'cadena de prueba';
      const sigPem = credPem.sign(data);

      // La firma del PEM debe verificar usando el Credential del DER
      expect(credDer.verify(data, sigPem)).toBe(true);
    });
  });

  describe('isValid', () => {
    it('el certificado de prueba del SAT esta vencido', async () => {
      // El certificado de prueba vence en 2020
      const cred = await Credential.create(CSD_CER, CSD_KEY, KEY_PASSWORD);
      expect(cred.isValid()).toBe(false);
    });
  });

  describe('belongsTo', () => {
    it('pertenece al RFC correcto', async () => {
      const cred = await Credential.create(CSD_CER, CSD_KEY, KEY_PASSWORD);
      expect(cred.belongsTo(RFC_ESPERADO)).toBe(true);
    });

    it('pertenece al RFC en minusculas (case insensitive)', async () => {
      const cred = await Credential.create(CSD_CER, CSD_KEY, KEY_PASSWORD);
      expect(cred.belongsTo(RFC_ESPERADO.toLowerCase())).toBe(true);
    });

    it('no pertenece a un RFC diferente', async () => {
      const cred = await Credential.create(CSD_CER, CSD_KEY, KEY_PASSWORD);
      expect(cred.belongsTo('XAXX010101000')).toBe(false);
    });
  });

  describe('keyMatchesCertificate', () => {
    it('la llave coincide con el certificado', async () => {
      const cred = await Credential.create(CSD_CER, CSD_KEY, KEY_PASSWORD);
      expect(cred.keyMatchesCertificate()).toBe(true);
    });
  });

  describe('acceso a certificate y privateKey', () => {
    it('expone el certificado', async () => {
      const cred = await Credential.create(CSD_CER, CSD_KEY, KEY_PASSWORD);
      expect(cred.certificate).toBeDefined();
      expect(cred.certificate.rfc()).toBe(RFC_ESPERADO);
    });

    it('expone la llave privada', async () => {
      const cred = await Credential.create(CSD_CER, CSD_KEY, KEY_PASSWORD);
      expect(cred.privateKey).toBeDefined();
      expect(cred.privateKey.toPem()).toContain('-----BEGIN PRIVATE KEY-----');
    });
  });
});
