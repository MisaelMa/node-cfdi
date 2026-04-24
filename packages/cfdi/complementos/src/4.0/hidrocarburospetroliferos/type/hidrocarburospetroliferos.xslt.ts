import { TipoPermiso, SubProductoHYP } from './hidrocarburospetroliferos.enum';

export interface XmlHidrocarburosPetroliferos {
  _attributes?: XmlHidrocarburosPetroliferosAttributes;
}

export interface XmlHidrocarburosPetroliferosAttributes {
  Version: string;
  TipoPermiso: TipoPermiso | string;
  NumeroPermiso: string;
  ClaveHYP: string;
  SubProductoHYP: SubProductoHYP | string;
}
