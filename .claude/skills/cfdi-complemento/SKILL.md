---
name: cfdi-complemento
description: >
  Guide for adding new SAT fiscal complement (complemento) support to the cfdi-node monorepo.
  Use this skill whenever someone wants to: add a new complemento, implement a missing complement,
  create support for a SAT fiscal addon (like Hidrocarburos, Nomina, CartaPorte, etc.),
  or asks about how complements work in this project. Also trigger when the user mentions
  "complemento", "complement", "addon fiscal", "XSD del SAT", or references any SAT namespace
  like "http://www.sat.gob.mx/...". Even if the user just says "add hidrocarburos support"
  or "implement pagos" without explicitly mentioning "complement", this skill applies.
---

# Adding a New Complemento to cfdi-node

This guide walks you through implementing a new SAT fiscal complement in the `@cfdi/complementos` package. The project lives at `packages/cfdi/complementos/` inside the Rush monorepo.

## Understanding the Architecture

Every CFDI complement follows the same core idea: it's a TypeScript class that builds an XML fragment with the right SAT namespace, schema location, and attributes. The class extends the abstract `Complemento<T>` base class, which handles namespace registration and exposes `getComplement()` — the standardized method the CFDI builder uses to attach the complement to the invoice XML.

The base class (`src/Complemento.ts`) does the heavy lifting:

```typescript
abstract class Complemento<T = any> {
  public complemento: T = {} as T;
  // Manages: xmlns, key, xmlnskey, schemaLocation
  constructor(config: { xmlns: string; key: string; xsd: string }) { ... }
  public getComplement(): ComplementsReturn<T> { ... }
}
```

You define your XML structure as a generic type `T`, pass the SAT namespace info to `super()`, and build the complement data in your constructor and methods.

## Step-by-Step: Adding a New Complement

### 1. Gather SAT Requirements

Before writing code, you need these from the SAT specification or XSD:

- **Namespace URI** (xmlns): e.g. `http://www.sat.gob.mx/hidrocarburospetroliferos`
- **XSD URL**: e.g. `http://www.sat.gob.mx/sitio_internet/cfd/hidrocarburos/hidrocarburos.xsd`
- **XML element name with prefix**: e.g. `hidrocarburos:Hidrocarburos`
- **Attributes and nested elements**: read the XSD to understand the full structure
- **Catalogs/enums**: fixed value sets like permit types, product codes, etc.
- **Whether it's a root complement or concept-level complement**:
  - Root complements go in `Comprobante/Complemento/` (most common)
  - Concept complements go in `Comprobante/Conceptos/Concepto/ComplementoConcepto/`

### 2. Create the Type Definitions

Create types inside `src/4.0/<nombre>/type/`.

#### Attributes Interface

Every XML element has an `_attributes` property. Define an interface for it:

```typescript
// Example: src/4.0/hidrocarburos/type/hidrocarburos.xslt.ts

export interface XmlHidrocarburos {
  _attributes: XmlHidrocarburosAttributes;
}

export interface XmlHidrocarburosAttributes {
  Version: string;
  TipoPermiso: string;    // Use enum type if you define one
  NumeroPermiso: string;
  ClaveHYP: string;
  SubProductoHYP?: string; // Optional attributes get '?'
}
```

The naming convention is: `Xml` + PascalCase name for the main interface, and `Xml` + PascalCase name + `Attributes` for the attributes.

#### Nested Elements

If the complement has child elements, add them to the main interface using the namespaced key:

```typescript
export interface XmlAerolineas {
  _attributes: XmlAerolineasAttributes;
  'aerolineas:OtrosCargos': XmlAerolineasOtrosCargos;  // nested element
}
```

Arrays of elements use `Type[]`:

```typescript
export interface XmlAerolineasOtrosCargos {
  _attributes?: XmlAerolineasOtrosCargosAttributes;
  'aerolineas:Cargo': XmlAerolineasCargo[];  // array of children
}
```

#### Enums (if needed)

If the SAT defines a fixed catalog of values, create an enum file:

