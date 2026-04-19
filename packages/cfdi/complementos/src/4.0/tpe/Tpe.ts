import {
  XmlTpe,
  XmlTpeAttributes,
  XmlTpeDatosTransitoAttributes,
} from './type/tpe.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/TuristaPasajeroExtranjero';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/TuristaPasajeroExtranjero/TuristaPasajeroExtranjero.xsd';

export class Tpe extends Complemento<XmlTpe> {
  public complemento: XmlTpe = {} as XmlTpe;

  constructor(attributes: XmlTpeAttributes) {
    super({ key: 'tpe:TuristaPasajeroExtranjero', xmlns, xsd });
    this.complemento._attributes = attributes;
  }

  datosTransito(attributes: XmlTpeDatosTransitoAttributes): void {
    if (!this.complemento['tpe:datosTransito']) {
      this.complemento['tpe:datosTransito'] = [];
    }
    this.complemento['tpe:datosTransito'].push({ _attributes: attributes });
  }
}
