# @cfdi/catalogos-codegen

Generador de los archivos `.ts` del paquete [@cfdi/catalogos](../catalogos) a partir de los recursos oficiales del SAT.

Paquete privado del monorepo. No se publica a npm; se ejecuta manualmente cuando el SAT publica una actualización del catálogo o cuando se necesitan agregar nuevos catálogos.

## Qué hace

1. Descarga `catCFDI.xsd` (códigos válidos) y `catCFDI.xlsx` (descripciones y metadatos) desde el SAT vía [@sat/recursos](../../sat/recursos).
2. Cruza ambas fuentes y valida que no haya discrepancias inesperadas.
3. Emite un archivo `.ts` por catálogo en [`packages/cfdi/catalogos/src/`](../catalogos/src) con el patrón:
   - `enum NombreCatalogo` — para uso en código (autocompletado)
   - `type NombreCatalogoType` — union de literales para validación de tipos
   - `const NombreCatalogoList` — array con `value`, descripción, metadatos extra y flag `deprecated`
4. Reescribe el `index.ts` del paquete con todos los exports.

## Catálogos generados

| Simple type (XSD) | Archivo TS | Notas |
|---|---|---|
| `c_FormaPago` | `FormaPago.ts` | Override de `enumNames` |
| `c_MetodoPago` | `MetodoPago.ts` | Override de `enumNames` |
| `c_TipoDeComprobante` | `TipoComprobante.ts` | Override; `typeExport: 'TypeComprobante'` |
| `c_Impuesto` | `Impuesto.ts` | Override |
| `c_UsoCFDI` | `UsoCFDI.ts` | Override; `listExport: 'usoCFDIList'` |
| `c_RegimenFiscal` | `RegimenFiscal.ts` | Metadatos extra (`personType`, `startDate`, `endingDate`) |
| `c_Moneda` | `Moneda.ts` | Códigos ISO usados como nombres del enum |
| `c_Exportacion` | `Exportacion.ts` | Override; `enumExport: 'ExportacionEnum'` |
| `c_Periodicidad` | `Periodicidad.ts` | Nombres derivados de descripción |
| `c_Meses` | `Meses.ts` | Nombres derivados de descripción |
| `c_TipoRelacion` | `TipoRelacion.ts` | Nombres derivados de descripción |
| `c_ObjetoImp` | `ObjetoImp.ts` | Nombres derivados de descripción |
| `c_TipoFactor` | `TipoFactor.ts` | Códigos alfabéticos (`Tasa`, `Cuota`, `Exento`) |
| `c_Pais` | `Pais.ts` | Códigos ISO |
| `c_Estado` | `Estado.ts` | Códigos del SAT |

Catálogos excluidos por tamaño: `c_ClaveProdServ` (~52k), `c_ClaveUnidad` (~2.3k), `c_CodigoPostal`, `c_Colonia`, `c_Localidad`, `c_Municipio`.

## Cómo ejecutarlo

```bash
cd packages/cfdi/catalogos-codegen

# Primera vez o cuando el SAT publica nueva version del catalogo
rushx generate -- --xlsx-url=http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/catCFDI_V_4_DDMMYYYY.xls

# Si ya tienes catCFDI.xlsx cacheado en packages/files/4.0/, basta con:
rushx generate

# Forzar redescarga de XSD/XLSX
rushx generate:force -- --xlsx-url=...
```

