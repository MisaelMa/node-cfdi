export interface XmlServicioparcial {
  _attributes: XmlServicioparcialAttributes;
  'servicioparcial:Inmueble'?: XmlServicioparcialInmueble;
}

export interface XmlServicioparcialAttributes {
  Version: string;
  NumPerLicoAut: string;
}

export interface XmlServicioparcialInmueble {
  _attributes: XmlServicioparcialInmuebleAttributes;
}

export interface XmlServicioparcialInmuebleAttributes {
  Calle: string;
  NoExterior?: string;
  NoInterior?: string;
  Colonia?: string;
  Localidad?: string;
  Referencia?: string;
  Municipio: string;
  Estado: string;
  CodigoPostal: string;
}
