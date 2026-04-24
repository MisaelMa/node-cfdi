import { XmlDecreto, XmlDecretoAttributes, XmlDecretoRenovAttributes, XmlDecretoSustitAttributes } from './type/decreto.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/renovacionysustitucionvehiculos';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/renovacionysustitucionvehiculos/renovacionysustitucionvehiculos.xsd';

export class Decreto extends Complemento<XmlDecreto> {
  public complemento: XmlDecreto = {} as XmlDecreto;

  constructor(attributes: XmlDecretoAttributes) {
    super({ key: 'decreto:renovacionysustitucionvehiculos', xmlns, xsd });
    this.complemento._attributes = attributes;
  }

  RenovVehicular(attributes: XmlDecretoRenovAttributes): void {
    this.complemento['decreto:DecretoRenovVehiculos'] = { _attributes: attributes };
  }

  SustitVehicular(attributes: XmlDecretoSustitAttributes): void {
    this.complemento['decreto:DecretoSustitVehiculos'] = { _attributes: attributes };
  }
}
