# @saxon-he/cli

Wrapper de Saxon-HE (Saxon Home Edition) para transformaciones XSLT y consultas XPath. Proporciona una interfaz fluida para construir y ejecutar comandos de Saxon desde Node.js.

## Instalacion

```bash
npm install @saxon-he/cli
```

### Requisitos

- **Java JDK** instalado en el sistema
- **Saxon-HE** >= 9.9

## Uso

### Transformacion XSLT

```typescript
import { Transform } from '@saxon-he/cli';

const transform = new Transform();

// Transformar XML con XSLT
const resultado = transform
  .s('entrada.xml')       // Archivo XML de entrada
  .xsl('plantilla.xslt')  // Archivo XSLT
  .o('salida.xml')         // Archivo de salida
  .run();

// Obtener solo el comando (sin ejecutar)
const cmd = transform.s('entrada.xml').xsl('plantilla.xslt').cli();
```

### Consulta XPath

```typescript
import { Query } from '@saxon-he/cli';

const query = new Query();

// Ejecutar consulta XPath
const resultado = query
  .s('documento.xml')
  .qs('//elemento/@atributo')
  .run();

// Desde archivo de consulta
const resultado2 = query
  .s('documento.xml')
  .q('consulta.xq')
  .run();
```

## API

### Clase `Transform`

| Metodo | Descripcion |
|--------|-------------|
| `s(archivo)` | Archivo XML de entrada |
| `xsl(stylesheet)` | Archivo XSLT |
| `o(output)` | Archivo de salida |
| `im(modename)` | Modo inicial |
| `it(template)` | Template inicial |
| `warnings(on\|off)` | Control de warnings |
| `run()` | Ejecutar transformacion |
| `cli()` | Obtener comando como string |

### Clase `Query`

| Metodo | Descripcion |
|--------|-------------|
| `s(archivo)` | Archivo XML de entrada |
| `q(queryfile)` | Archivo con consulta XPath/XQuery |
| `qs(querystring)` | Consulta como string |
| `run()` | Ejecutar consulta |
| `cli()` | Obtener comando como string |

## Licencia

[MIT](../../LICENSE)
