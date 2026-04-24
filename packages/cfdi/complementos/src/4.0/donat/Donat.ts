import { XmlDonat, XmlDonatAttributes } from './type/donat.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/donat';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/donat/donat11.xsd';

export class Donat extends Complemento<XmlDonat> {
  public complemento: XmlDonat = {} as XmlDonat;

  constructor(attributes: XmlDonatAttributes) {
    super({ key: 'donat:Donatarias', xmlns, xsd });
    this.complemento._attributes = attributes;
  }
}
