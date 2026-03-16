import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DescargaMasiva } from '../src/DescargaMasiva';
import {
  TipoSolicitud,
  TipoDescarga,
  EstadoSolicitud,
  type SatTokenLike,
  type CredentialLike,
} from '../src/types';

// ---------------------------------------------------------------------------
// Fixtures y mocks de infraestructura
// ---------------------------------------------------------------------------
const RFC = 'AAA010101AAA';
const ID_SOLICITUD = 'a3d08a33-d0d8-4f36-a857-ab4b2a5edc7c';
const ID_PAQUETE = 'a3d08a33-d0d8-4f36-a857-ab4b2a5edc7c_01';

const SOLICITUD_PARAMS = {
  rfcSolicitante: RFC,
  fechaInicio: '2024-01-01',
  fechaFin: '2024-01-31',
  tipoSolicitud: TipoSolicitud.CFDI,
  tipoDescarga: TipoDescarga.Emitidos,
};

/** Token SAT de prueba */
const mockToken: SatTokenLike = {
  value: '2024-01-01T00:00:00Z',
  created: new Date('2024-01-01T00:00:00Z'),
  expires: new Date('2024-01-01T00:08:00Z'),
};

/** Certificado fake en PEM */
const FAKE_PEM =
  '-----BEGIN CERTIFICATE-----\nMIIFbase64certdataABCDEFGHIJ==\n-----END CERTIFICATE-----';

/** Credencial FIEL de prueba (duck type) */
const mockCredential: CredentialLike = {
  certificate: {
    toDer: () => Buffer.from('fakecert'),
    toPem: () => FAKE_PEM,
  },
  sign: (_data: string) => 'base64signaturevalue==',
  rfc: () => RFC,
};

// ---------------------------------------------------------------------------
// Responses SOAP de prueba
// ---------------------------------------------------------------------------
const RESPONSE_SOLICITAR_OK = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <SolicitaDescargaResponse xmlns="http://DescargaMasivaTerceros.sat.gob.mx/">
      <SolicitaDescargaResult CodEstatus="5000"
                               IdSolicitud="${ID_SOLICITUD}"
                               Mensaje="Solicitud Aceptada"/>
    </SolicitaDescargaResponse>
  </s:Body>
</s:Envelope>`;

const RESPONSE_VERIFICAR_TERMINADA = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <VerificaSolicitudDescargaResponse xmlns="http://DescargaMasivaTerceros.sat.gob.mx/">
      <VerificaSolicitudDescargaResult CodEstatus="5000"
                                        EstadoSolicitud="3"
                                        NumeroCFDIs="50"
                                        Mensaje="Solicitud Terminada">
        <IdsPaquetes>${ID_PAQUETE}</IdsPaquetes>
      </VerificaSolicitudDescargaResult>
    </VerificaSolicitudDescargaResponse>
  </s:Body>
</s:Envelope>`;

const RESPONSE_VERIFICAR_EN_PROCESO = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <VerificaSolicitudDescargaResponse xmlns="http://DescargaMasivaTerceros.sat.gob.mx/">
      <VerificaSolicitudDescargaResult CodEstatus="5001"
                                        EstadoSolicitud="2"
                                        NumeroCFDIs="0"
                                        Mensaje="En proceso"/>
    </VerificaSolicitudDescargaResponse>
  </s:Body>
</s:Envelope>`;

const ZIP_CONTENT = Buffer.from('PK\x03\x04fake zip content for testing');
const ZIP_B64 = ZIP_CONTENT.toString('base64');

const RESPONSE_DESCARGAR_OK = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <PeticionDescargaMasivaTercerosSalida xmlns="http://DescargaMasivaTerceros.sat.gob.mx/">
      <Paquete>${ZIP_B64}</Paquete>
    </PeticionDescargaMasivaTercerosSalida>
  </s:Body>
</s:Envelope>`;

// ---------------------------------------------------------------------------
// Helpers de mock fetch
// ---------------------------------------------------------------------------
function mockFetchOk(body: string, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Internal Server Error',
    text: () => Promise.resolve(body),
  });
}

