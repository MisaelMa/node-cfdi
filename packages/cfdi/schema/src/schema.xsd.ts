import { ElementCompact, js2xml, json2xml, xml2js } from 'xml-js';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

import { CatalogProcess } from './catalogos.xsd';
import { CfdiXsd } from './cfdi.xsd';
import { STRUCTURE } from './common/const/structure';
// @ts-ignore
import { Xsd2JsonSchema } from 'xsd2jsonschema';
import { Complementos } from './complementos/complementos.process';

export class CfdiSchema {
  private static instance: CfdiSchema;
  private options = {
    xsd: {
      cfdi: '',
      catalogos: '',
      tipoDatos: '',
      complementos: [],
    },
  };
  private schemaName: any = {
    catalogos: [],
    comprobante: [],
    complementos: [],
    unknow: [],
  };
  private xs2js: Xsd2JsonSchema;
  private schemasJSON: Record<string, any> = {};
  private schemas: {
    name: string;
    type: string;
    schema: Record<string, any>;
    path: string;
    key: string;
  }[] = [];
  private cfdiProcess: CfdiXsd;
  private catalogProcess: CatalogProcess;
  private complementos: Complementos;

  constructor() {
    this.xs2js = new Xsd2JsonSchema();
    this.catalogProcess = CatalogProcess.of();
    this.cfdiProcess = CfdiXsd.of();
    this.complementos = Complementos.of();
  }
  setConfig(options: any) {
    this.options.xsd = options.xsd;
    this.cfdiProcess.setConfig({ path: options.xsd.cfdi });
    this.catalogProcess.setConfig(options.xsd.catalogos);
    this.complementos.setConfig({ path: options.xsd.complementos });
  }

  public static of(): CfdiSchema {
    if (!CfdiSchema.instance) {
      CfdiSchema.instance = new CfdiSchema();
    }
    return CfdiSchema.instance;
  }

  async processAll() {
    this.schemaName = {
      catalogos: [],
      comprobante: [],
      complementos: [],
      unknow: [],
    };
    this.schemas = [];
    const catalog = await this.catalogProcess.process();
    const tiposDatos = await this.tipoDatos();
    const cfdi = await this.cfdiProcess.process();
    const complementos = await this.complementos.process();
    const extras = {
      ...tiposDatos,
      ...catalog,
      // ...cfdi,
    };

    cfdi
      .filter((c: any) => c.name !== 'unknow')
      .forEach((c: any) => {
        const res = this.generateSchema(
          {
            ...extras,
            [c.key]: c.xsd,
          },
          c
        );
        const filter = res.filter((r) => {
          const index = this.schemas.findIndex((s) => s.key === r.key);
          return index === -1 && !!r.schema.properties;
        });

        this.schemas.push(...filter);
      });

    complementos.forEach((c: any) => {
      const res = this.generateSchema(
        {
          //  ...extras,
          [c.key]: c.xsd,
        },
        c
      );
      this.schemas.push(...res);
    });
    return {
      schemas: this.schemas,
    };
  }

  generateSchema(schemasJSON: Record<string, any>, c: any) {
    const xs2js = new Xsd2JsonSchema();

    const convertedSchemas = xs2js.processAllSchemas({
      schemas: schemasJSON,
    });

    return Object.keys(schemasJSON).map((key) => {
      const d = STRUCTURE[c.name] ? 'comprobante' : 'catalogos';
      if (c.key !== key) {
        console.log(key);
      }
      return {
        name: c.key === key ? c.name : key,
        key: c.key === key ? c.key : `catalogos_${key}`,
        path: c.key === key ? c.folder || 'catalogos' : 'catalogos',
        type: c.key === key ? c.type || 'comprobante' : 'catalogos',
        schema: convertedSchemas[key].getJsonSchema(),
      };
    });
  }

  async save(path: string) {
    const cfdi = `${path}cfdi.json`;

    this.schemas.forEach((schema) => {
      const name = schema.name.toLowerCase();
      const fileName = `${name}.json`;
      const direction = `${path}${
        schema.path.toLocaleLowerCase() || 'catalogos'
      }`;
      const file = `${direction}/${fileName}`;

      this.schemaName[schema.type].push({
        name,
        type: schema.type,
        key: schema.key.toLocaleUpperCase(),
        path: schema.path.toLocaleLowerCase() || 'catalogos',
      });
      !existsSync(direction) && mkdirSync(direction);
      if (!existsSync(file)) {
        writeFileSync(file, JSON.stringify(schema.schema));
      }
    });

    writeFileSync(cfdi, JSON.stringify(this.schemaName));
  }

  tipoDatos() {
    const tipoDatosXsd = readFileSync(this.options.xsd.tipoDatos, 'utf-8');
    return { tipoDatos: tipoDatosXsd };
  }
}
