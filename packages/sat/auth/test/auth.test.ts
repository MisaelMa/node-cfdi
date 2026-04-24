import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import crypto from 'crypto';
import { SatAuth } from '../src/SatAuth';
import type { CredentialLike } from '../src/types';

/**
 * Crea un mock de CredentialLike con un par de llaves RSA de prueba.
 */
function createMockCredential(): CredentialLike {
  const { privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });

  // Certificado DER simulado (contenido arbitrario para tests)
  const fakeDer = Buffer.from('fakecertificate', 'utf8');

  return {
    certificate: {
      toDer: () => fakeDer,
      toPem: () => '-----BEGIN CERTIFICATE-----\nFAKE\n-----END CERTIFICATE-----',
    },
    sign: (data: string) => {
      const signer = crypto.createSign('RSA-SHA256');
      signer.update(data, 'utf8');
      return signer.sign(privateKey, 'base64');
    },
  };
}

const SAT_TOKEN_VALUE = 'TOKENVALUEFROMSAT123456789';

const MOCK_SOAP_RESPONSE = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <AutenticaResponse xmlns="http://DescargaMasivaTerceros.gob.mx">
      <AutenticaResult>${SAT_TOKEN_VALUE}</AutenticaResult>
    </AutenticaResponse>
  </s:Body>
</s:Envelope>`;

describe('SatAuth', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(MOCK_SOAP_RESPONSE, {
        status: 200,
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('llama a la URL de autenticacion del SAT', async () => {
    const credential = createMockCredential();
    const auth = new SatAuth(credential);

    await auth.authenticate();

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      'https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/Autenticacion/Autenticacion.svc'
    );
  });

  it('usa metodo POST', async () => {
    const credential = createMockCredential();
    const auth = new SatAuth(credential);

    await auth.authenticate();

    const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(options.method).toBe('POST');
  });

  it('envia el SOAPAction correcto', async () => {
    const credential = createMockCredential();
    const auth = new SatAuth(credential);

    await auth.authenticate();

    const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
    const headers = options.headers as Record<string, string>;
    expect(headers['SOAPAction']).toBe(
      'http://DescargaMasivaTerceros.gob.mx/IAutenticacion/Autentica'
    );
  });

  it('envia Content-Type text/xml', async () => {
    const credential = createMockCredential();
    const auth = new SatAuth(credential);

    await auth.authenticate();

    const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
    const headers = options.headers as Record<string, string>;
    expect(headers['Content-Type']).toContain('text/xml');
  });

  it('retorna el token con el valor correcto', async () => {
    const credential = createMockCredential();
    const auth = new SatAuth(credential);

    const token = await auth.authenticate();

    expect(token.value).toBe(SAT_TOKEN_VALUE);
  });

  it('retorna fechas created y expires validas', async () => {
    const credential = createMockCredential();
    const auth = new SatAuth(credential);

    const before = new Date();
    const token = await auth.authenticate();
    const after = new Date();

    expect(token.created.getTime()).toBeGreaterThanOrEqual(before.getTime() - 1000);
    expect(token.created.getTime()).toBeLessThanOrEqual(after.getTime() + 1000);

    // expires debe ser ~5 minutos despues de created
    const diffMs = token.expires.getTime() - token.created.getTime();
    expect(diffMs).toBe(5 * 60 * 1000);
  });

  it('el body SOAP enviado contiene el elemento Autentica', async () => {
    const credential = createMockCredential();
    const auth = new SatAuth(credential);

    await auth.authenticate();

    const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
    const body = options.body as string;
    expect(body).toContain('Autentica');
    expect(body).toContain('http://DescargaMasivaTerceros.gob.mx');
  });

  it('el body SOAP contiene el certificado en base64', async () => {
    const credential = createMockCredential();
    const auth = new SatAuth(credential);

    await auth.authenticate();

    const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
    const body = options.body as string;
    // El certificado fake "fakecertificate" en base64
    const expectedBase64 = Buffer.from('fakecertificate', 'utf8').toString('base64');
    expect(body).toContain(expectedBase64);
  });

  it('el body SOAP contiene BinarySecurityToken', async () => {
    const credential = createMockCredential();
    const auth = new SatAuth(credential);

    await auth.authenticate();

    const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
    const body = options.body as string;
    expect(body).toContain('BinarySecurityToken');
  });

  it('lanza error si el SAT responde con status de error', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response('Internal Server Error', { status: 500 })
    );

    const credential = createMockCredential();
    const auth = new SatAuth(credential);

    await expect(auth.authenticate()).rejects.toThrow('SAT auth request failed');
  });

  it('lanza error si la respuesta no contiene AutenticaResult', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response('<s:Envelope><s:Body></s:Body></s:Envelope>', {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })
    );

    const credential = createMockCredential();
    const auth = new SatAuth(credential);

    await expect(auth.authenticate()).rejects.toThrow(
      'No se pudo extraer el token'
    );
  });

  it('maneja namespace en AutenticaResult (prefijo)', async () => {
    const responseWithPrefix = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <d:AutenticaResponse xmlns:d="http://DescargaMasivaTerceros.gob.mx">
      <d:AutenticaResult>TOKEN_CON_PREFIJO</d:AutenticaResult>
    </d:AutenticaResponse>
  </s:Body>
</s:Envelope>`;

    fetchSpy.mockResolvedValueOnce(
      new Response(responseWithPrefix, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })
    );

    const credential = createMockCredential();
    const auth = new SatAuth(credential);

    const token = await auth.authenticate();
    expect(token.value).toBe('TOKEN_CON_PREFIJO');
  });
});
