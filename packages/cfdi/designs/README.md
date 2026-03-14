# @cfdi/designs

Disenos y plantillas para generar PDF de facturas CFDI. Proporciona multiples layouts predefinidos y una clase abstracta para crear disenos personalizados.

## Instalacion

```bash
npm install @cfdi/designs
```

## Uso

```typescript
import { PDF, GeneradorPdf } from '@cfdi/designs';

// Generar PDF con un diseno predefinido
const pdf = new PDF(datosComprobante, opciones);
const documento = pdf.crear();
```

## Disenos disponibles

| Diseno | Descripcion |
|--------|-------------|
| A117 | Layout estandar |
| B111 | Layout compacto |
| B112 | Layout con detalles |
| B123 | Layout con complementos |
| B222 | Layout alternativo |
| B333 | Layout extendido |

## Clase abstracta `GeneradorPdf`

Para crear un diseno personalizado, extiende `GeneradorPdf` e implementa los metodos abstractos:

| Metodo | Descripcion |
|--------|-------------|
| `logo()` | Renderiza el logo del emisor |
| `folio()` | Numero de folio/serie |
| `datosEmisor()` | Datos del emisor |
| `receptor()` | Datos del receptor |
| `conceptos()` | Tabla de conceptos |
| `impuestos()` | Desglose de impuestos |
| `totalEnLetras()` | Total en palabras |
| `certificados()` | Certificados digital y SAT |
| `folioFiscal()` | UUID del timbrado |
| `qr()` | Codigo QR de verificacion |

## Utilidades PDF

| Clase | Descripcion |
|-------|-------------|
| `Grid` | Sistema de grid para layout |
| `Row`, `Column` | Filas y columnas |
| `Table`, `Cell` | Tablas y celdas |
| `Text` | Texto con estilos |
| `Image` | Imagenes |
| `Style` | Estilos personalizados |

## Licencia

[MIT](../../LICENSE)
