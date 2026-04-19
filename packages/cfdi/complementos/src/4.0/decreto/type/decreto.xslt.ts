export interface XmlDecreto {
  _attributes: XmlDecretoAttributes;
  'decreto:DecretoRenovVehiculos'?: XmlDecretoRenov;
  'decreto:DecretoSustitVehiculos'?: XmlDecretoSustit;
}

export interface XmlDecretoAttributes {
  Version: string;
  TipoDeDecreto: string;
}

export interface XmlDecretoRenov {
  _attributes: XmlDecretoRenovAttributes;
}

export interface XmlDecretoRenovAttributes {
  VehEnaj: string;
  TipooClaseVehEnaj: string;
  MarcaVehEnaj: string;
  ModeloVehEnaj: string;
  NumPlacasVehEnaj: string;
  FechaRegVehEnaj: string;
  VehNuevo: string;
  TipooClaseVehNuevo: string;
  MarcaVehNuevo: string;
  ModeloVehNuevo: string;
  AnioModeloVehNuevo: string;
  PrecioVehNuevo: string;
  MontoDesc: string;
  FechaFact: string;
  NumCertAgworke?: string;
}

export interface XmlDecretoSustit {
  _attributes: XmlDecretoSustitAttributes;
}

export interface XmlDecretoSustitAttributes {
  VehUsadoEnaj: string;
  TipooClaseVehUsadoEnaj: string;
  MarcaVehUsadoEnaj: string;
  ModeloVehUsadoEnaj: string;
  NumPlacasVehUsadoEnaj: string;
  FechaRegVehUsadoEnaj: string;
  VehNuevo: string;
  TipooClaseVehNuevo: string;
  MarcaVehNuevo: string;
  ModeloVehNuevo: string;
  AnioModeloVehNuevo: string;
  PrecioVehSustituido: string;
  MontoDesc: string;
  FechaFact: string;
  NumCertDeposVehUsadoEnaj?: string;
}
