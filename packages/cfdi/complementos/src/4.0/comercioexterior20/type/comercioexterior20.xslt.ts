export interface XmlCce20 {
  _attributes: XmlCce20Attributes;
  'cce20:Emisor'?: XmlCce20Emisor;
  'cce20:Propietario'?: XmlCce20Propietario[];
  'cce20:Receptor'?: XmlCce20Receptor;
  'cce20:Destinatario'?: XmlCce20Destinatario[];
  'cce20:Mercancias'?: XmlCce20Mercancias;
}

export interface XmlCce20Attributes {
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

export interface XmlCce20Domicilio {
  _attributes: XmlCce20DomicilioAttributes;
}

export interface XmlCce20DomicilioAttributes {
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

export interface XmlCce20Emisor {
  _attributes?: XmlCce20EmisorAttributes;
  'cce20:Domicilio'?: XmlCce20Domicilio;
}

export interface XmlCce20EmisorAttributes {
  Curp?: string;
}

export interface XmlCce20Receptor {
  _attributes?: XmlCce20ReceptorAttributes;
  'cce20:Domicilio'?: XmlCce20Domicilio;
}

export interface XmlCce20ReceptorAttributes {
  NumRegIdTrib?: string;
}

export interface XmlCce20Propietario {
  _attributes: XmlCce20PropietarioAttributes;
}

export interface XmlCce20PropietarioAttributes {
  NumRegIdTrib: string;
  ResidenciaFiscal: string;
}

export interface XmlCce20Destinatario {
  _attributes?: XmlCce20DestinatarioAttributes;
  'cce20:Domicilio'?: XmlCce20Domicilio;
}

export interface XmlCce20DestinatarioAttributes {
  NumRegIdTrib?: string;
  Nombre?: string;
}

export interface XmlCce20Mercancias {
  'cce20:Mercancia': XmlCce20Mercancia[];
}

export interface XmlCce20Mercancia {
  _attributes: XmlCce20MercanciaAttributes;
  'cce20:DescripcionesEspecificas'?: XmlCce20DescEspecifica[];
}

export interface XmlCce20MercanciaAttributes {
  NoIdentificacion: string;
  FraccionArancelaria?: string;
  CantidadAduana?: string;
  UnidadAduana?: string;
  ValorUnitarioAduana?: string;
  ValorDolares: string;
}

export interface XmlCce20DescEspecifica {
  _attributes: XmlCce20DescEspecificaAttributes;
}

export interface XmlCce20DescEspecificaAttributes {
  Marca: string;
  Modelo?: string;
  SubModelo?: string;
  NumeroSerie?: string;
}
