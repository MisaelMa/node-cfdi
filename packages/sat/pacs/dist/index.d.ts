export declare interface CancelacionPacResult {
    uuid: string;
    estatus: string;
    acuse: string;
}

export declare interface ConsultaEstatusResult {
    uuid: string;
    estatus: string;
    xml?: string;
}

export declare class FinkokProvider implements PacProvider {
    private readonly config;
    constructor(config: PacConfig);
    private finkokOrigin;
    private stampUrl;
    private cancelUrl;
    private authStamp;
    private authCancel;
    private postSoap;
    timbrar(request: TimbradoRequest): Promise<TimbradoResult>;
    cancelar(uuid: string, rfcEmisor: string, motivo: string, folioSustitucion?: string): Promise<CancelacionPacResult>;
    consultarEstatus(uuid: string): Promise<ConsultaEstatusResult>;
}

export declare interface PacConfig {
    baseUrl?: string;
    user: string;
    password: string;
    sandbox: boolean;
}

export declare interface PacProvider {
    timbrar(request: TimbradoRequest): Promise<TimbradoResult>;
    cancelar(uuid: string, rfcEmisor: string, motivo: string, folioSustitucion?: string): Promise<CancelacionPacResult>;
    consultarEstatus(uuid: string): Promise<ConsultaEstatusResult>;
}

export declare enum PacProviderType {
    Finkok = "Finkok",
    SW = "SW",
    ComercioDigital = "ComercioDigital",
    Prodigia = "Prodigia",
    Diverza = "Diverza"
}

export declare interface TimbradoRequest {
    xmlCfdi: string;
}

export declare interface TimbradoResult {
    uuid: string;
    fechaTimbrado: string;
    selloCFD: string;
    selloSAT: string;
    noCertificadoSAT: string;
    cadenaOriginalSAT: string;
    xmlTimbrado: string;
}

export { }
