export interface XmlCce11 {
  _attributes: XmlCce11Attributes;
  'cce11:Emisor'?: XmlCce11Emisor;
  'cce11:Propietario'?: XmlCce11Propietario[];
  'cce11:Receptor'?: XmlCce11Receptor;
  'cce11:Destinatario'?: XmlCce11Destinatario[];
  'cce11:Mercancias'?: XmlCce11Mercancias;
}

export interface XmlCce11Attributes {
  Version: string;
  MotivoTraslado?: string;
  TipoOperacion: string;
  ClaveDePedimento?: string;
  CertificadoOrigen?: string;
  NumCertificadoOrigen?: string;
  NumeroExportadorConfiable?: string;
  Incoterm?: string;
  Subdivision?: string;
  Observaciones?: string;
  TipoCambioUSD?: string;
  TotalUSD?: string;
}

export interface XmlCce11Domicilio {
  _attributes: XmlCce11DomicilioAttributes;
}

export interface XmlCce11DomicilioAttributes {
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

export interface XmlCce11Emisor {
  _attributes?: XmlCce11EmisorAttributes;
  'cce11:Domicilio'?: XmlCce11Domicilio;
}

export interface XmlCce11EmisorAttributes {
  Curp?: string;
}

export interface XmlCce11Receptor {
  _attributes?: XmlCce11ReceptorAttributes;
  'cce11:Domicilio'?: XmlCce11Domicilio;
}

export interface XmlCce11ReceptorAttributes {
  NumRegIdTrib?: string;
}

export interface XmlCce11Propietario {
  _attributes: XmlCce11PropietarioAttributes;
}

export interface XmlCce11PropietarioAttributes {
  NumRegIdTrib: string;
  ResidenciaFiscal: string;
}

export interface XmlCce11Destinatario {
  _attributes?: XmlCce11DestinatarioAttributes;
  'cce11:Domicilio'?: XmlCce11Domicilio;
}

export interface XmlCce11DestinatarioAttributes {
  NumRegIdTrib?: string;
  Nombre?: string;
}

export interface XmlCce11Mercancias {
  'cce11:Mercancia': XmlCce11Mercancia[];
}

export interface XmlCce11Mercancia {
  _attributes: XmlCce11MercanciaAttributes;
  'cce11:DescripcionesEspecificas'?: XmlCce11DescEspecifica[];
}

export interface XmlCce11MercanciaAttributes {
  NoIdentificacion: string;
  FraccionArancelaria?: string;
  CantidadAduana?: string;
  UnidadAduana?: string;
  ValorUnitarioAduana?: string;
  ValorDolares: string;
}

export interface XmlCce11DescEspecifica {
  _attributes: XmlCce11DescEspecificaAttributes;
}

export interface XmlCce11DescEspecificaAttributes {
  Marca: string;
  Modelo?: string;
  SubModelo?: string;
  NumeroSerie?: string;
}
