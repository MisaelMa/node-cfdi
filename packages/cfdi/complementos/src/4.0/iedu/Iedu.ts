import { XmlIedu, XmlIeduAttribute } from './type/iedu.xslt';

import { Complemento } from '../../Complemento';

/**
 *
 */
const xmlns = 'http://www.sat.gob.mx/iedu';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/iedu/iedu.xsd';
export class Iedu extends Complemento<XmlIedu> {
  public complemento: XmlIedu = {} as XmlIedu;
  /**
   *constructor
   *
   * @param attributes
   * XmlIeduAttribute
   */
  constructor(attributes: XmlIeduAttribute) {
    super({ key: 'iedu:instEducativas', xmlns, xsd });
    // rfcPago es opcional en iedu.xsd: un valor vacio no cumple tRFC (12-13 chars),
    // por lo que se omite en lugar de emitir rfcPago="".
    const { rfcPago, ...rest } = attributes;
    const _attributes: XmlIeduAttribute =
      typeof rfcPago === 'string' && rfcPago.trim() !== '' ? { ...rest, rfcPago } : rest;
    this.complemento = { _attributes } as XmlIedu;
  }
}
