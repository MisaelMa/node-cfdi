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

      const result = (await cfdiXsd.getXsdByElement('Emisor')) as XsdElement;

      const xsd = result?.xsd;

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
        name: 'Emisor',
      });

      expect(
        xsd['xs:schema']['xs:element']['xs:complexType']['xs:attribute']
      ).toHaveLength(4);
     
    });
  });

  describe('JsonSchema', () => {
    it('should get the JsonSchema comprobante', async () => {
      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement('Emisor')) as XsdElement;

      const res = await cfdiSchema.xsd2Json({
        ...catalogos,
        ...tipoDatos,
        Emisor: XMLUtils.toXsd(result?.xsd),
      });

      const jsonSchema = res['Emisor'].getJsonSchema();

      expect(jsonSchema).toBeDefined();
      expect(jsonSchema.type).toBe('object');

      expect(jsonSchema.required).toEqual(['Rfc', 'Nombre', 'RegimenFiscal']);
      expect(jsonSchema.properties).toEqual({
        Rfc: {
          $ref: 'tipoDatos.json#/definitions/t_RFC',
        },
        Nombre: {
          description:
            'Atributo requerido para registrar el nombre, denominación o razón social del contribuyente inscrito en el RFC, del emisor del comprobante.',
          maxLength: 300,
          minLength: 1,
          pattern: '[^|]{1,300}',
          type: 'string',
        },
        RegimenFiscal: {
          $ref: 'catalogos.json#/definitions/c_RegimenFiscal',
        },
        FacAtrAdquirente: {
          description:
            'Atributo condicional para expresar el número de operación proporcionado por el SAT cuando se trate de un comprobante a través de un PCECFDI o un PCGCFDISP.',
          maxLength: 10,
          minLength: 10,
          pattern: '[0-9]{10}',
          type: 'string',
        },
      });
    });
  });
});
