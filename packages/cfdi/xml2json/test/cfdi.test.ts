import { describe, expect, it, test } from 'vitest';
import { XmlToJson } from '../src/xmlToJson';
import path from 'path';

const files_path = path.resolve(__dirname, '..', '..', '..', 'files', 'xml');

describe('CFDI', () => {
  it('json', () => {
    const xml = path.resolve(
      files_path,
      '5E2D6AFF-2DD7-43D1-83D3-14C1ACA396D9.xml'
    );
    const json = XmlToJson(xml, { original: false, compact: true });
    //console.log(JSON.stringify(json, null, 2))
    expect(json).toBeDefined();
  });

  it('Emisor & Receptor', () => {
    const xml = path.resolve(files_path, 'emisor-receptor.xml');
    const json = XmlToJson(xml, { original: false, compact: false });
    expect(json).toBeDefined();

    expect(json).toEqual({
      Comprobante: {
        Emisor: {
          Nombre: 'ESCUELA KEMPER URGATE',
          RegimenFiscal: '603',
          Rfc: 'EKU9003173C9',
        },
        Receptor: {
          DomicilioFiscalReceptor: '36257',
          Nombre: 'XOCHILT CASAS CHAVEZ',
          RegimenFiscalReceptor: '612',
          Rfc: 'CACX7605101P8',
          UsoCFDI: "G03",
        },
      },
    });
  });
});