La URL del XLSX cambia con cada actualización del SAT. Búscala en la página del [Anexo 20](http://omawww.sat.gob.mx/tramitesyservicios/Paginas/anexo_20.htm) (busca el enlace que termina en `catCFDI_V_4_*.xls`).

Alternativas para pasar la URL:

- Flag CLI: `--xlsx-url=<url>`
- Env var: `SAT_XLSX_URL=<url>` antes de invocar
- Manual: descarga el XLSX y colócalo en `packages/files/4.0/catCFDI.xlsx`; el codegen lo usa sin descargar

Después de generar, revisa los cambios y comítealos:

```bash
git diff packages/cfdi/catalogos/src/
git add packages/cfdi/catalogos/src/
git commit -m "feat(catalogos): actualizar a version SAT YYYY-MM-DD"
```

## Cómo funciona internamente

```
┌─────────────────┐         ┌─────────────────┐
│  catCFDI.xsd    │         │ catCFDI.xlsx    │
│  (códigos)      │         │ (descripciones) │
└────────┬────────┘         └────────┬────────┘
         │                           │
         ▼                           ▼
   parsers/xsd.ts             parsers/xlsx.ts
         │                           │
         └─────────────┬─────────────┘
                       ▼
              generate.ts
              (validación cruzada)
                       ▼
              renderers/template.ts
                       ▼
   packages/cfdi/catalogos/src/*.ts
```

### `parsers/xsd.ts`

Extrae con regex los `<xs:simpleType name="c_X">` y sus `<xs:enumeration value="..."/>`. Devuelve `Map<simpleType, codes[]>`.

### `parsers/xlsx.ts`

Lee el XLSX con la librería [`xlsx`](https://www.npmjs.com/package/xlsx). Para cada hoja:
- **Auto-detecta la fila del header** buscando una celda en columna A cuyo contenido sea el nombre del simpleType (`c_FormaPago`, etc.). Esto hace al codegen tolerante a cambios de layout.
- Lee `codeColumn` y `descColumn` (típicamente A y B), más `extraColumns` opcionales.
- Aplica `codePadStart` para códigos numéricos que el XLSX guarda sin ceros (`1` → `01`).
- Convierte fechas de Excel a formato `DD/MM/YYYY`.

### Validación cruzada (`generate.ts`)

- **Códigos en XLSX que no están en XSD** → error duro (probablemente la config de columnas es incorrecta).
- **Códigos en XSD que no están en XLSX** → warning + se marca el código como `deprecated`. Esto pasa cuando el SAT remueve un código del catálogo público pero lo deja en el XSD por compatibilidad.
- **Códigos con `endingDate` pasada** → se marca como `deprecated` con la fecha.
- **Códigos sin `enumName` cuando hay override** → error pidiendo agregar el nombre al override.

### `renderers/template.ts`

Genera el TS con la cabecera `// Generado por @cfdi/catalogos-codegen. NO EDITAR.`

Estrategia de naming del enum:
1. Si `enumNames[code]` existe → lo usa (override curado por el dev).
2. Si el código es identificador válido (`USD`, `MEX`, `Tasa`) → lo usa directamente.
3. Si no → deriva desde la descripción del XLSX (`Diario` → `DIARIO`, `Cada 15 días` → `CADA_15_DIAS`).
4. Si la descripción está vacía → fallback `CODE_<código>`.
5. Si hay colisión de nombres → sufija con el código; si aún hay colisión, falla pidiendo override.

Estrategia para el `label`/`descripcion` del List:
1. Si el XLSX tiene descripción → la usa (caso normal).
2. Si no → busca en `spec.descriptions` override (manual del dev).
3. Si no → deriva del nombre del enum convertido a Title Case (`POR_DEFINIR` → `Por definir`).
4. Si nada de lo anterior aplica → vacío.

## Estructura del paquete

```
src/
  parsers/
    xsd.ts                # Extrae simpleTypes/enumerations del XSD
    xlsx.ts               # Lee descripciones y metadatos del Excel
  renderers/
    template.ts           # Render TS de cada catalogo
  overrides/
    FormaPago.ts          # enumNames: '01' -> 'EFECTIVO', etc.
    MetodoPago.ts
    TipoComprobante.ts
    Impuesto.ts
    UsoCFDI.ts            # enumNames + descriptions (P01)
    Exportacion.ts        # enumNames con nombres custom
    RegimenFiscal.ts      # descriptions para codigos deprecated
    TipoRelacion.ts       # descriptions
    Estado.ts             # descriptions (DIF)
  catalogos.config.ts     # Tabla de los 15 catalogos a generar
  generate.ts             # Orquestador
  index.ts                # API programatica
bin/
  cli.ts                  # Entry CLI (tsx)
test/
  fixtures/
    catCFDI.xsd           # XSD minimo para tests
    catCFDI.xlsx          # XLSX minimo (autogenerado en setup)
  generate.test.ts        # Tests unitarios e integracion
```

## Códigos deprecated

Cuando el SAT remueve un código del XLSX pero lo mantiene en el XSD (por compatibilidad histórica), el codegen lo marca como deprecated:

**En el `enum`** TypeScript marca el uso con tachado en el IDE:

```ts
/** @deprecated Removido del catalogo XLSX del SAT */
POR_DEFINIR = 'P01',
```

**En el `List`** se incluye un flag uniforme:

```ts
{
  value: 'P01',
  label: 'Por definir',
  deprecated: true,
  deprecatedReason: 'Removido del catalogo XLSX del SAT',
}
```

Como `deprecated` está siempre presente (`false` para vigentes, `true` para obsoletos), se puede filtrar uniformemente:

```ts
const vigentes = usoCFDIList.filter(x => !x.deprecated);
const obsoletos = usoCFDIList.filter(x => x.deprecated);
```

Para preservar la descripción de un código deprecated, agrega una entrada en `src/overrides/<Catalogo>.ts`:

```ts
// src/overrides/RegimenFiscal.ts
export const descriptions: Record<string, string> = {
  '609': 'Consolidación',
  '628': 'Hidrocarburos',
};
```

Y conéctalo en `catalogos.config.ts`:

```ts
import * as regimenFiscal from './overrides/RegimenFiscal';
// ...
{
  simpleType: 'c_RegimenFiscal',
  // ...
  descriptions: regimenFiscal.descriptions,
}
```

## Cómo agregar un nuevo catálogo

1. Verifica que el catálogo exista como `xs:simpleType` en `catCFDI.xsd` (descargado en `packages/files/4.0/`).
2. Agrega una entrada en [`src/catalogos.config.ts`](src/catalogos.config.ts):
   ```ts
   {
     simpleType: 'c_NuevoCatalogo',
     exportName: 'NuevoCatalogo',
     sheetName: 'c_NuevoCatalogo',
     codeColumn: 'A',          // tipicamente 'A'
     descColumn: 'B',          // tipicamente 'B'
     descKey: 'descripcion',   // o 'label'
   }
   ```
3. Ejecuta `rushx generate`.
4. Si el catálogo tiene códigos numéricos como `01`, `02`, agrega `codePadStart: 2`.
5. Si quieres nombres curados de enum, crea `src/overrides/NuevoCatalogo.ts` con `enumNames` y conéctalo en la config.

## Cómo agregar/editar un override de enum

Cuando el SAT añade un código nuevo a un catálogo que ya tiene `enumNames` override, el codegen falla pidiendo el nombre:

```
Error: FormaPago: codigos sin enumName en overrides: 32.
Anade entradas a src/overrides/FormaPago.ts y vuelve a ejecutar.
```

Edita el archivo y agrega la entrada:

```ts
// src/overrides/FormaPago.ts
export const enumNames: Record<string, string> = {
  // ...
  '32': 'NUEVO_METODO_DE_PAGO',
};
```

Re-ejecuta `rushx generate`. Esto evita que un código nuevo entre con un nombre derivado/inestable.

## Tests

```bash
rushx test:ci
```

Los tests usan fixtures locales en [`test/fixtures/`](test/fixtures) — no descargan del SAT. El `catCFDI.xlsx` mini se genera en setup si no existe.

## Workflow recomendado

1. **Mensual o cuando el SAT publica actualización:**
   - Buscar la URL nueva del XLSX en el [Anexo 20](http://omawww.sat.gob.mx/tramitesyservicios/Paginas/anexo_20.htm).
   - `rushx generate:force -- --xlsx-url=<nueva url>`.
   - Revisar `git diff packages/cfdi/catalogos/src/`.
   - Si hay códigos nuevos sin override, agregarlos en `src/overrides/`.
   - Re-ejecutar `rushx generate` hasta éxito.
   - Commitear los archivos generados.

2. **Cuando se rompe un test del consumer (`@cfdi/xml`, etc.):**
   - El cambio de catálogos puede ser breaking. Documentar en CHANGELOG.

## Referencias

- [Página del Anexo 20 — SAT](http://omawww.sat.gob.mx/tramitesyservicios/Paginas/anexo_20.htm)
- [@sat/recursos](../../sat/recursos) — descarga de recursos del SAT
- [@cfdi/catalogos](../catalogos) — paquete consumidor (output del codegen)
