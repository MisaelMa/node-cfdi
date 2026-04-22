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

describe('CfdiXsd - Receptor Integration Tests', () => {
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

  describe('XSD', () => {
    it('should get the XSD Receptor', async () => {
      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement('Receptor')) as XsdElement;

      const xsd = result?.xsd;
      console.log(JSON.stringify(xsd, null, 2));

      // Validar estructura del objeto XSD
      expect(xsd).toBeDefined();
      
      // Verificar estructura básica del schema
      expect(xsd['xs:schema']).toBeDefined();
      expect(xsd['xs:schema']['_attributes']).toBeDefined();
      
      // Verificar namespaces y atributos del schema
      const schemaAttrs = xsd['xs:schema']['_attributes'];
      expect(schemaAttrs['xmlns:cfdi']).toBe('http://www.sat.gob.mx/cfd/4');
      expect(schemaAttrs['xmlns:xs']).toBe('http://www.w3.org/2001/XMLSchema');
      expect(schemaAttrs['xmlns:catCFDI']).toBe('http://www.sat.gob.mx/sitio_internet/cfd/catalogos');
      expect(schemaAttrs['xmlns:tdCFDI']).toBe('http://www.sat.gob.mx/sitio_internet/cfd/tipoDatos/tdCFDI');
      expect(schemaAttrs['targetNamespace']).toBe('http://www.sat.gob.mx/cfd/4');
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
      
      // Verificar elemento Receptor
      expect(xsd['xs:schema']['xs:element']).toBeDefined();
      expect(xsd['xs:schema']['xs:element']['_attributes']).toEqual({
        name: 'Receptor',
      });

      // Verificar complexType y sus atributos
      expect(xsd['xs:schema']['xs:element']['xs:complexType']).toBeDefined();
      
      // Verificar atributos del complexType
      const attributes = xsd['xs:schema']['xs:element']['xs:complexType']['xs:attribute'];
      expect(Array.isArray(attributes)).toBe(true);
      expect(attributes.length).toBeGreaterThan(3); // Receptor tiene varios atributos
      
      // Verificar algunos atributos específicos del Receptor
      const attributeNames = attributes.map((attr: any) => attr._attributes.name);
      expect(attributeNames).toContain('Rfc');
      expect(attributeNames).toContain('Nombre');
      expect(attributeNames).toContain('DomicilioFiscalReceptor');
      expect(attributeNames).toContain('RegimenFiscalReceptor');
      expect(attributeNames).toContain('UsoCFDI');
      
      console.log('✅ XSD Receptor validation passed!');
      console.log('Found attributes:', attributeNames);
    });
  });

  describe('JsonSchema', () => {
    it('should get the JsonSchema Receptor', async () => {
      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement('Receptor')) as XsdElement;

      const res = await cfdiSchema.xsd2Json({
        ...catalogos,
        ...tipoDatos,
        Receptor: XMLUtils.toXsd(result?.xsd),
      });

      const jsonSchema = res['Receptor'].getJsonSchema();

      expect(jsonSchema).toBeDefined();
      expect(jsonSchema.type).toBe('object');
      
      // Verificar propiedades que no cambian
      expect(jsonSchema.$id).toBe('Receptor.json');
      expect(jsonSchema.$schema).toBe('http://json-schema.org/draft-07/schema#');
      
      // Usar regex para el title que contiene timestamp
      expect(jsonSchema.title).toMatch(/^This JSON Schema file was generated from Receptor on .*\.  For more information please see http:\/\/www\.xsd2jsonschema\.org$/);

      // Verificar required array para Receptor
      expect(jsonSchema.required).toContain('Rfc');
      expect(jsonSchema.required).toContain('Nombre');
      expect(jsonSchema.required).toContain('DomicilioFiscalReceptor');
      expect(jsonSchema.required).toContain('RegimenFiscalReceptor');
      expect(jsonSchema.required).toContain('UsoCFDI');

      // Verificar que properties existe y tiene las propiedades esperadas del Receptor
      expect(jsonSchema.properties).toBeDefined();
      expect(jsonSchema.properties).toEqual( {
        "Rfc": {
          "$ref": "tipoDatos.json#/definitions/t_RFC"
        },
        "Nombre": {
          "description": "Atributo requerido para registrar el nombre(s), primer apellido, segundo apellido, según corresponda, denominación o razón social del contribuyente, inscrito en el RFC, del receptor del comprobante.",
          "maxLength": 300,
          "minLength": 1,
          "pattern": "[^|]{1,300}",
          "type": "string"
        },
        "DomicilioFiscalReceptor": {
          "description": "Atributo requerido para registrar el código postal del domicilio fiscal del receptor del comprobante.",
          "maxLength": 5,
          "minLength": 5,
          "pattern": "[0-9]{5}",
          "type": "string"
        },
        "ResidenciaFiscal": {
          "$ref": "catalogos.json#/definitions/c_Pais"
        },
        "NumRegIdTrib": {
          "description": "Atributo condicional para expresar el número de registro de identidad fiscal del receptor cuando sea residente en el extranjero. Es requerido cuando se incluya el complemento de comercio exterior.",
          "maxLength": 40,
          "minLength": 1,
          "type": "string"
        },
        "RegimenFiscalReceptor": {
          "$ref": "catalogos.json#/definitions/c_RegimenFiscal"
        },
        "UsoCFDI": {
          "$ref": "catalogos.json#/definitions/c_UsoCFDI"
        }
      });

      console.log('✅ JsonSchema Receptor validation passed!');
      console.log(JSON.stringify(jsonSchema, null, 2));
    });
  });
}); 