import fs from 'fs';
import { Certificate, PrivateKey } from '@cfdi/csd';

import { Comprobante } from './elements/Comprobante';
import { FileSystem } from './utils/FileSystem';
import { Config, SaxonHe, XsltSheet } from './types/types';
import { Transform as CfdiTransform } from '@cfdi/transform';
import { Transform as SaxonTransform } from '@saxon-he/cli';
import { XmlCdfi } from './types/xmlCdfi.interface';
import xmlJS from 'xml-js';
import { CFDIError } from './common/error';
/**
 *
 */
export class CFDI extends Comprobante {
  private _cadenaOriginal: string = '';
  protected saxon?: SaxonHe | undefined = undefined
  protected xslt?: XsltSheet | null = null;
  private debug = false;

  /**
   *constructor
   *
   * @param attr
   * Comprobante
   * @param options
   *Options;
   */
  constructor(options?: Config) {
    super(options);
    this.xslt = options?.xslt;
    this.saxon = options?.saxon
    this._cadenaOriginal = '';
    this.setDebug(Boolean(options?.debug));
  }

  /**
   * certificar
   *
   * @param {string} cerpath
   * string
   */
  public certificar(cerpath: string): CFDI {
    try {
      const cert = Certificate.fromFileSync(cerpath);
      this.setNoCertificado(cert.noCertificado());
      this.setCertificado(cert.toBase64());
      return this;
    } catch (e) {
      const error = CFDIError({
        e,
        method: 'certificar',
        debug: this.debug,
        name: '@cfdi/csd',
      });
      throw error;
    }
  }

  /**
   * sellar
   *
   * @param {string} keyfile
   * string
   * @param {string} password
   * string
   */
  public async sellar(keyfile: string, password: string): Promise<void> {
    const cadena = await this.generarCadenaOriginal();
    const sello = await this.generarSello(cadena, keyfile, password);
    this._cadenaOriginal = cadena;
    this.setSello(sello);
  }

  /**
   *getJsonCdfi
   */
  public getJsonCdfi(): XmlCdfi {
    return this.xml;
  }

  /**
   *getXmlCdfi
   */
  public getXmlCdfi(): string {
    const options = { compact: true, ignoreComment: true, spaces: 4 };
    const cfdi = xmlJS.js2xml({ ...this.xml }, options);
    this.restartCfdi();
    return cfdi;
  }

  /**
   *saveFile
   *
   * @param file
   * string
   * @param pathSave
   * string
   * @param name
   * string
   */
  public saveFile(file: string, pathSave: string, name: string): boolean {
    try {
      const fullPath = `${pathSave}${name}.xml`;
      fs.writeFileSync(fullPath, Buffer.from(file, 'base64'), 'utf8');
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   *getCadenaOriginal
   */
  generarCadenaOriginal(): string {
    if (!this.xslt) {
      throw new Error(
        '¡Ups! Direcction Not Found Extensible Stylesheet Language Transformation'
      );
    }
    try {
      const fullPath = FileSystem.getTmpFullPath(FileSystem.generateNameTemp());
      const options = { compact: true, ignoreComment: true, spaces: 4 };
      const result = xmlJS.js2xml(this.xml, options);

      fs.writeFileSync(fullPath, result, 'utf8');
      
      let cadena: string;

      if (this.saxon) {
        const transform = new SaxonTransform(this.saxon);
        cadena = transform
          .s(fullPath)
          .xsl(String(this.xslt.path))
          .warnings('silent')
          .run();
      } else {
        const transform = new CfdiTransform();
        cadena = transform
          .s(fullPath)
          .xsl(String(this.xslt.path))
          .warnings('silent')
          .run();
      }
      
      if (this.debug) {
        console.log('xslt =>', this.xslt);
        console.log('cadena original =>', cadena);
      }
      fs.unlinkSync(fullPath);
      return cadena;
    } catch (e) {
      const error = CFDIError({
        e,
        method: 'getCadenaOriginal',
        debug: this.debug,
        name: '@cfdi/xml',
      });
      throw error;
    }
  }

  /**
   *getSello
   *
   * @param cadenaOriginal
   * string
   * @param keyfile
   * string
   * @param password
   * string
   */
  public generarSello(
    cadenaOriginal: string,
    keyfile: string,
    password: string
  ): string {
    try {
      const pk = PrivateKey.fromFileSync(keyfile, password);
      return pk.sign(cadenaOriginal);
    } catch (e) {
      throw CFDIError({
        e,
        method: 'getSello',
        debug: this.debug,
        name: '@cfdi/xml => @cfdi/csd',
      });
    }
  }

  public get sello(): string {
    const comprobante = this.xml['cfdi:Comprobante'];
    return comprobante?._attributes?.Sello || '';
  }

  public get cadenaOriginal(): string {
    return this._cadenaOriginal;
  }

  get isBebug(): boolean {
    return this.debug;
  }

  public setDebug(debug: boolean): void {
    this.debug = debug;
  }
}
