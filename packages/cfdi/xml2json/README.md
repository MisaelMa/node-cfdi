# @cfdi/2json

Conversion de XML de CFDI a JSON. Acepta una ruta de archivo o un string de XML y retorna un objeto JSON estructurado.

## Instalacion

```bash
npm install @cfdi/2json
```

## Uso

```typescript
import { XmlToJson } from '@cfdi/2json';

// Desde archivo
const json = XmlToJson('/ruta/al/cfdi.xml');

// Desde string XML
const xml = '<cfdi:Comprobante xmlns:cfdi="..." Version="4.0">...</cfdi:Comprobante>';
const json2 = XmlToJson(xml);

// Mantener namespaces originales (por defecto se eliminan)
const jsonOriginal = XmlToJson('/ruta/al/cfdi.xml', { original: true });
// Con namespaces: { 'cfdi:Comprobante': { ... } }
// Sin namespaces (default): { Comprobante: { ... } }

// Modo compact
const jsonCompact = XmlToJson('/ruta/al/cfdi.xml', { compact: true });
```

## API

### `XmlToJson(xmlPath, config?)`

| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| `xmlPath` | `string` | Ruta a un archivo XML o string con contenido XML |
| `config.original` | `boolean` | Si es `true`, mantiene los prefijos de namespace. Por defecto `false` |
| `config.compact` | `boolean` | Si es `true`, usa formato compacto. Por defecto `false` |

**Retorna:** Objeto JSON con la estructura del CFDI. Los namespaces como `cfdi:` se eliminan por defecto para facilitar el acceso a los nodos.

## Autor

**Amir Misael Marin Coh** — [@MisaelMa](https://github.com/MisaelMa)

## Licencia

[MIT](../../LICENSE)
