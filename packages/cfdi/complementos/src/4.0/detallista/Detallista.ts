import { XmlDetallista, XmlDetallistaAttributes } from './type/detallista.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/detallista';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/detallista/detallista.xsd';

export class Detallista extends Complemento<XmlDetallista> {
  public complemento: XmlDetallista = {} as XmlDetallista;

  constructor(attributes: XmlDetallistaAttributes) {
    super({ key: 'detallista:detallista', xmlns, xsd });
    this.complemento._attributes = attributes;
  }
}
