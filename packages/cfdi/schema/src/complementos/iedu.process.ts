import { readFileSync } from 'fs';
import { Process } from './process';
import { ElementCompact } from 'xml-js';

export class Iedu extends Process {
  private static instance: Iedu;

  constructor() {
    super();
  }
  public static of(): Iedu {
    if (!Iedu.instance) {
      // ¡Usa la clase concreta aquí!
      Iedu.instance = new Iedu();
    }
    return Iedu.instance;
  }
  process() {
    const xsd = this.read();
    return xsd;
  }

  xsd(content: ElementCompact) {
    console.log(content);

    return content;
  }
}
