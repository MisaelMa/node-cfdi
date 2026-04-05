import { describe, expect, it, test } from 'vitest';
import { XmlToJson } from '../src/xmlToJson';
import path from 'path';

const files_path = path.resolve(__dirname, '..', '..', '..', 'files', 'xml');

describe('impuestos to json', () => {
  it('traslados', () => {
    const xml = path.resolve(files_path, 'un-impuesto.xml');
    const json = XmlToJson(xml);
    //console.log('json', JSON.stringify(json, null, 2));
    expect(json).toBeDefined();

    expect(json).toEqual({
      Comprobante: {
        Impuestos: {
          TotalImpuestosTrasladados: '31.72',
          Traslados: [
            {
              Impuesto: '002',
              TipoFactor: 'Tasa',
              TasaOCuota: '0.160000',
              Importe: '31.72',
            },
          ],
          Retenciones: [
            {
              Importe: '2.00',
              Impuesto: '004',
            },
          ],
        },
      },
    });
  });

  it('dos traslados', () => {
    const xml = path.resolve(files_path, 'dos-impuestos.xml');
    const json = XmlToJson(xml);

    expect(json).toBeDefined();

    expect(json).toEqual({
      Comprobante: {
        Impuestos: {
          TotalImpuestosTrasladados: '31.72',
          Traslados: [
            {
              Impuesto: '002',
              TipoFactor: 'Tasa',
              TasaOCuota: '0.160000',
              Importe: '31.72',
            },
            {
              Impuesto: '002',
              TipoFactor: 'Tasa',
              TasaOCuota: '0.160000',
              Importe: '31.72',
            },
          ],
          Retenciones: [
            {
              Impuesto: '002',
              Importe: '1.00',
            },
            {
              Impuesto: '002',
              Importe: '1.00',
            },
          ],
        },
      },
    });
  });
});
