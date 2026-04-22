import { XmlRegistrofiscal, XmlRegistrofiscalAttributes } from './type/registrofiscal.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/registrofiscal';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/cfdiregistrofiscal/cfdiregistrofiscal.xsd';

export class RegistroFiscal extends Complemento<XmlRegistrofiscal> {
  public complemento: XmlRegistrofiscal = {} as XmlRegistrofiscal;

  constructor(attributes: XmlRegistrofiscalAttributes) {
    super({ key: 'registrofiscal:CFDIRegistroFiscal', xmlns, xsd });
    this.complemento._attributes = attributes;
  }
}
