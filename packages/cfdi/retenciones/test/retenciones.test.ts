import { describe, expect, it } from 'vitest';

import { buildRetencion20Xml, RETENCION_PAGO_NAMESPACE_V2 } from '../src/index';

function minimalRetencion20() {
  return {
    Version: '2.0' as const,
    CveRetenc: '16',
    DescRetenc: 'Dividendos',
    FechaExp: '2024-03-01T12:00:00',
    LugarExpRet: '06600',
    emisor: {
      Rfc: 'AAA010101AAA',
      NomDenRazSocE: 'EMISOR SA DE CV',
      RegimenFiscalE: '601',
      CurpE: 'BADD110513HCMLNS09',
    },
    receptor: {
      NacionalidadR: 'Nacional' as const,
      nacional: {
        RfcRecep: 'BBB020202BBB',
        NomDenRazSocR: 'RECEPTOR SA',
      },
    },
    periodo: {
      MesIni: '01',
      MesFin: '03',
      Ejerc: '2024',
    },
    totales: {
      montoTotOperacion: '1000.00',
      montoTotGrav: '800.00',
      montoTotExent: '200.00',
      montoTotRet: '150.00',
    },
  };
}

describe('buildRetencion20Xml', () => {
  it('generates XML with the Retenciones 2.0 namespace', () => {
    const xml = buildRetencion20Xml(minimalRetencion20());
    expect(xml).toContain(`xmlns:retenciones="${RETENCION_PAGO_NAMESPACE_V2}"`);
    expect(xml).toContain('http://www.sat.gob.mx/esquemas/retencionpago/2');
  });

  it('includes Emisor, Receptor, Periodo, and Totales elements', () => {
    const xml = buildRetencion20Xml(minimalRetencion20());
    expect(xml).toContain('<retenciones:Emisor');
    expect(xml).toContain('<retenciones:Receptor');
    expect(xml).toContain('<retenciones:Periodo');
    expect(xml).toContain('<retenciones:Totales');
  });

  it('sets Version to 2.0 on the root element', () => {
    const xml = buildRetencion20Xml(minimalRetencion20());
    expect(xml).toMatch(/Version="2\.0"/);
  });

  it('sets the CveRetenc attribute from the document', () => {
    const xml = buildRetencion20Xml(minimalRetencion20());
    expect(xml).toMatch(/CveRetenc="16"/);
  });

  it('embeds optional Complemento children when provided', () => {
    const xml = buildRetencion20Xml({
      ...minimalRetencion20(),
      complemento: [{ innerXml: '<ext:Foo xmlns:ext="urn:test"/>', meta: { id: 1 } }],
    });
    expect(xml).toContain('<retenciones:Complemento>');
    expect(xml).toContain('<ext:Foo xmlns:ext="urn:test"/>');
  });
});
