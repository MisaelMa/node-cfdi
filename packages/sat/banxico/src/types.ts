export interface TipoCambio {
  fecha: string;
  moneda: string;
  tipoCambio: number;
}

export interface BanxicoConfig {
  apiToken: string;
  timeout?: number;
}

export enum Moneda {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  CAD = 'CAD',
}

/** Series SIE (FIX u homologables) para tipo de cambio pesos por unidad de moneda extranjera. */
export const SERIE_BANXICO: ReadonlyMap<Moneda, string> = new Map([
  [Moneda.USD, 'SF43718'],
  [Moneda.EUR, 'SF46410'],
  [Moneda.GBP, 'SF46407'],
  [Moneda.JPY, 'SF46406'],
  [Moneda.CAD, 'SF60632'],
]);
