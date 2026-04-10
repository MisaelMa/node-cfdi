# @sat/recursos

This package downloads SAT-published **CFDI** assets for a chosen CFDI version (**3.3** or **4.0**): the main **XSD**, optional catalog / tipo-datos imports, the official **cadena original XSLT**, every remote `xsl:include` complement into a local `complementos/` folder, and rewrites include `href`s in the main XSLT so validation and cadena generation work offline.

## Installation

```bash
npm install @sat/recursos
```

## Usage

```typescript
import { SatResources } from '@sat/recursos';

const downloader = new SatResources({
  version: '4.0',
  outputDir: './sat-resources/cfdi-4.0',
});

const result = await downloader.download();

console.log(result.schema); // path to cfdv40.xsd or cfdv33.xsd
console.log(result.xslt); // path to cadenaoriginal.xslt (includes rewritten)
console.log(result.complementos); // downloaded .xslt paths
console.log(result.catalogSchema, result.tipoDatosSchema);
console.log(result.unused, result.added); // diff vs previous complementos
```

## API

| Export | Kind | Description |
|--------|------|-------------|
| `SatResources` | class | Downloads XSD/XSLT and related files for CFDI 3.3 or 4.0. |
| `SatResourcesOptions` | interface | `{ version: '3.3' \| '4.0', outputDir: string }`. |
| `SatVersion` | type | `'3.3' \| '4.0'`. |
| `DownloadResult` | interface | Paths to schema, XSLT, optional imports, complement list, diff metadata. |

## Author

**Amir Misael Marin Coh** — [@MisaelMa](https://github.com/MisaelMa)

## License

This package is released under the [MIT License](../../../LICENSE).
