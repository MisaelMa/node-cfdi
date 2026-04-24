export interface XmlTpe {
  _attributes: XmlTpeAttributes;
  'tpe:datosTransito'?: XmlTpeDatosTransito[];
}

export interface XmlTpeAttributes {
  version: string;
  fechadeTransito: string;
  tipoTransito: string;
}

export interface XmlTpeDatosTransito {
  _attributes: XmlTpeDatosTransitoAttributes;
}

export interface XmlTpeDatosTransitoAttributes {
  Via: string;
  TipoId: string;
  NumeroId: string;
  Nacionalidad: string;
  EmpresaTransporte: string;
  IdTransporte?: string;
}
