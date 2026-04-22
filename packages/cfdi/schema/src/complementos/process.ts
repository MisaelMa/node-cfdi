import { readFileSync } from 'fs';
import { ElementCompact, js2xml, xml2js } from 'xml-js';

export abstract class Process {
  xsdPath: string = '';
  async read() {
    const xsdContent = readFileSync(this.xsdPath, 'utf-8');
    const options = {
      compact: true,
      ignoreComment: true,
      alwaysChildren: true,
    };
    const xsd = xml2js(xsdContent, options) as ElementCompact;
    const xsdCompact = await this.xsd(xsd);
    return js2xml(xsdCompact, {
      compact: true,
      ignoreComment: true,
      spaces: 4,
    });
  }

  setConfig(path: string): this {
    this.xsdPath = path;
    return this;
  }

  protected abstract xsd(xsd: ElementCompact): any;
}
