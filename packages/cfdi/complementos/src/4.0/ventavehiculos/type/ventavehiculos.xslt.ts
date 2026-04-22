export interface XmlVentaVehiculos {
  _attributes: XmlVentaVehiculosAttributes;
  'ventavehiculos:InformacionAduanera'?: XmlVentaVehiculosInfoAduanera[];
}

export interface XmlVentaVehiculosAttributes {
  version: string;
  ClaveVehicular: string;
  Niv?: string;
}

export interface XmlVentaVehiculosInfoAduanera {
  _attributes: XmlVentaVehiculosInfoAduaneraAttributes;
}

export interface XmlVentaVehiculosInfoAduaneraAttributes {
  numero: string;
  fecha: string;
  aduana?: string;
}
