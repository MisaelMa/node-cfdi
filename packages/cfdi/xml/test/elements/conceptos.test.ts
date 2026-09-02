import { describe, it, expect, vi } from 'vitest';
import { Concepto } from '../../src/elements/Concepto';
import {
    ObjetoImpEnum,
  XmlConceptoAttributes,
  XmlConceptoTercerosAttributes,
  XmlConceptParteAttributes,
  XmlTranRentAttributesProperties,
} from '../../src/types';
import { ComlementTypeConcept } from '@cfdi/complementos/src';

/* vi.mock('@cfdi/xsd', () => ({
  Schema: {
    of: () => ({
      concepto: {
        concepto: {
          validate: vi.fn(),
        },
        terceros: {
          validate: vi.fn(),
        },
        predial: {
          validate: vi.fn(),
        },
        parte: {
          validate: vi.fn(),
        },
        informacionAduanera: {
          validate: vi.fn(),
        },
        traslado: {
          validate: vi.fn(),
        },
        retencion: {
          validate: vi.fn(),
        },
      },
    }),
  },
})); */

describe('Concepto', () => {
  it('debería crear una instancia de Concepto con los atributos dados', () => {
    const conceptoAttributes: XmlConceptoAttributes = {
      ClaveProdServ: '01010101',
      NoIdentificacion: '12345',
      Cantidad: '1',
      ClaveUnidad: 'H87',
      Unidad: 'Pieza',
      Descripcion: 'Producto de prueba',
      ValorUnitario: '100.00',
      Importe: '100.00',
      ObjetoImp: ObjetoImpEnum.NoobjetoDeimpuesto,
      Descuento: '10.00',
    };
    const concepto = new Concepto(conceptoAttributes);
    expect(concepto.getConcept()._attributes).toEqual({
      ...conceptoAttributes
    });
  });

  it('debería agregar un complemento', () => {
    const conceptoAttributes: XmlConceptoAttributes = {
      ClaveProdServ: '01010101',
      NoIdentificacion: '12345',
      Cantidad: '1',
      ClaveUnidad: 'H87',
      Unidad: 'Pieza',
      Descripcion: 'Producto de prueba',
      ValorUnitario: '100.00',
      Importe: '100.00',
      ObjetoImp: ObjetoImpEnum.NoobjetoDeimpuesto,
    };
    const concepto = new Concepto(conceptoAttributes);
    const complementoMock: ComlementTypeConcept = {
      getComplement: () => ({
        complement: {},
        key: 'testKey',
        schemaLocation: ['http://example.com/schema'],
        xmlns: 'http://example.com/xmlns',
        xmlnskey: 'testXmlnsKey',
      }),
    };
    concepto.complemento(complementoMock);
    expect(concepto.isComplement()).toBe(true);
    expect(concepto.getComplementProperties()).toEqual({
      key: 'testKey',
      xmlns: 'http://example.com/xmlns',
      xmlnskey: 'testXmlnsKey',
      schemaLocation: ['http://example.com/schema'],
    });
  });

  it('debería agregar información de terceros', () => {
    const conceptoAttributes: XmlConceptoAttributes = {
      ClaveProdServ: '01010101',
      NoIdentificacion: '12345',
      Cantidad: '1',
      ClaveUnidad: 'H87',
      Unidad: 'Pieza',
      Descripcion: 'Producto de prueba',
      ValorUnitario: '100.00',
      Importe: '100.00',
      ObjetoImp: ObjetoImpEnum.NoobjetoDeimpuesto,
    };
    const concepto = new Concepto(conceptoAttributes);
    const tercerosAttributes: XmlConceptoTercerosAttributes = {
      RfcACuentaTerceros: 'XAXX010101000',
      NombreACuentaTerceros: 'Tercero Ejemplo',
      DomicilioFiscalACuentaTerceros: '54321',
      RegimenFiscalACuentaTerceros: '601',
    };
    concepto.terceros(tercerosAttributes);
    expect(concepto.getConcept()['cfdi:ACuentaTerceros']).toEqual({
      _attributes: tercerosAttributes,
    });
  });

  it('debería agregar información predial', () => {
    const conceptoAttributes: XmlConceptoAttributes = {
      ClaveProdServ: '01010101',
      NoIdentificacion: '12345',
      Cantidad: '1',
      ClaveUnidad: 'H87',
      Unidad: 'Pieza',
      Descripcion: 'Producto de prueba',
      ValorUnitario: '100.00',
      Importe: '100.00',
      ObjetoImp: ObjetoImpEnum.NoobjetoDeimpuesto,
    };
    const concepto = new Concepto(conceptoAttributes);
    concepto.predial('1234567890');
    expect(concepto.getConcept()['cfdi:CuentaPredial']).toEqual({
      _attributes: { Numero: '1234567890' },
    });
  });

  it('debería agregar una parte', () => {
    const conceptoAttributes: XmlConceptoAttributes = {
      ClaveProdServ: '01010101',
      NoIdentificacion: '12345',
      Cantidad: '1',
      ClaveUnidad: 'H87',
      Unidad: 'Pieza',
      Descripcion: 'Producto de prueba',
      ValorUnitario: '100.00',
      Importe: '100.00',
      ObjetoImp: ObjetoImpEnum.NoobjetoDeimpuesto,
    };
    const concepto = new Concepto(conceptoAttributes);
    const parteAttributes: XmlConceptParteAttributes = {
      ClaveProdServ: '01010101',
      NoIdentificacion: '54321',
      Cantidad: '2',
      Unidad: 'Pieza',
      Descripcion: 'Parte de prueba',
      ValorUnitario: '50.00',
      Importe: '100.00',
    };
    concepto.parte(parteAttributes);
    expect(concepto.getConcept()['cfdi:Parte']).toEqual({
      _attributes: {
        ...parteAttributes,
        Cantidad: 2,
        ValorUnitario: 50,
        Importe: 50,
      },
    });
  });

  it('debería agregar información aduanera a una parte', () => {
    const conceptoAttributes: XmlConceptoAttributes = {
      ClaveProdServ: '01010101',
      NoIdentificacion: '12345',
      Cantidad: '1',
      ClaveUnidad: 'H87',
      Unidad: 'Pieza',
      Descripcion: 'Producto de prueba',
      ValorUnitario: '100.00',
      Importe: '100.00',
      ObjetoImp: ObjetoImpEnum.SíObjetoDeImpuestoYNobligadoAlDesglose,
    };
    const concepto = new Concepto(conceptoAttributes);
    const parteAttributes: XmlConceptParteAttributes = {
      ClaveProdServ: '01010101',
      NoIdentificacion: '54321',
      Cantidad: '2',
      Unidad: 'Pieza',
      Descripcion: 'Parte de prueba',
      ValorUnitario: '50.00',
      Importe: '100.00',
    };
    concepto.parte(parteAttributes);
    concepto.setParteInformacionAduanera('15  48  0301 0001234');
    expect(concepto.getConcept()['cfdi:Parte']?.['cfdi:InformacionAduanera']).toContainEqual({
      _attributes: { NumeroPedimento: '15  48  0301 0001234' },
    });
  });

  it('debería agregar información aduanera a una parte', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const conceptoAttributes: XmlConceptoAttributes = {
      ClaveProdServ: '01010101',
      NoIdentificacion: '12345',
      Cantidad: '1',
      ClaveUnidad: 'H87',
      Unidad: 'Pieza',
      Descripcion: 'Producto de prueba',
      ValorUnitario: '100.00',
      Importe: '100.00',
      ObjetoImp: ObjetoImpEnum.SíObjetoDeImpuestoYNobligadoAlDesglose,
    };
    const concepto = new Concepto(conceptoAttributes);
    concepto.setParteInformacionAduanera('15  48  0301 0001234');
   
    expect(consoleSpy).toBeCalledWith("utilize primero parte");

    consoleSpy.mockRestore();
  });

  it('debería agregar información aduanera', () => {
    const conceptoAttributes: XmlConceptoAttributes = {
      ClaveProdServ: '01010101',
      NoIdentificacion: '12345',
      Cantidad: '1',
      ClaveUnidad: 'H87',
      Unidad: 'Pieza',
      Descripcion: 'Producto de prueba',
      ValorUnitario: '100.00',
      Importe: '100.00',
      ObjetoImp: ObjetoImpEnum.SíObjetoDeImpuesto,
    };
    const concepto = new Concepto(conceptoAttributes);
    concepto.InformacionAduanera('15  48  0301 0001234');
    expect(concepto.getConcept()['cfdi:InformacionAduanera']).toContainEqual({
      _attributes: { NumeroPedimento: '15  48  0301 0001234' },
    });
  });

  it('debería agregar un traslado', () => {
    const conceptoAttributes: XmlConceptoAttributes = {
      ClaveProdServ: '01010101',
      NoIdentificacion: '12345',
      Cantidad: '1',
      ClaveUnidad: 'H87',
      Unidad: 'Pieza',
      Descripcion: 'Producto de prueba',
      ValorUnitario: '100.00',
      Importe: '100.00',
      ObjetoImp: ObjetoImpEnum.SíObjetoDeImpuesto,
    };
    const concepto = new Concepto(conceptoAttributes);
    const trasladoPayload: XmlTranRentAttributesProperties & { Base: string | number } = {
      Base: '1000',
      Impuesto: '002',
      TipoFactor: 'Tasa',
      TasaOCuota: '0.160000',
      Importe: '160.00',
    };
    concepto.traslado(trasladoPayload);
    expect(concepto.getConcept()['cfdi:Impuestos']).toEqual(concepto.impuesto);
  });

  it('debería agregar una retención', () => {
    const conceptoAttributes: XmlConceptoAttributes = {
      ClaveProdServ: '01010101',
      NoIdentificacion: '12345',
      Cantidad: '1',
      ClaveUnidad: 'H87',
      Unidad: 'Pieza',
      Descripcion: 'Producto de prueba',
      ValorUnitario: '100.00',
      Importe: '100.00',
      ObjetoImp: ObjetoImpEnum.SíObjetoDeImpuesto,
    };
    const concepto = new Concepto(conceptoAttributes);
    const retencionPayload: XmlTranRentAttributesProperties & {
      Base: string | number;
      TasaOCuota: string | number;
      Importe: string | number;
    } = {
      Base: '1000',
      Impuesto: '001',
      TipoFactor: 'Tasa',
      TasaOCuota: '0.160000',
      Importe: '160.00',
    };
    concepto.retencion(retencionPayload);
    expect(concepto.getConcept()['cfdi:Impuestos']).toEqual(concepto.impuesto);
  });

  // Los tests de arriba verifican campo por campo. Este congela la FORMA
  // COMPLETA que devuelve `getConcept()` — la estructura `xml-js` que después
  // se serializa a XML. Sirve de documentación viva: si el shape cambia, el
  // snapshot falla y hay que decidir si el cambio es intencional.
  describe('forma del objeto que devuelve getConcept()', () => {
    const atributos: XmlConceptoAttributes = {
      ClaveProdServ: '01010101',
      NoIdentificacion: 'SKU-1',
      Cantidad: '2',
      ClaveUnidad: 'E48',
      Unidad: 'Unidad de servicio',
      Descripcion: 'Servicio de consultoría',
      ValorUnitario: '1000.00',
      Importe: '2000.00',
      Descuento: '0.00',
      ObjetoImp: ObjetoImpEnum.SíObjetoDeImpuesto,
    };

    it('concepto con traslado y retención', () => {
      const concepto = new Concepto(atributos);
      concepto.traslado({
        Base: '2000.00',
        Impuesto: '002',
        TipoFactor: 'Tasa',
        TasaOCuota: '0.160000',
        Importe: '320.00',
      });
      concepto.retencion({
        Base: '2000.00',
        Impuesto: '001',
        TipoFactor: 'Tasa',
        TasaOCuota: '0.100000',
        Importe: '200.00',
      });

      expect(concepto.getConcept()).toMatchInlineSnapshot(`
        {
          "_attributes": {
            "Cantidad": "2",
            "ClaveProdServ": "01010101",
            "ClaveUnidad": "E48",
            "Descripcion": "Servicio de consultoría",
            "Descuento": "0.00",
            "Importe": "2000.00",
            "NoIdentificacion": "SKU-1",
            "ObjetoImp": "02",
            "Unidad": "Unidad de servicio",
            "ValorUnitario": "1000.00",
          },
          "cfdi:Impuestos": {
            "cfdi:Retenciones": {
              "cfdi:Retencion": [
                {
                  "_attributes": {
                    "Base": "2000.00",
                    "Importe": "200.00",
                    "Impuesto": "001",
                    "TasaOCuota": "0.100000",
                    "TipoFactor": "Tasa",
                  },
                },
              ],
            },
            "cfdi:Traslados": {
              "cfdi:Traslado": [
                {
                  "_attributes": {
                    "Base": "2000.00",
                    "Importe": "320.00",
                    "Impuesto": "002",
                    "TasaOCuota": "0.160000",
                    "TipoFactor": "Tasa",
                  },
                },
              ],
            },
          },
        }
      `);
    });

    it('concepto SIN impuestos', () => {
      const concepto = new Concepto({
        ...atributos,
        ObjetoImp: ObjetoImpEnum.NoobjetoDeimpuesto,
      });

      expect(concepto.getConcept()).toMatchInlineSnapshot(`
        {
          "_attributes": {
            "Cantidad": "2",
            "ClaveProdServ": "01010101",
            "ClaveUnidad": "E48",
            "Descripcion": "Servicio de consultoría",
            "Descuento": "0.00",
            "Importe": "2000.00",
            "NoIdentificacion": "SKU-1",
            "ObjetoImp": "01",
            "Unidad": "Unidad de servicio",
            "ValorUnitario": "1000.00",
          },
        }
      `);
    });
  });
});