import crypto from 'crypto';
import { readFileSync } from 'fs';
import { promises as fs } from 'fs';
import pkg from 'node-forge';

const { pki, asn1, util } = pkg;

/**
 * Wrapper de certificado X.509 para CSD y FIEL del SAT.
 * Usa crypto nativo de Node 22 para operaciones principales
 * y node-forge para parseo de extensiones X.509.
 */
export class Certificate {
  private readonly _forgeCert: pkg.pki.Certificate;
  private readonly _pem: string;

  private constructor(pem: string) {
    this._pem = pem;
    this._forgeCert = pki.certificateFromPem(pem);
  }

  /**
   * Crea un Certificate a partir de un buffer DER (binario .cer)
   */
  static fromDer(derBuffer: Buffer): Certificate {
    const derStr = util.binary.raw.encode(new Uint8Array(derBuffer));
    const asnObj = asn1.fromDer(derStr);
    const forgeCert = pki.certificateFromAsn1(asnObj);
    const pem = pki.certificateToPem(forgeCert);
    return new Certificate(pem);
  }

  /**
   * Crea un Certificate a partir de un PEM string
   */
  static fromPem(pem: string): Certificate {
    return new Certificate(pem);
  }

  /**
   * Crea un Certificate leyendo un archivo .cer (DER) o .pem
   */
  static async fromFile(filePath: string): Promise<Certificate> {
    const buf = await fs.readFile(filePath);
    const isPem =
      buf.toString('utf8', 0, 10).includes('-----') ||
      filePath.toLowerCase().endsWith('.pem');
    if (isPem) {
      return Certificate.fromPem(buf.toString('ascii'));
    }
    return Certificate.fromDer(buf);
  }

  /**
   * Crea un Certificate leyendo un archivo de forma sincrona
   */
  static fromFileSync(filePath: string): Certificate {
    const buf = readFileSync(filePath);
    const isPem =
      buf.toString('utf8', 0, 10).includes('-----') ||
      filePath.toLowerCase().endsWith('.pem');
    if (isPem) {
      return Certificate.fromPem(buf.toString('ascii'));
    }
    return Certificate.fromDer(buf);
  }

  /** Retorna el certificado en formato PEM */
  toPem(): string {
    return this._pem;
  }

  /** Retorna el certificado en formato DER (Buffer) */
  toDer(): Buffer {
    const derStr = asn1.toDer(pki.certificateToAsn1(this._forgeCert)).getBytes();
    return Buffer.from(derStr, 'binary');
  }

  /**
   * Numero de serie del certificado (hex string).
   * Para certificados del SAT se convierte a decimal ASCII (numero de certificado).
   */
  serialNumber(): string {
    return this._forgeCert.serialNumber;
  }

  /**
   * Numero de certificado SAT: convierte el serial hex a string decimal legible.
   * El SAT codifica el numero de certificado como ASCII en hex.
   */
  noCertificado(): string {
    const hex = this._forgeCert.serialNumber;
    // Si el serial son pares de hex que representan digitos ASCII (48-57 = '0'-'9')
    if (hex.length % 2 === 0) {
      const pairs = hex.match(/.{1,2}/g) ?? [];
      const allDigits = pairs.every(p => {
        const code = parseInt(p, 16);
        return code >= 48 && code <= 57;
      });
      if (allDigits) {
        return pairs.map(p => String.fromCharCode(parseInt(p, 16))).join('');
      }
    }
    return hex;
  }

  /**
   * RFC del titular extraido del subject del certificado.
   *
   * El SAT codifica el RFC en distintos OIDs segun el tipo de certificado:
   * - OID 2.5.4.45 (x500UniqueIdentifier): "RFC / CURP" (CSD persona fisica)
   *   o "RFC / CURP" (FIEL)
   * - OID 2.5.4.5 (serialNumber): " / CURP" o solo CURP (algunos CSD)
   *
   * La estrategia es buscar el valor que tenga formato de RFC valido (12-13 chars
   * alfanumericos) en los atributos del subject.
   */
  rfc(): string {
    const attrs = this._forgeCert.subject.attributes;

    // OID 2.5.4.45 - x500UniqueIdentifier: contiene "RFC / CURP"
    const x500UniqueId = attrs.find(a => a.type === '2.5.4.45');
    if (x500UniqueId?.value) {
      const raw = String(x500UniqueId.value).trim();
      // Formato "RFC / CURP" o solo "RFC"
      const rfcPart = raw.split('/')[0].trim();
      if (rfcPart && this._isValidRfc(rfcPart)) return rfcPart;
    }

    // OID 2.5.4.5 - serialNumber: puede contener " / CURP" (el RFC esta antes)
    const serialAttr = attrs.find(
      a => a.type === '2.5.4.5' || a.shortName === 'serialNumber'
    );
    if (serialAttr?.value) {
      const raw = String(serialAttr.value).trim();
      const rfcPart = raw.split('/')[0].trim();
      if (rfcPart && this._isValidRfc(rfcPart)) return rfcPart;
    }

    // OID 0.9.2342.19200300.100.1.1 - uid
    const uidAttr = attrs.find(a => a.type === '0.9.2342.19200300.100.1.1');
    if (uidAttr?.value) {
      const val = String(uidAttr.value).trim();
      if (this._isValidRfc(val)) return val;
    }

    // Busqueda en todos los atributos (fallback)
    for (const attr of attrs) {
      if (attr.value) {
        const val = String(attr.value).trim();
        const part = val.split('/')[0].trim();
        if (this._isValidRfc(part)) return part;
      }
    }

    return '';
  }

