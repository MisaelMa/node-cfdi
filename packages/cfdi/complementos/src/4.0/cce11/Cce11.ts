import {
  XmlCce11,
  XmlCce11Attributes,
  XmlCce11EmisorAttributes,
  XmlCce11ReceptorAttributes,
  XmlCce11DomicilioAttributes,
  XmlCce11PropietarioAttributes,
  XmlCce11DestinatarioAttributes,
  XmlCce11MercanciaAttributes,
  XmlCce11DescEspecificaAttributes,
} from './type/cce11.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/ComercioExterior11';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/ComercioExterior11/ComercioExterior11.xsd';

export class Cce11 extends Complemento<XmlCce11> {
  public complemento: XmlCce11 = {} as XmlCce11;

  constructor(attributes: XmlCce11Attributes) {
    super({ key: 'cce11:ComercioExterior', xmlns, xsd });
    this.complemento._attributes = attributes;
  }

  Emisor(attributes?: XmlCce11EmisorAttributes, domicilio?: XmlCce11DomicilioAttributes): void {
    this.complemento['cce11:Emisor'] = {};
    if (attributes) this.complemento['cce11:Emisor']._attributes = attributes;
    if (domicilio) this.complemento['cce11:Emisor']['cce11:Domicilio'] = { _attributes: domicilio };
  }

  Receptor(attributes?: XmlCce11ReceptorAttributes, domicilio?: XmlCce11DomicilioAttributes): void {
    this.complemento['cce11:Receptor'] = {};
    if (attributes) this.complemento['cce11:Receptor']._attributes = attributes;
    if (domicilio) this.complemento['cce11:Receptor']['cce11:Domicilio'] = { _attributes: domicilio };
  }

  Propietario(attributes: XmlCce11PropietarioAttributes): void {
    if (!this.complemento['cce11:Propietario']) {
      this.complemento['cce11:Propietario'] = [];
    }
    this.complemento['cce11:Propietario'].push({ _attributes: attributes });
  }

  Destinatario(attributes?: XmlCce11DestinatarioAttributes, domicilio?: XmlCce11DomicilioAttributes): void {
    if (!this.complemento['cce11:Destinatario']) {
      this.complemento['cce11:Destinatario'] = [];
    }
    const dest: any = {};
    if (attributes) dest._attributes = attributes;
    if (domicilio) dest['cce11:Domicilio'] = { _attributes: domicilio };
    this.complemento['cce11:Destinatario'].push(dest);
  }

  Mercancias(mercancia: XmlCce11MercanciaAttributes, especificaciones?: XmlCce11DescEspecificaAttributes[]): void {
    if (!this.complemento['cce11:Mercancias']) {
      this.complemento['cce11:Mercancias'] = { 'cce11:Mercancia': [] };
    }
    const merc: any = { _attributes: mercancia };
    if (especificaciones?.length) {
      merc['cce11:DescripcionesEspecificas'] = especificaciones.map(e => ({ _attributes: e }));
    }
    this.complemento['cce11:Mercancias']['cce11:Mercancia'].push(merc);
  }
}
