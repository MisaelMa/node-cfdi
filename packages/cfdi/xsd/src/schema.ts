import Ajv, { ValidateFunction } from 'ajv';
import { AnySchema, AnyValidateFunction } from 'ajv/dist/types';

import { Comprobante } from './tags/comprobante';
import { JSV } from './JSV';
import { JTDDataType } from 'ajv/dist/types/jtd-schema';
import { Schemakey } from './types/key-schema';
import { ValidateXSD } from './tags/validate';

/**
 * SchemaReader
 *
 * Puerto de lectura de schemas. `Schema` NO sabe de donde vienen los JSON:
 * solo sabe pedirlos por ruta. El adaptador que lee de disco vive en
 * `loader.node.ts` y lo registra el entrypoint de Node (`index.ts`).
 *
 * Debe devolver `null` cuando la ruta no existe.
 */
export type SchemaReader = (file: string) => Record<string, any> | null;

/**
 * Shape que espera `loadFiles` cuando no hay nada que cargar. Se devuelve una
 * instancia nueva por llamada: `ajv.addSchema` se queda con la referencia.
 */
const emptySchema = () => ({ catalogos: [], comprobante: [], complementos: [] });

export default class Schema {
  private static instance: Schema;
  private static reader: SchemaReader | null = null;
  private debug: boolean = false;
  private ajv: JSV = JSV.of();
  private pathSchema = '';
  private schemaKeys: string[] = [];
  constructor() {}

  public static of(): Schema {
    if (!Schema.instance) {
      Schema.instance = new Schema();
    }
    return Schema.instance;
  }

  /**
   *setReader
   *
   * Inyecta el adaptador de lectura. Lo llama el entrypoint de Node al
   * importarse; el entrypoint browser no registra ninguno.
   *
   * @param reader
   * SchemaReader
   */
  public static setReader(reader: SchemaReader): void {
    Schema.reader = reader;
  }

  /** Indica si hay un adaptador de lectura disponible (false en el browser). */
  public static hasReader(): boolean {
    return Schema.reader !== null;
  }

  setConfig(options: any) {
    if (!Schema.reader) {
      throw new Error(
        '@cfdi/xsd: no hay un lector de schemas registrado. La carga de XSD ' +
          'desde disco solo existe en Node. En el browser arma el CFDI con ' +
          '@cfdi/xml/browser y deja la validacion al server.'
      );
    }
    const { path, debug } = options;
    this.pathSchema = path;
    this.debug = debug;
    this.loadFiles();
  }

  private getContentFile(file: string) {
    const data = (Schema.reader as SchemaReader)(file);
    return data === null ? emptySchema() : data;
  }
  private loadFiles() {
    const cfdi = this.getContentFile(`${this.pathSchema}/cfdi.json`);
    const catalogos = cfdi.catalogos;
    const comprobante = cfdi.comprobante;
    const complementos = cfdi.complementos;

    this.loadData(catalogos);
    this.loadData(comprobante);
    this.loadData(complementos);
    this.buildKeys();
  }

  private loadData(schemas: Record<string, any>[]) {
    schemas.forEach((schema) => {
      if (
        !this.ajv.getSchema(schema.key) &&
        schema.key !==
          'COMPROBANTE_CONCEPTOS_CONCEPTO_PARTE_INFORMACIONADUANERA'
      ) {
        this.schemaKeys.push(schema.key);
        this.ajv.addSchema(
          this.getContentFile(
            `${this.pathSchema}/${schema.path}/${schema.name}.json`
          ),
          schema.key
        );
      }
    });
  }

  private getSchema(key: Schemakey): AnyValidateFunction {
    return this.ajv.getSchema(key);
  }

  public get cfdi() {
    return {
      comprobante: Comprobante.of(Schemakey.COMPROBANTE, this.debug),
      informacionGlobal: ValidateXSD.of(
        Schemakey.INFORMACIONGLOBAL,
        this.debug
      ),
      emisor: ValidateXSD.of(Schemakey.EMISOR, this.debug),
      receptor: ValidateXSD.of(Schemakey.RECEPTOR, this.debug),
      relacionado: ValidateXSD.of(
        Schemakey.CFDIRELACIONADOS_CFDIRELACIONADO,
        this.debug
      ),
      relacionados: ValidateXSD.of(Schemakey.CFDIRELACIONADOS, this.debug),
      impuestos: ValidateXSD.of(Schemakey.IMPUESTOS, this.debug),
      traslado: ValidateXSD.of(
        Schemakey.IMPUESTOS_TRASLADOS_TRASLADO,
        this.debug
      ),
      retencion: ValidateXSD.of(
        Schemakey.IMPUESTOS_RETENCIONES_RETENCION,
        this.debug
      ),
      //addenda: ValidateXSD.of(Schemakey.ADDENDA, this.debug),
    };
  }

  public get concepto() {
    return {
      concepto: ValidateXSD.of(Schemakey.CONCEPTO, this.debug),
      parte: ValidateXSD.of(Schemakey.CONCEPTO_PARTE, this.debug),
      /*  parteInformacionAduanera: ValidateXSD.of(
        Schemakey.CONCEPTO_PARTE_INFORMACIONADUANERA,
        this.debug
      ), */
      predial: ValidateXSD.of(Schemakey.CONCEPTO_CUENTAPREDIAL, this.debug),
      terceros: ValidateXSD.of(Schemakey.CONCEPTO_ACUENTATERCEROS, this.debug),
      cuentaPredial: ValidateXSD.of(
        Schemakey.CONCEPTO_CUENTAPREDIAL,
        this.debug
      ),
      informacionAduanera: ValidateXSD.of(
        Schemakey.CONCEPTO_INFORMACIONADUANERA,
        this.debug
      ),
      traslado: ValidateXSD.of(
        Schemakey.CONCEPTO_IMPUESTOS_TRASLADOS_TRASLADO,
        this.debug
      ),
      retencion: ValidateXSD.of(
        Schemakey.CONCEPTO_IMPUESTOS_RETENCIONES_RETENCION,
        this.debug
      ),
    };
  }

  private buildKeys() {
    const text: string[] = [];

    this.schemaKeys.forEach((key) => {
      const line = `${this.nameConst(key)} = '${key}',`;
      text.push(line);
    });
    /* console.log(`
    export enum Schemakey {
      ${text.join('\n')}
    }
    `); */
  }

  private nameConst(text: string) {
    return text
      .replace('COMPROBANTE_', '')
      .replace('CONCEPTOS_', '')
      .replace('CATALOGOS_', '');
  }
}
