export interface XmlTfd {
  _attributes: XmlTfdAttributes;
}

export interface XmlTfdAttributes {
  Version: string;
  UUID: string;
  FechaTimbrado: string;
  RfcProvCertif: string;
  Leyenda?: string;
  SelloCFD: string;
  NoCertificadoSAT: string;
  SelloSAT?: string;
}
