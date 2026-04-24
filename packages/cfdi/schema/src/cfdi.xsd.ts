import { ElementCompact } from 'xml-js';
import { BaseXSDProcessor } from './common/base-processor';
import { XMLUtils } from './common/xml-utils';
import { XSD_CONSTANTS } from './common/constants';

export interface XsdElement {
  xsd: ElementCompact;
  name: string;
}

export class CfdiXsd extends BaseXSDProcessor {
  private static instance: CfdiXsd;
  
  public static of(): CfdiXsd {
    if (!CfdiXsd.instance) {
      CfdiXsd.instance = new CfdiXsd();
    }
    return CfdiXsd.instance;
  }

  async process() {
    this.validateConfig();
    const xsd = await this.getXsd();
    return XMLUtils.transformSchemasToXsd(xsd);
  }

  public async getXsd(): Promise<XsdElement[]> {
    const targetXsd = await this.readXsd();

    const xsd: ElementCompact[] = [];
    this.schemaWrap(targetXsd, xsd, null, 'comprobante', 'comprobante');

    const comprobante = this.createComprobanteElement(targetXsd);
    xsd.unshift({
      name: 'comprobante',
      path: 'comprobante',
      key: 'comprobante',
      folder: 'comprobante',
      xsd: comprobante,
    });

    return xsd as XsdElement[];
  }

  public async getXsdByElement(element: string, key: string = 'name'): Promise<XsdElement | undefined> {
    const xsd = await this.getXsd();
    //console.log(xsd);
    const elementXsd = xsd.find((x: Record<string, any>) => x[key] === element);
    return elementXsd || undefined;
  }

  private schemaWrap(
    xsd: ElementCompact,
    base: ElementCompact[] = [],
    folder: string | null = null,
    path = '',
    key = ''
  ): void {
    const schema = xsd['xs:schema']['xs:element']['xs:complexType'][
      'xs:sequence'
    ]['xs:element'] as Array<any>;
    const items = Array.isArray(schema) ? schema : [schema];

    items.forEach((element) => {
      const name = XMLUtils.getElementName(element);
      const newXsd = this.generateXsd(
        element,
        'json',
        folder || name,
        path,
        `${key}_${name}`
      );
      
      const isOnlyAttribute = !!newXsd.xsd['xs:schema']?.['xs:element']?.['xs:complexType']?.['xs:sequence'];

      if (!isOnlyAttribute) {
        base.push(newXsd);
      } else {
        const newXsdElement = { ...newXsd };

        this.schemaWrap(
          newXsdElement.xsd,
          base,
          folder || name,
          `${path}_${name}` || name,
          `${path}_${name}`
        );
        
        delete newXsd.xsd['xs:schema']?.['xs:element']['xs:complexType']['xs:sequence'];
        base.push(newXsd);
      }
    });
  }

  private createComprobanteElement(xsd: ElementCompact): ElementCompact {
    const comprobante = { ...xsd };
    delete comprobante['xs:schema']['xs:element']['xs:complexType']['xs:sequence'];
    //console.log(JSON.stringify(comprobante, null, 2));
    return comprobante;
  }

  /**
   * Genera esquemas indexados por nombre (utilidad legacy)
   */
  generateSchemas(schemas: any[]): Record<string, any> {
    return XMLUtils.generateSchemasMap(schemas);
  }

  /**
   * Verifica si elemento tiene solo atributos (utilidad legacy)
   */
  isOnlyAttribute(element: any): boolean {
    return XMLUtils.isOnlyAttribute(element);
  }

  private generateXsd(
    element: any,
    type: 'xsd' | 'json' = 'xsd',
    folder: string,
    path = '',
    key = ''
  ): any {
    XMLUtils.removeAnnotations(element);

    const name = XMLUtils.getElementName(element);
    const schemaBase = XMLUtils.createSchemaBase();

    const newElement = {
      'xs:schema': {
        ...schemaBase,
        'xs:element': element,
      },
    };

    return {
      name,
      folder,
      path: path || name,
      key,
      xsd: type === 'xsd' ? XMLUtils.toXsd(newElement) : newElement,
    };
  }
}
