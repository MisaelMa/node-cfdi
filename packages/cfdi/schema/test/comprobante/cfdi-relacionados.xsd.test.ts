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

describe('CfdiXsd - CfdiRelacionados Integration Tests', () => {
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

  describe('XSD CfdiRelacionados', () => {
    it('should get the XSD CfdiRelacionados', async () => {
      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement(
        'CfdiRelacionados'
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

      // Verificar elemento CfdiRelacionados
      expect(xsd['xs:schema']['xs:element']).toBeDefined();
      expect(xsd['xs:schema']['xs:element']['_attributes']).toEqual({
        maxOccurs: 'unbounded',
        minOccurs: '0',
        name: 'CfdiRelacionados',
      });

      // Verificar complexType
      expect(xsd['xs:schema']['xs:element']['xs:complexType']).toBeDefined();

    });
    it('should get the JsonSchema CfdiRelacionados', async () => {
      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement(
        'CfdiRelacionados'
      )) as XsdElement;

      const res = await cfdiSchema.xsd2Json({
        ...catalogos,
        ...tipoDatos,
        CfdiRelacionados: XMLUtils.toXsd(result?.xsd),
      });

      const jsonSchema = res['CfdiRelacionados'].getJsonSchema();

      expect(jsonSchema).toBeDefined();
      expect(jsonSchema.type).toBe('object');

      // Verificar propiedades que no cambian
      expect(jsonSchema.$id).toBe('CfdiRelacionados.json');
      expect(jsonSchema.$schema).toBe(
        'http://json-schema.org/draft-07/schema#'
      );

      // Usar regex para el title que contiene timestamp
      expect(jsonSchema.title).toMatch(
        /^This JSON Schema file was generated from CfdiRelacionados on .*\.  For more information please see http:\/\/www\.xsd2jsonschema\.org$/
      );

      // Verificar required array para CfdiRelacionados
      expect(jsonSchema.required).toContain('TipoRelacion');

      // Verificar que properties existe y tiene las propiedades esperadas
      expect(jsonSchema.properties).toBeDefined();
      expect(jsonSchema.properties).toEqual({
        "TipoRelacion": {
          "$ref": "catalogos.json#/definitions/c_TipoRelacion"
        }
      });

     
    });
  });

  describe('XSD CfdiRelacionado', () => {
    it('should get the XSD CfdiRelacionado', async () => {
      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement(
        'CfdiRelacionado'
      )) as XsdElement;

      const xsd = result?.xsd;

      // Validar estructura del objeto XSD
      expect(xsd).toBeDefined();

      // Verificar estructura básica del schema
      expect(xsd['xs:schema']).toBeDefined();
      expect(xsd['xs:schema']['_attributes']).toBeDefined();

      // Verificar elemento CfdiRelacionado
      expect(xsd['xs:schema']['xs:element']).toBeDefined();
      expect(xsd['xs:schema']['xs:element']['_attributes']).toEqual({
        maxOccurs: 'unbounded',
        name: 'CfdiRelacionado',
      });

      // Verificar complexType y sus atributos
      expect(xsd['xs:schema']['xs:element']['xs:complexType']).toBeDefined();

      // Verificar atributos del complexType
      const attributes =
        xsd['xs:schema']['xs:element']['xs:complexType']['xs:attribute'];

      // CfdiRelacionado debe tener el atributo UUID

    });

    it('should get the JsonSchema CfdiRelacionado', async () => {
      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement(
        'CfdiRelacionado'
      )) as XsdElement;

      const res = await cfdiSchema.xsd2Json({
        ...catalogos,
        ...tipoDatos,
        CfdiRelacionado: XMLUtils.toXsd(result?.xsd),
      });

      const jsonSchema = res['CfdiRelacionado'].getJsonSchema();

      expect(jsonSchema).toBeDefined();
      expect(jsonSchema.type).toBe('object');

      // Verificar propiedades que no cambian
      expect(jsonSchema.$id).toBe('CfdiRelacionado.json');
      expect(jsonSchema.$schema).toBe(
        'http://json-schema.org/draft-07/schema#'
      );

      // Usar regex para el title que contiene timestamp
      expect(jsonSchema.title).toMatch(
        /^This JSON Schema file was generated from CfdiRelacionado on .*\.  For more information please see http:\/\/www\.xsd2jsonschema\.org$/
      );

      // Verificar required array para CfdiRelacionado
      expect(jsonSchema.required).toContain('UUID');

      // Verificar que properties existe y tiene las propiedades esperadas
      expect(jsonSchema.properties).toBeDefined();
      expect(jsonSchema.properties).toEqual({
        "UUID": {
          "description": "Atributo requerido para registrar el folio fiscal (UUID) de un CFDI relacionado con el presente comprobante, por ejemplo: Si el CFDI relacionado es un comprobante de traslado que sirve para registrar el movimiento de la mercancía. Si este comprobante se usa como nota de crédito o nota de débito del comprobante relacionado. Si este comprobante es una devolución sobre el comprobante relacionado. Si éste sustituye a una factura cancelada.",
          "maxLength": 36,
          "minLength": 36,
          "pattern": "[a-f0-9A-F]{8}-[a-f0-9A-F]{4}-[a-f0-9A-F]{4}-[a-f0-9A-F]{4}-[a-f0-9A-F]{12}",
          "type": "string"
        }
      });

   
    });
  });
});
