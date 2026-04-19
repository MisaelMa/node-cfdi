export interface XmlCartaPorte31 {
  _attributes: XmlCartaPorte31Attributes;
  'cartaporte31:Ubicaciones'?: XmlCP31Ubicaciones;
  'cartaporte31:Mercancias'?: XmlCP31Mercancias;
  'cartaporte31:FiguraTransporte'?: XmlCP31FiguraTransporte;
}

export interface XmlCartaPorte31Attributes {
  Version: string;
  TranspInternac: string;
  EntradaSalidaMerc?: string;
  PaisOrigenDestino?: string;
  ViaEntradaSalida?: string;
  TotalDistRec?: string;
  IdCCP?: string;
}

export interface XmlCP31Ubicaciones {
  'cartaporte31:Ubicacion': XmlCP31Ubicacion[];
}

export interface XmlCP31Ubicacion {
  _attributes: XmlCP31UbicacionAttributes;
  'cartaporte31:Domicilio'?: XmlCP31Domicilio;
}

export interface XmlCP31UbicacionAttributes {
  TipoUbicacion: string;
  IDUbicacion?: string;
  RFCRemitenteDestinatario: string;
  NombreRemitenteDestinatario?: string;
  FechaHoraSalidaLlegada: string;
  DistanciaRecorrida?: string;
}

export interface XmlCP31Domicilio {
  _attributes: XmlCP31DomicilioAttributes;
}

export interface XmlCP31DomicilioAttributes {
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

export interface XmlCP31Mercancias {
  _attributes: XmlCP31MercanciasAttributes;
  'cartaporte31:Mercancia'?: XmlCP31Mercancia[];
  'cartaporte31:Autotransporte'?: any;
  'cartaporte31:TransporteMaritimo'?: any;
  'cartaporte31:TransporteAereo'?: any;
  'cartaporte31:TransporteFerroviario'?: any;
}

export interface XmlCP31MercanciasAttributes {
  PesoBrutoTotal: string;
  UnidadPeso: string;
  PesoNetoTotal?: string;
  NumTotalMercancias: string;
}

export interface XmlCP31Mercancia {
  _attributes: XmlCP31MercanciaAttributes;
}

export interface XmlCP31MercanciaAttributes {
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

export interface XmlCP31FiguraTransporte {
  'cartaporte31:TiposFigura': XmlCP31TipoFigura[];
}

export interface XmlCP31TipoFigura {
  _attributes: XmlCP31TipoFiguraAttributes;
  'cartaporte31:Domicilio'?: XmlCP31Domicilio;
}

export interface XmlCP31TipoFiguraAttributes {
  TipoFigura: string;
  RFCFigura?: string;
  NumLicencia?: string;
  NombreFigura?: string;
}
