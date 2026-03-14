# @cfdi/rfc

Validacion de RFC (Registro Federal de Contribuyentes) mexicano. Verifica formato, fecha, digito verificador y palabras inconvenientes.

## Instalacion

```bash
npm install @cfdi/rfc
```

## Uso

```typescript
import { rfc } from '@cfdi/rfc';

// Validar un RFC
const resultado = rfc.validate('GARC850101AB1');
// { isValid: true, type: 'PF', rfc: 'GARC850101AB1' }

const resultado2 = rfc.validate('ABC010101XY9');
// { isValid: false, type: '', rfc: 'ABC010101XY9' }

// Obtener tipo de RFC
const tipo = rfc.getType('GARC850101AB1'); // 'PF' (Persona Fisica)
const tipo2 = rfc.getType('ABC010101XY9'); // 'PM' (Persona Moral)

// Verificar palabras inconvenientes del SAT
const prohibido = rfc.hasForbiddenWords('BUEI850101AB1'); // true
```

## API

### Modulo `rfc`

| Funcion | Retorna | Descripcion |
|---------|---------|-------------|
| `validate(input)` | `{ isValid, type, rfc }` | Valida formato, fecha, digito verificador y palabras inconvenientes |
| `getType(rfc)` | `string` | Retorna `'PF'` (persona fisica, 13 caracteres) o `'PM'` (persona moral, 12 caracteres) |
| `hasForbiddenWords(rfc)` | `boolean` | Verifica si los primeros 4 caracteres estan en la lista de palabras inconvenientes del SAT |

Sin dependencias externas.

## Licencia

[MIT](../../LICENSE)
