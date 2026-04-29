import pkg from 'node-forge';
import crypto from 'crypto';
import { Certificate } from './Certificate';

const { asn1, pki, util } = pkg;

/**
 * Códigos de estado de la respuesta OCSP (campo `responseStatus`).
 * Definidos por RFC 6960 § 4.2.1.
 */
export enum OcspResponseStatus {
  SUCCESSFUL = '00',
  MALFORMED_REQUEST = '01',
  INTERNAL_ERROR = '02',
  TRY_LATER = '03',
  SIG_REQUIRED = '05',
  UNAUTHORIZED = '06',
  UNDEFINED = '',
}

/**
 * Estado del certificado dentro de una respuesta OCSP exitosa.
 * Definidos por RFC 6960 § 4.2.2.2.
 */
export enum OcspCertificateStatus {
  GOOD = 0,
  REVOKED = 1,
  UNKNOWN = 2,
}

export interface OcspCertificateStatusResult {
  status: 'GOOD' | 'REVOKED' | 'UNKNOWN' | 'UNDEFINED';
  /** Solo presente cuando `status === 'REVOKED'`. */
  revocationTime?: Date;
}

export interface OcspVerifyResponse extends OcspCertificateStatusResult {
  /** DER de la solicitud OCSP enviada (base64). */
  ocspRequestBase64: string;
  /** DER de la respuesta OCSP recibida (base64). */
  ocspResponseBase64: string;
}

/**
 * Validación OCSP (Online Certificate Status Protocol) contra el SAT.
 *
 * El SAT expone el estado de revocación de e.firma en
 * `https://cfdi.sat.gob.mx/edofiel`. Para validar un certificado de un
 * contribuyente necesitas tres certificados:
 *
 * 1. **subject**: el cert del contribuyente que estás verificando.
 * 2. **issuer**: el cert raíz del SAT que emitió el subject (AC4 o AC5).
 * 3. **ocsp**: el cert que firma la respuesta del responder OCSP del SAT.
 *
 * @example
 *   const subject = await Certificate.fromFile('contribuyente.cer');
 *   const issuer = await Certificate.fromFile('AC5_SAT.cer');
 *   const ocspCert = await Certificate.fromFile('ocsp.ac5_sat.cer');
 *   const ocsp = new Ocsp('https://cfdi.sat.gob.mx/edofiel', issuer, subject, ocspCert);
 *   const res = await ocsp.verify();
 *   if (res.status === 'REVOKED') console.log('revocado el', res.revocationTime);
 */
export class Ocsp {
  private static readonly URL_REGEX =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/im;

  constructor(
    private readonly urlService: string,
    private readonly issuerCertificate: Certificate,
    private readonly subjectCertificate: Certificate,
    private readonly ocspCertificate: Certificate
  ) {
    if (!Ocsp.URL_REGEX.test(urlService)) {
      throw new Error('Revisar la url del servicio OCSP, el formato no es de URL');
    }
  }

  /**
   * Construye la solicitud OCSP, la POST-ea al endpoint, parsea la respuesta
   * y devuelve el estado del certificado del contribuyente.
   *
   * Lanza si:
   *   - el servicio responde con status != 200
   *   - la respuesta OCSP no es `successful`
   *   - la firma de la respuesta no fue emitida por el `ocspCertificate`
   */
  async verify(): Promise<OcspVerifyResponse> {
    const requestDerBytes = this._buildRequestDer();
    const requestBuffer = Buffer.from(requestDerBytes, 'binary');
    const responseBuffer = await this._postRequest(requestBuffer);
    const responseBinary = responseBuffer.toString('binary');
    const asn1Response = asn1.fromDer(responseBinary);

    const responseStatus = this.parseResponseStatus(asn1Response);
    if (responseStatus !== OcspResponseStatus.SUCCESSFUL) {
      throw new Error(
        `No fue posible realizar la validación OCSP (responseStatus=${responseStatus})`
      );
    }

    const asn1Basic = this._extractBasicResponse(asn1Response);
    if (!this.verifyResponseSignature(asn1Basic)) {
      throw new Error('La firma de la respuesta OCSP no corresponde');
    }

    const status = this.parseCertificateStatus(asn1Basic);
    return {
      ...status,
      ocspRequestBase64: requestBuffer.toString('base64'),
      ocspResponseBase64: responseBuffer.toString('base64'),
    };
  }

