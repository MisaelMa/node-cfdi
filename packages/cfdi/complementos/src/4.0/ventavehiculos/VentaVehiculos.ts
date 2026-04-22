import {
  XmlVentaVehiculos,
  XmlVentaVehiculosAttributes,
  XmlVentaVehiculosInfoAduaneraAttributes,
} from './type/ventavehiculos.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/ventavehiculos';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/ventavehiculos/ventavehiculos11.xsd';

export class VentaVehiculos extends Complemento<XmlVentaVehiculos> {
  public complemento: XmlVentaVehiculos = {} as XmlVentaVehiculos;

  constructor(attributes: XmlVentaVehiculosAttributes) {
    super({ key: 'ventavehiculos:VentaVehiculos', xmlns, xsd });
    this.complemento._attributes = attributes;
  }

  InformacionAduanera(attributes: XmlVentaVehiculosInfoAduaneraAttributes): void {
    if (!this.complemento['ventavehiculos:InformacionAduanera']) {
      this.complemento['ventavehiculos:InformacionAduanera'] = [];
    }
    this.complemento['ventavehiculos:InformacionAduanera'].push({ _attributes: attributes });
  }
}
