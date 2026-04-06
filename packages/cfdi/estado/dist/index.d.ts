export declare function buildSoapRequest(params: ConsultaParams): string;

export declare interface ConsultaParams {
    rfcEmisor: string;
    rfcReceptor: string;
    total: string;
    uuid: string;
}

export declare function consultarEstado(params: ConsultaParams): Promise<ConsultaResult>;

export declare interface ConsultaResult {
    codigoEstatus: string;
    esCancelable: string;
    estado: string;
    estatusCancelacion: string;
    validacionEFOS: string;
    activo: boolean;
    cancelado: boolean;
    noEncontrado: boolean;
}

export declare function formatTotal(total: string): string;

export declare function parseSoapResponse(xml: string): ConsultaResult;

export declare const SOAP_ACTION = "http://tempuri.org/IConsultaCFDIService/Consulta";

export declare const WEBSERVICE_URL = "https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc";

export { }
