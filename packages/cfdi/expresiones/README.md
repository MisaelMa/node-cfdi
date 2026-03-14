# @cfdi/expresiones

Generacion de expresiones impresas del CFDI para verificacion y codigos QR. Procesa un archivo XML de CFDI y extrae los valores necesarios para construir la cadena de verificacion.

## Instalacion

```bash
npm install @cfdi/expresiones
```

## Uso

```typescript
import { Transform } from '@cfdi/expresiones';

// Cargar archivo XML del CFDI
const transform = new Transform();
transform.s('/ruta/al/cfdi.xml');

// Generar la expresion impresa
const expresion = await transform.run();
// Resultado: ||valor1|valor2|valor3|...||
```

### Ejemplo completo

```typescript
import { Transform } from '@cfdi/expresiones';

const transform = new Transform();

// Cargar el XML (usa @cfdi/2json internamente para parsear)
transform.s('/ruta/factura.xml');

// Configurar advertencias (opcional)
transform.warnings('silent');

// Obtener la expresion impresa
const cadena = await transform.run();
console.log(cadena);
// ||4.0|2024-01-15T12:00:00|01|1000.00|...||
```

## API

### Clase `Transform`

| Metodo | Retorno | Descripcion |
|--------|---------|-------------|
| `s(archivo)` | `Transform` | Carga y parsea un archivo XML de CFDI |
| `run()` | `Promise<string>` | Genera la expresion impresa con formato `\|\|valor1\|valor2\|...\|\|` |
| `json(xslPath)` | `Transform` | Establece la ruta del archivo XSLT |
| `warnings(type)` | `Transform` | Configura el nivel de advertencias |

La expresion generada contiene los valores del comprobante en orden: atributos, emisor, receptor, conceptos, impuestos y complemento. Se omiten automaticamente los namespaces, esquemas, certificado y sello.

## Licencia

[MIT](../../LICENSE)
