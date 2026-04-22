import {
  XmlEcc12,
  XmlEcc12Attributes,
  XmlEcc12ConceptoAttributes,
  XmlEcc12TrasladoAttributes,
} from './type/ecc12.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/EstadoDeCuentaCombustible12';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/EstadoDeCuentaCombustible/ecc12.xsd';

export class Ecc12 extends Complemento<XmlEcc12> {
  public complemento: XmlEcc12 = {} as XmlEcc12;

  constructor(attributes: XmlEcc12Attributes) {
    super({ key: 'ecc12:EstadoDeCuentaCombustible', xmlns, xsd });
    this.complemento._attributes = attributes;
  }

  Concepto(concepto: XmlEcc12ConceptoAttributes, traslados?: XmlEcc12TrasladoAttributes[]): void {
    if (!this.complemento['ecc12:Conceptos']) {
      this.complemento['ecc12:Conceptos'] = {
        'ecc12:ConceptoEstadoDeCuentaCombustible': [],
      };
    }
    const concept: any = { _attributes: concepto };
    if (traslados?.length) {
      concept['ecc12:Traslados'] = {
        'ecc12:Traslado': traslados.map(t => ({ _attributes: t })),
      };
    }
    this.complemento['ecc12:Conceptos']['ecc12:ConceptoEstadoDeCuentaCombustible'].push(concept);
  }
}
