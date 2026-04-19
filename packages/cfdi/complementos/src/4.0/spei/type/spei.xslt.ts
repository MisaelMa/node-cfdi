export interface XmlSpei {
  'spei:SPEI_Tercero'?: XmlSpeiTercero[];
}

export interface XmlSpeiTercero {
  _attributes: XmlSpeiTerceroAttributes;
  'spei:Ordenante'?: XmlSpeiOrdenante;
  'spei:Beneficiario'?: XmlSpeiBeneficiario;
}

export interface XmlSpeiTerceroAttributes {
  FechaOperacion: string;
  Hora: string;
  ClaveSPEI: string;
  sello: string;
  numeroCertificado: string;
}

export interface XmlSpeiOrdenante {
  _attributes: XmlSpeiOrdenanteAttributes;
}

export interface XmlSpeiOrdenanteAttributes {
  BancoEmisor: string;
  Nombre: string;
  TipoCuenta: string;
  Cuenta: string;
  RFC: string;
}

export interface XmlSpeiBeneficiario {
  _attributes: XmlSpeiBeneficiarioAttributes;
}

export interface XmlSpeiBeneficiarioAttributes {
  BancoReceptor: string;
  Nombre: string;
  TipoCuenta: string;
  Cuenta: string;
  RFC: string;
  Concepto: string;
  IVA?: string;
  MontoPago: string;
}
