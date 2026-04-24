import { describe, it, expect } from 'vitest';
import { buildSoapRequest, formatTotal, parseSoapResponse } from '../src/soap';

// ---------------------------------------------------------------------------
// formatTotal
// ---------------------------------------------------------------------------
describe('formatTotal', () => {
  it('formatea un entero sin decimales', () => {
    expect(formatTotal('1000')).toBe('0000001000.000000');
  });

  it('formatea con dos decimales', () => {
    expect(formatTotal('1000.00')).toBe('0000001000.000000');
  });

  it('formatea con decimales parciales', () => {
    expect(formatTotal('250.5')).toBe('0000000250.500000');
  });

  it('formatea cero', () => {
    expect(formatTotal('0')).toBe('0000000000.000000');
  });

  it('formatea un monto grande', () => {
    expect(formatTotal('9999999999.999999')).toBe('9999999999.999999');
  });

  it('lanza error con un valor no numerico', () => {
    expect(() => formatTotal('abc')).toThrow('Total invalido');
  });
});

// ---------------------------------------------------------------------------
// buildSoapRequest
// ---------------------------------------------------------------------------
describe('buildSoapRequest', () => {
  const params = {
    rfcEmisor: 'AAA010101AAA',
    rfcReceptor: 'BBB020202BBB',
    total: '1000.00',
    uuid: 'CEE4BE01-ADFA-4DEB-8421-ADD60F0BEDAC',
  };

  it('genera un envelope SOAP valido', () => {
    const xml = buildSoapRequest(params);
    expect(xml).toContain('soap:Envelope');
    expect(xml).toContain('soap:Body');
    expect(xml).toContain('tem:Consulta');
    expect(xml).toContain('tem:expresionImpresa');
  });

  it('incluye el namespace de tempuri', () => {
    const xml = buildSoapRequest(params);
    expect(xml).toContain('xmlns:tem="http://tempuri.org/"');
  });

  it('incluye todos los parametros en la expresion impresa', () => {
    const xml = buildSoapRequest(params);
    expect(xml).toContain('re=AAA010101AAA');
    expect(xml).toContain('rr=BBB020202BBB');
    expect(xml).toContain('tt=0000001000.000000');
    expect(xml).toContain('id=CEE4BE01-ADFA-4DEB-8421-ADD60F0BEDAC');
  });

  it('envuelve la expresion en CDATA', () => {
    const xml = buildSoapRequest(params);
    expect(xml).toContain('<![CDATA[');
    expect(xml).toContain(']]>');
  });

  it('la expresion comienza con ?re=', () => {
    const xml = buildSoapRequest(params);
    expect(xml).toContain('<![CDATA[?re=');
  });
});

// ---------------------------------------------------------------------------
// parseSoapResponse - CFDI Vigente
// ---------------------------------------------------------------------------
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

const RESPONSE_NO_ENCONTRADO = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <ConsultaResponse xmlns="http://tempuri.org/">
      <ConsultaResult>
        <a:CodigoEstatus>N - 601: La expresión impresa proporcionada no es válida.</a:CodigoEstatus>
        <a:EsCancelable></a:EsCancelable>
        <a:Estado>No Encontrado</a:Estado>
        <a:EstatusCancelacion></a:EstatusCancelacion>
        <a:ValidacionEFOS></a:ValidacionEFOS>
      </ConsultaResult>
    </ConsultaResponse>
  </s:Body>
</s:Envelope>`;

const RESPONSE_SOAP_FAULT = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <s:Fault>
      <faultcode>s:Client</faultcode>
      <faultstring xml:lang="es-MX">Error en la peticion</faultstring>
    </s:Fault>
  </s:Body>
</s:Envelope>`;

describe('parseSoapResponse', () => {
  describe('CFDI Vigente', () => {
    it('extrae el codigo de estatus', () => {
      const result = parseSoapResponse(RESPONSE_VIGENTE);
      expect(result.codigoEstatus).toBe(
        'S - Comprobante obtenido satisfactoriamente.'
      );
    });

    it('extrae esCancelable', () => {
      const result = parseSoapResponse(RESPONSE_VIGENTE);
      expect(result.esCancelable).toBe('Cancelable con aceptación');
    });

    it('extrae el estado como Vigente', () => {
      const result = parseSoapResponse(RESPONSE_VIGENTE);
      expect(result.estado).toBe('Vigente');
    });

    it('estatusCancelacion vacio', () => {
      const result = parseSoapResponse(RESPONSE_VIGENTE);
      expect(result.estatusCancelacion).toBe('');
    });

    it('extrae validacionEFOS', () => {
      const result = parseSoapResponse(RESPONSE_VIGENTE);
      expect(result.validacionEFOS).toBe('200');
    });

    it('helper activo es true', () => {
      const result = parseSoapResponse(RESPONSE_VIGENTE);
      expect(result.activo).toBe(true);
    });

    it('helper cancelado es false', () => {
      const result = parseSoapResponse(RESPONSE_VIGENTE);
      expect(result.cancelado).toBe(false);
    });

    it('helper noEncontrado es false', () => {
      const result = parseSoapResponse(RESPONSE_VIGENTE);
      expect(result.noEncontrado).toBe(false);
    });
  });

  describe('CFDI Cancelado', () => {
    it('extrae el estado como Cancelado', () => {
      const result = parseSoapResponse(RESPONSE_CANCELADO);
      expect(result.estado).toBe('Cancelado');
    });

    it('extrae estatusCancelacion', () => {
      const result = parseSoapResponse(RESPONSE_CANCELADO);
      expect(result.estatusCancelacion).toBe('Cancelado sin aceptación');
    });

    it('helper activo es false', () => {
      const result = parseSoapResponse(RESPONSE_CANCELADO);
      expect(result.activo).toBe(false);
    });

    it('helper cancelado es true', () => {
      const result = parseSoapResponse(RESPONSE_CANCELADO);
      expect(result.cancelado).toBe(true);
    });

    it('helper noEncontrado es false', () => {
      const result = parseSoapResponse(RESPONSE_CANCELADO);
      expect(result.noEncontrado).toBe(false);
    });
  });

  describe('CFDI No Encontrado', () => {
    it('extrae el estado como No Encontrado', () => {
      const result = parseSoapResponse(RESPONSE_NO_ENCONTRADO);
      expect(result.estado).toBe('No Encontrado');
    });

    it('helper activo es false', () => {
      const result = parseSoapResponse(RESPONSE_NO_ENCONTRADO);
      expect(result.activo).toBe(false);
    });

    it('helper cancelado es false', () => {
      const result = parseSoapResponse(RESPONSE_NO_ENCONTRADO);
      expect(result.cancelado).toBe(false);
    });

    it('helper noEncontrado es true', () => {
      const result = parseSoapResponse(RESPONSE_NO_ENCONTRADO);
      expect(result.noEncontrado).toBe(true);
    });
  });

  describe('SOAP Fault', () => {
    it('lanza error cuando hay un SOAP Fault', () => {
      expect(() => parseSoapResponse(RESPONSE_SOAP_FAULT)).toThrow('SOAP Fault');
    });

    it('incluye el mensaje de faultstring en el error', () => {
      expect(() => parseSoapResponse(RESPONSE_SOAP_FAULT)).toThrow(
        'Error en la peticion'
      );
    });
  });
});
