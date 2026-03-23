import type {
  CancelacionPacResult,
  ConsultaEstatusResult,
  PacConfig,
  PacProvider,
  TimbradoRequest,
  TimbradoResult,
} from '../types';

const NS_SOAP = 'http://schemas.xmlsoap.org/soap/envelope/';
const NS_STAMP = 'http://facturacion.finkok.com/stamp';
const NS_CANCEL = 'http://facturacion.finkok.com/cancel';

const PROD_STAMP_WSDL = 'https://facturacion.finkok.com/servicios/soap/stamp.wsdl';
const DEMO_STAMP_WSDL = 'https://demo-facturacion.finkok.com/servicios/soap/stamp.wsdl';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function decodeBasicEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function pickLocalText(xml: string, localName: string): string | undefined {
  const re = new RegExp(
    `<(?:[\\w.-]+:)?${localName}[^>]*>([\\s\\S]*?)</(?:[\\w.-]+:)?${localName}>`,
    'i',
  );
  const m = xml.match(re);
  if (!m) return undefined;
  return decodeBasicEntities(m[1].trim());
}

function pickAttr(xml: string, attr: string): string | undefined {
  const re = new RegExp(`${attr}="([^"]*)"`, 'i');
  const m = xml.match(re);
  return m?.[1];
}

function extractTimbreFields(xmlTimbrado: string): Omit<TimbradoResult, 'xmlTimbrado'> {
  const timbre =
    xmlTimbrado.match(/<(?:[^:>]+:)?TimbreFiscalDigital\b[^>]*\/?>/)?.[0] ??
    xmlTimbrado.match(/<TimbreFiscalDigital\b[^>]*\/?>/)?.[0];
  if (!timbre) {
    throw new Error('El XML timbrado no contiene TimbreFiscalDigital.');
  }
  const uuid = pickAttr(timbre, 'UUID');
  const fechaTimbrado = pickAttr(timbre, 'FechaTimbrado');
  const selloCFD = pickAttr(timbre, 'SelloCFD') ?? '';
  const selloSAT = pickAttr(timbre, 'SelloSAT') ?? '';
  const noCertificadoSAT = pickAttr(timbre, 'NoCertificadoSAT') ?? '';
  const cadenaOriginalSAT = pickAttr(timbre, 'CadenaOriginal') ?? '';
  if (!uuid || !fechaTimbrado) {
    throw new Error('No se pudieron leer UUID o FechaTimbrado del timbre.');
  }
  return {
    uuid,
    fechaTimbrado,
    selloCFD,
    selloSAT,
    noCertificadoSAT,
    cadenaOriginalSAT,
  };
}

