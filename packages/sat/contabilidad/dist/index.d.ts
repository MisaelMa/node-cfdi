export declare function buildAuxiliarXml(info: ContribuyenteInfo, cuentas: CuentaAuxiliar[], tipoSolicitud: 'AF' | 'FC' | 'DE' | 'CO', version?: VersionContabilidad): string;

export declare function buildBalanzaXml(info: ContribuyenteInfo, cuentas: CuentaBalanza[], version?: VersionContabilidad): string;

export declare function buildCatalogoXml(info: ContribuyenteInfo, cuentas: CuentaCatalogo[], version?: VersionContabilidad): string;

export declare function buildPolizasXml(info: ContribuyenteInfo, polizas: Poliza[], tipoSolicitud: 'AF' | 'FC' | 'DE' | 'CO', version?: VersionContabilidad): string;

export declare interface ContribuyenteInfo {
    rfc: string;
    mes: string;
    anio: number;
    tipoEnvio: TipoEnvio;
}

export declare interface CuentaAuxiliar {
    numCta: string;
    desCta: string;
    saldoIni: number;
    saldoFin: number;
    transacciones: TransaccionAuxiliar[];
}

export declare interface CuentaBalanza {
    numCta: string;
    saldoIni: number;
    debe: number;
    haber: number;
    saldoFin: number;
}

export declare interface CuentaCatalogo {
    codAgrup: string;
    numCta: string;
    desc: string;
    subCtaDe?: string;
    nivel: number;
    natur: NaturalezaCuenta;
}

export declare enum NaturalezaCuenta {
    Deudora = "D",
    Acreedora = "A"
}

export declare interface Poliza {
    numPoliza: string;
    fecha: string;
    concepto: string;
    detalle: PolizaDetalle[];
}

export declare interface PolizaDetalle {
    numUnidad: string;
    concepto: string;
    debe: number;
    haber: number;
    numCta: string;
}

export declare enum TipoAjuste {
    Cierre = "C",
    Apertura = "A"
}

export declare enum TipoEnvio {
    Normal = "N",
    Complementaria = "C"
}

export declare interface TransaccionAuxiliar {
    fecha: string;
    numPoliza: string;
    concepto: string;
    debe: number;
    haber: number;
}

export declare enum VersionContabilidad {
    V1_1 = "1.1",
    V1_3 = "1.3"
}

export { }
