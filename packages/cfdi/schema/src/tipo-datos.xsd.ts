import { readFileSync } from "fs";

export class TipoDatosXsd {
  private static instance: TipoDatosXsd;
  private options = {
    source: ''
  };
  private constructor() {
  }

  public static of(): TipoDatosXsd {
    if (!TipoDatosXsd.instance) {
      TipoDatosXsd.instance = new TipoDatosXsd();
    }
    return TipoDatosXsd.instance;
  }

  setConfig({ source }: { source: string }) {
    this.options.source = source;
  }

  public async process() {
    const tipoDatosXsd = await this.getXsd();
    return { tipoDatos: tipoDatosXsd };
  }

  public async getXsd() {
    const xsd = await this.readXsd();
    return xsd;
  }

  private async readXsd() {
    const tipoDatosXsd = readFileSync(this.options.source, 'utf-8');
    return tipoDatosXsd;
  }
}
