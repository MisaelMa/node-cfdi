import {
  XmlImplocal,
  XmlImplocalAttributes,
  XmlImplocalRetencionAttributes,
  XmlImplocalTrasladoAttributes,
} from './type/implocal.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/implocal';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/implocal/implocal.xsd';

export class Implocal extends Complemento<XmlImplocal> {
  public complemento: XmlImplocal = {} as XmlImplocal;

  constructor(attributes: XmlImplocalAttributes) {
    super({ key: 'implocal:ImpuestosLocales', xmlns, xsd });
    this.complemento._attributes = attributes;
  }

  retenciones(attributes: XmlImplocalRetencionAttributes): void {
    if (!this.complemento['implocal:RetencionesLocales']) {
      this.complemento['implocal:RetencionesLocales'] = [];
    }
    this.complemento['implocal:RetencionesLocales'].push({ _attributes: attributes });
  }

  traslados(attributes: XmlImplocalTrasladoAttributes): void {
    if (!this.complemento['implocal:TrasladosLocales']) {
      this.complemento['implocal:TrasladosLocales'] = [];
    }
    this.complemento['implocal:TrasladosLocales'].push({ _attributes: attributes });
  }
}
