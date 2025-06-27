import { ElementCompact, js2xml, xml2js } from 'xml-js';

import { readFileSync } from 'fs';
import { Process } from './complementos/process';

export class Catalogs extends Process {
  catalogPath: string = '';
  private static instance: Catalogs;

  public static of(): Catalogs {
    if (!Catalogs.instance) {
      Catalogs.instance = new Catalogs();
    }
    return Catalogs.instance;
  }

  async process() {
    const xsd = await this.read();
    return { catalogos: xsd };
  }

  xsd(target: ElementCompact) {
    const catalogos = target['xs:schema']['xs:simpleType'] as any[];
    this.removePropertiesCatalog(catalogos, [
      'c_CodigoPostal',
      'c_ClaveProdServ',
      'c_ClaveUnidad',
      'c_Colonia',
    ]);
    return target;
  }

  removePropertiesCatalog(catalogos: any[], properties: string[]) {
    properties.forEach((property) => {
      const index = catalogos.findIndex(
        (ct) => ct._attributes.name === property
      );
      if (index !== -1) {
        catalogos[index]['xs:restriction']['xs:enumeration'] = [];
      }
    });
  }
}
