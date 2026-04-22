export interface XmlConsumodecombustibles {
  _attributes: XmlConsumodecombustiblesAttributes;
  'consumodecombustibles11:Conceptos'?: XmlCondComConceptos;
}

export interface XmlConsumodecombustiblesAttributes {
  version: string;
  tipoOperacion: string;
  numeroDeCuenta: string;
  subTotal?: string;
  total: string;
}

export interface XmlCondComConceptos {
  'consumodecombustibles11:ConceptoConsumoDeCombustibles': XmlCondComConcepto[];
}

export interface XmlCondComConcepto {
  _attributes: XmlCondComConceptoAttributes;
  'consumodecombustibles11:Determinados'?: XmlCondComDeterminados;
}

export interface XmlCondComConceptoAttributes {
  identificador: string;
  fecha: string;
  rfc: string;
  claveEstacion: string;
  cantidad: string;
  nombreCombustible: string;
  folioOperacion: string;
  valorUnitario: string;
  importe: string;
}

export interface XmlCondComDeterminados {
  'consumodecombustibles11:Determinado': XmlCondComDeterminado[];
}

export interface XmlCondComDeterminado {
  _attributes: XmlCondComDeterminadoAttributes;
}

export interface XmlCondComDeterminadoAttributes {
  impuesto: string;
  tasa: string;
  importe: string;
}
