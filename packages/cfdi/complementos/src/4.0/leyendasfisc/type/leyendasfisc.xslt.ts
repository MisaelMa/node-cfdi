export interface XmlLeyendasFiscales {
  _attributes: XmlLeyendasFiscalesAttributes;
  'leyendasFisc:Leyenda'?: XmlLeyenda[];
}

export interface XmlLeyendasFiscalesAttributes {
  version: string;
}

export interface XmlLeyenda {
  _attributes: XmlLeyendaAttributes;
}

export interface XmlLeyendaAttributes {
  disposicionFiscal?: string;
  norma?: string;
  textoLeyenda: string;
}
