export interface XmlPfic {
  _attributes: XmlPficAttributes;
}

export interface XmlPficAttributes {
  version: string;
  ClaveVehicular: string;
  Placa: string;
  RFCPF?: string;
}
