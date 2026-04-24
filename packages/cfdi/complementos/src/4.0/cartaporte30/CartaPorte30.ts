import {
  XmlCartaPorte30,
  XmlCartaPorte30Attributes,
  XmlCP30UbicacionAttributes,
  XmlCP30DomicilioAttributes,
  XmlCP30MercanciasAttributes,
  XmlCP30MercanciaAttributes,
  XmlCP30TipoFiguraAttributes,
} from './type/cartaporte30.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/CartaPorte30';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/CartaPorte/CartaPorte30.xsd';

export class CartaPorte30 extends Complemento<XmlCartaPorte30> {
  public complemento: XmlCartaPorte30 = {} as XmlCartaPorte30;

  constructor(attributes?: XmlCartaPorte30Attributes) {
    super({ key: 'cartaporte30:CartaPorte', xmlns, xsd });
    if (attributes) this.complemento._attributes = attributes;
  }

  setAttributes(attributes: XmlCartaPorte30Attributes): void {
    this.complemento._attributes = attributes;
  }

  setUbicacion(attributes: XmlCP30UbicacionAttributes, domicilio?: XmlCP30DomicilioAttributes): void {
    if (!this.complemento['cartaporte30:Ubicaciones']) {
      this.complemento['cartaporte30:Ubicaciones'] = { 'cartaporte30:Ubicacion': [] };
    }
    const ubicacion: any = { _attributes: attributes };
    if (domicilio) ubicacion['cartaporte30:Domicilio'] = { _attributes: domicilio };
    this.complemento['cartaporte30:Ubicaciones']['cartaporte30:Ubicacion'].push(ubicacion);
  }

  setMercancias(attributes: XmlCP30MercanciasAttributes): void {
    this.complemento['cartaporte30:Mercancias'] = { _attributes: attributes } as any;
  }

  setMercancia(attributes: XmlCP30MercanciaAttributes): void {
    if (!this.complemento['cartaporte30:Mercancias']) throw new Error('Debe llamar setMercancias() primero');
    if (!this.complemento['cartaporte30:Mercancias']['cartaporte30:Mercancia']) {
      this.complemento['cartaporte30:Mercancias']['cartaporte30:Mercancia'] = [];
    }
    this.complemento['cartaporte30:Mercancias']['cartaporte30:Mercancia'].push({ _attributes: attributes });
  }

  setFiguraTransporte(attributes: XmlCP30TipoFiguraAttributes, domicilio?: XmlCP30DomicilioAttributes): void {
    if (!this.complemento['cartaporte30:FiguraTransporte']) {
      this.complemento['cartaporte30:FiguraTransporte'] = { 'cartaporte30:TiposFigura': [] };
    }
    const figura: any = { _attributes: attributes };
    if (domicilio) figura['cartaporte30:Domicilio'] = { _attributes: domicilio };
    this.complemento['cartaporte30:FiguraTransporte']['cartaporte30:TiposFigura'].push(figura);
  }
}
