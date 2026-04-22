export interface XmlEcc12 {
  _attributes: XmlEcc12Attributes;
  'ecc12:Conceptos'?: XmlEcc12Conceptos;
}

export interface XmlEcc12Attributes {
  Version: string;
  TipoOperacion: string;
  NumeroDeCuenta: string;
  SubTotal: string;
  Total: string;
}

export interface XmlEcc12Conceptos {
  'ecc12:ConceptoEstadoDeCuentaCombustible': XmlEcc12Concepto[];
}

export interface XmlEcc12Concepto {
  _attributes: XmlEcc12ConceptoAttributes;
  'ecc12:Traslados'?: XmlEcc12Traslados;
}

export interface XmlEcc12ConceptoAttributes {
  Identificador: string;
  Fecha: string;
  Rfc: string;
  ClaveEstacion: string;
  Cantidad: string;
  TipoCombustible: string;
  Unidad?: string;
  NombreCombustible: string;
  FolioOperacion: string;
  ValorUnitario: string;
  Importe: string;
}

export interface XmlEcc12Traslados {
  'ecc12:Traslado': XmlEcc12Traslado[];
}

export interface XmlEcc12Traslado {
  _attributes: XmlEcc12TrasladoAttributes;
}

export interface XmlEcc12TrasladoAttributes {
  Impuesto: string;
  TasaOCuota: string;
  Importe: string;
}
