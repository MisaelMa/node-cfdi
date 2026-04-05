# @cfdi/utils

Utilidades generales para el ecosistema CFDI. Incluye conversion de numeros a letras en español (para totales en facturas), manejo de logos y utilidades de archivos.

## Instalacion

```bash
npm install @cfdi/utils
```

## Uso

### Numeros a letras

```typescript
import { NumeroALetras } from '@cfdi/utils';

const converter = new NumeroALetras();

// Convertir numero a letras con moneda
converter.NumeroALetras(1234.56, { plural: 'PESOS', singular: 'PESO' });
// "MIL DOSCIENTOS TREINTA Y CUATRO PESOS 56/100 M.N"

converter.NumeroALetras(1, { plural: 'PESOS', singular: 'PESO' });
// "UN PESO 00/100 M.N"

converter.NumeroALetras(1000000);
// "UN MILLON"
```

### Logo

```typescript
import { Logo } from '@cfdi/utils';

const logo = new Logo();
// Manejo de logos para representacion impresa de CFDI
```

### Utilidades de archivo

```typescript
import { isPath } from '@cfdi/utils';

// Detecta si un string es una ruta de archivo o contenido directo
isPath('/ruta/archivo.xml'); // true
isPath('<xml>contenido</xml>'); // false
```

## API

| Export | Tipo | Descripcion |
|--------|------|-------------|
| `NumeroALetras` | clase | Convierte numeros a texto en español con formato de moneda |
| `Logo` | clase | Manejo de logos para PDF |
| `File` | clase | Utilidades de lectura de archivos |
| `isPath(input)` | funcion | Detecta si un string es ruta o contenido |

## Licencia

[MIT](../../LICENSE)
