# @sat/diot

This package builds **DIOT** (Declaración Informativa de Operaciones con Terceros) **plain-text** files: one **pipe-delimited** line per **operation with third parties**, with SAT **tipo de tercero** and **tipo de operación** codes and validated **two-decimal** amounts.

## Installation

```bash
npm install @sat/diot
```

## Usage

```typescript
import {
  buildDiotTxt,
  TipoTercero,
  TipoOperacion,
} from '@sat/diot';

const txt = buildDiotTxt({
  rfc: 'AAA010101AAA',
  ejercicio: 2024,
  periodo: 3,
  operaciones: [
    {
      tipoTercero: TipoTercero.ProveedorNacional,
      tipoOperacion: TipoOperacion.OtrosConIVA,
      rfc: 'BBB020202BBB',
      montoIva16: 1600,
      montoIva0: 0,
      montoExento: 0,
      montoRetenido: 0,
      montoIvaNoDeduc: 0,
    },
  ],
});

// Each line: TipoTercero|TipoOperacion|RFC|IDFiscal|Nombre|Pais|Nacionalidad|IVA16|IVA0|Exento|Retenido|NoDeduc
console.log(txt);
```

## API

| Export | Kind | Description |
|--------|------|-------------|
| `buildDiotTxt` | function | `(declaracion: DiotDeclaracion) => string` pipe-delimited lines. |
| `DiotDeclaracion` | interface | RFC, exercise, period, list of `OperacionTercero`. |
| `OperacionTercero` | interface | Third-party operation: types, optional RFC/foreign ids, six amount fields. |
| `TipoTercero` | enum | e.g. `ProveedorNacional` (`04`), `ProveedorExtranjero` (`05`), `ProveedorGlobal` (`15`). |
| `TipoOperacion` | enum | e.g. honorarios, arrendamiento, otros con/sin IVA codes. |

## License

This package is released under the [MIT License](../../../LICENSE).
