import xmljs from 'xml-js';
import type {
  CfdiData,
  ConceptoData,
  ImpuestosData,
  TimbreData,
} from './types';

/**
 * Strips namespace prefix from element/attribute name.
 * e.g. "cfdi:Comprobante" -> "Comprobante", "tfd:TimbreFiscalDigital" -> "TimbreFiscalDigital"
 */
function stripNs(name: string): string {
  const idx = name.indexOf(':');
  return idx >= 0 ? name.slice(idx + 1) : name;
}

/**
 * Normalizes attributes Record by stripping namespaces from keys.
 */
function normalizeAttrs(
  attrs: Record<string, any> | undefined
): Record<string, string> {
  if (!attrs) return {};
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(attrs)) {
    result[stripNs(k)] = String(v ?? '');
  }
  return result;
}

/**
 * Finds a child element by local name (ignoring namespace prefix).
 */
function findChild(
  elements: xmljs.Element[] | undefined,
  localName: string
): xmljs.Element | undefined {
  if (!elements) return undefined;
  return elements.find(
    el => el.type === 'element' && stripNs(el.name ?? '') === localName
  );
}

/**
 * Finds all children with a given local name.
 */
function findChildren(
  elements: xmljs.Element[] | undefined,
  localName: string
): xmljs.Element[] {
  if (!elements) return [];
  return elements.filter(
    el => el.type === 'element' && stripNs(el.name ?? '') === localName
  );
}

function parseTraslados(
  impuestosEl: xmljs.Element | undefined
): Record<string, string>[] {
  const trasladosEl = findChild(impuestosEl?.elements, 'Traslados');
  return findChildren(trasladosEl?.elements, 'Traslado').map(t =>
    normalizeAttrs(t.attributes as Record<string, any>)
  );
}

function parseRetenciones(
  impuestosEl: xmljs.Element | undefined
): Record<string, string>[] {
  const retencionesEl = findChild(impuestosEl?.elements, 'Retenciones');
  return findChildren(retencionesEl?.elements, 'Retencion').map(r =>
    normalizeAttrs(r.attributes as Record<string, any>)
  );
}

function parseConcepto(conceptoEl: xmljs.Element): ConceptoData {
  const attributes = normalizeAttrs(
    conceptoEl.attributes as Record<string, any>
  );
  const impuestosEl = findChild(conceptoEl.elements, 'Impuestos');

  if (!impuestosEl) {
    return { attributes };
  }

  return {
    attributes,
    impuestos: {
      traslados: parseTraslados(impuestosEl),
      retenciones: parseRetenciones(impuestosEl),
    },
  };
}

function parseImpuestos(
  impuestosEl: xmljs.Element | undefined
): ImpuestosData | undefined {
  if (!impuestosEl) return undefined;
  const attrs = normalizeAttrs(impuestosEl.attributes as Record<string, any>);
  return {
    totalImpuestosTrasladados: attrs['TotalImpuestosTrasladados'],
    totalImpuestosRetenidos: attrs['TotalImpuestosRetenidos'],
    traslados: parseTraslados(impuestosEl),
    retenciones: parseRetenciones(impuestosEl),
  };
}

function parseTimbre(
  complementoEl: xmljs.Element | undefined
): TimbreData | undefined {
  if (!complementoEl) return undefined;
  const tfdEl = findChild(complementoEl.elements, 'TimbreFiscalDigital');
  if (!tfdEl) return undefined;
  const attrs = normalizeAttrs(tfdEl.attributes as Record<string, any>);
  return {
    uuid: attrs['UUID'] ?? '',
    fechaTimbrado: attrs['FechaTimbrado'] ?? '',
    rfcProvCertif: attrs['RfcProvCertif'] ?? '',
    selloCFD: attrs['SelloCFD'] ?? '',
    selloSAT: attrs['SelloSAT'] ?? '',
    noCertificadoSAT: attrs['NoCertificadoSAT'] ?? '',
    version: attrs['Version'] ?? '',
  };
}

export function parseXml(xml: string): CfdiData {
  const doc = xmljs.xml2js(xml, {
    compact: false,
    ignoreComment: true,
    ignoreDeclaration: true,
    ignoreInstruction: true,
    ignoreDoctype: true,
  }) as xmljs.Element;

  const comprobante = findChild(doc.elements, 'Comprobante');
  if (!comprobante) {
    throw new Error(
      'XML no contiene el elemento Comprobante en el namespace cfdi'
    );
  }

  const comprobanteAttrs = normalizeAttrs(
    comprobante.attributes as Record<string, any>
  );
  const version = comprobanteAttrs['Version'] ?? '';

  const emisorEl = findChild(comprobante.elements, 'Emisor');
  const receptorEl = findChild(comprobante.elements, 'Receptor');
  const conceptosEl = findChild(comprobante.elements, 'Conceptos');
  const impuestosEl = findChild(comprobante.elements, 'Impuestos');
  const complementoEl = findChild(comprobante.elements, 'Complemento');

  const conceptoEls = findChildren(conceptosEl?.elements, 'Concepto');

  return {
    version,
    comprobante: comprobanteAttrs,
    emisor: normalizeAttrs(emisorEl?.attributes as Record<string, any>),
    receptor: normalizeAttrs(receptorEl?.attributes as Record<string, any>),
    conceptos: conceptoEls.map(parseConcepto),
    impuestos: parseImpuestos(impuestosEl),
    complemento: complementoEl ?? undefined,
    timbre: parseTimbre(complementoEl),
    raw: xml,
  };
}
