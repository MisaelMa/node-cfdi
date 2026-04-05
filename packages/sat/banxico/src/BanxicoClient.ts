import type { BanxicoConfig, Moneda, TipoCambio } from './types';
import { SERIE_BANXICO } from './types';

const BASE_URL =
  'https://www.banxico.org.mx/SieAPIRest/service/v1/series';

const DEFAULT_TIMEOUT_MS = 30_000;

interface BanxicoDato {
  fecha?: string;
  dato?: string;
}

interface BanxicoSerie {
  idSerie?: string;
  datos?: BanxicoDato[];
}

interface BanxicoJson {
  bmx?: {
    series?: BanxicoSerie[];
  };
}

function resolveSerie(moneda: Moneda): string {
  const id = SERIE_BANXICO.get(moneda);
  if (!id) {
    throw new Error(`No hay serie Banxico configurada para la moneda: ${moneda}`);
  }
  return id;
}

function fechaConsulta(fecha?: string): string {
  if (fecha !== undefined && fecha.trim() !== '') {
    return fecha.trim();
  }
  return new Date().toISOString().slice(0, 10);
}

function parseTipoCambio(
  moneda: Moneda,
  json: unknown
): TipoCambio {
  const body = json as BanxicoJson;
  const serie = body.bmx?.series?.[0];
  const ultimo = serie?.datos?.[serie.datos.length - 1];
  const fechaRaw = ultimo?.fecha;
  const datoRaw = ultimo?.dato;

  if (!fechaRaw || datoRaw === undefined || datoRaw === '') {
    throw new Error('Respuesta Banxico sin observaciones en la serie solicitada');
  }

  if (datoRaw === 'N/E') {
    throw new Error('Banxico reportó dato no disponible (N/E) para la fecha o serie');
  }

  const tipoCambio = Number.parseFloat(datoRaw.replace(/,/g, ''));
  if (!Number.isFinite(tipoCambio)) {
    throw new Error(`Valor de tipo de cambio inválido: ${datoRaw}`);
  }

  return {
    fecha: fechaRaw,
    moneda,
    tipoCambio,
  };
}

export class BanxicoClient {
  private readonly token: string;

  private readonly timeoutMs: number;

  constructor(config: BanxicoConfig) {
    if (!config.apiToken?.trim()) {
      throw new Error('BanxicoConfig.apiToken es obligatorio');
    }
    this.token = config.apiToken.trim();
    this.timeoutMs = config.timeout ?? DEFAULT_TIMEOUT_MS;
  }

  private async fetchJson(url: string): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        throw new Error(`Banxico HTTP ${res.status}: ${res.statusText}`);
      }
      return (await res.json()) as unknown;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error(`Tiempo de espera agotado (${this.timeoutMs} ms) al consultar Banxico`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  private buildUrl(pathSuffix: string): string {
    const u = new URL(`${BASE_URL}/${pathSuffix}`);
    u.searchParams.set('token', this.token);
    return u.toString();
  }

  async obtenerTipoCambio(moneda: Moneda, fecha?: string): Promise<TipoCambio> {
    const serie = resolveSerie(moneda);
    const f = fechaConsulta(fecha);
    const url = this.buildUrl(`${serie}/datos/${f}/${f}`);
    const json = await this.fetchJson(url);
    return parseTipoCambio(moneda, json);
  }

  async obtenerTipoCambioActual(moneda: Moneda): Promise<TipoCambio> {
    const serie = resolveSerie(moneda);
    const url = this.buildUrl(`${serie}/datos/oportuno`);
    const json = await this.fetchJson(url);
    return parseTipoCambio(moneda, json);
  }
}
