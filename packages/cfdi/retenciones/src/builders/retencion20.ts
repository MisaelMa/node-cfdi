import type { ComplementoRetencion, EmisorRetencion, ReceptorRetencion, Retencion20 } from '../types';
import { RETENCION_PAGO_NAMESPACE_V2 } from '../types';

const P = 'retenciones';

function escapeXmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function optAttr(name: string, value: string | undefined): string {
  if (value === undefined || value === '') {
    return '';
  }
  return ` ${name}="${escapeXmlAttr(value)}"`;
}

function buildEmisorXml(emisor: EmisorRetencion): string {
  return (
    `<${P}:Emisor` +
    ` Rfc="${escapeXmlAttr(emisor.Rfc)}"` +
    optAttr('NomDenRazSocE', emisor.NomDenRazSocE) +
    ` RegimenFiscalE="${escapeXmlAttr(emisor.RegimenFiscalE)}"` +
    optAttr('CURPE', emisor.CurpE) +
    `/>`
  );
}

function buildReceptorXml(receptor: ReceptorRetencion): string {
  const nat = receptor.NacionalidadR;
  const nac = nat === 'Nacional' ? receptor.nacional : undefined;
  const ext = nat === 'Extranjero' ? receptor.extranjero : undefined;

  let inner = '';
  if (nac) {
    inner +=
      `<${P}:Nacional` +
      ` RFCRecep="${escapeXmlAttr(nac.RfcRecep)}"` +
      optAttr('NomDenRazSocR', nac.NomDenRazSocR) +
      optAttr('CURPR', nac.CurpR) +
      `/>`;
  }
  if (ext) {
    inner +=
      `<${P}:Extranjero` +
      optAttr('NumRegIdTrib', ext.NumRegIdTrib) +
      ` NomDenRazSocR="${escapeXmlAttr(ext.NomDenRazSocR)}"` +
      `/>`;
  }

  return `<${P}:Receptor Nacionalidad="${escapeXmlAttr(nat)}">${inner}</${P}:Receptor>`;
}

function buildComplementoXml(complemento: ComplementoRetencion[] | undefined): string {
  if (!complemento?.length) {
    return '';
  }
  const body = complemento.map((c) => c.innerXml).join('');
  return `<${P}:Complemento>${body}</${P}:Complemento>`;
}

/**
 * Genera el XML del comprobante de Retenciones 2.0 con el namespace oficial del SAT.
 */
export function buildRetencion20Xml(doc: Retencion20): string {
  const t = doc.totales;
  const p = doc.periodo;

  const rootAttrs =
    ` xmlns:${P}="${RETENCION_PAGO_NAMESPACE_V2}"` +
    ` Version="${escapeXmlAttr(doc.Version)}"` +
    ` CveRetenc="${escapeXmlAttr(doc.CveRetenc)}"` +
    optAttr('DescRetenc', doc.DescRetenc) +
    ` FechaExp="${escapeXmlAttr(doc.FechaExp)}"` +
    ` LugarExpRet="${escapeXmlAttr(doc.LugarExpRet)}"` +
    optAttr('NumCert', doc.NumCert) +
    optAttr('FolioInt', doc.FolioInt);

  const body =
    buildEmisorXml(doc.emisor) +
    buildReceptorXml(doc.receptor) +
    `<${P}:Periodo MesIni="${escapeXmlAttr(p.MesIni)}" MesFin="${escapeXmlAttr(p.MesFin)}" Ejerc="${escapeXmlAttr(p.Ejerc)}"/>` +
    `<${P}:Totales` +
    ` montoTotOperacion="${escapeXmlAttr(t.montoTotOperacion)}"` +
    ` montoTotGrav="${escapeXmlAttr(t.montoTotGrav)}"` +
    ` montoTotExent="${escapeXmlAttr(t.montoTotExent)}"` +
    ` montoTotRet="${escapeXmlAttr(t.montoTotRet)}"` +
    `/>` +
    buildComplementoXml(doc.complemento);

  return `<?xml version="1.0" encoding="UTF-8"?><${P}:Retenciones${rootAttrs}>${body}</${P}:Retenciones>`;
}
