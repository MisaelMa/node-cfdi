# @cfdi/catalogos

Catalogos oficiales del SAT para CFDI 4.0. Contiene enums, tipos y listas de valores para formas de pago, metodos de pago, regimenes fiscales, tipos de comprobante, usos de CFDI, impuestos y exportacion.

## Instalacion

```bash
npm install @cfdi/catalogos
```

## Uso

```typescript
import {
  FormaPago,
  MetodoPago,
  RegimenFiscal,
  TipoComprobante,
  UsoCFDI,
  Impuesto,
  ExportacionEnum,
  FormaPagoList,
} from '@cfdi/catalogos';

// Usar enums directamente
const pago = FormaPago.TRANSFERENCIA_ELECTRONICA; // '03'
const metodo = MetodoPago.PUE; // Pago en Una sola Exhibicion
const regimen = RegimenFiscal.GENERAL_DE_LEY; // Regimen general
const tipo = TipoComprobante.INGRESO;
const uso = UsoCFDI.GASTOS_EN_GENERAL;
const impuesto = Impuesto.IVA;
const exportacion = ExportacionEnum.NoAplica; // '01'

// Listas para selects/dropdowns
console.log(FormaPagoList);
// [{ label: 'Efectivo', value: '01' }, { label: 'Cheque nominativo', value: '02' }, ...]
```

## API

| Export | Tipo | Descripcion |
|--------|------|-------------|
| `FormaPago` | enum | Claves de forma de pago (01-99) |
| `FormaPagoList` | array | Lista con label/value para UI |
| `FormaPagoType` | type | Tipo union de claves validas |
| `MetodoPago` | enum | PUE, PPD |
| `RegimenFiscal` | enum | Regimenes fiscales del SAT |
| `TipoComprobante` | enum | Ingreso, Egreso, Traslado, Nomina, Pago |
| `UsoCFDI` | enum | Usos del CFDI |
| `Impuesto` | enum | IVA, ISR, IEPS |
| `ExportacionEnum` | enum | NoAplica, Definitiva, Temporal |
| `ExportacionType` | type | Tipo union de claves de exportacion |

## Autor

**Amir Misael Marin Coh** — [@MisaelMa](https://github.com/MisaelMa)

## Licencia

[MIT](../../LICENSE)
