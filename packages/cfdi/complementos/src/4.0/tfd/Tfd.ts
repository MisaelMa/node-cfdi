import { XmlTfd, XmlTfdAttributes } from './type/tfd.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/TimbreFiscalDigital';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/TimbreFiscalDigital/TimbreFiscalDigitalv11.xsd';

export class Tfd extends Complemento<XmlTfd> {
  public complemento: XmlTfd = {} as XmlTfd;

  constructor(attributes: XmlTfdAttributes) {
    super({ key: 'tfd:TimbreFiscalDigital', xmlns, xsd });
    this.complemento._attributes = attributes;
  }
}
