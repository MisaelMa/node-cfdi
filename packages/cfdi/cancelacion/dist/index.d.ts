export declare interface AceptacionRechazoParams {
    rfcReceptor: string;
    uuid: string;
    respuesta: RespuestaAceptacionRechazo;
}

export declare interface AceptacionRechazoResult {
    uuid: string;
    codEstatus: string;
    mensaje: string;
}

export declare function buildAceptacionRechazoRequest(params: AceptacionRechazoParams, token: string, cert: string, signatureValue: string, fecha: string): string;

export declare function buildCancelacionXml(params: CancelacionParams, rfcEmisor: string, fecha: string, cert: string, signatureValue: string, serialNumber: string): string;

export declare function buildCancelarRequest(cancelacionXml: string, token: string, cert: string, signatureValue: string): string;

export declare function buildConsultaPendientesRequest(rfcReceptor: string, token: string, cert: string, signatureValue: string): string;

export declare class CancelacionCfdi {
    private readonly _token;
    private readonly _credential;
    constructor(_token: SatTokenLike, _credential: CredentialLike);
    cancelar(params: CancelacionParams): Promise<CancelacionResult>;
    aceptarRechazar(params: AceptacionRechazoParams): Promise<AceptacionRechazoResult>;
    consultarPendientes(): Promise<PendientesResult[]>;
    private _signComponents;
    private _post;
}

export declare interface CancelacionParams {
    rfcEmisor: string;
    uuid: string;
    motivo: MotivoCancelacion;
    folioSustitucion?: string;
}

export declare interface CancelacionResult {
    uuid: string;
    estatus: EstatusCancelacion;
    codEstatus: string;
    mensaje: string;
}

export declare interface CredentialLike {
    certificate: {
        toDer(): Buffer;
        toPem(): string;
        serialNumber(): string;
    };
    sign(data: string): string;
    rfc(): string;
}

export declare enum EstatusCancelacion {
    EnProceso = "EnProceso",
    Cancelado = "Cancelado",
    CancelacionRechazada = "Rechazada",
    Plazo = "Plazo"
}

export declare enum MotivoCancelacion {
    ConRelacion = "01",
    SinRelacion = "02",
    NoOperacion = "03",
    FacturaGlobal = "04"
}

export declare function parseAceptacionRechazoResponse(xml: string): AceptacionRechazoResult;

export declare function parseCancelarResponse(xml: string): CancelacionResult;

export declare function parsePendientesResponse(xml: string): PendientesResult[];

export declare interface PendientesResult {
    uuid: string;
    rfcEmisor: string;
    fechaSolicitud: string;
}

export declare enum RespuestaAceptacionRechazo {
    Aceptacion = "Aceptacion",
    Rechazo = "Rechazo"
}

export declare interface SatTokenLike {
    value: string;
    created: Date;
    expires: Date;
}

export { }
