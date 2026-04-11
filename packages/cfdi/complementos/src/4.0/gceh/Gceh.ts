import {
  XmlGceh,
  XmlGcehAttributes,
  XmlGcehErogacion,
  XmlGcehErogacionAttributes,
  XmlGcehDocRelacionadoAttributes,
  XmlGcehActividadAttributes,
  XmlGcehCentroCostoAttributes,
} from './type/gceh.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/GastosHidrocarburos10';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/GastosHidrocarburos10/GastosHidrocarburos10.xsd';

export class Gceh extends Complemento<XmlGceh> {
  public complemento: XmlGceh = {} as XmlGceh;
  private currentErogacion: XmlGcehErogacion | null = null;

  constructor(attributes: XmlGcehAttributes) {
    super({ key: 'gceh:GastosHidrocarburos', xmlns, xsd });
    this.complemento._attributes = attributes;
  }

  erogacion(attributes: XmlGcehErogacionAttributes): Gceh {
    if (!this.complemento['gceh:Erogacion']) {
      this.complemento['gceh:Erogacion'] = [];
    }
    this.currentErogacion = { _attributes: attributes };
    this.complemento['gceh:Erogacion'].push(this.currentErogacion);
    return this;
  }

  documentoRelacionado(attributes: XmlGcehDocRelacionadoAttributes): Gceh {
    if (!this.currentErogacion) throw new Error('Debe llamar erogacion() primero');
    if (!this.currentErogacion['gceh:DocumentoRelacionado']) {
      this.currentErogacion['gceh:DocumentoRelacionado'] = [];
    }
    this.currentErogacion['gceh:DocumentoRelacionado'].push({ _attributes: attributes });
    return this;
  }

  actividad(attributes: XmlGcehActividadAttributes): Gceh {
    if (!this.currentErogacion) throw new Error('Debe llamar erogacion() primero');
    if (!this.currentErogacion['gceh:Actividades']) {
      this.currentErogacion['gceh:Actividades'] = [];
    }
    this.currentErogacion['gceh:Actividades'].push({ _attributes: attributes });
    return this;
  }

  centroCostos(attributes: XmlGcehCentroCostoAttributes): Gceh {
    if (!this.currentErogacion) throw new Error('Debe llamar erogacion() primero');
    if (!this.currentErogacion['gceh:CentroCostos']) {
      this.currentErogacion['gceh:CentroCostos'] = [];
    }
    this.currentErogacion['gceh:CentroCostos'].push({ _attributes: attributes });
    return this;
  }
}
