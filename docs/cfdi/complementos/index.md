# Complementos

# Complementos

```bash
npm i @cfdi/complementos --save
```

## Complementos disponibles

| Complemento | Clase | Documentacion |
|-------------|-------|---------------|
| Pagos 2.0 | `Pagos20`, `Pago20`, `Pago20Relacionado`, `Pago20ImpuestosP` | [pagos-2.0](pagos-2.0) |
| Carta Porte 2.0 | `CartaPorte20`, `CtaPrt20Ubicacion`, `CtaPrt20Mercancias`, `CtaPrt20FiguraTransporte` | [carta-porte-2.0](carta-porte-2.0) |
| INE 1.1 | `Ine` | [ine-1.1](ine-1.1) |
| Aerolineas | `Aerolineas` | - |
| IEDU | `Iedu` | [conceptos](../conceptos#iedu) |

## Uso general

Todos los complementos se importan desde `@cfdi/complementos` y se agregan al CFDI con el metodo `complemento()`:

```typescript
import { CFDI } from '@cfdi/xml';
import { Pagos20 } from '@cfdi/complementos';

const cfdi = new CFDI({ /* config */ });
// ... emisor, receptor, conceptos ...

const pago20 = new Pagos20();
// ... configurar complemento ...

cfdi.complemento(pago20);
```

Para complementos de concepto (como IEDU), se usa `concepto.complemento()`:

```typescript
import { Iedu } from '@cfdi/complementos';

const iedu = new Iedu({ /* attrs */ });
concepto.complemento(iedu);
```
