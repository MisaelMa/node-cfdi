# @cfdi/retenciones

This package builds **CFDI de Retenciones e información de pagos 2.0** XML from typed JavaScript objects: it emits the official `retenciones` namespace, escapes attribute values, serializes emisor, receptor (national or foreign), period, totals, and optional complement fragments you provide as raw inner XML.

## Installation

```bash
npm install @cfdi/retenciones
```

## Usage

```typescript
import {
  buildRetencion20Xml,
  RETENCION_PAGO_NAMESPACE_V2,
  TipoRetencion,
} from '@cfdi/retenciones';

const xml = buildRetencion20Xml({
  Version: '2.0',
  CveRetenc: TipoRetencion.Dividendos,
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
    NacionalidadR: 'Nacional',
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
  complemento: [
    {
      innerXml: '<ext:MiComplemento xmlns:ext="urn:example"/>',
      meta: { id: 1 },
    },
  ],
});
```

The builder does not sign the document; add **Certificado**, **Sello**, and related fields through your signing pipeline after generating the XML.

## API

| Export | Kind | Description |
| --- | --- | --- |
| `buildRetencion20Xml` | function | `(doc: Retencion20) => string` — full XML document |
| `RETENCION_PAGO_NAMESPACE_V1` | const | Namespace URI for Retenciones 1.0 |
| `RETENCION_PAGO_NAMESPACE_V2` | const | Namespace URI for Retenciones 2.0 |
| `TipoRetencion` | enum | Example SAT retention type codes (`14`, `16`, …) |
| `Retencion10` | interface | Typed root attributes for v1.0 documents |
| `Retencion20` | interface | Typed root + nested nodes for v2.0 XML |
| `EmisorRetencion` | interface | Issuer RFC, name, regimen, optional CURP |
| `ReceptorRetencion` | interface | `NacionalidadR` + `nacional` or `extranjero` branch |
| `ReceptorNacional` | interface | National receiver fields |
| `ReceptorExtranjero` | interface | Foreign receiver fields |
| `PeriodoRetencion` | interface | `MesIni`, `MesFin`, `Ejerc` |
| `TotalesRetencion` | interface | Operation and retention totals |
| `ComplementoRetencion` | interface | `innerXml` string + optional `meta` |

## Author

**Amir Misael Marin Coh** — [@MisaelMa](https://github.com/MisaelMa)

## License

This package is released under the [MIT License](https://opensource.org/licenses/MIT).
