# @cfdi/validador

This package parses CFDI XML into a normalized in-memory model and runs bundled business-rule checks grouped by area: structure, amounts, issuer, receiver, line items, taxes, Timbre Fiscal Digital, and CFD seal. Results separate **errors** from **warnings** (rules whose codes end with `W`), and expose the detected CFDI version.

## Installation

```bash
npm install @cfdi/validador
```

## Usage

```typescript
import { Validador, parseXml } from '@cfdi/validador';

const validador = new Validador();

const result = validador.validate(xmlString);
console.log(result.valid, result.version);
console.log(result.errors, result.warnings);

// From file
const fromFile = validador.validateFile('/path/to/cfdi.xml');

// Low-level: only parse (no rules)
const data = parseXml(xmlString);
console.log(data.comprobante['Total'], data.timbre?.uuid);
```

Rule bundles are exported if you want to inspect or compose custom sets:

```typescript
import {
  estructuraRules,
  montosRules,
  emisorRules,
  receptorRules,
  conceptosRules,
  impuestosRules,
  timbreRules,
  selloRules,
} from '@cfdi/validador';
```

## API

| Export | Kind | Description |
| --- | --- | --- |
| `Validador` | class | `validate(xml)`, `validateFile(path)` |
| `parseXml` | function | Parse CFDI XML to `CfdiData`; throws if no `Comprobante` |
| `ValidationResult` | interface | `valid`, `errors`, `warnings`, `version` |
| `ValidationIssue` | interface | `code`, `message`, optional `field`, `rule` |
| `ValidationRule` | type | `(data: CfdiData) => ValidationIssue[]` |
| `CfdiData` | interface | Parsed comprobante, emisor, receptor, conceptos, impuestos, timbre, `raw` |
| `ConceptoData` | interface | Concept line attributes and nested impuestos |
| `ImpuestosData` | interface | Totals and traslado/retención rows |
| `TimbreData` | interface | UUID, sellos, PAC RFC, certificate no., version |
| `estructuraRules` | const | Array of structure rules |
| `montosRules` | const | Amount consistency rules |
| `emisorRules` | const | Issuer rules |
| `receptorRules` | const | Receiver rules |
| `conceptosRules` | const | Line-item rules |
| `impuestosRules` | const | Tax total rules |
| `timbreRules` | const | Timbre FDI rules |
| `selloRules` | const | CFD seal rules |

## License

This package is released under the [MIT License](https://opensource.org/licenses/MIT).
