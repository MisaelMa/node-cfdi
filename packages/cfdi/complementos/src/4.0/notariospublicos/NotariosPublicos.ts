import {
  XmlNotariosPublicos,
  XmlNotariosPublicosAttributes,
  XmlNPDescInmuebleAttributes,
  XmlNPDatosOperacionAttributes,
  XmlNPDatosNotarioAttributes,
  XmlNPDatosEnajenanteAttributes,
  XmlNPDatosAdquirienteAttributes,
  XmlNPDatosPersonaAttributes,
  XmlNPDatosPersonaCopSCAttributes,
} from './type/notariospublicos.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/notariospublicos';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/notariospublicos/notariospublicos.xsd';

export class NotariosPublicos extends Complemento<XmlNotariosPublicos> {
  public complemento: XmlNotariosPublicos = {} as XmlNotariosPublicos;

  constructor(attributes?: XmlNotariosPublicosAttributes) {
    super({ key: 'notariospublicos:NotariosPublicos', xmlns, xsd });
    this.complemento._attributes = attributes ?? { Version: '1.0' };
  }

  DescInmueble(attributes: XmlNPDescInmuebleAttributes): void {
    if (!this.complemento['notariospublicos:DescInmuebles']) {
      this.complemento['notariospublicos:DescInmuebles'] = { 'notariospublicos:DescInmueble': [] };
    }
    this.complemento['notariospublicos:DescInmuebles']['notariospublicos:DescInmueble'].push({ _attributes: attributes });
  }

  DatosOperacion(attributes: XmlNPDatosOperacionAttributes): void {
    this.complemento['notariospublicos:DatosOperacion'] = { _attributes: attributes };
  }

  DatosNotario(attributes: XmlNPDatosNotarioAttributes): void {
    this.complemento['notariospublicos:DatosNotario'] = { _attributes: attributes };
  }

  DatosEnajenante(attributes: XmlNPDatosEnajenanteAttributes, persona?: XmlNPDatosPersonaAttributes): void {
    this.complemento['notariospublicos:DatosEnajenante'] = { _attributes: attributes };
    if (persona) {
      this.complemento['notariospublicos:DatosEnajenante']['notariospublicos:DatosUnEnajenante'] = { _attributes: persona };
    }
  }

  EnajenanteCopSC(attributes: XmlNPDatosPersonaCopSCAttributes): void {
    if (!this.complemento['notariospublicos:DatosEnajenante']) throw new Error('Debe llamar DatosEnajenante() primero');
    if (!this.complemento['notariospublicos:DatosEnajenante']['notariospublicos:DatosEnajenantesCopSC']) {
      this.complemento['notariospublicos:DatosEnajenante']['notariospublicos:DatosEnajenantesCopSC'] = {
        'notariospublicos:DatosEnajenanteCopSC': [],
      };
    }
    this.complemento['notariospublicos:DatosEnajenante']['notariospublicos:DatosEnajenantesCopSC']!['notariospublicos:DatosEnajenanteCopSC']!.push({ _attributes: attributes });
  }

  DatosAdquiriente(attributes: XmlNPDatosAdquirienteAttributes, persona?: XmlNPDatosPersonaAttributes): void {
    this.complemento['notariospublicos:DatosAdquiriente'] = { _attributes: attributes };
    if (persona) {
      this.complemento['notariospublicos:DatosAdquiriente']['notariospublicos:DatosUnAdquiriente'] = { _attributes: persona };
    }
  }

  AdquirienteCopSC(attributes: XmlNPDatosPersonaCopSCAttributes): void {
    if (!this.complemento['notariospublicos:DatosAdquiriente']) throw new Error('Debe llamar DatosAdquiriente() primero');
    if (!this.complemento['notariospublicos:DatosAdquiriente']['notariospublicos:DatosAdquirientesCopSC']) {
      this.complemento['notariospublicos:DatosAdquiriente']['notariospublicos:DatosAdquirientesCopSC'] = {
        'notariospublicos:DatosAdquirienteCopSC': [],
      };
    }
    this.complemento['notariospublicos:DatosAdquiriente']['notariospublicos:DatosAdquirientesCopSC']!['notariospublicos:DatosAdquirienteCopSC']!.push({ _attributes: attributes });
  }
}
