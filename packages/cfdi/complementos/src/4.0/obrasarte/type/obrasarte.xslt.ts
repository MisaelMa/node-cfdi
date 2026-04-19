export interface XmlObrasarte {
  _attributes: XmlObrasarteAttributes;
}

export interface XmlObrasarteAttributes {
  Version: string;
  TipoBien: string;
  OtrosTipoBien?: string;
  TituloAdquirido: string;
  OtrosTituloAdquirido?: string;
  Subtotal?: string;
  IVA?: string;
  FechaAdquisicion: string;
  CaracterísticasDeObraoPieza: string;
}
