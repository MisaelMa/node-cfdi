# @cfdi/transform

Transforma XML CFDI extrayendo valores para generar la cadena original u otras representaciones. Procesa recursivamente los nodos del XML y genera cadenas con formato pipe-separated.

## Instalacion

```bash
npm install @cfdi/transform
```

## Uso

```typescript
import { Transform } from '@cfdi/transform';

const transform = new Transform();
const cadena = await transform.s('ruta/factura.xml').run();
// "||valor1|valor2|valor3||"
```

## API

### Clase `Transform`

| Metodo | Descripcion |
|--------|-------------|
| `s(archivo)` | Define el archivo XML de entrada |
| `json(xslPath)` | Especifica ruta del XSLT |
| `warnings(type)` | Configura manejo de warnings |
| `run()` | Ejecuta la transformacion |

## Licencia

[MIT](../../LICENSE)
