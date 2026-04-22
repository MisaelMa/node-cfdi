import { XmlIeeh, XmlIeehAttributes, XmlIeehDocRelacionadoAttributes } from './type/ieeh.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/IngresosHidrocarburos10';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/IngresosHidrocarburos10/IngresosHidrocarburos.xsd';

export class Ieeh extends Complemento<XmlIeeh> {
  public complemento: XmlIeeh = {} as XmlIeeh;

  constructor(attributes: XmlIeehAttributes) {
    super({ key: 'ieeh:IngresosHidrocarburos', xmlns, xsd });
    this.complemento._attributes = attributes;
  }

  docRelacionado(attributes: XmlIeehDocRelacionadoAttributes): void {
    if (!this.complemento['ieeh:DocumentoRelacionado']) {
      this.complemento['ieeh:DocumentoRelacionado'] = [];
    }
    this.complemento['ieeh:DocumentoRelacionado'].push({ _attributes: attributes });
  }
}
