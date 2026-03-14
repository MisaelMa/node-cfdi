# @cfdi/expresiones

Genera la expresion impresa de un CFDI. Extrae los valores del XML para construir la cadena de verificacion usada en el codigo QR de la representacion impresa.

## Instalacion

```bash
npm install @cfdi/expresiones
```

## Uso

```typescript
import { Transform } from '@cfdi/expresiones';

const transform = new Transform();
const expresion = await transform.s('ruta/factura.xml').run();
// Retorna la cadena de expresion impresa para generar el QR
```

## API

### Clase `Transform`

| Metodo | Descripcion |
|--------|-------------|
| `s(archivo)` | Define el archivo XML de entrada |
| `run()` | Ejecuta la extraccion y retorna la expresion |

## Licencia

[MIT](../../LICENSE)
