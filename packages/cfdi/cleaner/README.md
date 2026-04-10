# @cfdi/cleaner

This package strips non-standard content from CFDI XML (addendas, non-SAT complement nodes and namespaces, extra schema locations, stylesheet hooks) and normalizes whitespace, leaving official SAT structure intact without modifying **Sello**, **Certificado**, or UUID-related data.

## Installation

```bash
npm install @cfdi/cleaner
```

## Usage

```typescript
import {
  CfdiCleaner,
  removeAddenda,
  collapseWhitespace,
  SAT_NAMESPACES,
} from '@cfdi/cleaner';

const cleaner = new CfdiCleaner();

const cleaned = cleaner.clean(xmlString);

// Or from disk
const fromFile = cleaner.cleanFile('/path/to/comprobante.xml');
```

You can also run individual cleaning steps in custom order (the class applies a fixed pipeline: stylesheet → addenda → non-SAT nodes → namespaces → schema locations → whitespace):

```typescript
import {
  removeStylesheetAttributes,
  removeNonSatNodes,
  removeNonSatNamespaces,
} from '@cfdi/cleaner';

let xml = raw;
xml = removeStylesheetAttributes(xml);
xml = removeNonSatNodes(xml);
xml = removeNonSatNamespaces(xml);
```

## API

| Export | Kind | Description |
| --- | --- | --- |
| `CfdiCleaner` | class | `clean(xml: string)`, `cleanFile(filePath: string)` |
| `SAT_NAMESPACES` | constant | Set of known SAT namespace URIs used when filtering |
| `removeStylesheetAttributes` | function | Remove `xml-stylesheet` processing instructions |
| `removeAddenda` | function | Remove addenda blocks |
| `removeNonSatNodes` | function | Remove non-SAT children under `cfdi:Complemento` |
| `removeNonSatNamespaces` | function | Remove non-SAT `xmlns` declarations on the root |
| `removeNonSatSchemaLocations` | function | Prune non-SAT pairs from `xsi:schemaLocation` |
| `collapseWhitespace` | function | Normalize whitespace between tags |

## Author

**Amir Misael Marin Coh** — [@MisaelMa](https://github.com/MisaelMa)

## License

This package is released under the [MIT License](https://opensource.org/licenses/MIT).
