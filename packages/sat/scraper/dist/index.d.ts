export declare interface CfdiConsultaResult {
    uuid: string;
    rfcEmisor: string;
    nombreEmisor: string;
    rfcReceptor: string;
    nombreReceptor: string;
    fechaEmision: string;
    fechaCertificacion: string;
    total: number;
    efecto: string;
    estado: string;
}

export declare interface ConsultaCfdiParams {
    rfcEmisor?: string;
    rfcReceptor?: string;
    fechaInicio: string;
    fechaFin: string;
    tipoComprobante?: string;
    estadoCfdi?: 'vigente' | 'cancelado' | 'todos';
}

export declare interface CredencialCIEC {
    tipo: TipoAutenticacion.CIEC;
    rfc: string;
    password: string;
}

export declare interface CredencialFIEL {
    tipo: TipoAutenticacion.FIEL;
    certificatePem: string;
    privateKeyPem: string;
    password: string;
}

export declare type CredencialPortal = CredencialCIEC | CredencialFIEL;

export declare class SatPortal {
    private readonly _baseUrl;
    private readonly _timeout;
    private readonly _userAgent;
    constructor(config?: ScraperConfig);
    login(credencial: CredencialPortal): Promise<SesionSAT>;
    consultarCfdis(sesion: SesionSAT, params: ConsultaCfdiParams): Promise<CfdiConsultaResult[]>;
    logout(sesion: SesionSAT): Promise<void>;
    private _loginCIEC;
    private _loginFIEL;
    private _validateSesion;
    private _get;
    private _postForm;
    private _buildCookieHeader;
    private _extractCookies;
    private _parseConsultaResults;
    private _extractCells;
    private _fetchWithTimeout;
}

export declare interface ScraperConfig {
    timeout?: number;
    userAgent?: string;
    baseUrl?: string;
}

export declare interface SesionSAT {
    cookies: Record<string, string>;
    csrfToken?: string;
    rfc: string;
    authenticated: boolean;
    expiresAt?: Date;
}

export declare enum TipoAutenticacion {
    FIEL = "fiel",
    CIEC = "ciec"
}

export { }
