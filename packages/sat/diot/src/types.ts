export enum TipoTercero {
  ProveedorNacional = '04',
  ProveedorExtranjero = '05',
  ProveedorGlobal = '15',
}

export enum TipoOperacion {
  ProfesionalesHonorarios = '85',
  Arrendamiento = '06',
  OtrosConIVA = '03',
  OtrosSinIVA = '04',
}

export interface OperacionTercero {
  tipoTercero: TipoTercero;
  tipoOperacion: TipoOperacion;
  rfc?: string;
  /** Obligatorio para proveedor extranjero; vacío u omitido en nacional. */
  idFiscal?: string;
  nombreExtranjero?: string;
  paisResidencia?: string;
  nacionalidad?: string;
  montoIva16: number;
  montoIva0: number;
  montoExento: number;
  montoRetenido: number;
  montoIvaNoDeduc: number;
}

export interface DiotDeclaracion {
  rfc: string;
  ejercicio: number;
  periodo: number;
  operaciones: OperacionTercero[];
}
