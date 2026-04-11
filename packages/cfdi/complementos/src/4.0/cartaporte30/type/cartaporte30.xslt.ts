export interface XmlCartaPorte30 {
  _attributes: XmlCartaPorte30Attributes;
  'cartaporte30:Ubicaciones'?: XmlCP30Ubicaciones;
  'cartaporte30:Mercancias'?: XmlCP30Mercancias;
  'cartaporte30:FiguraTransporte'?: XmlCP30FiguraTransporte;
}

export interface XmlCartaPorte30Attributes {
  Version: string;
  TranspInternac: string;
  EntradaSalidaMerc?: string;
  PaisOrigenDestino?: string;
  ViaEntradaSalida?: string;
  TotalDistRec?: string;
  IdCCP?: string;
}

export interface XmlCP30Ubicaciones {
  'cartaporte30:Ubicacion': XmlCP30Ubicacion[];
}

export interface XmlCP30Ubicacion {
  _attributes: XmlCP30UbicacionAttributes;
  'cartaporte30:Domicilio'?: XmlCP30Domicilio;
}

export interface XmlCP30UbicacionAttributes {
  TipoUbicacion: string;
  IDUbicacion?: string;
  RFCRemitenteDestinatario: string;
  NombreRemitenteDestinatario?: string;
  FechaHoraSalidaLlegada: string;
  DistanciaRecorrida?: string;
}

export interface XmlCP30Domicilio {
  _attributes: XmlCP30DomicilioAttributes;
}

export interface XmlCP30DomicilioAttributes {
  Calle?: string;
  NumeroExterior?: string;
  NumeroInterior?: string;
  Colonia?: string;
  Localidad?: string;
  Referencia?: string;
  Municipio?: string;
  Estado: string;
  Pais: string;
  CodigoPostal: string;
}

export interface XmlCP30Mercancias {
  _attributes: XmlCP30MercanciasAttributes;
  'cartaporte30:Mercancia'?: XmlCP30Mercancia[];
  'cartaporte30:Autotransporte'?: any;
  'cartaporte30:TransporteMaritimo'?: any;
  'cartaporte30:TransporteAereo'?: any;
  'cartaporte30:TransporteFerroviario'?: any;
}

export interface XmlCP30MercanciasAttributes {
  PesoBrutoTotal: string;
  UnidadPeso: string;
  PesoNetoTotal?: string;
  NumTotalMercancias: string;
}

export interface XmlCP30Mercancia {
  _attributes: XmlCP30MercanciaAttributes;
}

export interface XmlCP30MercanciaAttributes {
  BienesTransp: string;
  Descripcion: string;
  Cantidad: string;
  ClaveUnidad: string;
  Unidad?: string;
  PesoEnKg: string;
  MaterialPeligroso?: string;
  CveMaterialPeligroso?: string;
  ValorMercancia?: string;
  Moneda?: string;
  FraccionArancelaria?: string;
}

export interface XmlCP30FiguraTransporte {
  'cartaporte30:TiposFigura': XmlCP30TipoFigura[];
}

export interface XmlCP30TipoFigura {
  _attributes: XmlCP30TipoFiguraAttributes;
  'cartaporte30:Domicilio'?: XmlCP30Domicilio;
}

export interface XmlCP30TipoFiguraAttributes {
  TipoFigura: string;
  RFCFigura?: string;
  NumLicencia?: string;
  NombreFigura?: string;
}
