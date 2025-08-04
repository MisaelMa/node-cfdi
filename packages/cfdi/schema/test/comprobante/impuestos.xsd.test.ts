import { describe, it, expect, beforeEach } from 'vitest';
import { CfdiXsd, XsdElement } from '../../src/cfdi.xsd';
import path from 'path';
import { XMLUtils } from '../../src/common/xml-utils';
import { CatalogProcess } from '../../src/catalogos.xsd';
import { TipoDatosXsd } from '../../src/tipo-datos.xsd';
import { CfdiSchema } from '../../src/schema.xsd';
import {
  CATALOGOS_NAMESPACE,
  CATALOGOS_SCHEMA_LOCATION,
  TIPO_DATOS_NAMESPACE,
  TIPO_DATOS_SCHEMA_LOCATION,
} from '../shared';

describe('CfdiXsd - Impuestos Integration Tests', () => {
  let cfdiXsd: CfdiXsd;
  let catalogProcess: CatalogProcess;
  let tipoDatosXsd: TipoDatosXsd;
  let cfdiSchema: CfdiSchema;
  // Ruta al archivo XSD real
  const realXsdPath = path.join(__dirname, '../../src/files/cfdv40.xsd');
  const tipoDatosXsdPath = path.join(__dirname, '../../src/files/tdCFDI.xsd');
  const catalogosXsdPath = path.join(__dirname, '../../src/files/catCFDI.xsd');

  beforeEach(() => {
    cfdiXsd = CfdiXsd.of();
    catalogProcess = CatalogProcess.of();
    tipoDatosXsd = TipoDatosXsd.of();
    cfdiSchema = CfdiSchema.of();
    cfdiXsd.setConfig({ source: realXsdPath });
    catalogProcess.setConfig({ source: catalogosXsdPath });
    tipoDatosXsd.setConfig({ source: tipoDatosXsdPath });
  });

  describe('XSD Impuestos', () => {
    it('should get the XSD Impuestos', async () => {
      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement(
        'comprobante_Impuestos',
        'key'
      )) as XsdElement;

      const xsd = result?.xsd;
      // Validar estructura del objeto XSD
      expect(xsd).toBeDefined();

      // Verificar estructura básica del schema
      expect(xsd['xs:schema']).toBeDefined();
      expect(xsd['xs:schema']['_attributes']).toBeDefined();

      // Verificar namespaces y atributos del schema
      const schemaAttrs = xsd['xs:schema']['_attributes'];
      expect(schemaAttrs['xmlns:cfdi']).toBe('http://www.sat.gob.mx/cfd/4');
      expect(schemaAttrs['xmlns:xs']).toBe('http://www.w3.org/2001/XMLSchema');
      expect(schemaAttrs['xmlns:catCFDI']).toBe(
        'http://www.sat.gob.mx/sitio_internet/cfd/catalogos'
      );
      expect(schemaAttrs['xmlns:tdCFDI']).toBe(
        'http://www.sat.gob.mx/sitio_internet/cfd/tipoDatos/tdCFDI'
      );
      expect(schemaAttrs['targetNamespace']).toBe(
        'http://www.sat.gob.mx/cfd/4'
      );
      expect(schemaAttrs['elementFormDefault']).toBe('qualified');
      expect(schemaAttrs['attributeFormDefault']).toBe('unqualified');

      // Verificar imports
      expect(xsd['xs:schema']['xs:import']).toBeDefined();
      expect(Array.isArray(xsd['xs:schema']['xs:import'])).toBe(true);
      expect(xsd['xs:schema']['xs:import']).toHaveLength(2);
      expect(xsd['xs:schema']['xs:import']).toContainEqual({
        _attributes: {
          namespace: CATALOGOS_NAMESPACE,
          schemaLocation: CATALOGOS_SCHEMA_LOCATION,
        },
      });
      expect(xsd['xs:schema']['xs:import']).toContainEqual({
        _attributes: {
          namespace: TIPO_DATOS_NAMESPACE,
          schemaLocation: TIPO_DATOS_SCHEMA_LOCATION,
        },
      });

      // Verificar elemento Impuestos
      expect(xsd['xs:schema']['xs:element']).toBeDefined();
      expect(xsd['xs:schema']['xs:element']['_attributes']).toEqual(
        expect.objectContaining({
          name: 'Impuestos',
        })
      );

      // Verificar complexType
      expect(xsd['xs:schema']['xs:element']['xs:complexType']).toBeDefined();
    });

    it('should get the JsonSchema Impuestos', async () => {
      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement(
        'comprobante_Impuestos',
        'key'
      )) as XsdElement;

      const res = await cfdiSchema.xsd2Json({
        ...catalogos,
        ...tipoDatos,
        Impuestos: XMLUtils.toXsd(result?.xsd),
      });

      const jsonSchema = res['Impuestos'].getJsonSchema();
      expect(jsonSchema).toBeDefined();
      expect(jsonSchema.type).toBe('object');

      // Verificar propiedades que no cambian
      expect(jsonSchema.$id).toBe('Impuestos.json');
      expect(jsonSchema.$schema).toBe(
        'http://json-schema.org/draft-07/schema#'
      );

      // Usar regex para el title que contiene timestamp
      expect(jsonSchema.title).toMatch(
        /^This JSON Schema file was generated from Impuestos on .*\.  For more information please see http:\/\/www\.xsd2jsonschema\.org$/
      );

      // Verificar que properties existe
      expect(jsonSchema.properties).toBeDefined();

      // Impuestos puede tener TotalImpuestosRetenidos y TotalImpuestosTrasladados
      if (jsonSchema.properties.TotalImpuestosRetenidos) {
        expect(jsonSchema.properties.TotalImpuestosRetenidos.$ref).toContain(
          'tipoDatos.json#/definitions/t_Importe'
        );
      }
      if (jsonSchema.properties.TotalImpuestosTrasladados) {
        expect(jsonSchema.properties.TotalImpuestosTrasladados.$ref).toContain(
          'tipoDatos.json#/definitions/t_Importe'
        );
      }
    });
  });

  describe('XSD Retenciones', () => {
    it('should get the XSD Retenciones', async () => {
      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement(
        'comprobante_Impuestos_Retenciones',
        'key'
      )) as XsdElement;

      const xsd = result?.xsd;

      // Validar estructura del objeto XSD
      expect(xsd).toBeDefined();

      // Verificar elemento Retenciones
      expect(xsd['xs:schema']['xs:element']).toBeDefined();
      expect(xsd['xs:schema']['xs:element']['_attributes']).toEqual(
        expect.objectContaining({
          name: 'Retenciones',
        })
      );

      // Verificar complexType
      expect(xsd['xs:schema']['xs:element']['xs:complexType']).toBeDefined();
    });

    it('should get the JsonSchema Retenciones', async () => {
      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement(
        'comprobante_Impuestos_Retenciones',
        'key'
      )) as XsdElement;

      const res = await cfdiSchema.xsd2Json({
        ...catalogos,
        ...tipoDatos,
        Retenciones: XMLUtils.toXsd(result?.xsd),
      });

      const jsonSchema = res['Retenciones'].getJsonSchema();

      expect(jsonSchema).toBeDefined();
      expect(jsonSchema.type).toBe('object');

      // Verificar propiedades que no cambian
      expect(jsonSchema.$id).toBe('Retenciones.json');
      expect(jsonSchema.$schema).toBe(
        'http://json-schema.org/draft-07/schema#'
      );
    });
  });

  describe('XSD Retencion', () => {
    it('should get the XSD Retencion', async () => {
      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement(
        'comprobante_Impuestos_Retenciones_Retencion',
        'key'
      )) as XsdElement;

      const xsd = result?.xsd;

      // Validar estructura del objeto XSD
      expect(xsd).toBeDefined();

      // Verificar elemento Retencion
      expect(xsd['xs:schema']['xs:element']).toBeDefined();
      expect(xsd['xs:schema']['xs:element']['_attributes']).toEqual(
        expect.objectContaining({
          name: 'Retencion',
        })
      );

      // Verificar complexType y sus atributos
      expect(xsd['xs:schema']['xs:element']['xs:complexType']).toBeDefined();

      // Verificar atributos del complexType
      const attributes =
        xsd['xs:schema']['xs:element']['xs:complexType']['xs:attribute'];
      expect(Array.isArray(attributes)).toBe(true);

      // Retencion debe tener atributos específicos
      const attributeNames = attributes.map(
        (attr: any) => attr._attributes.name
      );
      expect(attributeNames).toContain('Impuesto');
      expect(attributeNames).toContain('Importe');
    });

    it('should get the JsonSchema Retencion', async () => {
      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement(
        'comprobante_Impuestos_Retenciones_Retencion',
        'key'
      )) as XsdElement;

      const res = await cfdiSchema.xsd2Json({
        ...catalogos,
        ...tipoDatos,
        Retencion: XMLUtils.toXsd(result?.xsd),
      });

      const jsonSchema = res['Retencion'].getJsonSchema();

      expect(jsonSchema).toBeDefined();
      expect(jsonSchema.type).toBe('object');

      // Verificar required array para Retencion
      expect(jsonSchema.required).toContain('Impuesto');
      expect(jsonSchema.required).toContain('Importe');

      // Verificar que properties existe y tiene las propiedades esperadas
      expect(jsonSchema.properties).toBeDefined();
      expect(jsonSchema.properties.Impuesto).toBeDefined();
      expect(jsonSchema.properties.Importe).toBeDefined();

      // Verificar referencias específicas
      expect(jsonSchema.properties.Impuesto.$ref).toContain(
        'catalogos.json#/definitions/c_Impuesto'
      );
      expect(jsonSchema.properties.Importe.$ref).toContain(
        'tipoDatos.json#/definitions/t_Importe'
      );
    });
  });

  describe('XSD Traslados', () => {
    it('should get the XSD Traslados', async () => {
      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement(
        'comprobante_Impuestos_Traslados',
        'key'
      )) as XsdElement;

      const xsd = result?.xsd;

      // Validar estructura del objeto XSD
      expect(xsd).toBeDefined();

      // Verificar elemento Traslados
      expect(xsd['xs:schema']['xs:element']).toBeDefined();
      expect(xsd['xs:schema']['xs:element']['_attributes']).toEqual(
        expect.objectContaining({
          name: 'Traslados',
        })
      );

      // Verificar complexType
      expect(xsd['xs:schema']['xs:element']['xs:complexType']).toBeDefined();
    });

    it('should get the JsonSchema Traslados', async () => {
      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement(
        'comprobante_Impuestos_Traslados',
        'key'
      )) as XsdElement;

      const res = await cfdiSchema.xsd2Json({
        ...catalogos,
        ...tipoDatos,
        Traslados: XMLUtils.toXsd(result?.xsd),
      });

      const jsonSchema = res['Traslados'].getJsonSchema();

      expect(jsonSchema).toBeDefined();
      expect(jsonSchema.type).toBe('object');

      // Verificar propiedades que no cambian
      expect(jsonSchema.$id).toBe('Traslados.json');
      expect(jsonSchema.$schema).toBe(
        'http://json-schema.org/draft-07/schema#'
      );
    });
  });

  describe('XSD Traslado', () => {
    it('should get the XSD Traslado', async () => {
      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement(
        'comprobante_Impuestos_Traslados_Traslado',
        'key'
      )) as XsdElement;

      const xsd = result?.xsd;

      // Validar estructura del objeto XSD
      expect(xsd).toBeDefined();

      // Verificar elemento Traslado
      expect(xsd['xs:schema']['xs:element']).toBeDefined();
      expect(xsd['xs:schema']['xs:element']['_attributes']).toEqual(
        expect.objectContaining({
          name: 'Traslado',
        })
      );

      // Verificar complexType y sus atributos
      expect(xsd['xs:schema']['xs:element']['xs:complexType']).toBeDefined();

      // Verificar atributos del complexType
      const attributes =
        xsd['xs:schema']['xs:element']['xs:complexType']['xs:attribute'];
      expect(Array.isArray(attributes)).toBe(true);

      // Traslado debe tener atributos específicos
      const attributeNames = attributes.map(
        (attr: any) => attr._attributes.name
      );
      expect(attributeNames).toContain('Base');
      expect(attributeNames).toContain('Impuesto');
      expect(attributeNames).toContain('TipoFactor');
    });

    it('should get the JsonSchema Traslado', async () => {
      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement(
        'comprobante_Impuestos_Traslados_Traslado',
        'key'
      )) as XsdElement;

      const res = await cfdiSchema.xsd2Json({
        ...catalogos,
        ...tipoDatos,
        Traslado: XMLUtils.toXsd(result?.xsd),
      });

      const jsonSchema = res['Traslado'].getJsonSchema();

      expect(jsonSchema).toBeDefined();
      expect(jsonSchema.type).toBe('object');

      // Verificar required array para Traslado
      expect(jsonSchema.required).toContain('Base');
      expect(jsonSchema.required).toContain('Impuesto');
      expect(jsonSchema.required).toContain('TipoFactor');

      // Verificar que properties existe y tiene las propiedades esperadas
      expect(jsonSchema.properties).toBeDefined();
      expect(jsonSchema.properties.Base).toBeDefined();
      expect(jsonSchema.properties.Impuesto).toBeDefined();
      expect(jsonSchema.properties.TipoFactor).toBeDefined();

      // Verificar referencias específicas
      expect(jsonSchema.properties.Base.$ref).toContain(
        'tipoDatos.json#/definitions/t_Importe'
      );
      expect(jsonSchema.properties.Impuesto.$ref).toContain(
        'catalogos.json#/definitions/c_Impuesto'
      );
      expect(jsonSchema.properties.TipoFactor.$ref).toContain(
        'catalogos.json#/definitions/c_TipoFactor'
      );

      // Verificar propiedades opcionales si existen
      if (jsonSchema.properties.TasaOCuota) {
        expect(jsonSchema.properties.TasaOCuota).toEqual({
          description:
            'Atributo condicional para señalar el valor de la tasa o cuota del impuesto que se traslada por los conceptos amparados en el comprobante.',
          minimum: 0,
          type: 'number',
        });
      }
      if (jsonSchema.properties.Importe) {
        expect(jsonSchema.properties.Importe).toEqual({
          $ref: 'tipoDatos.json#/definitions/t_Importe',
        });
      }
    });
  });
});
