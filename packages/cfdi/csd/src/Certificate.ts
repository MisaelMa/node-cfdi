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
   * Acceso al certificado de `node-forge` subyacente.
   * Pensado para integraciones internas (p. ej. el módulo `Ocsp`).
   * No depender de esta API en código de aplicación.
   */
  get forgeCertificate(): pkg.pki.Certificate {
    return this._forgeCert;
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
      const raw = Certificate._decodeAttrValue(x500UniqueId).trim();
      // Formato "RFC / CURP" o solo "RFC"
      const rfcPart = raw.split('/')[0].trim();
      if (rfcPart && this._isValidRfc(rfcPart)) return rfcPart;
    }

    // OID 2.5.4.5 - serialNumber: puede contener " / CURP" (el RFC esta antes)
    const serialAttr = attrs.find(
      a => a.type === '2.5.4.5' || a.shortName === 'serialNumber'
    );
    if (serialAttr?.value) {
      const raw = Certificate._decodeAttrValue(serialAttr).trim();
      const rfcPart = raw.split('/')[0].trim();
      if (rfcPart && this._isValidRfc(rfcPart)) return rfcPart;
    }

    // OID 0.9.2342.19200300.100.1.1 - uid
    const uidAttr = attrs.find(a => a.type === '0.9.2342.19200300.100.1.1');
    if (uidAttr?.value) {
      const val = Certificate._decodeAttrValue(uidAttr).trim();
      if (this._isValidRfc(val)) return val;
    }

    // Busqueda en todos los atributos (fallback)
    for (const attr of attrs) {
      if (attr.value) {
        const val = Certificate._decodeAttrValue(attr).trim();
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
    if (cn?.value) return Certificate._decodeAttrValue(cn);

    // givenName
    const gn = attrs.find(a => a.type === '2.5.4.42');
    if (gn?.value) return Certificate._decodeAttrValue(gn);

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

  /** Retorna el contenido base64 del certificado (sin headers PEM ni whitespace) */
  toBase64(): string {
    return this._pem.replace(/(-+[^-]+-+)/g, '').replace(/\s+/g, '');
  }

  /** Llave publica en formato PEM */
  publicKey(): string {
    return pki.publicKeyToPem(this._forgeCert.publicKey as pkg.pki.rsa.PublicKey);
  }

  /**
   * Detecta el tipo de certificado por extensiones X.509 (estándar SAT).
   *
   * - **CSD** (Certificado de Sello Digital): keyUsage con `digitalSignature`
   *   y `nonRepudiation` activos, sin `dataEncipherment` ni `keyAgreement`.
   * - **FIEL** (e.firma / firma electrónica avanzada): extKeyUsage con
   *   `emailProtection` y `clientAuth` activos.
   *
   * Si las extensiones no permiten clasificar, hace fallback a la heurística
   * histórica del OU del subject (`Prueba_CFDI`, `FIEL`, etc.).
   */
  certificateType(): 'CSD' | 'FIEL' | 'UNKNOWN' {
    const exts = this._forgeCert.extensions as Array<Record<string, any>>;

    for (const ext of exts) {
      if (
        ext.name === 'extKeyUsage' &&
        ext.emailProtection === true &&
        ext.clientAuth === true
      ) {
        return 'FIEL';
      }
      if (
        ext.name === 'keyUsage' &&
        ext.digitalSignature === true &&
        ext.nonRepudiation === true &&
        ext.dataEncipherment === false &&
        ext.keyAgreement === false
      ) {
        return 'CSD';
      }
    }

    // Fallback: heurística OU
    const attrs = this._forgeCert.subject.attributes;
    const ou = attrs.find(a => a.shortName === 'OU' || a.type === '2.5.4.11');
    if (ou?.value) {
      const ouVal = String(ou.value).toUpperCase();
      if (ouVal.includes('CSD') || ouVal.includes('CFDI') || ouVal.includes('SELLO')) {
        return 'CSD';
      }
      if (ouVal.includes('FIEL') || ouVal.includes('FIRMA')) {
        return 'FIEL';
      }
    }
    return 'UNKNOWN';
  }

  /** `true` si es FIEL (e.firma). Equivalente a `certificateType() === 'FIEL'`. */
  isFiel(): boolean {
    return this.certificateType() === 'FIEL';
  }

  /** `true` si es CSD. Equivalente a `certificateType() === 'CSD'`. */
  isCsd(): boolean {
    return this.certificateType() === 'CSD';
  }

  /**
   * Versión de la Autoridad Certificadora del SAT (AC) que emitió el certificado.
   *
   * El SAT codifica el número de AC en el dígito 12 (índice 11) del
   * `noCertificado` (20 dígitos decimales). En el serial hex es el carácter en
   * índice 23 (segundo nibble del byte 11). Valores típicos:
   *   - `4`: AC4 del SAT (deprecada)
   *   - `5`: AC5 del SAT (vigente)
   *
   * Retorna `null` si no se puede determinar.
   */
  acVersion(): number | null {
    const noCer = this.noCertificado();
    if (noCer.length < 12) return null;
    const digit = Number(noCer[11]);
    return Number.isFinite(digit) ? digit : null;
  }

  /**
   * Tipo de sujeto (titular) según el formato del RFC en el subject:
   *
   * - **MORAL** (persona moral / empresa): el OID 2.5.4.45 contiene `RFC / CURP`
   *   (RFC empresa + CURP del representante legal, separados por `/`).
   * - **FISICA** (persona física): RFC de 13 caracteres, sin `/`.
   *
   * Retorna `'UNKNOWN'` si no se puede determinar.
   */
  subjectType(): 'MORAL' | 'FISICA' | 'UNKNOWN' {
    const attrs = this._forgeCert.subject.attributes;
    const x500 = attrs.find(a => a.type === '2.5.4.45');
    if (x500?.value) {
      const raw = String(x500.value);
      if (raw.indexOf(' / ') >= 0) return 'MORAL';
      if (raw.length === 13) return 'FISICA';
    }
    // Fallback al RFC ya extraído
    const rfc = this.rfc();
    if (rfc.length === 13) return 'FISICA';
    if (rfc.length === 12) return 'MORAL';
    return 'UNKNOWN';
  }

  /**
   * `true` si el certificado está vigente: `notBefore <= now <= notAfter`.
   * A diferencia de `isExpired()`, también valida el inicio de vigencia.
   */
  isValid(): boolean {
    const now = new Date();
    return (
      now >= this._forgeCert.validity.notBefore &&
      now <= this._forgeCert.validity.notAfter
    );
  }

  /**
   * Verifica que este certificado fue firmado por el certificado emisor dado.
   * Útil para validar la cadena de confianza contra el AC4/AC5 del SAT.
   *
   * Retorna `true` si la firma es válida, `false` si no fue emitido por
   * ese emisor. Lanza si el binario del emisor es inválido.
   *
   * @example
   *   const cert = await Certificate.fromFile('cert.cer');
   *   const ac5 = await Certificate.fromFile('AC5_SAT.cer');
   *   if (!cert.verifyIssuedBy(ac5)) throw new Error('cert no emitido por AC5');
   */
  verifyIssuedBy(issuer: Certificate): boolean {
    try {
      return issuer._forgeCert.verify(this._forgeCert);
    } catch {
      return false;
    }
  }

  /** Alias de `verifyIssuedBy()` por compatibilidad con `e.firma`. */
  verifyIntegrity(issuer: Certificate): boolean {
    return this.verifyIssuedBy(issuer);
  }

  /**
   * Verifica una firma contra `data` usando la llave pública del certificado.
   * `signature` debe estar en Base64. Default SHA-256 (lo que exige el SAT).
   */
  verify(
    data: string,
    signature: string,
    algorithm: 'SHA256' | 'SHA384' | 'SHA512' = 'SHA256'
  ): boolean {
    try {
      const pubKeyPem = this.publicKey();
      const pubKey = crypto.createPublicKey({ key: pubKeyPem, format: 'pem' });
      const verifier = crypto.createVerify(`RSA-${algorithm}`);
      verifier.update(data, 'utf8');
      return verifier.verify(pubKey, signature, 'base64');
    } catch {
      return false;
    }
  }

  /**
   * Encripta un mensaje con la llave pública del certificado (RSA PKCS#1 v1.5).
   * Solo el dueño de la llave privada correspondiente puede desencriptar.
   * Retorna el ciphertext en Base64.
   */
  rsaEncrypt(message: string): string {
    const pubKey = crypto.createPublicKey({ key: this.publicKey(), format: 'pem' });
    const enc = crypto.publicEncrypt(
      { key: pubKey, padding: crypto.constants.RSA_PKCS1_PADDING },
      Buffer.from(message, 'utf8')
    );
    return enc.toString('base64');
  }

  private _attributesToRecord(
    attributes: pkg.pki.CertificateField[]
  ): Record<string, string> {
    const obj: Record<string, string> = {};
    for (const attr of attributes) {
      const key = attr.shortName || attr.name || String(attr.type);
      if (key) {
        obj[key] = Certificate._decodeAttrValue(attr);
      }
    }
    return obj;
  }

  /**
   * Decodifica el valor de un atributo del subject/issuer.
   *
   * node-forge devuelve los UTF8String como "binary string" (un byte JS por
   * cada byte UTF-8 del DER), por lo que `String(attr.value)` en certs con
   * acentos produce mojibake (ej. "AdministraciÃ³n" en vez de "Administración").
   * Cuando el tag ASN.1 original era UTF8 (12), re-decodificamos de bytes a UTF-8.
   */
  private static _decodeAttrValue(attr: pkg.pki.CertificateField): string {
    const raw = attr.value;
    if (raw === undefined || raw === null) return '';
    const str = String(raw);
    const tag = (attr as { valueTagClass?: number }).valueTagClass;
    if (tag === asn1.Type.UTF8) {
      return Buffer.from(str, 'binary').toString('utf8');
    }
    return str;
  }
}
