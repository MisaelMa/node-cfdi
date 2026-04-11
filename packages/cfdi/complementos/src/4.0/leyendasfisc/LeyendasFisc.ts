import {
  XmlLeyendasFiscales,
  XmlLeyendasFiscalesAttributes,
  XmlLeyendaAttributes,
} from './type/leyendasfisc.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/leyendasFiscales';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/leyendasFiscales/leyendasFisc.xsd';

export class LeyendasFisc extends Complemento<XmlLeyendasFiscales> {
  public complemento: XmlLeyendasFiscales = {} as XmlLeyendasFiscales;

  constructor(attributes?: XmlLeyendasFiscalesAttributes) {
    super({ key: 'leyendasFisc:LeyendasFiscales', xmlns, xsd });
    this.complemento._attributes = attributes ?? { version: '1.0' };
  }

  leyenda(attributes: XmlLeyendaAttributes): void {
    if (!this.complemento['leyendasFisc:Leyenda']) {
      this.complemento['leyendasFisc:Leyenda'] = [];
    }
    this.complemento['leyendasFisc:Leyenda'].push({ _attributes: attributes });
  }
}