function soapEnvelope(body: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="${NS_SOAP}">
  <soapenv:Header/>
  <soapenv:Body>
    ${body}
  </soapenv:Body>
</soapenv:Envelope>`;
}

/**
 * Cliente Finkok: timbrado, cancelación y consulta vía SOAP sobre los WSDL públicos.
 * Las URLs de producción y demo siguen la documentación de Finkok.
 */
export class FinkokProvider implements PacProvider {
  constructor(private readonly config: PacConfig) {}

  private finkokOrigin(): string {
    const raw = this.config.baseUrl?.trim();
    if (!raw) {
      return this.config.sandbox
        ? 'https://demo-facturacion.finkok.com'
        : 'https://facturacion.finkok.com';
    }
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      return new URL(withProto).origin;
    } catch {
      return this.config.sandbox
        ? 'https://demo-facturacion.finkok.com'
        : 'https://facturacion.finkok.com';
    }
  }

  private stampUrl(): string {
    const raw = this.config.baseUrl?.trim();
    if (raw && /\.wsdl$/i.test(raw) && /stamp/i.test(raw)) {
      return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    }
    return this.config.sandbox ? DEMO_STAMP_WSDL : PROD_STAMP_WSDL;
  }

  private cancelUrl(): string {
    const raw = this.config.baseUrl?.trim();
    if (raw && /\.wsdl$/i.test(raw) && /cancel/i.test(raw)) {
      return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    }
    return `${this.finkokOrigin()}/servicios/soap/cancel.wsdl`;
  }

  private authStamp(): string {
    return `
      <stamp:username>${escapeXml(this.config.user)}</stamp:username>
      <stamp:password>${escapeXml(this.config.password)}</stamp:password>`;
  }

  private authCancel(): string {
    return `
      <cancel:username>${escapeXml(this.config.user)}</cancel:username>
      <cancel:password>${escapeXml(this.config.password)}</cancel:password>`;
  }

  private async postSoap(url: string, xml: string): Promise<string> {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
      body: xml,
    });
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Finkok HTTP ${res.status}: ${text.slice(0, 500)}`);
    }
    return text;
  }

  async timbrar(request: TimbradoRequest): Promise<TimbradoResult> {
    const b64 = Buffer.from(request.xmlCfdi, 'utf8').toString('base64');
    const inner = `
    <stamp:stamp xmlns:stamp="${NS_STAMP}">
      <stamp:xml>${b64}</stamp:xml>
      ${this.authStamp()}
    </stamp:stamp>`;
    const response = await this.postSoap(this.stampUrl(), soapEnvelope(inner));

    const cod = pickLocalText(response, 'CodEstatus');
    const err = pickLocalText(response, 'MensajeIncidencia') ?? pickLocalText(response, 'error');
    if (err || (cod && !/timbrado satisfactoriamente/i.test(cod))) {
      throw new Error(err ?? cod ?? 'Error desconocido en timbrado Finkok.');
    }

    const xmlB64 = pickLocalText(response, 'xml');
    if (!xmlB64) {
      throw new Error('Respuesta de timbrado sin nodo xml.');
    }
    const xmlTimbrado = Buffer.from(xmlB64, 'base64').toString('utf8');
    const timbre = extractTimbreFields(xmlTimbrado);
    return { ...timbre, xmlTimbrado };
  }

  async cancelar(
    uuid: string,
    rfcEmisor: string,
    motivo: string,
    folioSustitucion?: string,
  ): Promise<CancelacionPacResult> {
    const folioAttr =
      folioSustitucion !== undefined && folioSustitucion !== ''
        ? ` FolioSustitucion="${escapeXml(folioSustitucion)}"`
        : '';
    const inner = `
    <cancel:cancel xmlns:cancel="${NS_CANCEL}">
      <cancel:UUIDS>
        <cancel:UUID UUID="${escapeXml(uuid)}" Motivo="${escapeXml(motivo)}"${folioAttr}/>
      </cancel:UUIDS>
      ${this.authCancel()}
      <cancel:taxpayer_id>${escapeXml(rfcEmisor)}</cancel:taxpayer_id>
    </cancel:cancel>`;
    const response = await this.postSoap(this.cancelUrl(), soapEnvelope(inner));

    const wsErr = pickLocalText(response, 'error');
    if (wsErr) {
      throw new Error(wsErr);
    }

    const acuse = pickLocalText(response, 'Acuse') ?? '';
    const estatus =
      pickLocalText(response, 'EstatusUUID') ??
      pickLocalText(response, 'EstatusCancelacion') ??
      pickLocalText(response, 'CodEstatus') ??
      '';
    return { uuid, estatus, acuse };
  }

  async consultarEstatus(uuid: string): Promise<ConsultaEstatusResult> {
    const inner = `
    <stamp:query_pending xmlns:stamp="${NS_STAMP}">
      ${this.authStamp()}
      <stamp:uuid>${escapeXml(uuid)}</stamp:uuid>
    </stamp:query_pending>`;
    const response = await this.postSoap(this.stampUrl(), soapEnvelope(inner));

    const err = pickLocalText(response, 'error');
    if (err) {
      throw new Error(err);
    }

    const estatus = pickLocalText(response, 'status') ?? '';
    const xmlRaw = pickLocalText(response, 'xml');
    const uuidOut = pickLocalText(response, 'uuid') ?? uuid;
    return {
      uuid: uuidOut,
      estatus,
      xml: xmlRaw ? decodeBasicEntities(xmlRaw) : undefined,
    };
  }
}
