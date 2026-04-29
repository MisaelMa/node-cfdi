import { describe, expect, it } from 'vitest';
import crypto from 'crypto';
import { resolve } from 'path';
import { Certificate } from '../src/Certificate';
import { PrivateKey } from '../src/PrivateKey';
import { Credential } from '../src/Credential';

/**
 * Test "informativo": carga un CSD y un FIEL, imprime toda la informacion
 * extraible y aserta los valores conocidos. Util para ver de un vistazo
 * que datos expone cada tipo de certificado.
 *
 * Ejecutar:
 *   pnpm vitest run test/InfoCertificados.test.ts --reporter=verbose
 */

const FILES_DIR = resolve(__dirname, '../../../files/certificados');

const CSD = {
  label: 'CSD (Certificado de Sello Digital)',
  cer: resolve(FILES_DIR, 'LAN7008173R5.cer'),
  key: resolve(FILES_DIR, 'LAN7008173R5.key'),
  password: '12345678a',
};

const FIEL = {
  label: 'FIEL / e.firma',
  cer: resolve(FILES_DIR, 'efirma/goodCertificate.cer'),
  key: resolve(FILES_DIR, 'efirma/goodPrivateKeyEncrypt.key'),
  password: '12345678a',
};

interface CertFixture {
  label: string;
  cer: string;
  key: string;
  password: string;
}

async function printCertificado(fx: CertFixture): Promise<void> {
  const cert = await Certificate.fromFile(fx.cer);

  let key: PrivateKey | null = null;
  let keyError: string | null = null;
  try {
    key = await PrivateKey.fromFile(fx.key, fx.password);
  } catch (e) {
    keyError = (e as Error).message;
  }

  seccion(`=== ${fx.label} ===`);
  linea('Archivo .cer', fx.cer);
  linea('Archivo .key', fx.key);
  linea('Tamano DER (bytes)', cert.toDer().length);

  seccion('--- Identidad del titular ---');
  linea('RFC', cert.rfc());
  linea('Nombre legal', cert.legalName());
  linea('Tipo de sujeto', cert.subjectType());
  linea('Tipo de certificado', cert.certificateType());
  linea('isCsd?', cert.isCsd());
  linea('isFiel?', cert.isFiel());

  seccion('--- Identificadores SAT ---');
  linea('No. certificado SAT (20 dig.)', cert.noCertificado());
  linea('Version AC del SAT', cert.acVersion());
  linea('Numero de serie (hex)', cert.serialNumber());

  seccion('--- Vigencia ---');
  linea('Inicio de vigencia (UTC)', cert.validFrom().toISOString());
  linea('Fin de vigencia (UTC)', cert.validTo().toISOString());
  linea('isValid (vigente ahora)?', cert.isValid());
  linea('isExpired?', cert.isExpired());

  seccion('--- Huellas digitales ---');
  linea('SHA-1', cert.fingerprint());
  linea('SHA-256', cert.fingerprintSha256());

  seccion('--- Subject (titular) ---');
  printMapa(cert.subject());

  seccion('--- Issuer (emisor) ---');
  printMapa(cert.issuer());

  seccion('--- Llave publica ---');
  const pubKey = crypto.createPublicKey({ key: cert.publicKey(), format: 'pem' });
  const details = pubKey.asymmetricKeyDetails;
  linea('Tamano modulo RSA (bits)', details?.modulusLength ?? 'desconocido');
  linea('Exponente publico', details?.publicExponent?.toString() ?? 'desconocido');
  linea('PEM (primeros 80 chars)', cert.publicKey().slice(0, 80) + '...');

  seccion('--- Llave privada ---');
  if (key) {
    linea('Carga', `OK (con contrasena "${fx.password}")`);
    linea('belongsToCertificate?', key.belongsToCertificate(cert));

    const cred = await Credential.create(fx.cer, fx.key, fx.password);
    seccion('--- Credential (cer + key) ---');
    linea('RFC (via credential)', cred.rfc());
    linea('Nombre legal (via credential)', cred.legalName());
    linea('keyMatchesCertificate?', cred.keyMatchesCertificate());
    const sello = cred.sign('||cadena|original|de|prueba||');
    linea('Sello SHA-256 base64 (60 chars)', sello.slice(0, 60) + '...');
    linea('Verificacion de sello', cred.verify('||cadena|original|de|prueba||', sello));
  } else {
    linea('Carga', `ERROR: ${keyError}`);
  }

  console.log('');
}

function seccion(titulo: string): void {
  console.log('\n' + titulo);
}

function linea(etiqueta: string, valor: unknown): void {
  const label = (etiqueta + ':').padEnd(36, ' ');
  console.log(`  ${label} ${JSON.stringify(valor)}`);
}

function printMapa(mapa: Record<string, string>): void {
  for (const k of Object.keys(mapa).sort()) {
    linea('  ' + k, mapa[k]);
  }
}

