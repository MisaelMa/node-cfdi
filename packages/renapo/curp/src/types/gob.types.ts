const sexo = ["M", "H", "X"] as const
const entidad = [
  'AS', 'BC', 'BS', 'CC',
  'CL', 'CM', 'CS', 'CH',
  'DF', 'DG', 'GT', 'GR',
  'HG', 'JC', 'MC', 'MN',
  'MS', 'NT', 'NL', 'OC',
  'PL', 'QT', 'QR', 'SP',
  'SL', 'SR', 'TC', 'TS',
  'TL', 'VZ', 'YN', 'ZS',
  'NE'
] as const
const meses = [
  "01", "02", "03", "04", "05",
  "06", "07", "08", "09", "10",
  "11", "12"
] as const
const dias = [
  "01", "02", "03", "04", "05",
  "06", "07", "08", "09", "10",
  "11", "12", "13", "14", "15",
  "16", "17", "18", "19", "20",
  "21", "22", "23", "24", "25",
  "26", "27", "28", "29", "30",
  "31"
] as const
export interface TypeFinde {
  tipoBusqueda: "datos" | "curp"
}
export type entidadType = typeof entidad[number]
export type daysType = typeof dias[number]
export type mesesType = typeof meses[number]
export type sexoType = typeof sexo[number];
export interface WithData {
  claveEntidad: entidadType
  diaNacimiento: daysType
  mesNacimiento: mesesType
  nombres: string
  primerApellido: string
  segundoApellido: string
  selectedYear: string
  sexo: sexoType
}

export interface WithCurp {
  curp: string
}



export interface Renapo {
  codigo: string;
  mensaje: string;
  registros: Registro[]
}

export interface DocProbatorio {
  anioReg: string
  claveEntidadRegistro: string
  claveMunicipioRegistro: string
  entidadRegistro: string
  foja: string
  libro: string
  municipioRegistro: string
  numActa: string
  tomo: string
}
export interface Registro {
  claveEntidad: entidadType
  curp: string
  datosDocProbatorio: DocProbatorio
  docProbatorio: number | string;
  entidad: string
  fechaNacimiento: string
  nacionalidad: string
  nombres: string
  parametro: string
  primerApellido: string
  segundoApellido: string
  sexo: string
  statusCurp: string
}

