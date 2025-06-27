import { describe, expect, it, test } from 'vitest';
import { XmlToJson } from '../src/xmlToJson';
import { CFDI } from '../src/cfdi';
import path from 'path';
import { Concepto } from '../src/cfdi/Concepto';

const files_path = path.resolve(__dirname, '..', '..', '..', 'files', 'xml');
const nameCFDI = '5E2D6AFF-2DD7-43D1-83D3-14C1ACA396D9.xml';
const xml = path.resolve(files_path, nameCFDI);
const cfdi = new CFDI(xml);
describe('CFDI Class ', () => {
  it('toObject', () => {
    expect(cfdi).toBeDefined();
    expect(cfdi.receptor).toEqual({
      Nombre: 'AMIR MISAEL MARIN',
      Rfc: 'XAXX010101000',
      UsoCFDI: 'G03',
    });
  });

  it('conceptos', () => {

    const xml = path.resolve(files_path,'conceptos.xml')
    const cfdi = new CFDI(xml);

    cfdi.conceptos.forEach((c) => {
        console.log(c.Descripcion);
        c.impuestos.data()
    })
  });
});
