export interface XmlGceh {
  _attributes: XmlGcehAttributes;
  'gceh:Erogacion'?: XmlGcehErogacion[];
}

export interface XmlGcehAttributes {
  Version: string;
  NumeroContrato: string;
  AreaContractual?: string;
}

export interface XmlGcehErogacion {
  _attributes: XmlGcehErogacionAttributes;
  'gceh:DocumentoRelacionado'?: XmlGcehDocRelacionado[];
  'gceh:Actividades'?: XmlGcehActividad[];
  'gceh:CentroCostos'?: XmlGcehCentroCosto[];
}

export interface XmlGcehErogacionAttributes {
  TipoErogacion: string;
  MontocuErogacion: string;
  Porcentaje: string;
}

export interface XmlGcehDocRelacionado {
  _attributes: XmlGcehDocRelacionadoAttributes;
}

export interface XmlGcehDocRelacionadoAttributes {
  FolioFiscalVinculado: string;
  FechaFolioFiscalVinculado: string;
  Mes: string;
  MontoTotalIVA16?: string;
  MontoTotalIVA0?: string;
}

export interface XmlGcehActividad {
  _attributes: XmlGcehActividadAttributes;
  'gceh:SubActividades'?: XmlGcehSubActividad[];
}

export interface XmlGcehActividadAttributes {
  ActividadRelacionada?: string;
}

export interface XmlGcehSubActividad {
  _attributes: XmlGcehSubActividadAttributes;
  'gceh:Tareas'?: XmlGcehTarea[];
}

export interface XmlGcehSubActividadAttributes {
  SubActividadRelacionada?: string;
}

export interface XmlGcehTarea {
  _attributes: XmlGcehTareaAttributes;
}

export interface XmlGcehTareaAttributes {
  TareaRelacionada?: string;
}

export interface XmlGcehCentroCosto {
  _attributes: XmlGcehCentroCostoAttributes;
  'gceh:Yacimientos'?: XmlGcehYacimiento[];
}

export interface XmlGcehCentroCostoAttributes {
  Campo?: string;
}

export interface XmlGcehYacimiento {
  _attributes: XmlGcehYacimientoAttributes;
  'gceh:Pozos'?: XmlGcehPozo[];
}

export interface XmlGcehYacimientoAttributes {
  NombreDelYacimiento?: string;
}

export interface XmlGcehPozo {
  _attributes: XmlGcehPozoAttributes;
}

export interface XmlGcehPozoAttributes {
  NombreDelPozo?: string;
}
