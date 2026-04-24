import { XmlDivisas, XmlDivisasAttributes } from './type/divisas.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/divisas';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/divisas/divisas.xsd';

export class Divisas extends Complemento<XmlDivisas> {
  public complemento: XmlDivisas = {} as XmlDivisas;

  constructor(attributes: XmlDivisasAttributes) {
    super({ key: 'divisas:Divisas', xmlns, xsd });
    this.complemento._attributes = attributes;
  }
}
