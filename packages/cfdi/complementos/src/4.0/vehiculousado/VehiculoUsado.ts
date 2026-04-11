import { XmlVehiculousado, XmlVehiculousadoAttributes, XmlVehiculoInfoAduaneraAttributes } from './type/vehiculousado.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/vehiculousado';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/vehiculousado/vehiculousado.xsd';

export class VehiculoUsado extends Complemento<XmlVehiculousado> {
  public complemento: XmlVehiculousado = {} as XmlVehiculousado;

  constructor(attributes: XmlVehiculousadoAttributes) {
    super({ key: 'vehiculousado:VehiculoUsado', xmlns, xsd });
    this.complemento._attributes = attributes;
  }

  informacionAduanera(attributes: XmlVehiculoInfoAduaneraAttributes): void {
    this.complemento['vehiculousado:InformacionAduanera'] = { _attributes: attributes };
  }
}
