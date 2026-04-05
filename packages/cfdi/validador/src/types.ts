export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  version: string;
}

export interface ValidationIssue {
  code: string;
  message: string;
  field?: string;
  rule: string;
}

export type ValidationRule = (xml: CfdiData) => ValidationIssue[];

export interface CfdiData {
  version: string;
  comprobante: Record<string, string>;
  emisor: Record<string, string>;
  receptor: Record<string, string>;
  conceptos: ConceptoData[];
  impuestos?: ImpuestosData;
  complemento?: any;
  timbre?: TimbreData;
  raw: string;
}

export interface ConceptoData {
  attributes: Record<string, string>;
  impuestos?: {
    traslados: Record<string, string>[];
    retenciones: Record<string, string>[];
  };
}

export interface ImpuestosData {
  totalImpuestosTrasladados?: string;
  totalImpuestosRetenidos?: string;
  traslados: Record<string, string>[];
  retenciones: Record<string, string>[];
}

export interface TimbreData {
  uuid: string;
  fechaTimbrado: string;
  rfcProvCertif: string;
  selloCFD: string;
  selloSAT: string;
  noCertificadoSAT: string;
  version: string;
}
