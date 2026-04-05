import crypto from 'crypto';
import { Certificate } from './Certificate';
import { PrivateKey } from './PrivateKey';

/**
 * Une un certificado X.509 con su llave privada correspondiente.
 * Soporta CSD (Certificado de Sello Digital) y FIEL (eFirma).
 */
export class Credential {
  private constructor(
    private readonly _certificate: Certificate,
    private readonly _privateKey: PrivateKey
  ) {}

  /**
   * Crea un Credential cargando archivos desde el sistema de archivos.
   * El archivo .cer puede ser DER o PEM; el .key siempre es DER cifrado del SAT.
   */
  static async create(
    cerPath: string,
    keyPath: string,
    password: string
  ): Promise<Credential> {
    const [cert, key] = await Promise.all([
      Certificate.fromFile(cerPath),
      PrivateKey.fromFile(keyPath, password),
    ]);
    return new Credential(cert, key);
  }

  /**
   * Crea un Credential a partir de strings PEM (sin cifrado).
   * Util cuando ya se tiene el PEM del certificado y la llave.
   */
  static fromPem(cerPem: string, keyPem: string): Credential {
    const cert = Certificate.fromPem(cerPem);
    const key = PrivateKey.fromPem(keyPem);
    return new Credential(cert, key);
  }

  /**
   * Verdadero si el certificado es FIEL (eFirma).
   */
  isFiel(): boolean {
    return this._certificate.isFiel();
  }

  /**
   * Verdadero si el certificado es CSD (Certificado de Sello Digital).
   */
  isCsd(): boolean {
    return this._certificate.isCsd();
  }

  /**
   * RFC del titular extraido del subject del certificado.
   */
  rfc(): string {
    return this._certificate.rfc();
  }

  /**
   * Nombre legal del titular.
   */
  legalName(): string {
    return this._certificate.legalName();
  }

  /**
   * Numero de serie del certificado (hex).
   */
  serialNumber(): string {
    return this._certificate.serialNumber();
  }

  /**
   * Numero de certificado SAT (decimal ASCII derivado del serial hex).
   */
  noCertificado(): string {
    return this._certificate.noCertificado();
  }

  /**
   * Firma datos usando la llave privada con SHA-256 por defecto.
   * Retorna la firma en base64.
   */
  sign(data: string, algorithm = 'SHA256'): string {
    return this._privateKey.sign(data, algorithm);
  }

  /**
   * Verifica una firma contra los datos usando la llave publica del certificado.
   */
  verify(data: string, signature: string, algorithm = 'SHA256'): boolean {
    try {
      const pubKeyPem = this._certificate.publicKey();
      const pubKey = crypto.createPublicKey({ key: pubKeyPem, format: 'pem' });
      const verifier = crypto.createVerify(`RSA-${algorithm}`);
      verifier.update(data, 'utf8');
      return verifier.verify(pubKey, signature, 'base64');
    } catch {
      return false;
    }
  }

  /**
   * Verdadero si el certificado no esta vencido.
   */
  isValid(): boolean {
    return !this._certificate.isExpired();
  }

  /**
   * Verifica si el certificado pertenece al RFC dado.
   */
  belongsTo(rfc: string): boolean {
    return this._certificate.rfc().toUpperCase() === rfc.toUpperCase();
  }

  /**
   * Verifica que la llave privada corresponda al certificado
   * (compara llaves publicas).
   */
  keyMatchesCertificate(): boolean {
    return this._privateKey.belongsToCertificate(this._certificate);
  }

  /** Acceso al certificado */
  get certificate(): Certificate {
    return this._certificate;
  }

  /** Acceso a la llave privada */
  get privateKey(): PrivateKey {
    return this._privateKey;
  }
}
