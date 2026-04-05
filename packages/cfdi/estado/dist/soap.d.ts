import { ConsultaParams, ConsultaResult } from './types';
declare const WEBSERVICE_URL = "https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc";
declare const SOAP_ACTION = "http://tempuri.org/IConsultaCFDIService/Consulta";
export declare function formatTotal(total: string): string;
export declare function buildSoapRequest(params: ConsultaParams): string;
export declare function parseSoapResponse(xml: string): ConsultaResult;
export { WEBSERVICE_URL, SOAP_ACTION };
//# sourceMappingURL=soap.d.ts.map