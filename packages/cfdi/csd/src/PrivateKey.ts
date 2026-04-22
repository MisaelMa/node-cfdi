import crypto from 'crypto';
import { readFileSync } from 'fs';
import { promises as fs } from 'fs';
import { Certificate } from './Certificate';

/**
 * Llave privada RSA para CSD o FIEL del SAT.
 * Usa crypto nativo de Node 22 para firma y verificacion.
 */
export class PrivateKey {
  private readonly _pem: string;
  private readonly _keyObject: crypto.KeyObject;

  private constructor(pem: string) {
    this._pem = pem;
    this._keyObject = crypto.createPrivateKey({ key: pem, format: 'pem' });
  }

  /**
   * Carga una llave privada desde un buffer DER cifrado (archivo .key del SAT)
   * usando OpenSSL para descifrar con la contrasena proporcionada.
   */
  static fromDer(derBuffer: Buffer, password: string): PrivateKey {
    // El .key del SAT es un PKCS#8 encriptado en DER
    // Usar crypto nativo de Node 22
    const keyObject = crypto.createPrivateKey({
      key: derBuffer,
      format: 'der',
      type: 'pkcs8',
      passphrase: password,
    });
    const pem = keyObject.export({ format: 'pem', type: 'pkcs8' }) as string;
    return new PrivateKey(pem);
  }

  /**
   * Carga una llave privada desde un PEM string (no encriptado)
   */
  static fromPem(pem: string): PrivateKey {
    return new PrivateKey(pem);
  }

  /**
   * Carga una llave privada desde un archivo .key (DER cifrado) o .pem
   */
  static async fromFile(filePath: string, password: string): Promise<PrivateKey> {
    const buf = await fs.readFile(filePath);
    const isPem =
      buf.toString('utf8', 0, 10).includes('-----') ||
      filePath.toLowerCase().endsWith('.pem');
    if (isPem) {
      return PrivateKey.fromPem(buf.toString('ascii'));
    }
    return PrivateKey.fromDer(buf, password);
  }

  /**
   * Carga una llave privada desde un archivo de forma sincrona
   */
  static fromFileSync(filePath: string, password: string): PrivateKey {
    const buf = readFileSync(filePath);
    const isPem =
      buf.toString('utf8', 0, 10).includes('-----') ||
      filePath.toLowerCase().endsWith('.pem');
    if (isPem) {
      return PrivateKey.fromPem(buf.toString('ascii'));
    }
    return PrivateKey.fromDer(buf, password);
  }

  /** Retorna la llave privada en formato PEM (PKCS#8, sin cifrado) */
  toPem(): string {
    return this._pem;
  }

  /**
   * Firma datos usando SHA-256 por defecto.
   * Retorna la firma en base64.
   */
  sign(data: string, algorithm = 'SHA256'): string {
    const signer = crypto.createSign(`RSA-${algorithm}`);
    signer.update(data, 'utf8');
    return signer.sign(this._keyObject, 'base64');
  }

  /**
   * Verifica si esta llave privada corresponde al certificado dado,
   * comparando la llave publica.
   */
  belongsToCertificate(cert: Certificate): boolean {
    try {
      const certPubKeyPem = cert.publicKey();
      const certPubKey = crypto.createPublicKey({ key: certPubKeyPem, format: 'pem' });
      const privPubKey = crypto.createPublicKey(this._keyObject);

      // Comparar las llaves exportadas como DER
      const certDer = certPubKey.export({ format: 'der', type: 'spki' });
      const privDer = privPubKey.export({ format: 'der', type: 'spki' });

      return certDer.equals(privDer);
    } catch {
      return false;
    }
  }

  /** Retorna el KeyObject de Node crypto (para uso avanzado) */
  get keyObject(): crypto.KeyObject {
    return this._keyObject;
  }
}
