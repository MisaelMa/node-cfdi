# @cfdi/transform

Transformacion de datos XML CFDI. Extrae los valores de un comprobante fiscal XML y genera una cadena con formato de expresion impresa.

## Instalacion

```bash
npm install @cfdi/transform
```

## Uso

```typescript
import { Transform } from '@cfdi/transform';

// Crear instancia con el XML parseado
const transform = new Transform(xmlObject);

// Ejecutar la transformacion para obtener la cadena de valores
const resultado = await transform.run();
// Resultado: ||valor1|valor2|valor3|...||
```

### Configuracion adicional

```typescript
const transform = new Transform(xmlObject);

// Especificar ruta XSLT
transform.json('/ruta/al/archivo.xsl');

// Configurar advertencias
transform.warnings('silent');

// Ejecutar
const cadena = await transform.run();
```

## API

### Clase `Transform`

| Metodo | Retorno | Descripcion |
|--------|---------|-------------|
| `constructor(xml)` | `Transform` | Recibe el objeto XML parseado del CFDI |
| `run()` | `Promise<string>` | Extrae los valores del comprobante y retorna la cadena con formato `\|\|valor1\|valor2\|...\|\|` |
| `json(xslPath)` | `Transform` | Establece la ruta del archivo XSLT |
| `warnings(type)` | `Transform` | Configura el nivel de advertencias (`'silent'` por defecto) |

La transformacion recorre la estructura del comprobante en el siguiente orden: atributos, InformacionGlobal, CfdiRelacionados, Emisor, Receptor, Conceptos, Impuestos y Complemento. Omite automaticamente namespaces, esquemas y el sello digital.

## Licencia

[MIT](../../LICENSE)
