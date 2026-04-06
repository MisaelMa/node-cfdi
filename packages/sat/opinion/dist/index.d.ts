export declare interface ObligacionFiscal {
    descripcion: string;
    fechaInicio: string;
    fechaFin?: string;
    estado: string;
}

export declare interface OpinionConfig {
    timeout?: number;
    baseUrl?: string;
}

export declare interface OpinionCumplimiento {
    rfc: string;
    nombreContribuyente: string;
    resultado: ResultadoOpinion;
    fechaEmision: string;
    folioOpinion: string;
    obligaciones: ObligacionFiscal[];
    urlPdf?: string;
}

export declare class OpinionCumplimientoService {
    private readonly _baseUrl;
    private readonly _timeout;
    constructor(config?: OpinionConfig);
    obtener(sesion: SesionPortalLike): Promise<OpinionCumplimiento>;
    descargarPdf(sesion: SesionPortalLike, urlPdf?: string): Promise<Buffer>;
    private _fetch;
    private _fetchRaw;
    private _parseOpinion;
    private _extractResultado;
    private _extractBetween;
    private _parseObligaciones;
    private _extractCells;
}

export declare enum ResultadoOpinion {
    Positivo = "Positivo",
    Negativo = "Negativo",
    EnSuspenso = "En suspenso",
    Inscrito = "Inscrito sin obligaciones",
    NoInscrito = "No inscrito"
}

export declare interface SesionPortalLike {
    cookies: Record<string, string>;
    rfc: string;
    authenticated: boolean;
}

export { }
