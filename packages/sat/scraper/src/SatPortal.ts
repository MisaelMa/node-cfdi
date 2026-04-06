import type {
  CredencialPortal,
  CredencialFIEL,
  SesionSAT,
  ConsultaCfdiParams,
  CfdiConsultaResult,
  ScraperConfig,
} from './types';
import { TipoAutenticacion } from './types';

const DEFAULT_BASE_URL = 'https://portalcfdi.facturaelectronica.sat.gob.mx';
const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

/**
 * Cliente para interactuar con el portal del SAT via scraping HTTP.
 *
 * Soporta autenticacion con CIEC o FIEL para acceder a servicios como
 * consulta de CFDIs, descarga de CSF, opinion de cumplimiento, etc.
 *
 * @example
 * ```typescript
 * const portal = new SatPortal();
 * const sesion = await portal.login({
 *   tipo: TipoAutenticacion.CIEC,
 *   rfc: 'AAA010101AAA',
 *   password: 'contraseña',
 * });
 *
 * const cfdis = await portal.consultarCfdis(sesion, {
 *   fechaInicio: '2024-01-01',
 *   fechaFin: '2024-01-31',
 * });
 * ```
 */
export class SatPortal {
  private readonly _baseUrl: string;
  private readonly _timeout: number;
  private readonly _userAgent: string;

  constructor(config: ScraperConfig = {}) {
    this._baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
    this._timeout = config.timeout ?? DEFAULT_TIMEOUT;
    this._userAgent = config.userAgent ?? DEFAULT_USER_AGENT;
  }

  /**
   * Inicia sesion en el portal del SAT.
   * Obtiene las cookies de sesion necesarias para llamadas posteriores.
   */
  async login(credencial: CredencialPortal): Promise<SesionSAT> {
    if (credencial.tipo === TipoAutenticacion.CIEC) {
      return this._loginCIEC(credencial.rfc, credencial.password);
    }
    return this._loginFIEL(credencial);
  }

  /**
   * Consulta CFDIs en el portal del SAT usando la sesion activa.
   */
  async consultarCfdis(
    sesion: SesionSAT,
    params: ConsultaCfdiParams
  ): Promise<CfdiConsultaResult[]> {
    this._validateSesion(sesion);

    const url = `${this._baseUrl}/ConsultaEmisor.aspx`;
    const formData = new URLSearchParams({
      ctl00$MainContent$TxtFechaInicial: params.fechaInicio,
      ctl00$MainContent$TxtFechaFinal: params.fechaFin,
      ...(params.rfcReceptor && {
        'ctl00$MainContent$TxtRfcReceptor': params.rfcReceptor,
      }),
    });

    const html = await this._postForm(url, formData, sesion);
    return this._parseConsultaResults(html);
  }

  /**
   * Cierra la sesion del portal SAT.
   */
  async logout(sesion: SesionSAT): Promise<void> {
    const url = `${this._baseUrl}/logout.aspx`;
    await this._get(url, sesion);
    sesion.authenticated = false;
  }

  private async _loginCIEC(rfc: string, password: string): Promise<SesionSAT> {
    const loginUrl = `${this._baseUrl}/nidp/wsfed/ep?id=SATUPCFDiCon&sid=0&option=credential&sid=0`;
    const formData = new URLSearchParams({
      Ecom_User_ID: rfc,
      Ecom_Password: password,
      option: 'credential',
      submit: 'Enviar',
    });

    const response = await this._fetchWithTimeout(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': this._userAgent,
      },
      body: formData.toString(),
      redirect: 'manual',
    });

    const cookies = this._extractCookies(response);

    return {
      cookies,
      rfc,
      authenticated: response.status === 302 || response.status === 200,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    };
  }

  private async _loginFIEL(
    credencial: CredencialFIEL
  ): Promise<SesionSAT> {
    const loginUrl = `${this._baseUrl}/nidp/wsfed/ep?id=SATx509Custom&sid=0&option=credential`;

    const response = await this._fetchWithTimeout(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': this._userAgent,
      },
      body: new URLSearchParams({
        credentialToken: credencial.certificatePem,
        credentialSecret: credencial.privateKeyPem,
        option: 'credential',
      }).toString(),
      redirect: 'manual',
    });

    const cookies = this._extractCookies(response);

    return {
      cookies,
      rfc: '',
      authenticated: response.status === 302 || response.status === 200,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    };
  }

  private _validateSesion(sesion: SesionSAT): void {
    if (!sesion.authenticated) {
      throw new Error('La sesion del SAT no esta activa');
    }
    if (sesion.expiresAt && sesion.expiresAt < new Date()) {
      throw new Error('La sesion del SAT ha expirado');
    }
  }

  private async _get(url: string, sesion: SesionSAT): Promise<string> {
    const response = await this._fetchWithTimeout(url, {
      headers: {
        Cookie: this._buildCookieHeader(sesion.cookies),
        'User-Agent': this._userAgent,
      },
    });
    return response.text();
  }

  private async _postForm(
    url: string,
    form: URLSearchParams,
    sesion: SesionSAT
  ): Promise<string> {
    const response = await this._fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: this._buildCookieHeader(sesion.cookies),
        'User-Agent': this._userAgent,
      },
      body: form.toString(),
    });
    return response.text();
  }

  private _buildCookieHeader(cookies: Record<string, string>): string {
    return Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
  }

  private _extractCookies(response: Response): Record<string, string> {
    const cookies: Record<string, string> = {};
    const setCookie = response.headers.getSetCookie?.() ?? [];
    for (const cookie of setCookie) {
      const [pair] = cookie.split(';');
      const [name, ...valueParts] = pair.split('=');
      if (name) {
        cookies[name.trim()] = valueParts.join('=').trim();
      }
    }
    return cookies;
  }

  private _parseConsultaResults(html: string): CfdiConsultaResult[] {
    const results: CfdiConsultaResult[] = [];
    const rowPattern =
      /<tr[^>]*class="[^"]*rgRow[^"]*"[^>]*>([\s\S]*?)<\/tr>/gi;
    let match: RegExpExecArray | null;

    while ((match = rowPattern.exec(html)) !== null) {
      const cells = this._extractCells(match[1]);
      if (cells.length >= 9) {
        results.push({
          uuid: cells[0],
          rfcEmisor: cells[1],
          nombreEmisor: cells[2],
          rfcReceptor: cells[3],
          nombreReceptor: cells[4],
          fechaEmision: cells[5],
          fechaCertificacion: cells[6],
          total: parseFloat(cells[7]) || 0,
          efecto: cells[8],
          estado: cells[9] ?? 'Vigente',
        });
      }
    }

    return results;
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

  private async _fetchWithTimeout(
    url: string,
    init: RequestInit = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this._timeout);

    try {
      return await fetch(url, {
        ...init,
        signal: controller.signal,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error(
          `Timeout: el portal del SAT no respondio en ${this._timeout / 1000} segundos`
        );
      }
      throw new Error(
        `Error de red al conectar con el portal del SAT: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      clearTimeout(timer);
    }
  }
}
