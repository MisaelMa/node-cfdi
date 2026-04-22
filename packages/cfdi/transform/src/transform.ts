import fs from 'fs';
import { parseXslt } from './xslt-parser';
import { generateCadenaOriginal } from './cadena-engine';
import type { TemplateRegistry } from './types';

export default class Transform {
  private xmlContent: string = '';
  private registry: TemplateRegistry | null = null;

  s(archivo: string): this {
    this.xmlContent = fs.readFileSync(archivo, 'utf-8');
    return this;
  }

  xsl(xslPath: string): this {
    this.registry = parseXslt(xslPath);
    return this;
  }

  json(xslPath: string): this {
    return this.xsl(xslPath);
  }

  warnings(_type: string = 'silent'): this {
    return this;
  }

  run(): string {
    if (!this.registry) {
      throw new Error('XSLT not loaded. Call xsl() or json() first.');
    }
    return generateCadenaOriginal(this.xmlContent, this.registry);
  }
}
