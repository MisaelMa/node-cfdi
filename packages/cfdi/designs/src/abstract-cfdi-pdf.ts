import type { CFDIComprobante, XmlEmisorAttribute, XmlReceptor, XmlImpuestos, XmlConcepto, XmlEmisor } from '@cfdi/types';
import type { XmlTfd } from '@cfdi/complementos';

export abstract class GeneradorPdf {
  
  constructor(xml: string) {
  
  }

  protected abstract logo(): void;
  protected abstract folio(comprobante: CFDIComprobante): void;
  protected abstract datosEmisor(emisor: XmlEmisorAttribute, lugarExpedicion: string): void;
  protected abstract fecha(fecha: string): void;
  protected abstract receptor(receptor: XmlReceptor): void;
  protected abstract fechaTimbrado(tfd: XmlTfd): void;
  protected abstract totales(comprobante: CFDIComprobante): void;
  protected abstract impuestos(impuesto: XmlImpuestos): void;
  protected abstract totalEnLetras(total: number): void;
  protected abstract certificadoEmisor(noCertificado: string): void;
  protected abstract detalles(concepto: XmlConcepto): void;
  protected abstract formaPago(forma: string): void;
  protected abstract metodoPago(metodo: string): void;
  protected abstract moneda(moneda: string): void;
  protected abstract tipoComprobante(tipo: string): void;
  protected abstract certificadoSat(tfd: XmlTfd): void;
  protected abstract folioFiscal(tfd: XmlTfd): void;
  protected abstract selloEmisor(tfd: XmlTfd): void;
  protected abstract selloSat(tfd: XmlTfd): void;
  protected abstract cadenaOriginal(tfd: XmlTfd): void;
  protected abstract qr(
    tfd: XmlTfd,
    emisor?: XmlEmisor,
    receptor?: XmlReceptor,
    total?: string
  ): void;

  public async obtenerDocumento()  {
    /* const fuentesCombinadas = { ...this.fuentes, ...Pd.fonts, ...this.opciones.fuentes };
    console.log(fuentesCombinadas);
    return createPdf(this.definicionDocumento); */
  }


}