describe('Informacion de un CSD', () => {
  it('imprime y valida los datos del CSD LAN7008173R5.cer', async () => {
    await printCertificado(CSD);

    const cert = await Certificate.fromFile(CSD.cer);
    const key = await PrivateKey.fromFile(CSD.key, CSD.password);
    const cred = await Credential.create(CSD.cer, CSD.key, CSD.password);

    expect(cert.rfc()).toBe('LAN7008173R5');
    expect(cert.legalName()).toBe('CINDEMEX SA DE CV');
    expect(cert.subjectType()).toBe('MORAL');
    expect(cert.certificateType()).toBe('CSD');
    expect(cert.isCsd()).toBe(true);
    expect(cert.isFiel()).toBe(false);

    expect(cert.noCertificado()).toBe('20001000000300022815');
    expect(cert.acVersion()).toBe(3);

    expect(cert.validFrom().toISOString()).toBe('2016-10-25T21:52:11.000Z');
    expect(cert.validTo().toISOString()).toBe('2020-10-25T21:52:11.000Z');
    expect(cert.isExpired()).toBe(true);
    expect(cert.isValid()).toBe(false);

    expect(cert.fingerprint()).toBe(
      'D5:D8:CA:9E:E7:29:71:0F:0C:BC:4A:F2:80:8B:F0:CF:3E:8F:35:43'
    );
    expect(cert.fingerprintSha256()).toBe(
      '83BDC4B0E315A70EFBB99E6E3B194F2F8AAAB74647BD162B463CCB387839AD08'
    );

    const sub = cert.subject();
    expect(sub['CN']).toBe('CINDEMEX SA DE CV');
    expect(sub['O']).toBe('CINDEMEX SA DE CV');
    expect(sub['OU']).toBe('Prueba_CFDI');

    const iss = cert.issuer();
    expect(iss['C']).toBe('MX');
    expect(iss['O']).toBe('Servicio de Administración Tributaria');

    const pubKey = crypto.createPublicKey({ key: cert.publicKey(), format: 'pem' });
    expect(pubKey.asymmetricKeyDetails?.modulusLength).toBe(2048);
    expect(pubKey.asymmetricKeyDetails?.publicExponent?.toString()).toBe('65537');

    expect(key.belongsToCertificate(cert)).toBe(true);
    expect(cred.keyMatchesCertificate()).toBe(true);

    const sello = cred.sign('||cadena|original||');
    expect(cred.verify('||cadena|original||', sello)).toBe(true);
  });
});

describe('Informacion de una FIEL', () => {
  it('imprime y valida los datos del FIEL goodCertificate.cer', async () => {
    await printCertificado(FIEL);

    const cert = await Certificate.fromFile(FIEL.cer);
    const key = await PrivateKey.fromFile(FIEL.key, FIEL.password);
    const cred = await Credential.create(FIEL.cer, FIEL.key, FIEL.password);

    expect(cert.rfc()).toBe('CACX7605101P8');
    expect(cert.legalName()).toBe('XOCHILT CASAS CHAVEZ');
    expect(cert.subjectType()).toBe('FISICA');
    expect(cert.certificateType()).toBe('FIEL');
    expect(cert.isFiel()).toBe(true);
    expect(cert.isCsd()).toBe(false);

    expect(cert.noCertificado()).toBe('30001000000500003282');
    expect(cert.acVersion()).toBe(5);

    expect(cert.validFrom().toISOString()).toBe('2023-05-09T18:05:49.000Z');
    expect(cert.validTo().toISOString()).toBe('2027-05-08T18:05:49.000Z');

    expect(cert.fingerprint()).toBe(
      '9C:E9:14:C2:C9:BB:47:A2:A1:6B:2D:3E:50:43:40:D0:CF:F3:C2:40'
    );
    expect(cert.fingerprintSha256()).toBe(
      'EF9BB92EDDFBC2F675B6A6B91751A8EF9A02CEB4C9133AB9D4F675DA90B76465'
    );

    const sub = cert.subject();
    expect(sub['CN']).toBe('XOCHILT CASAS CHAVEZ');
    expect(sub['serialNumber']).toBe('CACX760510MGTSHC04');

    const iss = cert.issuer();
    expect(iss['C']).toBe('MX');
    expect(iss['CN']).toBe('AC UAT');
    expect(iss['O']).toBe('SERVICIO DE ADMINISTRACION TRIBUTARIA');
    expect(iss['OU']).toBe('SAT-IES Authority');

    const pubKey = crypto.createPublicKey({ key: cert.publicKey(), format: 'pem' });
    expect(pubKey.asymmetricKeyDetails?.modulusLength).toBe(2048);
    expect(pubKey.asymmetricKeyDetails?.publicExponent?.toString()).toBe('65537');

    expect(key.belongsToCertificate(cert)).toBe(true);
    expect(cred.keyMatchesCertificate()).toBe(true);

    const sello = cred.sign('||cadena|original||');
    expect(cred.verify('||cadena|original||', sello)).toBe(true);
  });
});
