import { readFileSync } from 'fs';
import { js2xml } from 'xml-js';
import { Iedu } from './iedu.process';
interface ComplementoData {
  name: string;
  path: string;
}
export class Complementos {
  complementos: ComplementoData[] = [];
  private static instance: Complementos;

  public static of(): Complementos {
    if (!Complementos.instance) {
      Complementos.instance = new Complementos();
    }
    return Complementos.instance;
  }

  setConfig(options: any) {
    const { path } = options;
    path && (this.complementos = path);
  }

  async process() {
    return this.getComplementos();
  }

  getComplementos() {
    const xsd = this.complementos.map(async (c) => {
      return {
        name: c.name,
        key: c.name,
        folder: 'complementos',
        type: 'complementos',
        xsd: await this.createComplemento(c),
      };
    });

    return Promise.all(xsd);
  }

  createComplemento(data: ComplementoData) {
    switch (data.name) {
      case 'iedu':
        return Iedu.of().setConfig(data.path).process();
      case 'pago':
      //return new PagoComplemento(data);
      // Agrega más casos según sea necesario para otros tipos de complementos
      default:
        throw new Error(`Tipo de complemento desconocido: ${data.name}`);
    }
  }
}