// ---------------------------------------------------------------------------
// Tests de DescargaMasiva
// ---------------------------------------------------------------------------
describe('DescargaMasiva', () => {
  let descarga: DescargaMasiva;

  beforeEach(() => {
    descarga = new DescargaMasiva(mockToken, mockCredential);
    vi.stubGlobal('fetch', undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // solicitar()
  // -------------------------------------------------------------------------
  describe('solicitar()', () => {
    it('retorna el idSolicitud cuando la respuesta es exitosa', async () => {
      vi.stubGlobal('fetch', mockFetchOk(RESPONSE_SOLICITAR_OK));

      const result = await descarga.solicitar(SOLICITUD_PARAMS);

      expect(result.idSolicitud).toBe(ID_SOLICITUD);
    });

    it('retorna el codEstatus de la respuesta', async () => {
      vi.stubGlobal('fetch', mockFetchOk(RESPONSE_SOLICITAR_OK));

      const result = await descarga.solicitar(SOLICITUD_PARAMS);

      expect(result.codEstatus).toBe('5000');
    });

    it('retorna el mensaje de la respuesta', async () => {
      vi.stubGlobal('fetch', mockFetchOk(RESPONSE_SOLICITAR_OK));

      const result = await descarga.solicitar(SOLICITUD_PARAMS);

      expect(result.mensaje).toBe('Solicitud Aceptada');
    });

    it('llama a fetch con POST a la URL de solicitar', async () => {
      const fetchMock = mockFetchOk(RESPONSE_SOLICITAR_OK);
      vi.stubGlobal('fetch', fetchMock);

      await descarga.solicitar(SOLICITUD_PARAMS);

      expect(fetchMock).toHaveBeenCalledOnce();
      const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe(
        'https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/SolicitaDescargaService.svc'
      );
    });

    it('envia el Content-Type text/xml en la peticion', async () => {
      const fetchMock = mockFetchOk(RESPONSE_SOLICITAR_OK);
      vi.stubGlobal('fetch', fetchMock);

      await descarga.solicitar(SOLICITUD_PARAMS);

      const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(
        (options.headers as Record<string, string>)['Content-Type']
      ).toContain('text/xml');
    });

    it('envia el SOAPAction correcto', async () => {
      const fetchMock = mockFetchOk(RESPONSE_SOLICITAR_OK);
      vi.stubGlobal('fetch', fetchMock);

      await descarga.solicitar(SOLICITUD_PARAMS);

      const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(
        (options.headers as Record<string, string>)['SOAPAction']
      ).toContain('SolicitaDescarga');
    });

    it('el body contiene el RFC solicitante', async () => {
      const fetchMock = mockFetchOk(RESPONSE_SOLICITAR_OK);
      vi.stubGlobal('fetch', fetchMock);

      await descarga.solicitar(SOLICITUD_PARAMS);

      const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(options.body as string).toContain(RFC);
    });

    it('el body contiene la fecha de inicio', async () => {
      const fetchMock = mockFetchOk(RESPONSE_SOLICITAR_OK);
      vi.stubGlobal('fetch', fetchMock);

      await descarga.solicitar(SOLICITUD_PARAMS);

      const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(options.body as string).toContain('2024-01-01');
    });

    it('lanza error cuando HTTP retorna status de error', async () => {
      vi.stubGlobal('fetch', mockFetchOk('Error', 500));

      await expect(descarga.solicitar(SOLICITUD_PARAMS)).rejects.toThrow(
        'HTTP 500'
      );
    });

    it('lanza error cuando hay un error de red', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValue(new Error('ECONNREFUSED'))
      );

      await expect(descarga.solicitar(SOLICITUD_PARAMS)).rejects.toThrow(
        'Error de red'
      );
    });

    it('lanza error de timeout cuando fetch es abortado', async () => {
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortError));

      await expect(descarga.solicitar(SOLICITUD_PARAMS)).rejects.toThrow(
        'Timeout'
      );
    });
  });

  // -------------------------------------------------------------------------
  // verificar()
  // -------------------------------------------------------------------------
  describe('verificar()', () => {
    it('retorna estado Terminada (3) cuando la solicitud esta lista', async () => {
      vi.stubGlobal('fetch', mockFetchOk(RESPONSE_VERIFICAR_TERMINADA));

      const result = await descarga.verificar(ID_SOLICITUD);

      expect(result.estado).toBe(EstadoSolicitud.Terminada);
    });

    it('retorna la descripcion del estado', async () => {
      vi.stubGlobal('fetch', mockFetchOk(RESPONSE_VERIFICAR_TERMINADA));

      const result = await descarga.verificar(ID_SOLICITUD);

      expect(result.estadoDescripcion).toBe('Terminada');
    });

    it('retorna los idsPaquetes cuando la solicitud esta terminada', async () => {
      vi.stubGlobal('fetch', mockFetchOk(RESPONSE_VERIFICAR_TERMINADA));

      const result = await descarga.verificar(ID_SOLICITUD);

      expect(result.idsPaquetes).toContain(ID_PAQUETE);
    });

    it('retorna el numero de CFDIs', async () => {
      vi.stubGlobal('fetch', mockFetchOk(RESPONSE_VERIFICAR_TERMINADA));

      const result = await descarga.verificar(ID_SOLICITUD);

      expect(result.numeroCfdis).toBe(50);
    });

    it('retorna estado EnProceso (2) cuando todavia procesa', async () => {
      vi.stubGlobal('fetch', mockFetchOk(RESPONSE_VERIFICAR_EN_PROCESO));

      const result = await descarga.verificar(ID_SOLICITUD);

      expect(result.estado).toBe(EstadoSolicitud.EnProceso);
    });

    it('retorna lista vacia de paquetes cuando esta en proceso', async () => {
      vi.stubGlobal('fetch', mockFetchOk(RESPONSE_VERIFICAR_EN_PROCESO));

      const result = await descarga.verificar(ID_SOLICITUD);

      expect(result.idsPaquetes).toHaveLength(0);
    });

    it('llama a fetch con POST a la URL de verificar', async () => {
      const fetchMock = mockFetchOk(RESPONSE_VERIFICAR_TERMINADA);
      vi.stubGlobal('fetch', fetchMock);

      await descarga.verificar(ID_SOLICITUD);

      const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe(
        'https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/VerificaSolicitudDescargaService.svc'
      );
    });

    it('el body contiene el IdSolicitud', async () => {
      const fetchMock = mockFetchOk(RESPONSE_VERIFICAR_TERMINADA);
      vi.stubGlobal('fetch', fetchMock);

      await descarga.verificar(ID_SOLICITUD);

      const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(options.body as string).toContain(ID_SOLICITUD);
    });

    it('lanza error cuando HTTP retorna status de error', async () => {
      vi.stubGlobal('fetch', mockFetchOk('Error', 500));

      await expect(descarga.verificar(ID_SOLICITUD)).rejects.toThrow('HTTP 500');
    });
  });

  // -------------------------------------------------------------------------
  // descargar()
  // -------------------------------------------------------------------------
  describe('descargar()', () => {
    it('retorna el ZIP como Buffer', async () => {
      vi.stubGlobal('fetch', mockFetchOk(RESPONSE_DESCARGAR_OK));

      const result = await descarga.descargar(ID_PAQUETE);

      expect(Buffer.isBuffer(result)).toBe(true);
    });

    it('el Buffer contiene el contenido correcto del ZIP', async () => {
      vi.stubGlobal('fetch', mockFetchOk(RESPONSE_DESCARGAR_OK));

      const result = await descarga.descargar(ID_PAQUETE);

      expect(result).toEqual(ZIP_CONTENT);
    });

    it('llama a fetch con POST a la URL de descargar', async () => {
      const fetchMock = mockFetchOk(RESPONSE_DESCARGAR_OK);
      vi.stubGlobal('fetch', fetchMock);

      await descarga.descargar(ID_PAQUETE);

      const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe(
        'https://cfdidescargamasiva.clouda.sat.gob.mx/DescargaMasivaService.svc'
      );
    });

    it('el body contiene el IdPaquete', async () => {
      const fetchMock = mockFetchOk(RESPONSE_DESCARGAR_OK);
      vi.stubGlobal('fetch', fetchMock);

      await descarga.descargar(ID_PAQUETE);

      const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(options.body as string).toContain(ID_PAQUETE);
    });

    it('envia el SOAPAction correcto para descarga', async () => {
      const fetchMock = mockFetchOk(RESPONSE_DESCARGAR_OK);
      vi.stubGlobal('fetch', fetchMock);

      await descarga.descargar(ID_PAQUETE);

      const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(
        (options.headers as Record<string, string>)['SOAPAction']
      ).toContain('Descargar');
    });

    it('lanza error cuando HTTP retorna status de error', async () => {
      vi.stubGlobal('fetch', mockFetchOk('Error', 500));

      await expect(descarga.descargar(ID_PAQUETE)).rejects.toThrow('HTTP 500');
    });
  });

  // -------------------------------------------------------------------------
  // Flujo completo (los 3 pasos)
  // -------------------------------------------------------------------------
  describe('flujo completo de descarga masiva', () => {
    it('ejecuta los 3 pasos en orden y retorna el ZIP', async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          text: () => Promise.resolve(RESPONSE_SOLICITAR_OK),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          text: () => Promise.resolve(RESPONSE_VERIFICAR_TERMINADA),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          text: () => Promise.resolve(RESPONSE_DESCARGAR_OK),
        });

      vi.stubGlobal('fetch', fetchMock);

      const solicitud = await descarga.solicitar(SOLICITUD_PARAMS);
      expect(solicitud.idSolicitud).toBe(ID_SOLICITUD);

      const verificacion = await descarga.verificar(solicitud.idSolicitud);
      expect(verificacion.estado).toBe(EstadoSolicitud.Terminada);
      expect(verificacion.idsPaquetes).toHaveLength(1);

      const zip = await descarga.descargar(verificacion.idsPaquetes[0]);
      expect(Buffer.isBuffer(zip)).toBe(true);
      expect(zip).toEqual(ZIP_CONTENT);

      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it('las 3 llamadas van a URLs diferentes del SAT', async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          text: () => Promise.resolve(RESPONSE_SOLICITAR_OK),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          text: () => Promise.resolve(RESPONSE_VERIFICAR_TERMINADA),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
          text: () => Promise.resolve(RESPONSE_DESCARGAR_OK),
        });

      vi.stubGlobal('fetch', fetchMock);

      await descarga.solicitar(SOLICITUD_PARAMS);
      await descarga.verificar(ID_SOLICITUD);
      await descarga.descargar(ID_PAQUETE);

      const urls = fetchMock.mock.calls.map(
        (call: [string, RequestInit]) => call[0]
      );

      expect(urls[0]).toContain('SolicitaDescargaService.svc');
      expect(urls[1]).toContain('VerificaSolicitudDescargaService.svc');
      expect(urls[2]).toContain('DescargaMasivaService.svc');
    });
  });
});

// ---------------------------------------------------------------------------
// Tests de EstadoSolicitud enum
// ---------------------------------------------------------------------------
describe('EstadoSolicitud', () => {
  it('Aceptada tiene valor 1', () => {
    expect(EstadoSolicitud.Aceptada).toBe(1);
  });

  it('EnProceso tiene valor 2', () => {
    expect(EstadoSolicitud.EnProceso).toBe(2);
  });

  it('Terminada tiene valor 3', () => {
    expect(EstadoSolicitud.Terminada).toBe(3);
  });

  it('Error tiene valor 4', () => {
    expect(EstadoSolicitud.Error).toBe(4);
  });

  it('Rechazada tiene valor 5', () => {
    expect(EstadoSolicitud.Rechazada).toBe(5);
  });

  it('Vencida tiene valor 6', () => {
    expect(EstadoSolicitud.Vencida).toBe(6);
  });
});
