import { ElementCompact } from 'xml-js';
import { BaseXSDProcessor } from './common/base-processor';
import { XMLUtils } from './common/xml-utils';
import { XSD_CONSTANTS } from './common/constants';

export class CatalogProcess extends BaseXSDProcessor {
  private static instance: CatalogProcess;

  public static of(): CatalogProcess {
    if (!CatalogProcess.instance) {
      CatalogProcess.instance = new CatalogProcess();
    }
    return CatalogProcess.instance;
  }

  async process() {
    this.validateConfig();
    const xsd = await this.readXsd();
    const processedXsd = this.processXsdData(xsd);
    const result = XMLUtils.toXsd(processedXsd);
    return { catalogos: result };
  }

  private processXsdData(target: ElementCompact): ElementCompact {
    const catalogos = target['xs:schema']['xs:simpleType'] as any[];
    this.removePropertiesCatalog(catalogos, XSD_CONSTANTS.CATALOG_REMOVE_PROPERTIES);
    return target;
  }

  private removePropertiesCatalog(catalogos: any[], properties: readonly string[]): void {
    properties.forEach((property) => {
      const index = catalogos.findIndex(
        (catalog) => catalog._attributes?.name === property
      );
      if (index !== -1) {
        catalogos[index]['xs:restriction']['xs:enumeration'] = [];
      }
    });
  }
}
