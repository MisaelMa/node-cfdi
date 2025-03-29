import * as Pd from 'pdfmake/build/pdfmake';

import { BufferOptions, TDocumentDefinitions } from 'pdfmake/interfaces';
import {
  CFDIComprobante,
  XmlCdfi,
  XmlConcepto,
  XmlEmisor,
  XmlEmisorAttribute,
  XmlImpuestos,
  XmlReceptor,
} from '@cfdi/xml';
import { TCreatedPdf, createPdf } from 'pdfmake/build/pdfmake';

import { OptionsPdf } from './types';
import { XmlTfd } from '@cfdi/complementos/types/complements/tfd/tfd.com';
import { XmlToJson } from '@cfdi/2json';
import path from 'path';
// import PdfPrinter from 'pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
import pdfMake from 'pdfmake/build/pdfmake';
import { writeFileSync } from 'fs';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export abstract class RPDF {
  public xml: XmlCdfi = {} as XmlCdfi;
  public options: OptionsPdf;
  public docDefinition: TDocumentDefinitions | any = {};
  public fonts = {
    // Roboto: {
    //   normal: path.resolve(__dirname, '..', 'src', 'fonts', 'Roboto-Regular.ttf'),
    //   bold: path.resolve(__dirname, '..', 'src', 'fonts', 'Roboto-Regular.ttf'),
    //   italics: path.resolve(__dirname, '..', 'src', 'fonts', 'Roboto-Regular.ttf'),
    //   bolditalics: path.resolve(__dirname, '..', 'src', 'fonts', 'Roboto-Regular.ttf')
    // },
  };
  constructor(xml: string, options: OptionsPdf = {} as OptionsPdf) {
    // @ts-ignore
    this.xml = XmlToJson(xml);
    this.options = options;
  }
  setEskeleton(body: TDocumentDefinitions): void {
    this.docDefinition = body;
  }
  protected abstract addLogo(): void;
  protected abstract addFolio(c: CFDIComprobante): void;
  protected abstract addEmisorData(emisor: XmlEmisorAttribute, expedido: string): void;
  protected abstract addDate(date: string): void;
  protected abstract addReceptor(receptor: XmlReceptor): void;
  protected abstract fechaTimbrado(tfd: XmlTfd): void;
  protected abstract addCatidad(comprobante: CFDIComprobante): void;
  protected abstract addImpuesto(impuesto: XmlImpuestos): void;
  protected abstract addNumberToLetter(total: number): void;
  protected abstract addCSDEmisor(NoCertificado: string): void;
  protected abstract addDetalles(detalles: XmlConcepto): void;
  protected abstract addFormaDePago(forma: string): void;
  protected abstract addMetodoDePago(metodo: string): void;
  protected abstract addMoneda(moneda: string): void;
  protected abstract addTipoComprobante(tipo: string): void;
  protected abstract addCSDSat(tfd: XmlTfd): void;
  protected abstract folioFiscal(tfd: XmlTfd): void;
  protected abstract addSelloDgtEmisor(tfd: XmlTfd): void;
  protected abstract addSelloDelSat(tfd: XmlTfd): void;
  protected abstract addCadenaOriginal(tfd: XmlTfd): void;
  protected abstract addQr(
    tfd: XmlTfd,
    emisor: XmlEmisor | undefined,
    receptor: XmlReceptor | undefined,
    total: string
  ): void;
  public async getDocument(): Promise<TCreatedPdf> {
    /* if (this.xml.Comprobante.Emisor) {
      this.addEmisorData(
        this.xml.Comprobante.Emisor,
        this.xml.Comprobante.LugarExpedicion
      );
    }
    await this.addLogo();
    this.addFolio(this.xml.Comprobante);
    this.addDate(this.xml.Comprobante.Fecha); */
    // @ts-ignore
    /*this.addReceptor(this.xml['cfdi:Comprobante']['cfdi:Receptor']);
    this.addDetalles(this.xml['cfdi:Comprobante']['cfdi:Conceptos']);
    this.addCatidad(this.xml['cfdi:Comprobante']._attributes);
    // @ts-ignore
    this.addImpuesto(this.xml['cfdi:Comprobante']['cfdi:Impuestos']);
    this.addNumberToLetter(+this.xml['cfdi:Comprobante']._attributes.Total);
    // @ts-ignore
    this.addCSDEmisor(this.xml['cfdi:Comprobante']._attributes.NoCertificado);
    // @ts-ignore
    this.addFormaDePago(this.xml['cfdi:Comprobante']._attributes.FormaPago);
    // @ts-ignore
    this.addMetodoDePago(this.xml['cfdi:Comprobante']._attributes.MetodoPago);
    // @ts-ignore
    this.addMoneda(this.xml['cfdi:Comprobante']._attributes.Moneda);
    // @ts-ignore
    this.addTipoComprobante(
      this.xml['cfdi:Comprobante']._attributes.TipoDeComprobante
    );

    if (this.xml['cfdi:Comprobante']!['cfdi:Complemento']) {
      const complements = this.xml['cfdi:Comprobante']['cfdi:Complemento'];
      if (complements['tfd:TimbreFiscalDigital']) {
        const tfd = complements['tfd:TimbreFiscalDigital'];
        this.fechaTimbrado(tfd);
        this.addCSDSat(tfd);
        this.folioFiscal(tfd);
        this.addSelloDgtEmisor(tfd);
        this.addSelloDelSat(tfd);
        this.addCadenaOriginal(tfd);
        await this.addQr(
          tfd,
          this.xml['cfdi:Comprobante']['cfdi:Emisor'],
          this.xml['cfdi:Comprobante']['cfdi:Receptor'],
          this.xml['cfdi:Comprobante']._attributes.Total as string
        );
      }
    } */
    const fo = { ...this.fonts, ...Pd.fonts, ...this.options.fonts };
    console.log(fo);
    return createPdf(this.docDefinition);
  }

  public async save(path: string, name: string) {
    const dir = path + `${name.replace('.pdf', '')}.pdf`;
    try {
      const buffer = await this.getBuffer();
      writeFileSync(dir, buffer, { encoding: 'binary' });
      return {
        save: true,
        path: dir,
      };
    } catch (e) {
      return {
        save: false,
        error: e,
      };
    }
  }

  public async getBlob(options?: BufferOptions): Promise<Blob> {
    return new Promise(async (resolve) => {
      const doc = await this.getDocument();
      doc!.getBlob((result) => {
        resolve(result);
      }, options);
    });
  }

  public async getBase64(options?: BufferOptions): Promise<string> {
    return new Promise(async (resolve) => {
      const doc = await this.getDocument();
      doc!.getBase64((result) => {
        resolve(result);
      }, options);
    });
  }

  public async getBuffer(options?: BufferOptions): Promise<Buffer> {
    return new Promise(async (resolve) => {
      const doc = await this.getDocument();
      doc!.getBuffer((result) => {
        resolve(result);
      }, options);
    });
  }

  public async getDataUrl(options?: BufferOptions): Promise<string> {
    return new Promise(async (resolve) => {
      const doc = await this.getDocument();
      doc!.getDataUrl((result) => {
        resolve(result);
      }, options);
    });
  }

  public async getStream(options?: BufferOptions) {
    const doc = await this.getDocument();
    return doc!.getStream(options);
  }
}