```typescript
// Example: hidrocarburos.enum.ts

export enum TipoPermiso {
  PER06 = 'PER06',
  PER07 = 'PER07',
  PER08 = 'PER08',
}

export const TipoPermisoList = [
  { value: 'PER06', label: 'Distribuidor de petroliferos' },
  { value: 'PER07', label: 'Expendio al publico de petroliferos' },
  { value: 'PER08', label: 'Distribuidor y expendio al publico' },
];
```

#### Barrel Export

Create an `index.ts` in the type directory:

```typescript
export * from './hidrocarburos.xslt';
// export * from './hidrocarburos.enum';  // if enums exist
```

### 3. Create the Complement Class

Create the class at `src/4.0/<nombre>/<Nombre>.ts`.

#### Simple Complement (flat attributes only)

This is the most common case:

```typescript
// src/4.0/hidrocarburos/Hidrocarburos.ts

import { XmlHidrocarburos, XmlHidrocarburosAttributes } from './type/hidrocarburos.xslt';
import { Complemento } from '../../Complemento';

const xmlns = 'http://www.sat.gob.mx/hidrocarburospetroliferos';
const xsd = 'http://www.sat.gob.mx/sitio_internet/cfd/hidrocarburos/hidrocarburos.xsd';

export class Hidrocarburos extends Complemento<XmlHidrocarburos> {
  public complemento: XmlHidrocarburos = {} as XmlHidrocarburos;

  constructor(attributes: XmlHidrocarburosAttributes) {
    super({ key: 'hidrocarburos:Hidrocarburos', xmlns, xsd });
    this.complemento._attributes = attributes;
  }
}
```

The three values passed to `super()` are critical:
- `key`: the namespaced XML element name (prefix:ElementName)
- `xmlns`: the SAT namespace URI
- `xsd`: the full URL to the XSD schema file

#### Complex Complement (with nested elements)

When a complement has child elements, add builder methods. Follow the Aerolineas pattern:

```typescript
export class MiComplemento extends Complemento<XmlMiComplemento> {
  public complemento: XmlMiComplemento = {} as XmlMiComplemento;

  constructor(attributes: XmlMiComplementoAttributes) {
    super({ key: 'prefix:ElementName', xmlns, xsd });
    this.complemento._attributes = attributes;
  }

  addChild(attributes: XmlChildAttributes): void {
    if (!this.complemento['prefix:Children']) {
      this.complemento['prefix:Children'] = [];
    }
    this.complemento['prefix:Children'].push({
      _attributes: attributes,
    });
  }
}
```

Important behaviors:
- Initialize arrays/objects lazily (check if they exist first)
- Throw descriptive errors if ordering matters (e.g., parent must exist before adding children)
- Use `void` return type for builder methods (unless you want fluent chaining with `this`)

### 4. Create the Barrel Export

Add an `index.ts` in the complement directory:

```typescript
// src/4.0/hidrocarburos/index.ts
export * from './Hidrocarburos';
export * from './type';
```

### 5. Register the Complement

This is where you wire the new complement into the rest of the system. There are several files to update:

#### a) Main package export — `src/index.ts`

Add the export line with the other 4.0 exports:

```typescript
export * from './4.0/hidrocarburos';
```

#### b) Complement interfaces — `src/types/tags/complements.interface.ts`

**For root complements**, add to `XmlComplements`:

```typescript
export interface XmlComplements extends AnyKey {
  // ... existing entries ...
  'hidrocarburos:Hidrocarburos'?: XmlHidrocarburos;
}
```

**For concept-level complements**, add to `XmlComplementsConcepts`:

```typescript
export interface XmlComplementsConcepts extends AnyKey {
  // ... existing entries ...
  'myprefix:MyElement'?: XmlMyType;
}
```

#### c) Type unions — same file

