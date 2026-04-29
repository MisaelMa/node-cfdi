import crypto from 'crypto';
import { readFileSync } from 'fs';
import { promises as fs } from 'fs';
import { Certificate } from './Certificate';

export interface PrivateKeyLoadOptions {
  /**
   * Si `true`, rechaza llaves no cifradas (requiere PKCS#8 EncryptedPrivateKeyInfo).
   * Por convención SAT las `.key` siempre vienen cifradas.
   */
  strict?: boolean;
}

/**
 * Llave privada RSA para CSD o FIEL del SAT.
 * Usa crypto nativo de Node 22 para firma, verificación, encripción y desencripción.
 */
export class PrivateKey {
  private readonly _pem: string;
  private readonly _keyObject: crypto.KeyObject;

  private constructor(pem: string) {
    this._pem = pem;
    this._keyObject = crypto.createPrivateKey({ key: pem, format: 'pem' });
  }

  /**
   * Carga una llave privada desde un buffer DER (archivo .key).
   *
   * Soporta:
   *   - PKCS#8 cifrado (EncryptedPrivateKeyInfo) — formato canónico del SAT
   *   - PKCS#8 sin cifrar (PrivateKeyInfo)
   *   - PKCS#1 sin cifrar (RSAPrivateKey)
   *
   * Cuando `opts.strict` es `true`, **solo** acepta PKCS#8 cifrado.
   */
  static fromDer(
    derBuffer: Buffer,
    password: string,
    opts: PrivateKeyLoadOptions = {}
  ): PrivateKey {
    const kind = PrivateKey._detectDerKind(derBuffer);

    if (opts.strict && kind !== 'encrypted-pkcs8') {
      throw new Error(
        'Llave privada no válida: se esperaba PKCS#8 EncryptedPrivateKeyInfo (modo strict)'
      );
    }

    let keyObject: crypto.KeyObject;
    if (kind === 'encrypted-pkcs8') {
      keyObject = crypto.createPrivateKey({
        key: derBuffer,
        format: 'der',
        type: 'pkcs8',
        passphrase: password,
      });
    } else if (kind === 'plain-pkcs8') {
      keyObject = crypto.createPrivateKey({ key: derBuffer, format: 'der', type: 'pkcs8' });
    } else {
      keyObject = crypto.createPrivateKey({ key: derBuffer, format: 'der', type: 'pkcs1' });
    }
    const pem = keyObject.export({ format: 'pem', type: 'pkcs8' }) as string;
    return new PrivateKey(pem);
  }

  /** Carga una llave privada desde un PEM string (no encriptado). */
  static fromPem(pem: string): PrivateKey {
    return new PrivateKey(pem);
  }

  /**
   * Carga una llave privada desde un archivo .key (DER cifrado) o .pem.
   *
   * Cuando `opts.strict` es `true`, exige que el archivo contenga una llave
   * PKCS#8 cifrada (lo que entrega el SAT). PEM/DER sin cifrar lanza.
   */
  static async fromFile(
    filePath: string,
    password: string,
    opts: PrivateKeyLoadOptions = {}
  ): Promise<PrivateKey> {
    const buf = await fs.readFile(filePath);
    const isPem =
      buf.toString('utf8', 0, 10).includes('-----') ||
      filePath.toLowerCase().endsWith('.pem');
    if (isPem) {
      if (opts.strict) {
        throw new Error('Llave privada no válida: PEM no cifrado (modo strict)');
      }
      return PrivateKey.fromPem(buf.toString('ascii'));
    }
    return PrivateKey.fromDer(buf, password, opts);
  }

  /** Versión síncrona de `fromFile`. */
  static fromFileSync(
    filePath: string,
    password: string,
    opts: PrivateKeyLoadOptions = {}
  ): PrivateKey {
    const buf = readFileSync(filePath);
    const isPem =
      buf.toString('utf8', 0, 10).includes('-----') ||
      filePath.toLowerCase().endsWith('.pem');
    if (isPem) {
      if (opts.strict) {
        throw new Error('Llave privada no válida: PEM no cifrado (modo strict)');
      }
      return PrivateKey.fromPem(buf.toString('ascii'));
    }
    return PrivateKey.fromDer(buf, password, opts);
  }

  /**
   * Detecta la variante de DER de una llave privada.
   *
   *   - `'plain-pkcs8'`: PKCS#8 PrivateKeyInfo sin cifrar
   *   - `'plain-pkcs1'`: PKCS#1 RSAPrivateKey sin cifrar
   *   - `'encrypted-pkcs8'`: PKCS#8 EncryptedPrivateKeyInfo (lo que entrega el SAT)
   */
  private static _detectDerKind(
    der: Buffer
  ): 'plain-pkcs8' | 'plain-pkcs1' | 'encrypted-pkcs8' {
    try {
      crypto.createPrivateKey({ key: der, format: 'der', type: 'pkcs8' });
      return 'plain-pkcs8';
    } catch {
      // not plain pkcs8
    }
    try {
      crypto.createPrivateKey({ key: der, format: 'der', type: 'pkcs1' });
      return 'plain-pkcs1';
    } catch {
      // not plain pkcs1
    }
    return 'encrypted-pkcs8';
  }

  /** Retorna la llave privada en formato PEM (PKCS#8, sin cifrado). */
  toPem(): string {
    return this._pem;
  }

  /**
   * Firma datos usando SHA-256 por defecto. Retorna la firma en base64.
   * El SAT exige SHA-256 para sello digital y firmas FIEL.
   */
  sign(data: string, algorithm = 'SHA256'): string {
    const signer = crypto.createSign(`RSA-${algorithm}`);
    signer.update(data, 'utf8');
    return signer.sign(this._keyObject, 'base64');
  }

  /**
   * Desencripta un mensaje cifrado con la llave pública del certificado
   * correspondiente (RSA PKCS#1 v1.5). El input debe estar en base64.
   * Retorna el plaintext como UTF-8.
   *
   * @example
   *   const enc = cert.rsaEncrypt('hola');
   *   const plain = key.rsaDecrypt(enc); // 'hola'
   */
  rsaDecrypt(encryptedBase64: string): string {
    const buf = Buffer.from(encryptedBase64, 'base64');
    const dec = crypto.privateDecrypt(
      { key: this._keyObject, padding: crypto.constants.RSA_PKCS1_PADDING },
      buf
    );
    return dec.toString('utf8');
  }

  /**
   * `true` si esta llave privada corresponde al certificado dado
   * (compara la llave pública exportada de ambos).
   */
  belongsToCertificate(cert: Certificate): boolean {
    try {
      const certPubKeyPem = cert.publicKey();
      const certPubKey = crypto.createPublicKey({ key: certPubKeyPem, format: 'pem' });
      const privPubKey = crypto.createPublicKey(this._keyObject);
      const certDer = certPubKey.export({ format: 'der', type: 'spki' });
      const privDer = privPubKey.export({ format: 'der', type: 'spki' });
      return certDer.equals(privDer);
    } catch {
      return false;
    }
  }

  /** KeyObject de Node crypto (para uso avanzado). */
  get keyObject(): crypto.KeyObject {
    return this._keyObject;
  }
}
