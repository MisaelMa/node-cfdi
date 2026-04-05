import { ElementCompact, js2xml } from 'xml-js';
import { XSD_CONSTANTS } from './constants';
import { XMLElementOptions } from './interfaces';

/**
 * Utilidades XML centralizadas para evitar duplicación
 */
export class XMLUtils {
  /**
   * Convierte elemento a XSD con configuración estándar
   */
  static toXsd(element: ElementCompact): string {
    return js2xml(element, XSD_CONSTANTS.OUTPUT_OPTIONS);
  }

  /**
   * Genera estructura base de esquema XSD con namespaces estándar
   */
  static createSchemaBase(options: XMLElementOptions = {}): any {
    const defaultNamespaces = {
      'xmlns:cfdi': XSD_CONSTANTS.NAMESPACES.CFDI,
      'xmlns:xs': XSD_CONSTANTS.NAMESPACES.XS,
      'xmlns:catCFDI': XSD_CONSTANTS.NAMESPACES.CAT_CFDI,
      'xmlns:tdCFDI': XSD_CONSTANTS.NAMESPACES.TD_CFDI,
    };

    const defaultImports = [
      {
        _attributes: {
          namespace: XSD_CONSTANTS.NAMESPACES.CAT_CFDI,
          schemaLocation: XSD_CONSTANTS.SCHEMA_LOCATIONS.CAT_CFDI,
        },
      },
      {
        _attributes: {
          namespace: XSD_CONSTANTS.NAMESPACES.TD_CFDI,
          schemaLocation: XSD_CONSTANTS.SCHEMA_LOCATIONS.TD_CFDI,
        },
      },
    ];

    return {
      _attributes: {
        ...defaultNamespaces,
        ...options.namespaces,
        targetNamespace: options.targetNamespace || XSD_CONSTANTS.NAMESPACES.CFDI,
        elementFormDefault: options.elementFormDefault || 'qualified',
        attributeFormDefault: options.attributeFormDefault || 'unqualified',
      },
      'xs:import': options.imports || defaultImports,
    };
  }

  /**
   * Limpia anotaciones de un elemento
   */
  static removeAnnotations(element: any): void {
    delete element?.['xs:annotation'];
  }

  /**
   * Obtiene el nombre de un elemento con fallback
   */
  static getElementName(element: any, fallback: string = 'unknown'): string {
    return element?._attributes?.name || fallback;
  }

  /**
   * Verifica si un elemento tiene solo atributos (sin secuencia)
   */
  static isOnlyAttribute(element: any): boolean {
    return (
      !!element?.['xs:complexType']['xs:attribute'] &&
      !element['xs:complexType']['xs:sequence']
    );
  }

  /**
   * Convierte array de esquemas a objeto indexado por nombre
   */
  static generateSchemasMap(schemas: any[]): Record<string, any> {
    const schemasMap: Record<string, any> = {};
    schemas.forEach((schema) => {
      schemasMap[schema.name] = schema.xsd;
    });
    return schemasMap;
  }

  /**
   * Aplica transformación estándar de salida a lista de esquemas
   */
  static transformSchemasToXsd(schemas: any[]): any[] {
    return schemas.map((x: any) => ({ 
      ...x, 
      xsd: XMLUtils.toXsd(x.xsd) 
    }));
  }
} 