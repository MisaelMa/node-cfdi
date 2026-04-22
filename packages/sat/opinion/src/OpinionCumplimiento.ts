import type {
  OpinionCumplimiento as OpinionResult,
  ObligacionFiscal,
  OpinionConfig,
  SesionPortalLike,
  ResultadoOpinion,
} from './types';

const DEFAULT_BASE_URL =
  'https://portalcfdi.facturaelectronica.sat.gob.mx';
const DEFAULT_TIMEOUT = 30_000;

/**
 * Cliente para obtener la Opinion de Cumplimiento (32-D) del SAT.
 *
 * Requiere una sesion activa en el portal del SAT (obtenida via @sat/scraper).
 *
 * @example
 * ```typescript
 * const opinion = new OpinionCumplimientoService();
 * const result = await opinion.obtener(sesion);
 *
 * if (result.resultado === ResultadoOpinion.Positivo) {
 *   console.log('Contribuyente al corriente');
 * }
 * ```
 */
export class OpinionCumplimientoService {
  private readonly _baseUrl: string;
  private readonly _timeout: number;

  constructor(config: OpinionConfig = {}) {
    this._baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
    this._timeout = config.timeout ?? DEFAULT_TIMEOUT;
  }

  /**
   * Obtiene la opinion de cumplimiento del contribuyente autenticado.
   */
  async obtener(sesion: SesionPortalLike): Promise<OpinionResult> {
    if (!sesion.authenticated) {
      throw new Error(
        'Se requiere una sesion activa en el portal del SAT'
      );
    }

    const url = `${this._baseUrl}/RecuperaOpinionCumplimiento.aspx`;
    const html = await this._fetch(url, sesion);
    return this._parseOpinion(html, sesion.rfc);
  }

  /**
   * Descarga el PDF de la opinion de cumplimiento.
   */
  async descargarPdf(
    sesion: SesionPortalLike,
    urlPdf?: string
  ): Promise<Buffer> {
    if (!sesion.authenticated) {
      throw new Error(
        'Se requiere una sesion activa en el portal del SAT'
      );
    }

    const url =
      urlPdf ?? `${this._baseUrl}/RecuperaOpinionCumplimiento.aspx?generar=1`;
    const response = await this._fetchRaw(url, sesion);

    if (!response.ok) {
      throw new Error(
        `Error descargando PDF: HTTP ${response.status}`
      );
    }

    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  }

  private async _fetch(
    url: string,
    sesion: SesionPortalLike
  ): Promise<string> {
    const response = await this._fetchRaw(url, sesion);
    return response.text();
  }

  private async _fetchRaw(
    url: string,
    sesion: SesionPortalLike
  ): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this._timeout);

    try {
      return await fetch(url, {
        headers: {
          Cookie: Object.entries(sesion.cookies)
            .map(([k, v]) => `${k}=${v}`)
            .join('; '),
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        signal: controller.signal,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error(
          `Timeout: el portal del SAT no respondio en ${this._timeout / 1000} segundos`
        );
      }
      throw new Error(
        `Error de red: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      clearTimeout(timer);
    }
  }

  private _parseOpinion(
    html: string,
    rfc: string
  ): OpinionResult {
    const resultado = this._extractResultado(html);
    const nombre = this._extractBetween(html, 'Nombre, denominación o razón social:', '</span>') ||
                   this._extractBetween(html, 'Nombre:', '</span>');
    const folio = this._extractBetween(html, 'Folio:', '</span>') ||
                  this._extractBetween(html, 'No. Operación:', '</span>');
    const fecha = this._extractBetween(html, 'Fecha de emisión:', '</span>') ||
                  this._extractBetween(html, 'Fecha:', '</span>');

    const obligaciones = this._parseObligaciones(html);

    return {
      rfc,
      nombreContribuyente: nombre.trim(),
      resultado,
      fechaEmision: fecha.trim(),
      folioOpinion: folio.trim(),
      obligaciones,
    };
  }

  private _extractResultado(html: string): ResultadoOpinion {
    const lower = html.toLowerCase();
    if (lower.includes('positiv')) return 'Positivo' as ResultadoOpinion;
    if (lower.includes('negativ')) return 'Negativo' as ResultadoOpinion;
    if (lower.includes('suspenso')) return 'En suspenso' as ResultadoOpinion;
    if (lower.includes('sin obligaciones'))
      return 'Inscrito sin obligaciones' as ResultadoOpinion;
    return 'No inscrito' as ResultadoOpinion;
  }

  private _extractBetween(html: string, start: string, end: string): string {
    const startIdx = html.indexOf(start);
    if (startIdx === -1) return '';
    const afterStart = startIdx + start.length;
    const endIdx = html.indexOf(end, afterStart);
    if (endIdx === -1) return '';
    return html
      .substring(afterStart, endIdx)
      .replace(/<[^>]+>/g, '')
      .trim();
  }

  private _parseObligaciones(html: string): ObligacionFiscal[] {
    const obligaciones: ObligacionFiscal[] = [];
    const rowPattern =
      /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let match: RegExpExecArray | null;
    let inObligaciones = false;

    while ((match = rowPattern.exec(html)) !== null) {
      if (match[1].includes('Obligaciones')) {
        inObligaciones = true;
        continue;
      }
      if (!inObligaciones) continue;

      const cells = this._extractCells(match[1]);
      if (cells.length >= 3) {
        obligaciones.push({
          descripcion: cells[0],
          fechaInicio: cells[1],
          fechaFin: cells[2] || undefined,
          estado: cells[3] || 'Activa',
        });
      }
    }

    return obligaciones;
  }

  private _extractCells(rowHtml: string): string[] {
    const cells: string[] = [];
    const cellPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let match: RegExpExecArray | null;
    while ((match = cellPattern.exec(rowHtml)) !== null) {
      cells.push(match[1].replace(/<[^>]+>/g, '').trim());
    }
    return cells;
  }
}
