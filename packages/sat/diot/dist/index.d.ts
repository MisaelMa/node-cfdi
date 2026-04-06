export declare function buildDiotTxt(declaracion: DiotDeclaracion): string;

export declare interface DiotDeclaracion {
    rfc: string;
    ejercicio: number;
    periodo: number;
    operaciones: OperacionTercero[];
}

export declare interface OperacionTercero {
    tipoTercero: TipoTercero;
    tipoOperacion: TipoOperacion;
    rfc?: string;
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

export declare enum TipoOperacion {
    ProfesionalesHonorarios = "85",
    Arrendamiento = "06",
    OtrosConIVA = "03",
    OtrosSinIVA = "04"
}

export declare enum TipoTercero {
    ProveedorNacional = "04",
    ProveedorExtranjero = "05",
    ProveedorGlobal = "15"
}

export { }