  /**
   * Valida formato basico de RFC mexicano (12 PM, 13 PF).
   */
  private _isValidRfc(value: string): boolean {
    // RFC: 3-4 letras, 6 digitos de fecha, 3 homoclave
    return /^[A-Z&Ñ]{3,4}\d{6}[A-Z\d]{3}$/i.test(value);
  }

  /**
   * Nombre legal del titular extraido del subject (commonName o givenName)
   */
  legalName(): string {
    const attrs = this._forgeCert.subject.attributes;

    // CN (commonName)
    const cn = attrs.find(a => a.shortName === 'CN' || a.type === '2.5.4.3');
    if (cn?.value) return String(cn.value);

    // givenName
    const gn = attrs.find(a => a.type === '2.5.4.42');
    if (gn?.value) return String(gn.value);

    return '';
  }

  /** Retorna todos los atributos del issuer como objeto clave-valor */
  issuer(): Record<string, string> {
    return this._attributesToRecord(this._forgeCert.issuer.attributes);
  }

  /** Retorna todos los atributos del subject como objeto clave-valor */
  subject(): Record<string, string> {
    return this._attributesToRecord(this._forgeCert.subject.attributes);
  }

  /** Fecha de inicio de vigencia */
  validFrom(): Date {
    return this._forgeCert.validity.notBefore;
  }

  /** Fecha de fin de vigencia */
  validTo(): Date {
    return this._forgeCert.validity.notAfter;
  }

  /** Verdadero si el certificado esta vencido */
  isExpired(): boolean {
    return new Date() > this._forgeCert.validity.notAfter;
  }

  /**
   * Fingerprint SHA-1 del certificado (formato AA:BB:CC:...)
   */
  fingerprint(): string {
    const derBuf = this.toDer();
    const hash = crypto.createHash('sha1').update(derBuf).digest('hex');
    return hash
      .toUpperCase()
      .match(/.{1,2}/g)!
      .join(':');
  }

  /**
   * Fingerprint SHA-256 del certificado
   */
  fingerprintSha256(): string {
    const derBuf = this.toDer();
    return crypto.createHash('sha256').update(derBuf).digest('hex').toUpperCase();
  }

  /** Llave publica en formato PEM */
  publicKey(): string {
    return pki.publicKeyToPem(this._forgeCert.publicKey as pkg.pki.rsa.PublicKey);
  }

  /**
   * Detecta si es FIEL (eFirma).
   * Los certificados FIEL del SAT tienen "FIEL" en el OU o en el CN,
   * o el campo OU no contiene "CSD" ni "Prueba_CFDI".
   * En la practica, los CSD tienen OU con "Prueba_CFDI" o similar,
   * mientras que los FIEL tienen OU vacío o con "FIEL".
   */
  isFiel(): boolean {
    return !this.isCsd();
  }

  /**
   * Detecta si es CSD (Certificado de Sello Digital).
   * Los CSD del SAT incluyen en el subject OU un valor que indica
   * su uso para sellos: "CSD", "Prueba_CFDI", etc.
   * Tambien se puede verificar por el KeyUsage: digitalSignature sin
   * nonRepudiation implica CSD; con nonRepudiation es FIEL.
   */
  isCsd(): boolean {
    const attrs = this._forgeCert.subject.attributes;

    // Buscar OU (organizationalUnitName)
    const ou = attrs.find(a => a.shortName === 'OU' || a.type === '2.5.4.11');
    if (ou?.value) {
      const ouVal = String(ou.value).toUpperCase();
      // CSD tiene OU con "CSD", "PRUEBA_CFDI", o similar
      if (
        ouVal.includes('CSD') ||
        ouVal.includes('CFDI') ||
        ouVal.includes('SELLO')
      ) {
        return true;
      }
      // FIEL tiene OU con "FIEL" o "FIRMA"
      if (ouVal.includes('FIEL') || ouVal.includes('FIRMA')) {
        return false;
      }
    }

    // Verificar extensiones Key Usage
    const keyUsageExt = this._forgeCert.extensions.find(
      e => e.id === '2.5.29.15' || e.name === 'keyUsage'
    ) as any;

    if (keyUsageExt) {
      // CSD: digitalSignature = true, nonRepudiation = false
      // FIEL: ambos true
      if (keyUsageExt.digitalSignature && !keyUsageExt.nonRepudiation) {
        return true;
      }
    }

    // Por defecto, si tiene serialNumber con " / " (RFC / CURP) es probablemente CSD
    const serialAttr = attrs.find(
      a => a.type === '2.5.4.5' || a.shortName === 'serialNumber'
    );
    if (serialAttr?.value && String(serialAttr.value).includes('/')) {
      return true;
    }

    return false;
  }

  private _attributesToRecord(
    attributes: pkg.pki.CertificateField[]
  ): Record<string, string> {
    const obj: Record<string, string> = {};
    for (const attr of attributes) {
      const key = attr.shortName || attr.name || String(attr.type);
      if (key) {
        obj[key] = String(attr.value ?? '');
      }
    }
    return obj;
  }
}
