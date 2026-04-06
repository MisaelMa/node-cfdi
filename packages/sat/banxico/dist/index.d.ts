export declare class BanxicoClient {
    private readonly token;
    private readonly timeoutMs;
    constructor(config: BanxicoConfig);
    private fetchJson;
    private buildUrl;
    obtenerTipoCambio(moneda: Moneda, fecha?: string): Promise<TipoCambio>;
    obtenerTipoCambioActual(moneda: Moneda): Promise<TipoCambio>;
}

export declare interface BanxicoConfig {
    apiToken: string;
    timeout?: number;
}

export declare enum Moneda {
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    JPY = "JPY",
    CAD = "CAD"
}

export declare const SERIE_BANXICO: ReadonlyMap<Moneda, string>;

export declare interface TipoCambio {
    fecha: string;
    moneda: string;
    tipoCambio: number;
}

export { }
