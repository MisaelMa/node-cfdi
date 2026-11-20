export interface XmlIedu {
  _attributes?: XmlIeduAttribute;
}

export interface XmlIeduAttribute {
  version: string;
  nombreAlumno: string;
  CURP: string;
  nivelEducativo: string;
  autRVOE: string;
  rfcPago?: string;
}
