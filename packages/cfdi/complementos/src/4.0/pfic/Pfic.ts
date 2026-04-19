import { XmlPfic, XmlPficAttributes } from './type/pfic.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/pfic';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/pfic/pfic.xsd';

export class Pfic extends Complemento<XmlPfic> {
  public complemento: XmlPfic = {} as XmlPfic;

  constructor(attributes: XmlPficAttributes) {
    super({ key: 'pfic:PFintegranteCoordinado', xmlns, xsd });
    this.complemento._attributes = attributes;
  }
}
