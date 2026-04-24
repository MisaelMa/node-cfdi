export interface XmlVehiculousado {
  _attributes: XmlVehiculousadoAttributes;
  'vehiculousado:InformacionAduanera'?: XmlVehiculoInfoAduanera;
}

export interface XmlVehiculousadoAttributes {
  Version: string;
  montoAdquisicion: string;
  montoEnajenacion: string;
  claveVehicular: string;
  marca: string;
  tipo: string;
  modelo: string;
  numeroMotor?: string;
  numeroSerie?: string;
  NIV: string;
  valor: string;
}

export interface XmlVehiculoInfoAduanera {
  _attributes: XmlVehiculoInfoAduaneraAttributes;
}

export interface XmlVehiculoInfoAduaneraAttributes {
  numero: string;
  fecha: string;
  aduana?: string;
}
