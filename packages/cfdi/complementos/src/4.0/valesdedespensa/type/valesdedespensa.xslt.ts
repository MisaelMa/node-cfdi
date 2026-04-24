export interface XmlValesDeDespensa {
  _attributes: XmlValesDeDespensaAttributes;
  'valesdedespensa:Conceptos'?: XmlValesConceptos;
}

export interface XmlValesDeDespensaAttributes {
  version: string;
  tipoOperacion: string;
  registroPatronal?: string;
  numeroDeCuenta: string;
  total: string;
}

export interface XmlValesConceptos {
  'valesdedespensa:Concepto': XmlValesConcepto[];
}

export interface XmlValesConcepto {
  _attributes: XmlValesConceptoAttributes;
}

export interface XmlValesConceptoAttributes {
  identificador: string;
  fecha: string;
  rfc: string;
  curp: string;
  nombre: string;
  numSeguridadSocial?: string;
  importe: string;
}
