# @cfdi/pdf

Opciones de configuracion para la generacion de PDF a partir de comprobantes CFDI. Define las interfaces para personalizar el logo, lugar de expedicion y fuentes tipograficas del documento.

## Instalacion

```bash
npm install @cfdi/pdf
```

## Uso

```typescript
import { OptionsPdf, Logo } from '@cfdi/pdf';

// Configuracion basica con logo como string base64
const opciones: OptionsPdf = {
  logo: 'data:image/png;base64,...',
  lugarExpedicion: 'Ciudad de Mexico, CDMX',
};

// Configuracion con logo detallado
const logo: Logo = {
  image: 'data:image/png;base64,...',
  width: 150,
  height: 80,
};

const opcionesCompletas: OptionsPdf = {
  logo,
  lugarExpedicion: 'Monterrey, Nuevo Leon',
  fonts: {
    Roboto: {
      normal: '/ruta/fuentes/Roboto-Regular.ttf',
      bold: '/ruta/fuentes/Roboto-Bold.ttf',
      italics: '/ruta/fuentes/Roboto-Italic.ttf',
      bolditalics: '/ruta/fuentes/Roboto-BoldItalic.ttf',
    },
  },
};
```

## API

### `OptionsPdf`

| Propiedad | Tipo | Descripcion |
|-----------|------|-------------|
| `logo` | `string \| Logo` | Logo en formato base64 o como objeto `Logo` |
| `lugarExpedicion` | `string` | Direccion del lugar de expedicion |
| `fonts` | `TFontDictionary` | Diccionario de fuentes personalizadas (de pdfmake) |

### `Logo`

| Propiedad | Tipo | Descripcion |
|-----------|------|-------------|
| `image` | `string` | Imagen en formato base64 |
| `width` | `number \| string` | Ancho del logo |
| `height` | `number \| string` | Alto del logo |

## Licencia

[MIT](../../LICENSE)
