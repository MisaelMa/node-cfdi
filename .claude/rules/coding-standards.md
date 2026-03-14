---
globs:
  - "**/*.ts"
  - "**/*.tsx"
---

# Estandares de codificacion

## Formato

- Prettier: singleQuote, trailingComma 'es5', printWidth 80, arrowParens 'avoid'
- Indentacion: 2 espacios
- Fin de linea: auto

## Nombres

- **Clases**: PascalCase (`Comprobante`, `BaseImpuestos`, `CfdiSchema`)
- **Funciones/variables**: camelCase (`setFile`, `getPem`, `validateLocal`)
- **Constantes**: UPPER_SNAKE_CASE (`COMPROBANTE`, `EMISOR`, `RECEPTOR`)
- **Archivos de clases**: PascalCase (`Comprobante.ts`, `Elemento.ts`)
- **Archivos utilitarios**: camelCase (`checkDigit.ts`, `number.utils.ts`)
- **Interfaces**: sufijo `.interface.ts` o en carpeta `types/`
- **Propiedades privadas**: prefijo underscore (`_cadenaOriginal`, `_attributes`)

## TypeScript

- `strict: true` habilitado
- Preferir tipos explicitos en parametros y retornos de funciones publicas
- `any` permitido solo cuando es necesario, preferir tipos especificos
- Usar `type` para unions y aliases, `interface` para estructuras de objetos
- Generics cuando el tipo varia (`Elemento<T>`, `Complemento<T>`)
- Type assertions con `as` solo cuando sea necesario
- Preferir `Omit`, `Pick`, `Partial` sobre crear interfaces duplicadas

## Patrones de clases

- **Singleton**: factory method estatico `of()` con constructor privado
- **Clases base abstractas**: prefijo `Base` (`BaseImpuestos`, `BaseXSDProcessor`)
- **Fluent interface**: metodos que retornan `this` para encadenar (`return this`)
- **Herencia**: para elementos XML que comparten comportamiento

```typescript
// Singleton
export class Schema {
  private static instance: Schema;
  private constructor() {}
  public static of(): Schema {
    if (!Schema.instance) Schema.instance = new Schema();
    return Schema.instance;
  }
}

// Fluent interface
setReceptor(data: XmlReceptor): this {
  this.xml['cfdi:Receptor'] = { _attributes: data };
  return this;
}
```

## Importaciones

Orden:
1. Librerias externas (`node-forge`, `xml-js`, `ajv`)
2. Paquetes del monorepo (`@cfdi/types`, `@cfdi/catalogos`)
3. Imports relativos (`./cer`, `../types`)

```typescript
import pkg from 'node-forge';
import { XmlComprobante } from '@cfdi/types';
import { MetodoPago } from '@cfdi/catalogos';
import { Comprobante } from './Comprobante';
```

## Exportaciones

- Barrel files (`index.ts`) con `export * from './modulo'`
- Exportaciones nombradas sobre default
- Agrupar re-exports por categoria

```typescript
// index.ts
export * from './FormaPago';
export * from './MetodoPago';
export { Concepto as Concepts } from './elements/Concepto';
export type { LoaderOptions } from './loader.xsd';
```

## Manejo de errores

- Clases de error custom que extienden `Error`
- Factory function `CFDIError()` para errores con contexto
- Propiedades: `code`, `message`, `name`, `method`
- Logging condicional con `debug`

```typescript
export class BadCurpFormat extends Error {
  constructor(curp: string) {
    super(`'${curp}' is an invalid curp`);
  }
}
```

## Async

- Tipo `Promise<T>` explicito en retornos
- Try-catch en metodos async con rethrow usando `CFDIError`
- Separar metodos sincronos de asincronos claramente

## Organizacion de archivos

```
src/
  index.ts              # Barrel file
  [Clase].ts            # Clases principales (PascalCase)
  elements/             # Componentes XML
    Base[Nombre].ts     # Clases base
    [Nombre].ts         # Implementaciones
  types/                # Interfaces y tipos
    index.ts
    [nombre].interface.ts
  common/               # Codigo compartido
    constants.ts
    error.ts
  utils/                # Funciones utilitarias
    [nombre].utils.ts
```
