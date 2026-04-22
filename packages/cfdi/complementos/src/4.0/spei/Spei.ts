import {
  XmlSpei,
  XmlSpeiTerceroAttributes,
  XmlSpeiOrdenanteAttributes,
  XmlSpeiBeneficiarioAttributes,
} from './type/spei.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/spei';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/spei/spei.xsd';

export class Spei extends Complemento<XmlSpei> {
  public complemento: XmlSpei = {} as XmlSpei;
  private currentTercero: any = null;

  constructor() {
    super({ key: 'spei:Complemento_SPEI', xmlns, xsd });
  }

  tercero(attributes: XmlSpeiTerceroAttributes): Spei {
    if (!this.complemento['spei:SPEI_Tercero']) {
      this.complemento['spei:SPEI_Tercero'] = [];
    }
    this.currentTercero = { _attributes: attributes };
    this.complemento['spei:SPEI_Tercero'].push(this.currentTercero);
    return this;
  }

  ordenante(attributes: XmlSpeiOrdenanteAttributes): Spei {
    if (!this.currentTercero) throw new Error('Debe llamar tercero() primero');
    this.currentTercero['spei:Ordenante'] = { _attributes: attributes };
    return this;
  }

  beneficiario(attributes: XmlSpeiBeneficiarioAttributes): Spei {
    if (!this.currentTercero) throw new Error('Debe llamar tercero() primero');
    this.currentTercero['spei:Beneficiario'] = { _attributes: attributes };
    return this;
  }
}
