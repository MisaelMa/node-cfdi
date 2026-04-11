import {
  XmlConsumodecombustibles,
  XmlConsumodecombustiblesAttributes,
  XmlCondComConceptoAttributes,
  XmlCondComDeterminadoAttributes,
} from './type/consumodecombustibles11.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/ConsumoDeCombustibles11';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/ConsumoDeCombustibles/consumodeCombustibles11.xsd';

export class ConsumoDeCombustibles11 extends Complemento<XmlConsumodecombustibles> {
  public complemento: XmlConsumodecombustibles = {} as XmlConsumodecombustibles;

  constructor(attributes: XmlConsumodecombustiblesAttributes) {
    super({ key: 'consumodecombustibles11:ConsumoDeCombustibles', xmlns, xsd });
    this.complemento._attributes = attributes;
  }

  Concepto(concepto: XmlCondComConceptoAttributes, determinados?: XmlCondComDeterminadoAttributes[]): void {
    if (!this.complemento['consumodecombustibles11:Conceptos']) {
      this.complemento['consumodecombustibles11:Conceptos'] = {
        'consumodecombustibles11:ConceptoConsumoDeCombustibles': [],
      };
    }
    const concept: any = { _attributes: concepto };
    if (determinados?.length) {
      concept['consumodecombustibles11:Determinados'] = {
        'consumodecombustibles11:Determinado': determinados.map(d => ({ _attributes: d })),
      };
    }
    this.complemento['consumodecombustibles11:Conceptos']['consumodecombustibles11:ConceptoConsumoDeCombustibles'].push(concept);
  }
}
