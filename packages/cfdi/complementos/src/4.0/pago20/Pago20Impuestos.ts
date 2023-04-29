import {
  XmlPago10Impuesto,
  XmlPagoImptoAttributes,
  XmlPagoRetencionAttributes,
  XmlPagoTranladoAttributes,
} from '../../../types/complements/pago10.interface';

/**
 *
 */
export class Pago20Impuestos {
  private impuesto: XmlPago10Impuesto = {} as XmlPago10Impuesto;

  /**
   *constructor
   *
   * @param data
   * XmlPagoImptoAttributes
   */
  constructor(data: XmlPagoImptoAttributes) {
    this.impuesto._attributes = data;
  }

  /**
   *retenciones
   *
   * @param data
   * XmlPagoRetencionAttributes
   */
  retenciones(data: XmlPagoRetencionAttributes): void {
    if (!this.impuesto['pago10:Retenciones']) {
      this.impuesto['pago10:Retenciones'] = {
        'pago10:Retencion': [],
      };
    }
    this.impuesto['pago10:Retenciones']['pago10:Retencion'].push({
      _attributes: data,
    });
  }

  /**
   *traslados
   *
   * @param data
   * XmlPagoTranladoAttributes
   */
  traslados(data: XmlPagoTranladoAttributes): void {
    if (!this.impuesto['pago10:Traslados']) {
      this.impuesto['pago10:Traslados'] = {
        'pago10:Traslado': [],
      };
    }
    this.impuesto['pago10:Traslados']['pago10:Traslado'].push({
      _attributes: data,
    });
  }

  /**
   *getImpuesto
   */
  getImpuesto(): XmlPago10Impuesto {
    return this.impuesto;
  }
}