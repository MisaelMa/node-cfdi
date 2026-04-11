import { XmlPagoenespecie, XmlPagoenespecieAttributes } from './type/pagoenespecie.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/pagoenespecie';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/pagoenespecie/pagoenespecie.xsd';

export class PagoEnEspecie extends Complemento<XmlPagoenespecie> {
  public complemento: XmlPagoenespecie = {} as XmlPagoenespecie;

  constructor(attributes: XmlPagoenespecieAttributes) {
    super({ key: 'pagoenespecie:PagoEnEspecie', xmlns, xsd });
    this.complemento._attributes = attributes;
  }
}
