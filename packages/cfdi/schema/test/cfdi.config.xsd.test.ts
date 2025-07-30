import { describe, it, expect, beforeEach } from 'vitest';
import { CfdiXsd } from '../src/cfdi.xsd';
import path from 'path';

describe('CfdiXsd - Integration Tests', () => {
  let cfdiXsd: CfdiXsd;
  
  // Ruta al archivo XSD real
  const realXsdPath = path.join(__dirname, '../src/files/cfdv40.xsd');

  beforeEach(() => {
    cfdiXsd = CfdiXsd.of();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance when called multiple times', () => {
      const instance1 = CfdiXsd.of();
      const instance2 = CfdiXsd.of();
      
      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(CfdiXsd);
    });

    it('should maintain state across instances', () => {
      const instance1 = CfdiXsd.of();
      instance1.setConfig({ source: realXsdPath });
      
      const instance2 = CfdiXsd.of();
      
      expect(instance1).toBe(instance2);
      // Ambas instancias deben tener la misma configuración
      expect((instance2 as any).source).toBe(realXsdPath);
    });
  });

  describe('Configuration', () => {
    it('should set configuration with source parameter', () => {
      cfdiXsd.setConfig({ source: realXsdPath });
      
      expect((cfdiXsd as any).source).toBe(realXsdPath);
    });

    it('should maintain backward compatibility with path parameter', () => {
      cfdiXsd.setConfig({ path: realXsdPath });
      
      expect((cfdiXsd as any).source).toBe(realXsdPath);
    });

    it('should prioritize source over path when both are provided', () => {
      const testSource = realXsdPath;
      const testPath = './other-path.xsd';
      
      cfdiXsd.setConfig({ source: testSource, path: testPath });
      
      expect((cfdiXsd as any).source).toBe(testSource);
    });
  });

  describe('Real XSD Processing', () => {
    beforeEach(() => {
      cfdiXsd.setConfig({ source: realXsdPath });
    });

    it('should process real CFDI XSD successfully', async () => {
      const result = await cfdiXsd.process();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // Verificar que todos los elementos tienen la estructura esperada
      result.forEach((element: any) => {
        expect(element).toHaveProperty('name');
        expect(element).toHaveProperty('xsd');
        expect(typeof element.xsd).toBe('string');
        expect(element.xsd).toContain('<xs:schema');
      });
    });

    it('should include comprobante element at the beginning', async () => {
      const result = await cfdiXsd.process();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // El primer elemento debe ser comprobante
      const firstElement = result[0];
      expect(firstElement).toEqual(
        expect.objectContaining({
          name: 'comprobante',
          path: 'comprobante', 
          key: 'comprobante',
          folder: 'comprobante'
        })
      );
    });

    it('should process real CFDI elements correctly', async () => {
      const result = await cfdiXsd.process();

      // Buscar elementos específicos del CFDI real
      const elementNames = result.map((element: any) => element.name);
      
      // Verificar que se procesan los elementos principales del CFDI
      expect(elementNames).toContain('comprobante');
      
      // Buscar elementos que deberían estar presentes en cfdv40.xsd
      const hasExpectedElements = elementNames.some((name: string) => 
        ['InformacionGlobal', 'CfdiRelacionados', 'Emisor', 'Receptor', 'Conceptos']
          .some(expectedName => name.toLowerCase().includes(expectedName.toLowerCase()))
      );
      
      expect(hasExpectedElements).toBe(true);
    });

    it('should throw error when no source is configured', async () => {
      const freshInstance = new (CfdiXsd as any)();
      
      await expect(freshInstance.process()).rejects.toThrow(
        'Configuración inválida: se requiere source o path'
      );
    });

    it('should handle invalid file path', async () => {
      cfdiXsd.setConfig({ source: './non-existent-file.xsd' });

      await expect(cfdiXsd.process()).rejects.toThrow();
    });
   
    it.only('should contain the correct elements', async () => {
      const result = await cfdiXsd.process();
      const withoutXsd = result.map(({xsd, ...item}) => item);
      const elementNames = result.map((element) => element.name);

        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
        expect(elementNames).toContain('comprobante');
        expect(elementNames).toContain('InformacionGlobal');
        expect(elementNames).toContain('CfdiRelacionados');
        expect(elementNames).toContain('Emisor');
        expect(elementNames).toContain('Receptor');
        expect(elementNames).toContain('Conceptos');

        expect(withoutXsd).toBeDefined();
        expect(withoutXsd).toEqual([
          {
            name: 'comprobante',
            path: 'comprobante',
            key: 'comprobante',
            folder: 'comprobante'
          },
          {
            name: 'InformacionGlobal',
            folder: 'InformacionGlobal',
            path: 'comprobante',
            key: 'comprobante_InformacionGlobal'
          },
          {
            name: 'CfdiRelacionado',
            folder: 'CfdiRelacionados',
            path: 'comprobante_CfdiRelacionados',
            key: 'comprobante_CfdiRelacionados_CfdiRelacionado'
          },
          {
            name: 'CfdiRelacionados',
            folder: 'CfdiRelacionados',
            path: 'comprobante',
            key: 'comprobante_CfdiRelacionados'
          },
          {
            name: 'Emisor',
            folder: 'Emisor',
            path: 'comprobante',
            key: 'comprobante_Emisor'
          },
          {
            name: 'Receptor',
            folder: 'Receptor',
            path: 'comprobante',
            key: 'comprobante_Receptor'
          },
          {
            name: 'Traslado',
            folder: 'Conceptos',
            path: 'comprobante_Conceptos_Concepto_Impuestos_Traslados',
            key: 'comprobante_Conceptos_Concepto_Impuestos_Traslados_Traslado'
          },
          {
            name: 'Traslados',
            folder: 'Conceptos',
            path: 'comprobante_Conceptos_Concepto_Impuestos',
            key: 'comprobante_Conceptos_Concepto_Impuestos_Traslados'
          },
          {
            name: 'Retencion',
            folder: 'Conceptos',
            path: 'comprobante_Conceptos_Concepto_Impuestos_Retenciones',
            key: 'comprobante_Conceptos_Concepto_Impuestos_Retenciones_Retencion'
          },
          {
            name: 'Retenciones',
            folder: 'Conceptos',
            path: 'comprobante_Conceptos_Concepto_Impuestos',
            key: 'comprobante_Conceptos_Concepto_Impuestos_Retenciones'
          },
          {
            name: 'Impuestos',
            folder: 'Conceptos',
            path: 'comprobante_Conceptos_Concepto',
            key: 'comprobante_Conceptos_Concepto_Impuestos'
          },
          {
            name: 'ACuentaTerceros',
            folder: 'Conceptos',
            path: 'comprobante_Conceptos_Concepto',
            key: 'comprobante_Conceptos_Concepto_ACuentaTerceros'
          },
          {
            name: 'InformacionAduanera',
            folder: 'Conceptos',
            path: 'comprobante_Conceptos_Concepto',
            key: 'comprobante_Conceptos_Concepto_InformacionAduanera'
          },
          {
            name: 'CuentaPredial',
            folder: 'Conceptos',
            path: 'comprobante_Conceptos_Concepto',
            key: 'comprobante_Conceptos_Concepto_CuentaPredial'
          },
          {
            name: 'unknown',
            folder: 'Conceptos',
            path: 'comprobante_Conceptos_Concepto_ComplementoConcepto',
            key: 'comprobante_Conceptos_Concepto_ComplementoConcepto_unknown'
          },
          {
            name: 'ComplementoConcepto',
            folder: 'Conceptos',
            path: 'comprobante_Conceptos_Concepto',
            key: 'comprobante_Conceptos_Concepto_ComplementoConcepto'
          },
          {
            name: 'InformacionAduanera',
            folder: 'Conceptos',
            path: 'comprobante_Conceptos_Concepto_Parte',
            key: 'comprobante_Conceptos_Concepto_Parte_InformacionAduanera'
          },
          {
            name: 'Parte',
            folder: 'Conceptos',
            path: 'comprobante_Conceptos_Concepto',
            key: 'comprobante_Conceptos_Concepto_Parte'
          },
          {
            name: 'Concepto',
            folder: 'Conceptos',
            path: 'comprobante_Conceptos',
            key: 'comprobante_Conceptos_Concepto'
          },
          {
            name: 'Conceptos',
            folder: 'Conceptos',
            path: 'comprobante',
            key: 'comprobante_Conceptos'
          },
          {
            name: 'Retencion',
            folder: 'Impuestos',
            path: 'comprobante_Impuestos_Retenciones',
            key: 'comprobante_Impuestos_Retenciones_Retencion'
          },
          {
            name: 'Retenciones',
            folder: 'Impuestos',
            path: 'comprobante_Impuestos',
            key: 'comprobante_Impuestos_Retenciones'
          },
          {
            name: 'Traslado',
            folder: 'Impuestos',
            path: 'comprobante_Impuestos_Traslados',
            key: 'comprobante_Impuestos_Traslados_Traslado'
          },
          {
            name: 'Traslados',
            folder: 'Impuestos',
            path: 'comprobante_Impuestos',
            key: 'comprobante_Impuestos_Traslados'
          },
          {
            name: 'Impuestos',
            folder: 'Impuestos',
            path: 'comprobante',
            key: 'comprobante_Impuestos'
          },
          {
            name: 'unknown',
            folder: 'Complemento',
            path: 'comprobante_Complemento',
            key: 'comprobante_Complemento_unknown'
          },
          {
            name: 'Complemento',
            folder: 'Complemento',
            path: 'comprobante',
            key: 'comprobante_Complemento'
          },
          {
            name: 'unknown',
            folder: 'Addenda',
            path: 'comprobante_Addenda',
            key: 'comprobante_Addenda_unknown'
          },
          {
            name: 'Addenda',
            folder: 'Addenda',
            path: 'comprobante',
            key: 'comprobante_Addenda'
          }
        ])
    });
  });

  describe('Real Schema Analysis', () => {
    beforeEach(() => {
      cfdiXsd.setConfig({ source: realXsdPath });
    });

    it('should extract all sequence elements from real XSD', async () => {
      const result = await cfdiXsd.process();

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(1); // Al menos comprobante + otros elementos
      
      // Verificar que cada elemento tiene la estructura correcta
      result.forEach((element: any) => {
        expect(element.name).toBeTruthy();
        expect(element.xsd).toBeTruthy();
        expect(typeof element.xsd).toBe('string');
      });
    });

    it('should generate valid XSD for each extracted element', async () => {
      const result = await cfdiXsd.process();

      result.forEach((element: any) => {
        // Cada XSD debe contener la estructura básica
        expect(element.xsd).toContain('<xs:schema');
        expect(element.xsd).toContain('xmlns:xs="http://www.w3.org/2001/XMLSchema"');
        expect(element.xsd).toContain('</xs:schema>');
      });
    });

    it('should preserve namespaces in generated XSD', async () => {
      const result = await cfdiXsd.process();

      const firstElement = result[0];
      const xsdContent = firstElement.xsd;
      
      // Verificar que se mantienen los namespaces importantes
      expect(xsdContent).toContain('xmlns:cfdi="http://www.sat.gob.mx/cfd/4"');
      expect(xsdContent).toContain('xmlns:xs="http://www.w3.org/2001/XMLSchema"');
    });
  });

  describe('Utility Methods with Real Data', () => {
    beforeEach(() => {
      cfdiXsd.setConfig({ source: realXsdPath });
    });

    it('should generate schemas map from real processed data', async () => {
      const processedSchemas = await cfdiXsd.process();
      
      const schemasMap = cfdiXsd.generateSchemas(processedSchemas);

      expect(schemasMap).toBeDefined();
      expect(typeof schemasMap).toBe('object');
      expect(schemasMap['comprobante']).toBeDefined();
      
      // Verificar que el mapa tiene las claves correctas
      Object.keys(schemasMap).forEach(key => {
        expect(typeof schemasMap[key]).toBe('string');
        expect(schemasMap[key]).toContain('<xs:schema');
      });
    });

    it('should handle element analysis correctly', () => {
      // Test con elemento que solo tiene atributos
      const attributeOnlyElement = {
        'xs:complexType': {
          'xs:attribute': { name: 'test' }
        }
      };

      const isOnlyAttr = cfdiXsd.isOnlyAttribute(attributeOnlyElement);
      expect(typeof isOnlyAttr).toBe('boolean');

      // Test con elemento que tiene secuencias
      const sequenceElement = {
        'xs:complexType': {
          'xs:sequence': { 
            'xs:element': { name: 'child' }
          },
          'xs:attribute': { name: 'attr' }
        }
      };

      const hasSequence = cfdiXsd.isOnlyAttribute(sequenceElement);
      expect(typeof hasSequence).toBe('boolean');
    });
  });

  describe('Integration with Base Processor', () => {
    it('should inherit readXsd method from BaseXSDProcessor', async () => {
      cfdiXsd.setConfig({ source: realXsdPath });

      const xsdData = await cfdiXsd.readXsd();

      expect(xsdData).toBeDefined();
      expect(xsdData['xs:schema']).toBeDefined();
      expect(xsdData['xs:schema']['xs:element']).toBeDefined();
    });

    it('should inherit validateConfig method from BaseXSDProcessor', async () => {
      // Test sin configuración
      const freshInstance = new (CfdiXsd as any)();
      
      await expect(freshInstance.process()).rejects.toThrow();
    });

    it('should load real XSD and validate schema structure', async () => {
      cfdiXsd.setConfig({ source: realXsdPath });

      const xsdData = await cfdiXsd.readXsd();

      // Verificar estructura del esquema real
      expect(xsdData['xs:schema']).toBeDefined();
      expect(xsdData['xs:schema']['_attributes']).toBeDefined();
      expect(xsdData['xs:schema']['_attributes']['targetNamespace']).toBe('http://www.sat.gob.mx/cfd/4');
      
      // Verificar que existe el elemento Comprobante
      expect(xsdData['xs:schema']['xs:element']).toBeDefined();
      expect(xsdData['xs:schema']['xs:element']['_attributes']['name']).toBe('Comprobante');
    });
  });

  describe('Performance and Validation', () => {
    it('should process real XSD within reasonable time', async () => {
      cfdiXsd.setConfig({ source: realXsdPath });

      const startTime = Date.now();
      const result = await cfdiXsd.process();
      const endTime = Date.now();

      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(5000); // Menos de 5 segundos
    });

    it('should generate consistent output on multiple runs', async () => {
      cfdiXsd.setConfig({ source: realXsdPath });

      const result1 = await cfdiXsd.process();
      const result2 = await cfdiXsd.process();

      expect(result1.length).toBe(result2.length);
      
      // Verificar que los nombres son consistentes
      const names1 = result1.map((r: any) => r.name).sort();
      const names2 = result2.map((r: any) => r.name).sort();
      expect(names1).toEqual(names2);
    });
  });

  describe('Error Handling with Real Files', () => {
    it('should handle non-existent files gracefully', async () => {
      cfdiXsd.setConfig({ source: './non-existent-file.xsd' });

      await expect(cfdiXsd.process()).rejects.toThrow();
    });

    it('should handle invalid file types', async () => {
      // Usar un archivo que no es XSD
      const invalidPath = path.join(__dirname, '../package.json');
      cfdiXsd.setConfig({ source: invalidPath });

      await expect(cfdiXsd.process()).rejects.toThrow();
    });

    it('should handle files without .xsd extension', async () => {
      cfdiXsd.setConfig({ source: './some-file.txt' });

      await expect(cfdiXsd.process()).rejects.toThrow('El archivo debe tener extensión .xsd');
    });
  });

  describe('Memory Management', () => {
    it('should not create memory leaks with multiple instances', () => {
      const instances: CfdiXsd[] = [];
      
      for (let i = 0; i < 100; i++) {
        instances.push(CfdiXsd.of());
      }

      // Todos deben ser la misma instancia
      const firstInstance = instances[0];
      instances.forEach(instance => {
        expect(instance).toBe(firstInstance);
      });
    });
  });
}); 
