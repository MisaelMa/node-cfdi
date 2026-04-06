export declare interface CfdiData {
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

export declare interface ConceptoData {
    attributes: Record<string, string>;
    impuestos?: {
        traslados: Record<string, string>[];
        retenciones: Record<string, string>[];
    };
}

export declare const conceptosRules: ValidationRule[];

export declare const emisorRules: ValidationRule[];

export declare const estructuraRules: ValidationRule[];

export declare interface ImpuestosData {
    totalImpuestosTrasladados?: string;
    totalImpuestosRetenidos?: string;
    traslados: Record<string, string>[];
    retenciones: Record<string, string>[];
}

export declare const impuestosRules: ValidationRule[];

export declare const montosRules: ValidationRule[];

export declare function parseXml(xml: string): CfdiData;

export declare const receptorRules: ValidationRule[];

export declare const selloRules: ValidationRule[];

export declare interface TimbreData {
    uuid: string;
    fechaTimbrado: string;
    rfcProvCertif: string;
    selloCFD: string;
    selloSAT: string;
    noCertificadoSAT: string;
    version: string;
}

export declare const timbreRules: ValidationRule[];

export declare class Validador {
    private _rules;
    constructor();
    validate(xml: string): ValidationResult;
    validateFile(filePath: string): ValidationResult;
}

export declare interface ValidationIssue {
    code: string;
    message: string;
    field?: string;
    rule: string;
}

export declare interface ValidationResult {
    valid: boolean;
    errors: ValidationIssue[];
    warnings: ValidationIssue[];
    version: string;
}

export declare type ValidationRule = (xml: CfdiData) => ValidationIssue[];

export { }
