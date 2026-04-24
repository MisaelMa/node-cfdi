import {
  XmlNomina12,
  XmlNomina12Attributes,
  XmlNominaEmisorAttributes,
  XmlNominaEntidadSNCFAttributes,
  XmlNominaReceptorAttributes,
  XmlNominaSubContratacionAttributes,
  XmlNominaPercepcionesAttributes,
  XmlNominaPercepcionAttributes,
  XmlNominaAccionesAttributes,
  XmlNominaHorasExtraAttributes,
  XmlNominaJubilacionAttributes,
  XmlNominaSeparacionAttributes,
  XmlNominaDeduccionesAttributes,
  XmlNominaDeduccionAttributes,
  XmlNominaOtroPagoAttributes,
  XmlNominaSubsidioAttributes,
  XmlNominaCompensacionAttributes,
  XmlNominaIncapacidadAttributes,
} from './type/nomina12.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/nomina12';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/nomina/nomina12.xsd';

export class Nomina12 extends Complemento<XmlNomina12> {
  public complemento: XmlNomina12 = {} as XmlNomina12;

  constructor(attributes: XmlNomina12Attributes) {
    super({ key: 'nomina12:Nomina', xmlns, xsd });
    this.complemento._attributes = attributes;
  }

  Emisor(attributes?: XmlNominaEmisorAttributes, entidadSNCF?: XmlNominaEntidadSNCFAttributes): void {
    this.complemento['nomina12:Emisor'] = {};
    if (attributes) this.complemento['nomina12:Emisor']._attributes = attributes;
    if (entidadSNCF) {
      this.complemento['nomina12:Emisor']['nomina12:EntidadSNCF'] = { _attributes: entidadSNCF };
    }
  }

  Receptor(attributes: XmlNominaReceptorAttributes): void {
    this.complemento['nomina12:Receptor'] = { _attributes: attributes };
  }

  SubContratacion(attributes: XmlNominaSubContratacionAttributes): void {
    if (!this.complemento['nomina12:Receptor']) throw new Error('Debe llamar Receptor() primero');
    if (!this.complemento['nomina12:Receptor']['nomina12:SubContratacion']) {
      this.complemento['nomina12:Receptor']['nomina12:SubContratacion'] = [];
    }
    this.complemento['nomina12:Receptor']['nomina12:SubContratacion'].push({ _attributes: attributes });
  }

  Percepciones(attributes: XmlNominaPercepcionesAttributes): void {
    this.complemento['nomina12:Percepciones'] = { _attributes: attributes };
  }

  Percepcion(attributes: XmlNominaPercepcionAttributes): void {
    if (!this.complemento['nomina12:Percepciones']) throw new Error('Debe llamar Percepciones() primero');
    if (!this.complemento['nomina12:Percepciones']['nomina12:Percepcion']) {
      this.complemento['nomina12:Percepciones']['nomina12:Percepcion'] = [];
    }
    this.complemento['nomina12:Percepciones']['nomina12:Percepcion'].push({ _attributes: attributes });
  }

  JubilacionPensionRetiro(attributes: XmlNominaJubilacionAttributes): void {
    if (!this.complemento['nomina12:Percepciones']) throw new Error('Debe llamar Percepciones() primero');
    this.complemento['nomina12:Percepciones']['nomina12:JubilacionPensionRetiro'] = { _attributes: attributes };
  }

  SeparacionIndemnizacion(attributes: XmlNominaSeparacionAttributes): void {
    if (!this.complemento['nomina12:Percepciones']) throw new Error('Debe llamar Percepciones() primero');
    this.complemento['nomina12:Percepciones']['nomina12:SeparacionIndemnizacion'] = { _attributes: attributes };
  }

  Deducciones(attributes?: XmlNominaDeduccionesAttributes): void {
    this.complemento['nomina12:Deducciones'] = {};
    if (attributes) this.complemento['nomina12:Deducciones']._attributes = attributes;
  }

  Deduccion(attributes: XmlNominaDeduccionAttributes): void {
    if (!this.complemento['nomina12:Deducciones']) throw new Error('Debe llamar Deducciones() primero');
    if (!this.complemento['nomina12:Deducciones']['nomina12:Deduccion']) {
      this.complemento['nomina12:Deducciones']['nomina12:Deduccion'] = [];
    }
    this.complemento['nomina12:Deducciones']['nomina12:Deduccion'].push({ _attributes: attributes });
  }

  OtroPago(attributes: XmlNominaOtroPagoAttributes, subsidio?: XmlNominaSubsidioAttributes, compensacion?: XmlNominaCompensacionAttributes): void {
    if (!this.complemento['nomina12:OtrosPagos']) {
      this.complemento['nomina12:OtrosPagos'] = { 'nomina12:OtroPago': [] };
    }
    const pago: any = { _attributes: attributes };
    if (subsidio) pago['nomina12:SubsidioAlEmpleo'] = { _attributes: subsidio };
    if (compensacion) pago['nomina12:CompensacionSaldosAFavor'] = { _attributes: compensacion };
    this.complemento['nomina12:OtrosPagos']['nomina12:OtroPago'].push(pago);
  }

  Incapacidad(attributes: XmlNominaIncapacidadAttributes): void {
    if (!this.complemento['nomina12:Incapacidades']) {
      this.complemento['nomina12:Incapacidades'] = { 'nomina12:Incapacidad': [] };
    }
    this.complemento['nomina12:Incapacidades']['nomina12:Incapacidad'].push({ _attributes: attributes });
  }
}
