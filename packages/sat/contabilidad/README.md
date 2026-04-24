# @sat/contabilidad

This package builds **Contabilidad Electrónica** XML documents aligned with **Anexo 24** of the SAT rules: **Balanza de comprobación**, **Catálogo de cuentas**, **Pólizas del periodo**, and **Auxiliar de cuentas**, with selectable schema version **1.1** or **1.3**.

## Installation

```bash
npm install @sat/contabilidad
```

## Usage

```typescript
import {
  buildBalanzaXml,
  buildCatalogoXml,
  buildPolizasXml,
  buildAuxiliarXml,
  TipoEnvio,
  NaturalezaCuenta,
  VersionContabilidad,
} from '@sat/contabilidad';

const info = {
  rfc: 'AAA010101AAA',
  mes: '03',
  anio: 2024,
  tipoEnvio: TipoEnvio.Normal,
};

const balanzaXml = buildBalanzaXml(
  info,
  [
    {
      numCta: '1000-001',
      saldoIni: 0,
      debe: 1000,
      haber: 0,
      saldoFin: 1000,
    },
  ],
  VersionContabilidad.V1_3,
);

const polizasXml = buildPolizasXml(
  info,
  [
    {
      numPoliza: 'P-1',
      fecha: '2024-03-15',
      concepto: 'Diario',
      detalle: [
        {
          numUnidad: '1',
          concepto: 'Cargo',
          debe: 100,
          haber: 0,
          numCta: '1000-001',
        },
      ],
    },
  ],
  'AF', // TipoSolicitud: AF | FC | DE | CO
  VersionContabilidad.V1_3,
);
```

## API

| Export | Kind | Description |
|--------|------|-------------|
| `buildBalanzaXml` | function | `(info, cuentas, version?)` → Balanza XML string. |
| `buildCatalogoXml` | function | `(info, cuentas, version?)` → Catálogo XML string. |
| `buildPolizasXml` | function | `(info, polizas, tipoSolicitud, version?)` → Pólizas XML string. |
| `buildAuxiliarXml` | function | `(info, cuentas, tipoSolicitud, version?)` → Auxiliar XML string. |
| `ContribuyenteInfo` | interface | RFC, mes, año, tipo de envío. |
| `TipoEnvio` | enum | `Normal` (`N`), `Complementaria` (`C`). |
| `TipoAjuste` | enum | `Cierre`, `Apertura` (catalog types). |
| `NaturalezaCuenta` | enum | `Deudora`, `Acreedora`. |
| `CuentaBalanza` | interface | Account balances for balanza. |
| `CuentaCatalogo` | interface | Chart-of-accounts row. |
| `Poliza` / `PolizaDetalle` | interface | Journal entry header and lines. |
| `CuentaAuxiliar` / `TransaccionAuxiliar` | interface | Auxiliary account and movements. |
| `VersionContabilidad` | enum | `V1_1`, `V1_3`. |

## Author

**Amir Misael Marin Coh** — [@MisaelMa](https://github.com/MisaelMa)

## License

This package is released under the [MIT License](../../../LICENSE).
