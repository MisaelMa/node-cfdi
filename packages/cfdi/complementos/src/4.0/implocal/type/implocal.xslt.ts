export interface XmlImplocal {
  _attributes: XmlImplocalAttributes;
  'implocal:RetencionesLocales'?: XmlImplocalRetencion[];
  'implocal:TrasladosLocales'?: XmlImplocalTraslado[];
}

export interface XmlImplocalAttributes {
  version: string;
  TotaldeRetenciones: string;
  TotaldeTraslados: string;
}

export interface XmlImplocalRetencion {
  _attributes: XmlImplocalRetencionAttributes;
}

export interface XmlImplocalRetencionAttributes {
  ImpLocRetenido: string;
  TasadeRetencion: string;
  Importe: string;
}

export interface XmlImplocalTraslado {
  _attributes: XmlImplocalTrasladoAttributes;
}

export interface XmlImplocalTrasladoAttributes {
  ImpLocTrasladado: string;
  TasadeTraslado: string;
  Importe: string;
}
