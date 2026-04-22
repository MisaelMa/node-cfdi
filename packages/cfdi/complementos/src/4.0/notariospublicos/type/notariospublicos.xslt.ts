export interface XmlNotariosPublicos {
  _attributes: XmlNotariosPublicosAttributes;
  'notariospublicos:DescInmuebles'?: XmlNPDescInmuebles;
  'notariospublicos:DatosOperacion'?: XmlNPDatosOperacion;
  'notariospublicos:DatosNotario'?: XmlNPDatosNotario;
  'notariospublicos:DatosEnajenante'?: XmlNPDatosEnajenante;
  'notariospublicos:DatosAdquiriente'?: XmlNPDatosAdquiriente;
}

export interface XmlNotariosPublicosAttributes {
  Version: string;
}

export interface XmlNPDescInmuebles {
  'notariospublicos:DescInmueble': XmlNPDescInmueble[];
}

export interface XmlNPDescInmueble {
  _attributes: XmlNPDescInmuebleAttributes;
}

export interface XmlNPDescInmuebleAttributes {
  TipoInmueble: string;
  Calle: string;
  NoExterior?: string;
  NoInterior?: string;
  Colonia?: string;
  Localidad?: string;
  Referencia?: string;
  Municipio: string;
  Estado: string;
  Pais: string;
  CodigoPostal: string;
}

export interface XmlNPDatosOperacion {
  _attributes: XmlNPDatosOperacionAttributes;
}

export interface XmlNPDatosOperacionAttributes {
  NumInstrumentoNotarial: string;
  FechaInstNotarial: string;
  MontoOperacion: string;
  Subtotal: string;
  IVA: string;
}

export interface XmlNPDatosNotario {
  _attributes: XmlNPDatosNotarioAttributes;
}

export interface XmlNPDatosNotarioAttributes {
  CURP: string;
  NumNotaria: string;
  EntidadFederativa: string;
  Adscripcion?: string;
}

export interface XmlNPDatosEnajenante {
  _attributes: XmlNPDatosEnajenanteAttributes;
  'notariospublicos:DatosUnEnajenante'?: XmlNPDatosPersona;
  'notariospublicos:DatosEnajenantesCopSC'?: XmlNPDatosPersonasCopSC;
}

export interface XmlNPDatosEnajenanteAttributes {
  CoproSocConyugalE: string;
}

export interface XmlNPDatosAdquiriente {
  _attributes: XmlNPDatosAdquirienteAttributes;
  'notariospublicos:DatosUnAdquiriente'?: XmlNPDatosPersona;
  'notariospublicos:DatosAdquirientesCopSC'?: XmlNPDatosPersonasCopSC;
}

export interface XmlNPDatosAdquirienteAttributes {
  CoproSocConyugalE: string;
}

export interface XmlNPDatosPersona {
  _attributes: XmlNPDatosPersonaAttributes;
}

export interface XmlNPDatosPersonaAttributes {
  Nombre: string;
  ApellidoPaterno?: string;
  ApellidoMaterno?: string;
  RFC: string;
  CURP?: string;
}

export interface XmlNPDatosPersonasCopSC {
  'notariospublicos:DatosEnajenanteCopSC'?: XmlNPDatosPersonaCopSC[];
  'notariospublicos:DatosAdquirienteCopSC'?: XmlNPDatosPersonaCopSC[];
}

export interface XmlNPDatosPersonaCopSC {
  _attributes: XmlNPDatosPersonaCopSCAttributes;
}

export interface XmlNPDatosPersonaCopSCAttributes {
  Nombre: string;
  ApellidoPaterno?: string;
  ApellidoMaterno?: string;
  RFC: string;
  CURP?: string;
  Porcentaje: string;
}
