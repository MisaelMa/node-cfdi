import {
  XmlCartaPorte31,
  XmlCartaPorte31Attributes,
  XmlCP31UbicacionAttributes,
  XmlCP31DomicilioAttributes,
  XmlCP31MercanciasAttributes,
  XmlCP31MercanciaAttributes,
  XmlCP31TipoFiguraAttributes,
} from './type/cartaporte31.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/CartaPorte31';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/CartaPorte/CartaPorte31.xsd';

export class CartaPorte31 extends Complemento<XmlCartaPorte31> {
  public complemento: XmlCartaPorte31 = {} as XmlCartaPorte31;

  constructor(attributes?: XmlCartaPorte31Attributes) {
    super({ key: 'cartaporte31:CartaPorte', xmlns, xsd });
    if (attributes) this.complemento._attributes = attributes;
  }

  setAttributes(attributes: XmlCartaPorte31Attributes): void {
    this.complemento._attributes = attributes;
  }

  setUbicacion(attributes: XmlCP31UbicacionAttributes, domicilio?: XmlCP31DomicilioAttributes): void {
    if (!this.complemento['cartaporte31:Ubicaciones']) {
      this.complemento['cartaporte31:Ubicaciones'] = { 'cartaporte31:Ubicacion': [] };
    }
    const ubicacion: any = { _attributes: attributes };
    if (domicilio) ubicacion['cartaporte31:Domicilio'] = { _attributes: domicilio };
    this.complemento['cartaporte31:Ubicaciones']['cartaporte31:Ubicacion'].push(ubicacion);
  }

  setMercancias(attributes: XmlCP31MercanciasAttributes): void {
    this.complemento['cartaporte31:Mercancias'] = { _attributes: attributes } as any;
  }

  setMercancia(attributes: XmlCP31MercanciaAttributes): void {
    if (!this.complemento['cartaporte31:Mercancias']) throw new Error('Debe llamar setMercancias() primero');
    if (!this.complemento['cartaporte31:Mercancias']['cartaporte31:Mercancia']) {
      this.complemento['cartaporte31:Mercancias']['cartaporte31:Mercancia'] = [];
    }
    this.complemento['cartaporte31:Mercancias']['cartaporte31:Mercancia'].push({ _attributes: attributes });
  }

  setFiguraTransporte(attributes: XmlCP31TipoFiguraAttributes, domicilio?: XmlCP31DomicilioAttributes): void {
    if (!this.complemento['cartaporte31:FiguraTransporte']) {
      this.complemento['cartaporte31:FiguraTransporte'] = { 'cartaporte31:TiposFigura': [] };
    }
    const figura: any = { _attributes: attributes };
    if (domicilio) figura['cartaporte31:Domicilio'] = { _attributes: domicilio };
    this.complemento['cartaporte31:FiguraTransporte']['cartaporte31:TiposFigura'].push(figura);
  }
}
