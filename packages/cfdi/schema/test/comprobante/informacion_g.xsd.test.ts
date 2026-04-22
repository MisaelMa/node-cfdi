import { describe, it, expect, beforeEach } from 'vitest';
import { CfdiXsd, XsdElement } from '../../src/cfdi.xsd';
import path from 'path';
import { XMLUtils } from '../../src/common/xml-utils';
import { CatalogProcess } from '../../src/catalogos.xsd';
import { TipoDatosXsd } from '../../src/tipo-datos.xsd';
import { CfdiSchema } from '../../src/schema.xsd';
const CATALOGOS_NAMESPACE =
  'http://www.sat.gob.mx/sitio_internet/cfd/catalogos';
const TIPO_DATOS_NAMESPACE =
  'http://www.sat.gob.mx/sitio_internet/cfd/tipoDatos/tdCFDI';
const CATALOGOS_SCHEMA_LOCATION =
  'http://www.sat.gob.mx/sitio_internet/cfd/catalogos/catCFDI.xsd';
const TIPO_DATOS_SCHEMA_LOCATION =
  'http://www.sat.gob.mx/sitio_internet/cfd/tipoDatos/tdCFDI/tdCFDI.xsd';

describe('CfdiXsd - Integration Tests', () => {
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
    it('should get the XSD comprobante', async () => {
      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement(
        'InformacionGlobal'
      )) as XsdElement;

      const xsd = result?.xsd;

      console.log(JSON.stringify(xsd, null, 2));
      expect(xsd).toBeDefined();
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
      expect(xsd['xs:schema']['xs:element']['_attributes']).toEqual({
        name: 'InformacionGlobal',
        minOccurs: '0',
      });

      expect(xsd['xs:schema']['xs:element']['xs:complexType']['xs:attribute']).toHaveLength(3);
      expect(xsd['xs:schema']['xs:element']['xs:complexType']['xs:attribute']).toContainEqual({
        "_attributes": {
          "name": "Periodicidad",
          "type": "catCFDI:c_Periodicidad",
          "use": "required"
        },
        "xs:annotation": {
          "xs:documentation": {
            "_text": "Atributo requerido para expresar el período al que corresponde la información del comprobante global."
          }
        }
      });
      expect(xsd['xs:schema']['xs:element']['xs:complexType']['xs:attribute']).toContainEqual( {
        "_attributes": {
          "name": "Meses",
          "type": "catCFDI:c_Meses",
          "use": "required"
        },
        "xs:annotation": {
          "xs:documentation": {
            "_text": "Atributo requerido para expresar el mes o los meses al que corresponde la información del comprobante global."
          }
        }
      },);
      expect(xsd['xs:schema']['xs:element']['xs:complexType']['xs:attribute']).toContainEqual({
        "_attributes": {
          "name": "Año",
          "use": "required"
        },
        "xs:annotation": {
          "xs:documentation": {
            "_text": "Atributo requerido para expresar el año al que corresponde la información del comprobante global."
          }
        },
        "xs:simpleType": {
          "xs:restriction": {
            "_attributes": {
              "base": "xs:short"
            },
            "xs:minInclusive": {
              "_attributes": {
                "value": "2021"
              }
            },
            "xs:whiteSpace": {
              "_attributes": {
                "value": "collapse"
              }
            }
          }
        }
      });
    });
  });

  describe('JsonSchema', () => {
    it('should get the JsonSchema comprobante', async () => {
      cfdiXsd.setConfig({ source: realXsdPath });
      catalogProcess.setConfig({ source: catalogosXsdPath });
      tipoDatosXsd.setConfig({ source: tipoDatosXsdPath });

      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement(
        'InformacionGlobal'
      )) as XsdElement;

      const res = await cfdiSchema.xsd2Json({
        ...catalogos,
        ...tipoDatos,
        'InformacionGlobal': XMLUtils.toXsd(result?.xsd),
      });

      const jsonSchema = res['InformacionGlobal'].getJsonSchema();

      console.log(JSON.stringify(jsonSchema, null, 2));
      expect(jsonSchema).toBeDefined();
      expect(jsonSchema.type).toBe('object');

      expect(jsonSchema.title).toMatch(
        /This JSON Schema file was generated from InformacionGlobal on .*\.  For more information please see http:\/\/www\.xsd2jsonschema\.org$/
      );
      expect(jsonSchema.description).toBe(
        'Atributo requerido para expresar el mes o los meses al que corresponde la información del comprobante global.'
      );
      expect(jsonSchema.required).toEqual([
        'Periodicidad',
        'Meses',
        'Año'
      ]);
      expect(jsonSchema.properties).toEqual({
        'Periodicidad': {
          '$ref': 'catalogos.json#/definitions/c_Periodicidad'
        },
        'Meses': {
          '$ref': 'catalogos.json#/definitions/c_Meses'
        },
        'Año': {
          'description': 'Atributo requerido para expresar el año al que corresponde la información del comprobante global.',
          'maximum': 32767,
          'minimum': 2021,
          'type': 'integer'
        }
      });
    });
  });
});

     