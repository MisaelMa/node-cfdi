import { XmlObrasarte, XmlObrasarteAttributes } from './type/obrasarte.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/arteantiguedades';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/arteantiguedades/obrasarteantiguedades.xsd';

export class ObrasArte extends Complemento<XmlObrasarte> {
  public complemento: XmlObrasarte = {} as XmlObrasarte;

  constructor(attributes: XmlObrasarteAttributes) {
    super({ key: 'obrasarte:obrasarteantiguedades', xmlns, xsd });
    this.complemento._attributes = attributes;
  }
}