Add the class to `ComlementType` (note: the typo "Comlement" is intentional, it exists this way in the codebase — don't "fix" it):

```typescript
export declare type ComlementType =
  | // ... existing ...
  | Hidrocarburos
  | Complemento;
```

Add the XML type to `ComplementTypeXml<T>`:

```typescript
export declare type ComplementTypeXml<T> =
  | // ... existing ...
  | XmlHidrocarburos
  | T;
```

#### d) Namespace attributes — same file

Add namespace declaration to `XmlComplementsAttributes`:

```typescript
'xmlns:hidrocarburos'?: string;  // http://www.sat.gob.mx/hidrocarburospetroliferos
```

Add to `XmlnsComplementsLinks`:

```typescript
hidrocarburos?: string;  // http://www.sat.gob.mx/hidrocarburospetroliferos
```

### 6. Write Tests

Create a test file using Vitest:

```typescript
// test/hidrocarburos.test.ts
import { describe, it, expect } from 'vitest';
import { Hidrocarburos } from '../src/4.0/hidrocarburos/Hidrocarburos';

describe('Hidrocarburos', () => {
  it('should create a valid complement with required attributes', () => {
    const hidro = new Hidrocarburos({
      Version: '1.0',
      TipoPermiso: 'PER06',
      NumeroPermiso: 'PL/12345/EXP/2026',
      ClaveHYP: '01',
      SubProductoHYP: '0101',
    });

    const result = hidro.getComplement();
    expect(result.key).toBe('hidrocarburos:Hidrocarburos');
    expect(result.xmlns).toBe('http://www.sat.gob.mx/hidrocarburospetroliferos');
    expect(result.complement._attributes.Version).toBe('1.0');
    expect(result.schemaLocation).toHaveLength(2);
  });
});
```

Tests should validate: correct `key`, `xmlns`, `schemaLocation`, attributes, nested element construction, and error cases.

Run with: `npm run test:ci` from the package directory, or `rush test:ci` from the monorepo root.

### 7. Build and Verify

```bash
npm run build
npm run test:ci
```

## Quick Reference: File Checklist

For a new complement called `<Nombre>`:

```
CREATE:
  src/4.0/<nombre>/
    <Nombre>.ts              # Main class extending Complemento<T>
    index.ts                 # Barrel export
    type/
      <nombre>.xslt.ts      # XML interfaces (Xml*, Xml*Attributes)
      <nombre>.enum.ts       # Enums (if SAT defines catalogs)
      index.ts               # Type barrel export

UPDATE:
  src/index.ts                                    # Add export
  src/types/tags/complements.interface.ts          # Add to:
    - XmlComplements or XmlComplementsConcepts     #   interface mapping
    - ComlementType                                #   class union
    - ComplementTypeXml<T>                         #   XML type union
    - XmlComplementsAttributes                     #   xmlns declaration
    - XmlnsComplementsLinks                        #   namespace links

CREATE (optional):
  test/<nombre>.test.ts                            # Vitest tests
```

## Common Pitfalls

- **Forgetting to register in `complements.interface.ts`**: The complement will work in isolation but won't be recognized by the CFDI builder. This is the most commonly missed step.
- **Wrong namespace prefix in key**: The part before the colon in `key` must match the namespace prefix used in the XML interfaces (e.g., `'aerolineas:Aerolineas'` uses prefix `aerolineas`).
- **XSD URL mismatch**: Double-check the XSD URL against the SAT's official site. A wrong URL means validation will fail.
- **Missing `_attributes` property**: Every XML element interface needs `_attributes` — this is how `xml-js` represents XML attributes.
- **Not re-exporting from index.ts**: Both the complement directory and the main `src/index.ts` need export lines.
- **"Fixing" the ComlementType typo**: It's `ComlementType` not `ComplementType` throughout the codebase. Don't rename it.

## Reference: Existing Complement Examples

Read these files to see the patterns in action:

- **Simple**: `src/4.0/iedu/Iedu.ts` — flat attributes, extends Complemento
- **With children**: `src/4.0/aerolineas/Aerolineas.ts` — nested elements, builder methods
- **Complex**: `src/4.0/cartaporte20/CartaPorte20.ts` — multiple nested helpers, setter methods
- **Concept-level**: `src/4.0/iedu/Iedu.ts` — attaches to individual concepts, not root
