import { Concepto } from './concepto';
import { XmlToJson } from '../xmlToJson';
import {
  XmlConceptoAttributes,
  XmlEmisorAttribute,
  XmlReceptorAttribute,
} from '@cfdi/types';
import { ConceptFactory } from './concepto.factory';
export class CFDI {
  json: Record<string, any> = {};
  constructor(xml: string) {
    this.json = XmlToJson(xml);
  }

  get comprobante() {
    return this.json.Comprobante;
  }

  get emisor(): XmlEmisorAttribute {
    return this.json.Comprobante;
  }

  get receptor(): XmlReceptorAttribute {
    return this.json.Comprobante?.Receptor;
  }

  get conceptos(): Concepto[] {
    const conceptos = this.json.Comprobante?.Conceptos || [];
    return conceptos.map((concepto: XmlConceptoAttributes) => {
      return new ConceptFactory(concepto).build();
    });
  }

  get impuestos() {
    return this.json.Comprobante?.Impuestos;
  }

  get complemento() {
    return this.json.Comprobante?.Complemento;
  }
}
