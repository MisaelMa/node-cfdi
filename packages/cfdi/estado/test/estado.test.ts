import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { consultarEstado } from '../src/consultarEstado';

const RESPONSE_VIGENTE = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <ConsultaResponse xmlns="http://tempuri.org/">
      <ConsultaResult>
        <a:CodigoEstatus>S - Comprobante obtenido satisfactoriamente.</a:CodigoEstatus>
        <a:EsCancelable>Cancelable con aceptación</a:EsCancelable>
        <a:Estado>Vigente</a:Estado>
        <a:EstatusCancelacion></a:EstatusCancelacion>
        <a:ValidacionEFOS>200</a:ValidacionEFOS>
      </ConsultaResult>
    </ConsultaResponse>
  </s:Body>
</s:Envelope>`;

const RESPONSE_CANCELADO = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <ConsultaResponse xmlns="http://tempuri.org/">
      <ConsultaResult>
        <a:CodigoEstatus>S - Comprobante obtenido satisfactoriamente.</a:CodigoEstatus>
        <a:EsCancelable>No cancelable</a:EsCancelable>
        <a:Estado>Cancelado</a:Estado>
        <a:EstatusCancelacion>Cancelado sin aceptación</a:EstatusCancelacion>
        <a:ValidacionEFOS>200</a:ValidacionEFOS>
      </ConsultaResult>
    </ConsultaResponse>
  </s:Body>
</s:Envelope>`;

const PARAMS = {
  rfcEmisor: 'AAA010101AAA',
  rfcReceptor: 'BBB020202BBB',
  total: '1000.00',
  uuid: 'CEE4BE01-ADFA-4DEB-8421-ADD60F0BEDAC',
};

function mockFetchOk(body: string, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    text: () => Promise.resolve(body),
  });
}

describe('consultarEstado', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retorna resultado vigente cuando el SAT responde correctamente', async () => {
    vi.stubGlobal('fetch', mockFetchOk(RESPONSE_VIGENTE));

    const result = await consultarEstado(PARAMS);

    expect(result.estado).toBe('Vigente');
    expect(result.activo).toBe(true);
    expect(result.cancelado).toBe(false);
    expect(result.noEncontrado).toBe(false);
    expect(result.codigoEstatus).toBe(
      'S - Comprobante obtenido satisfactoriamente.'
    );
    expect(result.validacionEFOS).toBe('200');
  });

  it('retorna resultado cancelado cuando el CFDI esta cancelado', async () => {
    vi.stubGlobal('fetch', mockFetchOk(RESPONSE_CANCELADO));

    const result = await consultarEstado(PARAMS);

    expect(result.estado).toBe('Cancelado');
    expect(result.activo).toBe(false);
    expect(result.cancelado).toBe(true);
    expect(result.noEncontrado).toBe(false);
    expect(result.estatusCancelacion).toBe('Cancelado sin aceptación');
  });

  it('llama a fetch con el Content-Type correcto', async () => {
    const fetchMock = mockFetchOk(RESPONSE_VIGENTE);
    vi.stubGlobal('fetch', fetchMock);

    await consultarEstado(PARAMS);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((options.headers as Record<string, string>)['Content-Type']).toBe(
      'text/xml; charset=utf-8'
    );
  });

  it('llama a fetch con el SOAPAction correcto', async () => {
    const fetchMock = mockFetchOk(RESPONSE_VIGENTE);
    vi.stubGlobal('fetch', fetchMock);

    await consultarEstado(PARAMS);

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((options.headers as Record<string, string>)['SOAPAction']).toBe(
      'http://tempuri.org/IConsultaCFDIService/Consulta'
    );
  });

  it('llama a fetch con el metodo POST', async () => {
    const fetchMock = mockFetchOk(RESPONSE_VIGENTE);
    vi.stubGlobal('fetch', fetchMock);

    await consultarEstado(PARAMS);

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(options.method).toBe('POST');
  });

  it('llama a la URL correcta del webservice del SAT', async () => {
    const fetchMock = mockFetchOk(RESPONSE_VIGENTE);
    vi.stubGlobal('fetch', fetchMock);

    await consultarEstado(PARAMS);

    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      'https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc'
    );
  });

  it('lanza error cuando HTTP retorna un status de error', async () => {
    vi.stubGlobal('fetch', mockFetchOk('Internal Server Error', 500));

    await expect(consultarEstado(PARAMS)).rejects.toThrow('HTTP 500');
  });

  it('lanza error cuando hay un error de red', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('ECONNREFUSED'))
    );

    await expect(consultarEstado(PARAMS)).rejects.toThrow(
      'Error de red al consultar el estado del CFDI'
    );
  });

  it('lanza error de timeout cuando fetch es abortado', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortError));

    await expect(consultarEstado(PARAMS)).rejects.toThrow('Timeout');
  });

  it('el body del SOAP contiene los RFC y UUID correctos', async () => {
    const fetchMock = mockFetchOk(RESPONSE_VIGENTE);
    vi.stubGlobal('fetch', fetchMock);

    await consultarEstado(PARAMS);

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = options.body as string;
    expect(body).toContain('re=AAA010101AAA');
    expect(body).toContain('rr=BBB020202BBB');
    expect(body).toContain('id=CEE4BE01-ADFA-4DEB-8421-ADD60F0BEDAC');
    expect(body).toContain('tt=0000001000.000000');
  });
});
