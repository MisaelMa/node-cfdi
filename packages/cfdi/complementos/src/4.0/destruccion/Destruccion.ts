import { XmlDestruccion, XmlDestruccionAttributes, XmlDestruccionInfoAduaneraAttributes, XmlVehiculoDestruidoAttributes } from './type/destruccion.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/certificadodestruccion';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/certificadodestruccion/certificadodedestruccion.xsd';

export class Destruccion extends Complemento<XmlDestruccion> {
  public complemento: XmlDestruccion = {} as XmlDestruccion;

  constructor(attributes: XmlDestruccionAttributes) {
    super({ key: 'destruccion:certificadodedestruccion', xmlns, xsd });
    this.complemento._attributes = attributes;
  }

  InformacionAduanera(attributes: XmlDestruccionInfoAduaneraAttributes): void {
    this.complemento['destruccion:InformacionAduanera'] = { _attributes: attributes };
  }

  VehiculoDestruido(attributes: XmlVehiculoDestruidoAttributes): void {
    this.complemento['destruccion:VehiculoDestruido'] = { _attributes: attributes };
  }
}
