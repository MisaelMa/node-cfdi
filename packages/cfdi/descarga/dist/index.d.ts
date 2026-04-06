export declare function buildDescargarRequest(idPaquete: string, rfc: string, token: string, cert: string, signatureValue: string): string;

export declare function buildSecurityHeader(components: SoapSignatureComponents, tokenValue: string): string;

export declare function buildSolicitarRequest(params: SolicitudParams, token: string, cert: string, signatureValue: string): string;

export declare function buildVerificarRequest(idSolicitud: string, rfc: string, token: string, cert: string, signatureValue: string): string;

export declare function canonicalize(xml: string): string;

export declare interface CredentialLike {
    certificate: {
        toDer(): Buffer;
        toPem(): string;
    };
    sign(data: string): string;
    rfc(): string;
}

export declare class DescargaMasiva {
    private readonly _token;
    private readonly _credential;
    constructor(_token: SatTokenLike, _credential: CredentialLike);
    solicitar(params: SolicitudParams): Promise<SolicitudResult>;
    verificar(idSolicitud: string): Promise<VerificacionResult>;
    descargar(idPaquete: string): Promise<Buffer>;
    private _signComponents;
    private _post;
}

export declare function digestSha256(content: string): string;

export declare const ESTADO_DESCRIPCION: Record<EstadoSolicitud, string>;

export declare enum EstadoComprobante {
    Cancelado = "0",
    Vigente = "1"
}

export declare enum EstadoSolicitud {
    Aceptada = 1,
    EnProceso = 2,
    Terminada = 3,
    Error = 4,
    Rechazada = 5,
    Vencida = 6
}

export declare const NS_DM_SOLICITUD = "http://DescargaMasivaTerceros.sat.gob.mx/";

export declare function parseDescargarResponse(xml: string): Buffer;

export declare function parseSolicitarResponse(xml: string): SolicitudResult;

export declare function parseVerificarResponse(xml: string): VerificacionResult;

export declare interface SatTokenLike {
    value: string;
    created: Date;
    expires: Date;
}

export declare function signSoapBody(bodyXml: string, credential: CredentialLike, bodyId?: string): SoapSignatureComponents;

export declare interface SoapSignatureComponents {
    bodyDigest: string;
    signatureValue: string;
    x509Certificate: string;
    bodyId: string;
}

export declare interface SolicitudParams {
    rfcSolicitante: string;
    fechaInicio: string;
    fechaFin: string;
    tipoSolicitud: TipoSolicitud;
    tipoDescarga: TipoDescarga;
    rfcEmisor?: string;
    rfcReceptor?: string;
    estadoComprobante?: EstadoComprobante;
}

export declare interface SolicitudResult {
    idSolicitud: string;
    codEstatus: string;
    mensaje: string;
}

export declare enum TipoDescarga {
    Emitidos = "RfcEmisor",
    Recibidos = "RfcReceptor"
}

export declare enum TipoSolicitud {
    CFDI = "CFDI",
    Metadata = "Metadata"
}

export declare interface VerificacionResult {
    estado: EstadoSolicitud;
    estadoDescripcion: string;
    codEstatus: string;
    mensaje: string;
    idsPaquetes: string[];
    numeroCfdis: number;
}

export { }
