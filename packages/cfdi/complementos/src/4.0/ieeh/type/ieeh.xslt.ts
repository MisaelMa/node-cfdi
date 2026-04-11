export interface XmlIeeh {
  _attributes: XmlIeehAttributes;
  'ieeh:DocumentoRelacionado'?: XmlIeehDocRelacionado[];
}

export interface XmlIeehAttributes {
  Version: string;
  NumeroContrato: string;
  ContraprestacionPagadaOperador: string;
  Porcentaje: string;
}

export interface XmlIeehDocRelacionado {
  _attributes: XmlIeehDocRelacionadoAttributes;
}

export interface XmlIeehDocRelacionadoAttributes {
  FolioFiscalVinculado: string;
  FechaFolioFiscalVinculado: string;
  Mes: string;
}
