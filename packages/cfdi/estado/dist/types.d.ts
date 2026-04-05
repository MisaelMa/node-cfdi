export interface ConsultaParams {
    rfcEmisor: string;
    rfcReceptor: string;
    total: string;
    uuid: string;
}
export interface ConsultaResult {
    codigoEstatus: string;
    esCancelable: string;
    estado: string;
    estatusCancelacion: string;
    validacionEFOS: string;
    activo: boolean;
    cancelado: boolean;
    noEncontrado: boolean;
}
//# sourceMappingURL=types.d.ts.map