  /**
   * Parsea el `responseStatus` (primer campo de OCSPResponse, RFC 6960 §4.2.1).
   * Útil para inspeccionar respuestas pre-grabadas sin red.
   */
  parseResponseStatus(asn1Response: pkg.asn1.Asn1): OcspResponseStatus {
    const status = Buffer.from(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((asn1Response as any).value[0] as { value: string }).value as unknown as string
    ).toString('hex');
    if (status === OcspResponseStatus.SUCCESSFUL) return OcspResponseStatus.SUCCESSFUL;
    if (status === OcspResponseStatus.TRY_LATER) return OcspResponseStatus.TRY_LATER;
    if (status === OcspResponseStatus.MALFORMED_REQUEST) return OcspResponseStatus.MALFORMED_REQUEST;
    if (status === OcspResponseStatus.INTERNAL_ERROR) return OcspResponseStatus.INTERNAL_ERROR;
    if (status === OcspResponseStatus.SIG_REQUIRED) return OcspResponseStatus.SIG_REQUIRED;
    if (status === OcspResponseStatus.UNAUTHORIZED) return OcspResponseStatus.UNAUTHORIZED;
    return OcspResponseStatus.UNDEFINED;
  }

  /**
   * Extrae `{ status, revocationTime? }` desde un `BasicOCSPResponse` ya parseado.
   * Útil para inspeccionar respuestas pre-grabadas sin red.
   */
  parseCertificateStatus(asn1Basic: pkg.asn1.Asn1): OcspCertificateStatusResult {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const certStatus: any = (asn1Basic as any).value[0].value[2].value[0].value[1];
    if (certStatus.type === OcspCertificateStatus.GOOD) {
      return { status: 'GOOD' };
    }
    if (certStatus.type === OcspCertificateStatus.REVOKED) {
      const revocationTime = this._asn1DateToDate(certStatus.value[0].value);
      return { status: 'REVOKED', revocationTime };
    }
    if (certStatus.type === OcspCertificateStatus.UNKNOWN) {
      return { status: 'UNKNOWN' };
    }
    return { status: 'UNDEFINED' };
  }

