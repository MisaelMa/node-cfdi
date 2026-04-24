export interface XmlDestruccion {
  _attributes: XmlDestruccionAttributes;
  'destruccion:InformacionAduanera'?: XmlDestruccionInfoAduanera;
  'destruccion:VehiculoDestruido'?: XmlVehiculoDestruido;
}

export interface XmlDestruccionAttributes {
  Version: string;
  Serie: string;
  NumFolDesVeh: string;
}

export interface XmlDestruccionInfoAduanera {
  _attributes: XmlDestruccionInfoAduaneraAttributes;
}

export interface XmlDestruccionInfoAduaneraAttributes {
  NumPedImp: string;
  Fecha: string;
  Aduana: string;
}

export interface XmlVehiculoDestruido {
  _attributes: XmlVehiculoDestruidoAttributes;
}

export interface XmlVehiculoDestruidoAttributes {
  Marca: string;
  TipooClase: string;
  Año: string;
  Modelo: string;
  NIV?: string;
  NumSerie?: string;
  NumPlacas: string;
  NumMotor?: string;
  NumFolTarjCir: string;
}
