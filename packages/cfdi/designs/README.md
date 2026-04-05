# @cfdi/designs

Disenos y plantillas para generar representaciones en PDF de facturas CFDI. Incluye clases utilitarias para construir documentos PDF con pdfmake y disenos predefinidos listos para usar.

## Instalacion

```bash
npm install @cfdi/designs
```

## Uso

### Usar un diseno predefinido

```typescript
import { PDF117 } from '@cfdi/designs';

const plantilla = new PDF117();
plantilla.design();

const pdf = plantilla.getPDF();
const documento = pdf.toJSON();
```

### Construir un diseno personalizado

```typescript
import { PDF, Row, Column, Table, Cell, Text, Image, Style } from '@cfdi/designs';

const pdf = new PDF();

// Crear una fila con columnas
const encabezado = new Row()
  .addColumn(
    new Column({
      mode: 'stack',
      children: new Image('base64...')
        .setHeight(100)
        .setWidth(100)
        .toJSON(),
    })
  )
  .addColumn(
    new Column({ width: 200 })
      .setContent({ text: 'Mi Empresa SA de CV', style: { bold: true } })
      .setStyle(new Style({ fontSize: 9 }))
  );

// Crear tabla de conceptos
const tabla = new Table();
tabla.setWidths([50, 200, 80, 80]);
tabla.setStyle(new Style({ fontSize: 9 }));
tabla.setMargin([0, 10, 0, 10]);

tabla.setHeader(
  [
    new Cell('CANTIDAD').toJSON(),
    new Cell('DESCRIPCION').toJSON(),
    new Text('P.UNITARIO').toJSON(),
    new Text('IMPORTE').toJSON(),
  ],
  new Style({ fillColor: 'black', color: 'white', fontSize: 9 })
);

tabla.addRow([
  new Cell('1').toJSON(),
  new Text('Servicio de consultoria').toJSON(),
  new Text('1000.00').toJSON(),
  new Text('1000.00').toJSON(),
]);

// Agregar texto con estilos
const total = new Text('TOTAL: ', new Style({ bold: true }))
  .addText('$1,160.00', new Style({ fontSize: 12 }));

// Construir el documento
pdf
  .addContent(encabezado.toJSON())
  .addContent(tabla.toJSON())
  .addContent(total.toJSON())
  .setStyles({ header: { fontSize: 18, bold: true } })
  .setDefaultStyle({ fontSize: 10 });
```

## API

### Disenos predefinidos

| Clase | Descripcion |
|-------|-------------|
| `PDF117` | Diseno de factura con encabezado, datos del cliente, tabla de conceptos, desglose de impuestos y datos fiscales del SAT |

### Clases utilitarias

| Clase | Descripcion |
|-------|-------------|
| `PDF` | Contenedor principal del documento. Metodos: `addContent()`, `setStyles()`, `setDefaultStyle()`, `toJSON()` |
| `Row` | Fila de columnas. Metodos: `addColumn()`, `setGap()`, `toJSON()` |
| `Column` | Columna dentro de una fila. Metodos: `setContent()`, `setStyle()`, `toJSON()` |
| `Table` | Tabla con filas y columnas. Metodos: `setHeader()`, `addRow()`, `setWidths()`, `setMargin()`, `setStyle()`, `toJSON()` |
| `Cell` | Celda de tabla. Metodos: `setColSpan()`, `setBorder()`, `setAlignment()`, `setStyle()`, `toJSON()` |
| `Text` | Texto con estilo. Metodos: `addText()`, `setBold()`, `setMargin()`, `setStyle()`, `toJSON()` |
| `Image` | Imagen (base64). Metodos: `setWidth()`, `setHeight()`, `setAlignment()`, `toJSON()` |
| `Style` | Estilo aplicable a cualquier elemento. Propiedades: `fontSize`, `bold`, `color`, `fillColor`, `margin`, `alignment` |
| `Grid` | Utilidad para crear layouts de cuadricula |

### Clase abstracta `GeneradorPdf`

Clase base para crear disenos personalizados. Define los metodos abstractos que cada diseno debe implementar:

`logo()`, `folio()`, `datosEmisor()`, `receptor()`, `impuestos()`, `totalEnLetras()`, `certificadoEmisor()`, `folioFiscal()`, `qr()`, `detalles()`, `formaPago()`, `metodoPago()`, `moneda()`, `tipoComprobante()`, entre otros.

## Licencia

[MIT](../../LICENSE)
