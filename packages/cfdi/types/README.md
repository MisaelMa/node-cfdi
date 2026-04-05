# @cfdi/types

Definiciones de tipos TypeScript para CFDI 4.0. Proporciona interfaces y tipos para la estructura del comprobante fiscal, sus elementos y complementos.

## Instalacion

```bash
npm install @cfdi/types
```

## Uso

```typescript
import {
  XmlComprobante,
  XmlConcepto,
  XmlEmisor,
  XmlReceptor,
  XmlImpuestos,
  XmlRelacionados,
  CFDIComprobante,
  XmlComplements,
} from '@cfdi/types';

// Definir atributos del comprobante
const comprobante: CFDIComprobante = {
  Fecha: '2024-01-15T12:00:00',
  SubTotal: '1000.00',
  Total: '1160.00',
  Moneda: 'MXN',
  TipoDeComprobante: 'I',
  Exportacion: '01',
  MetodoPago: 'PUE',
  FormaPago: '01',
  LugarExpedicion: '12345',
};
```

### Tipos de complementos

```typescript
import {
  Ine,
  Aerolineas,
  CartaPorte20,
  Pago20,
  Iedu,
} from '@cfdi/types';
```

### Tipos de configuracion

```typescript
import type {
  Config,
  SaxonHe,
  XsltSheet,
  InvoiceType,
  InvoiceRelation,
  TaxSystem,
} from '@cfdi/types';

// Enums disponibles
InvoiceType.INGRESO;    // 'I'
InvoiceType.EGRESO;     // 'E'
InvoiceType.TRASLADO;   // 'T'
InvoiceType.NOMINA;     // 'N'
InvoiceType.PAGO;       // 'P'
```

## API

### Interfaces del comprobante

| Tipo | Descripcion |
|------|-------------|
| `XmlComprobante` | Estructura completa del nodo Comprobante |
| `CFDIComprobante` | Atributos del comprobante (Fecha, Total, Moneda, etc.) |
| `XmlEmisor` | Estructura del nodo Emisor |
| `XmlReceptor` | Estructura del nodo Receptor |
| `XmlConcepto` | Estructura del nodo Conceptos |
| `XmlImpuestos` | Estructura del nodo Impuestos |
| `XmlRelacionados` | Estructura del nodo CfdiRelacionados |
| `XmlComplements` | Estructura del nodo Complemento |

### Interfaces de complementos

| Tipo | Descripcion |
|------|-------------|
| `Ine` | Complemento INE |
| `Aerolineas` | Complemento de aerolineas |
| `CartaPorte20` | Complemento carta porte 2.0 |
| `Pago20` | Complemento de pagos 2.0 |
| `Iedu` | Complemento instituciones educativas |

### Enums

| Enum | Descripcion |
|------|-------------|
| `InvoiceType` | Tipos de comprobante (I, E, T, N, P) |
| `InvoiceRelation` | Tipos de relacion entre CFDI |
| `TaxSystem` | Regimenes fiscales |

### Interfaces de configuracion

| Tipo | Descripcion |
|------|-------------|
| `Config` | Configuracion general del CFDI |
| `SaxonHe` | Configuracion del binario Saxon-HE |
| `XsltSheet` | Ruta a la hoja de transformacion XSLT |
| `Schema` | Ruta al esquema XSD |

## Licencia

[MIT](../../LICENSE)
