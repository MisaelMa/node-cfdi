import { describe, it, expect, beforeEach } from 'vitest';
import { CfdiXsd, XsdElement } from '../../src/cfdi.xsd';
import path from 'path';
import { XMLUtils } from '../../src/common/xml-utils';
import { CatalogProcess } from '../../src/catalogos.xsd';
import { TipoDatosXsd } from '../../src/tipo-datos.xsd';
import { CfdiSchema } from '../../src/schema.xsd';

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
  });

  describe('XSD', () => {
    it('should get the XSD comprobante', async () => {
      cfdiXsd.setConfig({ source: realXsdPath });
      catalogProcess.setConfig({ source: catalogosXsdPath });
      tipoDatosXsd.setConfig({ source: tipoDatosXsdPath });

      const catalogos = await catalogProcess.process();
      const tipoDatos = await tipoDatosXsd.process();

      const result = (await cfdiXsd.getXsdByElement(
        'comprobante'
      )) as XsdElement;

      const xsd = result?.xsd

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
       
       // Verificar elemento Comprobante
       expect(xsd['xs:schema']['xs:element']).toBeDefined();
       expect(xsd['xs:schema']['xs:element']['_attributes']['name']).toBe('Comprobante');
       
       // Verificar annotation del elemento
       expect(xsd['xs:schema']['xs:element']['xs:annotation']).toBeDefined();
       
       // Verificar complexType
       expect(xsd['xs:schema']['xs:element']['xs:complexType']).toBeDefined();
       
       // Verificar atributos del complexType
       const attributes = xsd['xs:schema']['xs:element']['xs:complexType']['xs:attribute'];
       expect(Array.isArray(attributes)).toBe(true);
       expect(attributes.length).toBeGreaterThan(10); // Debe tener varios atributos
       
       // Verificar algunos atributos específicos
       const attributeNames = attributes.map((attr: any) => attr._attributes.name);
       expect(attributeNames).toContain('Version');
       expect(attributeNames).toContain('Fecha');
       expect(attributeNames).toContain('Sello');
       expect(attributeNames).toContain('SubTotal');
       expect(attributeNames).toContain('Total');
       expect(attributeNames).toContain('TipoDeComprobante');
       expect(attributeNames).toContain('Exportacion');
       expect(attributeNames).toContain('LugarExpedicion');
       
       // Verificar estructura de un atributo específico (Version)
       const versionAttr = attributes.find((attr: any) => attr._attributes.name === 'Version');
       expect(versionAttr).toBeDefined();
       expect(versionAttr._attributes.use).toBe('required');
       expect(versionAttr._attributes.fixed).toBe('4.0');
       expect(versionAttr['xs:annotation']).toBeDefined();
       expect(versionAttr['xs:simpleType']).toBeDefined();
       
       console.log('✅ XSD object validation passed!');
       console.log('Found attributes:', attributeNames);      

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
        'comprobante'
      )) as XsdElement;

      const res = await cfdiSchema.xsd2Json({
        ...catalogos,
        ...tipoDatos,
        comprobante: XMLUtils.toXsd(result?.xsd),
      });

      const jsonSchema = res['comprobante'].getJsonSchema();

      expect(jsonSchema.type).toBe('object');

      expect(jsonSchema.$id).toBe('comprobante.json');
      expect(jsonSchema.$schema).toBe(
        'http://json-schema.org/draft-07/schema#'
      );
      expect(jsonSchema.title).toMatch(
        /^This JSON Schema file was generated from comprobante on .*\.  For more information please see http:\/\/www\.xsd2jsonschema\.org$/
      );
      expect(jsonSchema.description).toBe(
        'Atributo requerido para incorporar el código postal del lugar de expedición del comprobante (domicilio de la matriz o de la sucursal).'
      );

      // Verificar required array
      expect(jsonSchema.required).toEqual([
        'Version',
        'Fecha',
        'Sello',
        'NoCertificado',
        'Certificado',
        'SubTotal',
        'Moneda',
        'Total',
        'TipoDeComprobante',
        'Exportacion',
        'LugarExpedicion',
      ]);

      expect(jsonSchema.properties).toEqual({
        Version: {
          description:
            'Atributo requerido con valor prefijado a 4.0 que indica la versión del estándar bajo el que se encuentra expresado el comprobante.',
          type: 'string',
        },
        Serie: {
          description:
            'Atributo opcional para precisar la serie para control interno del contribuyente. Este atributo acepta una cadena de caracteres.',
          maxLength: 25,
          minLength: 1,
          pattern: '[^|]{1,25}',
          type: 'string',
        },
        Folio: {
          description:
            'Atributo opcional para control interno del contribuyente que expresa el folio del comprobante, acepta una cadena de caracteres.',
          maxLength: 40,
          minLength: 1,
          pattern: '[^|]{1,40}',
          type: 'string',
        },
        Fecha: {
          $ref: 'tipoDatos.json#/definitions/t_FechaH',
        },
        Sello: {
          description:
            'Atributo requerido para contener el sello digital del comprobante fiscal, al que hacen referencia las reglas de resolución miscelánea vigente. El sello debe ser expresado como una cadena de texto en formato Base 64.',
          type: 'string',
        },
        FormaPago: {
          $ref: 'catalogos.json#/definitions/c_FormaPago',
        },
        NoCertificado: {
          description:
            'Atributo requerido para expresar el número de serie del certificado de sello digital que ampara al comprobante, de acuerdo con el acuse correspondiente a 20 posiciones otorgado por el sistema del SAT.',
          maxLength: 20,
          minLength: 20,
          pattern: '[0-9]{20}',
          type: 'string',
        },
        Certificado: {
          description:
            'Atributo requerido que sirve para incorporar el certificado de sello digital que ampara al comprobante, como texto en formato base 64.',
          type: 'string',
        },
        CondicionesDePago: {
          description:
            'Atributo condicional para expresar las condiciones comerciales aplicables para el pago del comprobante fiscal digital por Internet. Este atributo puede ser condicionado mediante atributos o complementos.',
          maxLength: 1000,
          minLength: 1,
          pattern: '[^|]{1,1000}',
          type: 'string',
        },
        SubTotal: {
          $ref: 'tipoDatos.json#/definitions/t_Importe',
        },
        Descuento: {
          $ref: 'tipoDatos.json#/definitions/t_Importe',
        },
        Moneda: {
          $ref: 'catalogos.json#/definitions/c_Moneda',
        },
        TipoCambio: {
          description:
            'Atributo condicional para representar el tipo de cambio FIX conforme con la moneda usada. Es requerido cuando la clave de moneda es distinta de MXN y de XXX. El valor debe reflejar el número de pesos mexicanos que equivalen a una unidad de la divisa señalada en el atributo moneda. Si el valor está fuera del porcentaje aplicable a la moneda tomado del catálogo c_Moneda, el emisor debe obtener del PAC que vaya a timbrar el CFDI, de manera no automática, una clave de confirmación para ratificar que el valor es correcto e integrar dicha clave en el atributo Confirmacion.',
          minimum: 0.000001,
          type: 'number',
        },
        Total: {
          $ref: 'tipoDatos.json#/definitions/t_Importe',
        },
        TipoDeComprobante: {
          $ref: 'catalogos.json#/definitions/c_TipoDeComprobante',
        },
        Exportacion: {
          $ref: 'catalogos.json#/definitions/c_Exportacion',
        },
        MetodoPago: {
          $ref: 'catalogos.json#/definitions/c_MetodoPago',
        },
        LugarExpedicion: {
          $ref: 'catalogos.json#/definitions/c_CodigoPostal',
        },
        Confirmacion: {
          description:
            'Atributo condicional para registrar la clave de confirmación que entregue el PAC para expedir el comprobante con importes grandes, con un tipo de cambio fuera del rango establecido o con ambos casos. Es requerido cuando se registra un tipo de cambio o un total fuera del rango establecido.',
          maxLength: 5,
          minLength: 5,
          pattern: '[0-9a-zA-Z]{5}',
          type: 'string',
        },
      });
      //console.log(JSON.stringify(res['comprobante'].getJsonSchema(), null, 2));
    });
  });
});
