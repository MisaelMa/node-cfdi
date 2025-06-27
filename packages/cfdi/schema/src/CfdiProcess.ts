import { ElementCompact, js2xml, xml2js } from 'xml-js';

import { readFileSync } from 'fs';

export class CfdiProcess {
  private static instance: CfdiProcess;
  cfdiPath: string = '';
  public static of(): CfdiProcess {
    if (!CfdiProcess.instance) {
      CfdiProcess.instance = new CfdiProcess();
    }
    return CfdiProcess.instance;
  }

  setConfig(options: any) {
    const { path } = options;
    path && (this.cfdiPath = path);
    // path && (this.catalogPath = path);
  }

  async process() {
    const targetXsd = this.readXsd();
    const xsd: any = [];
    this.schemaWrap(targetXsd, xsd, null, 'comprobante', 'comprobante');

    const comprobante = this.comprobante(targetXsd);
    xsd.unshift({
      name: 'comprobante',
      path: 'comprobante',
      key: 'comprobante',
      folder: 'comprobante',
      xsd: comprobante,
    });

    return xsd.map((x: any) => ({ ...x, xsd: this.toXsd(x.xsd) }));
  }

  schemaWrap(
    xsd: Record<string, any>,
    base: any[] = [],
    folder = null,
    path = '',
    key = ''
  ) {
    const schema = xsd['xs:schema']['xs:element']['xs:complexType'][
      'xs:sequence'
    ]['xs:element'] as Array<any>;
    const items = Array.isArray(schema) ? schema : [schema];

    items.forEach((e) => {
      const name = e?._attributes?.name || 'unknow';
      const newXsd = this.generateXsd(
        e,
        'json',
        folder || name,
        path,
        `${key}_${name}`
      );
      const isOnlyAttribute =
        !!newXsd.xsd['xs:schema']?.['xs:element']?.['xs:complexType']?.[
          'xs:sequence'
        ];

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
        delete newXsd.xsd['xs:schema']?.['xs:element']['xs:complexType'][
          'xs:sequence'
        ];

        base.push(newXsd);
      }
    });
  }

  comprobante(xsd: Record<string, any>) {
    const comprobante = { ...xsd };
    delete comprobante['xs:schema']['xs:element']['xs:complexType'][
      'xs:sequence'
    ];
    return comprobante;
  }

  readXsd() {
    const xsd = readFileSync(this.cfdiPath, 'utf-8');
    var options = { compact: true, ignoreComment: true, alwaysChildren: true };
    return xml2js(xsd, options) as ElementCompact;
  }

  generateSchemas(schemas: any[]) {
    const schemasB: any = {};
    schemas.forEach((schema) => {
      schemasB[schema.name] = schema.xsd;
    });
    return schemasB;
  }

  isOnlyAttribute(element: any) {
    return (
      !!element?.['xs:complexType']['xs:attribute'] &&
      !element['xs:complexType']['xs:sequence']
    );
  }

  generateXsd(
    element: any,
    type: 'xsd' | 'json' = 'xsd',
    folder: string,
    path = '',
    key = ''
  ): any {
    delete element?.['xs:annotation'];

    const name = element?._attributes?.name || 'unknow';

    const newElement = {
      'xs:schema': {
        _attributes: {
          'xmlns:cfdi': 'http://www.sat.gob.mx/cfd/4',
          'xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
          'xmlns:catCFDI': 'http://www.sat.gob.mx/sitio_internet/cfd/catalogos',
          'xmlns:tdCFDI':
            'http://www.sat.gob.mx/sitio_internet/cfd/tipoDatos/tdCFDI',
          targetNamespace: 'http://www.sat.gob.mx/cfd/4',
          elementFormDefault: 'qualified',
          attributeFormDefault: 'unqualified',
        },
        'xs:import': [
          {
            _attributes: {
              namespace: 'http://www.sat.gob.mx/sitio_internet/cfd/catalogos',
              schemaLocation:
                'http://www.sat.gob.mx/sitio_internet/cfd/catalogos/catCFDI.xsd',
            },
          },
          {
            _attributes: {
              namespace:
                'http://www.sat.gob.mx/sitio_internet/cfd/tipoDatos/tdCFDI',
              schemaLocation:
                'http://www.sat.gob.mx/sitio_internet/cfd/tipoDatos/tdCFDI/tdCFDI.xsd',
            },
          },
        ],
        'xs:element': element,
      },
    };

    return {
      name,
      folder,
      path: path ? path : name,
      key,
      xsd: type === 'xsd' ? this.toXsd(newElement) : newElement,
    };
  }

  toXsd(newElement: any) {
    return js2xml(newElement, {
      compact: true,
      ignoreComment: true,
      spaces: 4,
    });
  }
}
