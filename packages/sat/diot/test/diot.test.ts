import { describe, it, expect } from 'vitest';
import { buildDiotTxt } from '../src/builders/diot-txt';
import {
  DiotDeclaracion,
  TipoOperacion,
  TipoTercero,
} from '../src/types';

describe('TipoTercero y TipoOperacion', () => {
  it('conserva los valores de catálogo SAT esperados', () => {
    expect(TipoTercero.ProveedorNacional).toBe('04');
    expect(TipoTercero.ProveedorExtranjero).toBe('05');
    expect(TipoTercero.ProveedorGlobal).toBe('15');

    expect(TipoOperacion.ProfesionalesHonorarios).toBe('85');
    expect(TipoOperacion.Arrendamiento).toBe('06');
    expect(TipoOperacion.OtrosConIVA).toBe('03');
    expect(TipoOperacion.OtrosSinIVA).toBe('04');
  });
});

describe('buildDiotTxt', () => {
  it('genera líneas delimitadas por | con montos a 2 decimales', () => {
    const decl: DiotDeclaracion = {
      rfc: 'AAA010101AAA',
      ejercicio: 2025,
      periodo: 1,
      operaciones: [
        {
          tipoTercero: TipoTercero.ProveedorNacional,
          tipoOperacion: TipoOperacion.ProfesionalesHonorarios,
          rfc: 'BBA830831LJ4',
          montoIva16: 116.0,
          montoIva0: 0,
          montoExento: 0,
          montoRetenido: 10.5,
          montoIvaNoDeduc: 0,
        },
      ],
    };

    const txt = buildDiotTxt(decl);
    expect(txt).toBe(
      '04|85|BBA830831LJ4|||||116.00|0.00|0.00|10.50|0.00'
    );
  });

  it('rellena datos de proveedor extranjero distinto al nacional', () => {
    const decl: DiotDeclaracion = {
      rfc: 'AAA010101AAA',
      ejercicio: 2025,
      periodo: 3,
      operaciones: [
        {
          tipoTercero: TipoTercero.ProveedorExtranjero,
          tipoOperacion: TipoOperacion.OtrosConIVA,
          idFiscal: 'US-TAX-998877',
          nombreExtranjero: 'Cloud Services Inc',
          paisResidencia: 'USA',
          nacionalidad: 'US',
          montoIva16: 0,
          montoIva0: 1000,
          montoExento: 250.25,
          montoRetenido: 0,
          montoIvaNoDeduc: 0,
        },
      ],
    };

    const txt = buildDiotTxt(decl);
    expect(txt).toBe(
      '05|03||US-TAX-998877|Cloud Services Inc|USA|US|0.00|1000.00|250.25|0.00|0.00'
    );
  });

  it('rechaza montos con más de dos decimales', () => {
    const decl: DiotDeclaracion = {
      rfc: 'AAA010101AAA',
      ejercicio: 2025,
      periodo: 1,
      operaciones: [
        {
          tipoTercero: TipoTercero.ProveedorNacional,
          tipoOperacion: TipoOperacion.Arrendamiento,
          rfc: 'CCA010101CCC',
          montoIva16: 10.001,
          montoIva0: 0,
          montoExento: 0,
          montoRetenido: 0,
          montoIvaNoDeduc: 0,
        },
      ],
    };

    expect(() => buildDiotTxt(decl)).toThrow(/montoIva16/);
  });
});
