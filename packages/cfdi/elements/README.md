# @cfdi/elements

Elementos estructurales del comprobante CFDI. Define las constantes y clases base que representan los nodos XML de un CFDI 4.0.

## Instalacion

```bash
npm install @cfdi/elements
```

## Uso

```typescript
import { Elemento } from '@cfdi/elements';
import {
  COMPROBANTE,
  EMISOR,
  RECEPTOR,
  CONCEPTOS,
  CONCEPTO,
  IMPUESTOS,
  TRASLADOS,
  TRASLADO,
  COMPLEMENTO,
} from '@cfdi/elements';

// Usar constantes de tags XML
console.log(COMPROBANTE); // 'cfdi:Comprobante'
console.log(EMISOR);      // 'cfdi:Emisor'
console.log(RECEPTOR);    // 'cfdi:Receptor'
console.log(CONCEPTOS);   // 'cfdi:Conceptos'
console.log(CONCEPTO);    // 'cfdi:Concepto'
console.log(IMPUESTOS);   // 'cfdi:Impuestos'
```

### Clase Elemento

Clase generica base para representar nodos XML con prefijo de namespace.

```typescript
const concepto = new Elemento('cfdi:Concepto');

concepto.tag();    // 'cfdi:Concepto'
concepto.prefix(); // 'cfdi'
concepto.name();   // 'Concepto'
```

### Complementos

El paquete tambien exporta elementos de complementos como Carta Porte 3.1 y Vehiculo Usado.

```typescript
import { CartaPorte31, VehiculoUsado } from '@cfdi/elements';
```

## API

### Constantes

| Constante | Valor |
|-----------|-------|
| `COMPROBANTE` | `'cfdi:Comprobante'` |
| `EMISOR` | `'cfdi:Emisor'` |
| `RECEPTOR` | `'cfdi:Receptor'` |
| `CONCEPTOS` | `'cfdi:Conceptos'` |
| `CONCEPTO` | `'cfdi:Concepto'` |
| `IMPUESTOS` | `'cfdi:Impuestos'` |
| `TRASLADOS` | `'cfdi:Traslados'` |
| `TRASLADO` | `'cfdi:Traslado'` |
| `COMPLEMENTO` | `'cfdi:Complemento'` |

### Clase `Elemento<T>`

| Metodo | Retorno | Descripcion |
|--------|---------|-------------|
| `tag()` | `string` | Nombre completo del tag (ej. `cfdi:Concepto`) |
| `prefix()` | `string` | Prefijo del namespace (ej. `cfdi`) |
| `name()` | `string` | Nombre del elemento sin prefijo (ej. `Concepto`) |

## Licencia

[MIT](../../LICENSE)
