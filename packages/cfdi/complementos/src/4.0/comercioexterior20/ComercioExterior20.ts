import {
  XmlCce20,
  XmlCce20Attributes,
  XmlCce20EmisorAttributes,
  XmlCce20ReceptorAttributes,
  XmlCce20DomicilioAttributes,
  XmlCce20PropietarioAttributes,
  XmlCce20DestinatarioAttributes,
  XmlCce20MercanciaAttributes,
  XmlCce20DescEspecificaAttributes,
} from './type/comercioexterior20.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/ComercioExterior20';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/ComercioExterior20/ComercioExterior20.xsd';

export class ComercioExterior20 extends Complemento<XmlCce20> {
  public complemento: XmlCce20 = {} as XmlCce20;

  constructor(attributes: XmlCce20Attributes) {
    super({ key: 'cce20:ComercioExterior', xmlns, xsd });
    this.complemento._attributes = attributes;
  }

  Emisor(attributes?: XmlCce20EmisorAttributes, domicilio?: XmlCce20DomicilioAttributes): void {
    this.complemento['cce20:Emisor'] = {};
    if (attributes) this.complemento['cce20:Emisor']._attributes = attributes;
    if (domicilio) this.complemento['cce20:Emisor']['cce20:Domicilio'] = { _attributes: domicilio };
  }

  Receptor(attributes?: XmlCce20ReceptorAttributes, domicilio?: XmlCce20DomicilioAttributes): void {
    this.complemento['cce20:Receptor'] = {};
    if (attributes) this.complemento['cce20:Receptor']._attributes = attributes;
    if (domicilio) this.complemento['cce20:Receptor']['cce20:Domicilio'] = { _attributes: domicilio };
  }

  Propietario(attributes: XmlCce20PropietarioAttributes): void {
    if (!this.complemento['cce20:Propietario']) {
      this.complemento['cce20:Propietario'] = [];
    }
    this.complemento['cce20:Propietario'].push({ _attributes: attributes });
  }

  Destinatario(attributes?: XmlCce20DestinatarioAttributes, domicilio?: XmlCce20DomicilioAttributes): void {
    if (!this.complemento['cce20:Destinatario']) {
      this.complemento['cce20:Destinatario'] = [];
    }
    const dest: any = {};
    if (attributes) dest._attributes = attributes;
    if (domicilio) dest['cce20:Domicilio'] = { _attributes: domicilio };
    this.complemento['cce20:Destinatario'].push(dest);
  }

  Mercancias(mercancia: XmlCce20MercanciaAttributes, especificaciones?: XmlCce20DescEspecificaAttributes[]): void {
    if (!this.complemento['cce20:Mercancias']) {
      this.complemento['cce20:Mercancias'] = { 'cce20:Mercancia': [] };
    }
    const merc: any = { _attributes: mercancia };
    if (especificaciones?.length) {
      merc['cce20:DescripcionesEspecificas'] = especificaciones.map(e => ({ _attributes: e }));
    }
    this.complemento['cce20:Mercancias']['cce20:Mercancia'].push(merc);
  }
}