  /**
   * Verifica la firma del `BasicOCSPResponse` con la llave pública del
   * `ocspCertificate`. Retorna `true` si la firma es válida.
   */
  verifyResponseSignature(asn1Basic: pkg.asn1.Asn1): boolean {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sigBytes: string = ((asn1Basic as any).value[2] as { value: string }).value;
      const signatureRaw = sigBytes.slice(1); // saltar el byte de unused-bits del BIT STRING
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tbsAsn1Children: pkg.asn1.Asn1[] = ((asn1Basic as any).value[0] as { value: pkg.asn1.Asn1[] })
        .value;
      const tbsAsn1 = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, tbsAsn1Children);
      const tbsDer = asn1.toDer(tbsAsn1).getBytes();
      // OCSP usa SHA-1 históricamente; el SAT también
      const signatureBase64 = Buffer.from(signatureRaw, 'binary').toString('base64');
      return this.ocspCertificate.verify(tbsDer, signatureBase64, 'SHA256') ||
        this.ocspCertificate.verify(tbsDer, signatureBase64, 'SHA384') ||
        this._verifySha1(tbsDer, signatureRaw);
    } catch {
      return false;
    }
  }

  private _verifySha1(tbsDer: string, sigRaw: string): boolean {
    try {
      const pubKeyPem = this.ocspCertificate.publicKey();
      const pubKey = crypto.createPublicKey({ key: pubKeyPem, format: 'pem' });
      const verifier = crypto.createVerify('RSA-SHA1');
      verifier.update(Buffer.from(tbsDer, 'binary'));
      return verifier.verify(pubKey, Buffer.from(sigRaw, 'binary'));
    } catch {
      return false;
    }
  }

  private async _postRequest(body: Buffer): Promise<Buffer> {
    const response = await fetch(this.urlService, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: new Uint8Array(body),
    });
    if (response.status !== 200) {
      throw new Error(`Error al consultar el servicio ${this.urlService}`);
    }
    const ab = await response.arrayBuffer();
    return Buffer.from(ab);
  }

  private _extractBasicResponse(asn1Response: pkg.asn1.Asn1): pkg.asn1.Asn1 {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inner: string = ((asn1Response as any).value[1] as { value: any }).value[0].value[1].value;
    return asn1.fromDer(inner);
  }

  private _buildRequestDer(): string {
    const issuerNameDer = this._encodeIssuerName();
    const issuerNameHash = this._sha1Binary(issuerNameDer);

    const issuerKeyDer = this._extractIssuerPublicKeyBinary();
    const issuerKeyHash = this._sha1Binary(issuerKeyDer);

    const serialBin = Buffer.from(this.subjectCertificate.serialNumber(), 'hex').toString('binary');

    const reqAsn1 = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                asn1.create(
                  asn1.Class.UNIVERSAL,
                  asn1.Type.OID,
                  false,
                  asn1.oidToDer(pki.oids['sha1']).getBytes()
                ),
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, ''),
              ]),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, issuerNameHash),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, issuerKeyHash),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, serialBin),
            ]),
          ]),
        ]),
        // requestExtensions [2]
        asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.OID,
                false,
                asn1.oidToDer('1.3.6.1.5.5.7.48.1.2').getBytes()
              ),
              asn1.create(
                asn1.Class.UNIVERSAL,
                asn1.Type.OCTETSTRING,
                false,
                Buffer.from('041064bb982b0f6236984ec9d8c4997b6996', 'hex').toString('binary')
              ),
            ]),
          ]),
        ]),
      ]),
    ]);
    return asn1.toDer(reqAsn1).getBytes();
  }

  private _encodeIssuerName(): string {
    const attrs = this.subjectCertificate.forgeCertificate.issuer.attributes;
    const items: pkg.asn1.Asn1[] = attrs.map(attr =>
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(
            asn1.Class.UNIVERSAL,
            asn1.Type.OID,
            false,
            asn1.oidToDer(attr.type as string).getBytes()
          ),
          asn1.create(
            asn1.Class.UNIVERSAL,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((attr as any).valueTagClass as number) || asn1.Type.UTF8,
            false,
            attr.value as string
          ),
        ]),
      ])
    );
    const dn = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, items);
    return asn1.toDer(dn).getBytes();
  }

  private _extractIssuerPublicKeyBinary(): string {
    const derBuf = this.issuerCertificate.toDer();
    const derStr = util.binary.raw.encode(new Uint8Array(derBuf));
    const parsed = asn1.fromDer(derStr);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bitString: string = (parsed as any).value[0].value[6].value[1].bitStringContents;
    return bitString.slice(1);
  }

  private _sha1Binary(input: string): string {
    return crypto.createHash('sha1').update(Buffer.from(input, 'binary')).digest('binary');
  }

  private _asn1DateToDate(date: string): Date {
    if (date.indexOf('Z') === -1) {
      throw new Error('Formato de fecha incorrecto, se espera YYYYMMDDHHMMSSZ');
    }
    return new Date(
      `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T${date.slice(
        8,
        10
      )}:${date.slice(10, 12)}:${date.slice(12, 14)}.000Z`
    );
  }
}
