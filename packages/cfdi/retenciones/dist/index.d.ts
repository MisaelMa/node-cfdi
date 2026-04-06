export declare function buildRetencion20Xml(doc: Retencion20): string;

export declare interface ComplementoRetencion<TMeta = Record<string, unknown>> {
    innerXml: string;
    meta?: TMeta;
}

export declare interface EmisorRetencion {
    Rfc: string;
    NomDenRazSocE?: string;
    RegimenFiscalE: string;
    CurpE?: string;
}

export declare interface PeriodoRetencion {
    MesIni: string;
    MesFin: string;
    Ejerc: string;
}

export declare interface ReceptorExtranjero {
    NumRegIdTrib?: string;
    NomDenRazSocR: string;
}

export declare interface ReceptorNacional {
    RfcRecep: string;
    NomDenRazSocR?: string;
    CurpR?: string;
}

export declare interface ReceptorRetencion {
    NacionalidadR: 'Nacional' | 'Extranjero';
    nacional?: ReceptorNacional;
    extranjero?: ReceptorExtranjero;
}

export declare interface Retencion10 {
    Version: '1.0';
    CveRetenc: string;
    DescRetenc?: string;
    FechaExp: string;
    LugarExpRet: string;
    NumCert?: string;
    FolioInt?: string;
    emisor: EmisorRetencion;
    receptor: ReceptorRetencion;
    periodo: PeriodoRetencion;
    totales: TotalesRetencion;
    complemento?: ComplementoRetencion[];
}

export declare interface Retencion20 {
    Version: '2.0';
    CveRetenc: string;
    DescRetenc?: string;
    FechaExp: string;
    LugarExpRet: string;
    NumCert?: string;
    FolioInt?: string;
    emisor: EmisorRetencion;
    receptor: ReceptorRetencion;
    periodo: PeriodoRetencion;
    totales: TotalesRetencion;
    complemento?: ComplementoRetencion[];
}

export declare const RETENCION_PAGO_NAMESPACE_V1 = "http://www.sat.gob.mx/esquemas/retencionpago/1";

export declare const RETENCION_PAGO_NAMESPACE_V2 = "http://www.sat.gob.mx/esquemas/retencionpago/2";

export declare enum TipoRetencion {
    Arrendamiento = "14",
    Dividendos = "16",
    Intereses = "17",
    Fideicomiso = "18",
    EnajenacionAcciones = "19",
    Otro = "99"
}

export declare interface TotalesRetencion {
    montoTotOperacion: string;
    montoTotGrav: string;
    montoTotExent: string;
    montoTotRet: string;
}

export { }
