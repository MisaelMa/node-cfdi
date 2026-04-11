export interface XmlNomina12 {
  _attributes: XmlNomina12Attributes;
  'nomina12:Emisor'?: XmlNominaEmisor;
  'nomina12:Receptor'?: XmlNominaReceptor;
  'nomina12:Percepciones'?: XmlNominaPercepciones;
  'nomina12:Deducciones'?: XmlNominaDeducciones;
  'nomina12:OtrosPagos'?: XmlNominaOtrosPagos;
  'nomina12:Incapacidades'?: XmlNominaIncapacidades;
}

export interface XmlNomina12Attributes {
  Version: string;
  TipoNomina: string;
  FechaPago: string;
  FechaInicialPago: string;
  FechaFinalPago: string;
  NumDiasPagados: string;
  TotalPercepciones?: string;
  TotalDeducciones?: string;
  TotalOtrosPagos?: string;
}

export interface XmlNominaEmisor {
  _attributes?: XmlNominaEmisorAttributes;
  'nomina12:EntidadSNCF'?: XmlNominaEntidadSNCF;
}

export interface XmlNominaEmisorAttributes {
  Curp?: string;
  RegistroPatronal?: string;
  RfcPatronOrigen?: string;
}

export interface XmlNominaEntidadSNCF {
  _attributes: XmlNominaEntidadSNCFAttributes;
}

export interface XmlNominaEntidadSNCFAttributes {
  OrigenRecurso: string;
  MontoRecursoPropio?: string;
}

export interface XmlNominaReceptor {
  _attributes: XmlNominaReceptorAttributes;
  'nomina12:SubContratacion'?: XmlNominaSubContratacion[];
}

export interface XmlNominaReceptorAttributes {
  Curp: string;
  NumSeguridadSocial?: string;
  FechaInicioRelLaboral?: string;
  Antigüedad?: string;
  TipoContrato: string;
  Sindicalizado?: string;
  TipoJornada?: string;
  TipoRegimen: string;
  NumEmpleado: string;
  Departamento?: string;
  Puesto?: string;
  RiesgoPuesto?: string;
  PeriodicidadPago: string;
  Banco?: string;
  CuentaBancaria?: string;
  SalarioBaseCotApor?: string;
  SalarioDiarioIntegrado?: string;
  ClaveEntFed: string;
}

export interface XmlNominaSubContratacion {
  _attributes: XmlNominaSubContratacionAttributes;
}

export interface XmlNominaSubContratacionAttributes {
  RfcLabora: string;
  PorcentajeTiempo: string;
}

export interface XmlNominaPercepciones {
  _attributes: XmlNominaPercepcionesAttributes;
  'nomina12:Percepcion'?: XmlNominaPercepcion[];
  'nomina12:JubilacionPensionRetiro'?: XmlNominaJubilacion;
  'nomina12:SeparacionIndemnizacion'?: XmlNominaSeparacion;
}

export interface XmlNominaPercepcionesAttributes {
  TotalSueldos?: string;
  TotalSeparacionIndemnizacion?: string;
  TotalJubilacionPensionRetiro?: string;
  TotalGravado: string;
  TotalExento: string;
}

export interface XmlNominaPercepcion {
  _attributes: XmlNominaPercepcionAttributes;
  'nomina12:AccionesOTitulos'?: XmlNominaAcciones;
  'nomina12:HorasExtra'?: XmlNominaHorasExtra[];
}

export interface XmlNominaPercepcionAttributes {
  TipoPercepcion: string;
  Clave: string;
  Concepto: string;
  ImporteGravado: string;
  ImporteExento: string;
}

export interface XmlNominaAcciones {
  _attributes: XmlNominaAccionesAttributes;
}

export interface XmlNominaAccionesAttributes {
  ValorMercado: string;
  PrecioAlOtorgarse: string;
}

export interface XmlNominaHorasExtra {
  _attributes: XmlNominaHorasExtraAttributes;
}

export interface XmlNominaHorasExtraAttributes {
  Dias: string;
  TipoHoras: string;
  HorasExtra: string;
  ImportePagado: string;
}

export interface XmlNominaJubilacion {
  _attributes: XmlNominaJubilacionAttributes;
}

export interface XmlNominaJubilacionAttributes {
  TotalUnaExhibicion?: string;
  TotalParcialidad?: string;
  MontoDiario?: string;
  IngresoAcumulable: string;
  IngresoNoAcumulable: string;
}

export interface XmlNominaSeparacion {
  _attributes: XmlNominaSeparacionAttributes;
}

export interface XmlNominaSeparacionAttributes {
  TotalPagado: string;
  NumAñosServicio: string;
  UltimoSueldoMensOrd: string;
  IngresoAcumulable: string;
  IngresoNoAcumulable: string;
}

export interface XmlNominaDeducciones {
  _attributes?: XmlNominaDeduccionesAttributes;
  'nomina12:Deduccion'?: XmlNominaDeduccion[];
}

export interface XmlNominaDeduccionesAttributes {
  TotalOtrasDeducciones?: string;
  TotalImpuestosRetenidos?: string;
}

export interface XmlNominaDeduccion {
  _attributes: XmlNominaDeduccionAttributes;
}

export interface XmlNominaDeduccionAttributes {
  TipoDeduccion: string;
  Clave: string;
  Concepto: string;
  Importe: string;
}

export interface XmlNominaOtrosPagos {
  'nomina12:OtroPago': XmlNominaOtroPago[];
}

export interface XmlNominaOtroPago {
  _attributes: XmlNominaOtroPagoAttributes;
  'nomina12:SubsidioAlEmpleo'?: XmlNominaSubsidio;
  'nomina12:CompensacionSaldosAFavor'?: XmlNominaCompensacion;
}

export interface XmlNominaOtroPagoAttributes {
  TipoOtroPago: string;
  Clave: string;
  Concepto: string;
  Importe: string;
}

export interface XmlNominaSubsidio {
  _attributes: XmlNominaSubsidioAttributes;
}

export interface XmlNominaSubsidioAttributes {
  SubsidioCausado: string;
}

export interface XmlNominaCompensacion {
  _attributes: XmlNominaCompensacionAttributes;
}

export interface XmlNominaCompensacionAttributes {
  SaldoAFavor: string;
  Año: string;
  RemanenteSalFav: string;
}

export interface XmlNominaIncapacidades {
  'nomina12:Incapacidad': XmlNominaIncapacidad[];
}

export interface XmlNominaIncapacidad {
  _attributes: XmlNominaIncapacidadAttributes;
}

export interface XmlNominaIncapacidadAttributes {
  DiasIncapacidad: string;
  TipoIncapacidad: string;
  ImporteMonetario?: string;
}
