import {
  XmlHidrocarburosPetroliferos,
  XmlHidrocarburosPetroliferosAttributes,
} from './type/hidrocarburospetroliferos.xslt';

import { Complemento } from '../../Complemento';

/*
 * https://www.sat.gob.mx/consulta/05122/complemento-hidrocarburos-y-petroliferos
 * Complemento a nivel concepto: Comprobante/Conceptos/Concepto/ComplementoConcepto
 * Publicado 25-03-2026, obligatorio a partir del 24-04-2026.
 */
const xmlns = 'http://www.sat.gob.mx/hidrocarburospetroliferos';
const xsd =
  'http://www.sat.gob.mx/sitio_internet/cfd/hidrocarburospetroliferos/hidrocarburospetroliferos.xsd';

export class HidrocarburosPetroliferos extends Complemento<XmlHidrocarburosPetroliferos> {
  public complemento: XmlHidrocarburosPetroliferos =
    {} as XmlHidrocarburosPetroliferos;

  constructor(attributes: XmlHidrocarburosPetroliferosAttributes) {
    super({ key: 'hidrocarburospetroliferos:HidroYPetro', xmlns, xsd });
    this.complemento = {
      _attributes: attributes,
    } as XmlHidrocarburosPetroliferos;
  }
}
