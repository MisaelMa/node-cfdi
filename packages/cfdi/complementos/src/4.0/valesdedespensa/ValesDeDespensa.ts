import { XmlValesDeDespensa, XmlValesDeDespensaAttributes, XmlValesConceptoAttributes } from './type/valesdedespensa.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/valesdedespensa';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/valesdedespensa/valesdedespensa.xsd';

export class ValesDeDespensa extends Complemento<XmlValesDeDespensa> {
  public complemento: XmlValesDeDespensa = {} as XmlValesDeDespensa;

  constructor(attributes: XmlValesDeDespensaAttributes) {
    super({ key: 'valesdedespensa:ValesDeDespensa', xmlns, xsd });
    this.complemento._attributes = attributes;
  }

  concepto(attributes: XmlValesConceptoAttributes): void {
    if (!this.complemento['valesdedespensa:Conceptos']) {
      this.complemento['valesdedespensa:Conceptos'] = { 'valesdedespensa:Concepto': [] };
    }
    this.complemento['valesdedespensa:Conceptos']['valesdedespensa:Concepto'].push({ _attributes: attributes });
  }
}
