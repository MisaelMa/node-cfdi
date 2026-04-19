import { XmlServicioparcial, XmlServicioparcialAttributes, XmlServicioparcialInmuebleAttributes } from './type/servicioparcial.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/servicioparcialconstruccion';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/servicioparcialconstruccion/servicioparcialconstruccion.xsd';

export class ServicioParcial extends Complemento<XmlServicioparcial> {
  public complemento: XmlServicioparcial = {} as XmlServicioparcial;

  constructor(attributes: XmlServicioparcialAttributes) {
    super({ key: 'servicioparcial:parcialesconstruccion', xmlns, xsd });
    this.complemento._attributes = attributes;
  }

  inmueble(attributes: XmlServicioparcialInmuebleAttributes): void {
    this.complemento['servicioparcial:Inmueble'] = { _attributes: attributes };
  }
}
