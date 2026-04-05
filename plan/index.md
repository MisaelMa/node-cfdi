# Analisis: Paquetes que faltan en @cfdi vs nodecfdi y npm

## Contexto

Comparar el ecosistema @cfdi contra @nodecfdi y otros paquetes npm para identificar funcionalidad que falta y mejoras necesarias en paquetes existentes.

---

## Paquetes existentes que necesitan MEJORAS

### 1. `@cfdi/rfc` — Necesita mejoras significativas

**Estado actual:** Validación básica (regex + fecha + checksum + palabras prohibidas). Tests vacíos.

**Lo que @nodecfdi/rfc tiene y nosotros NO:**

- Clase `Rfc` como Value Object (API orientada a objetos)
- `RfcIntConverter` — convierte RFC ↔ entero de 64 bits (útil para BD)
- `RfcFaker` — genera RFCs aleatorios válidos (útil para tests)
- `obtainDate()` — extrae fecha de nacimiento/constitución
- Flags de validación: `DISALLOW_GENERIC`, `DISALLOW_FOREIGN`
- Detección de RFC genérico (`XAXX010101000`) y extranjero (`XEXX010101000`) como tipos especiales
- Compatibilidad con navegadores

**Mejoras propuestas:**

- [ ] Crear clase `Rfc` con métodos `isFisica()`, `isMoral()`, `isGeneric()`, `isForeign()`
- [ ] Agregar `RfcFaker` para generar RFCs de prueba
- [ ] Agregar extracción de fecha del RFC
- [ ] Escribir tests reales (actualmente tests vacíos)

### 2. `@cfdi/csd` — Necesita soporte FIEL y limpieza

**Estado actual:** Maneja CSD (.cer/.key) con OpenSSL CLI + node-forge. Tests vacíos.

**Lo que @nodecfdi/credentials tiene y nosotros NO:**

- **Soporte FIEL (eFirma)** — firma electrónica legal, no solo CSD
- Clase `Credential` que une certificado + clave privada
- `isFiel()` / `isCsd()` — detecta tipo de credencial
- `rfc()` — extrae RFC del certificado automáticamente
- `legalName()` — nombre legal del titular
- `verify(data, signature)` — verificación de firmas
- Validación de que certificado y clave sean par (`belongsTo`)
- Soporte PFX/PKCS#12 (crear y leer)
- Sin dependencia de OpenSSL CLI (usa crypto nativo)
- Múltiples algoritmos de firma

**Mejoras propuestas:**

- [ ] Agregar clase `Credential` (CSD + FIEL unificado)
- [ ] Migrar de OpenSSL CLI a crypto nativo de Node 22 (eliminar `@clir/openssl`)
- [ ] Agregar `isFiel()`, `isCsd()`, `rfc()`, `legalName()`
- [ ] Agregar verificación de firmas y validación de pares cert+key
- [ ] Soporte PFX import/export
- [ ] Escribir tests reales

---

## Comparacion completa @cfdi vs @nodecfdi

| Funcionalidad         | @cfdi                | @nodecfdi                | Estado            |
| --------------------- | -------------------- | ------------------------ | ----------------- |
| XML CFDI 4.0          | `@cfdi/xml`          | `cfdi-core`              | Ambos             |
| Complementos          | `@cfdi/complementos` | `cfdi-elementos`         | Ambos             |
| Certificados CSD      | `@cfdi/csd` (básico) | `credentials` (completo) | **Mejorar**       |
| FIEL (eFirma)         | **NO**               | `credentials`            | **Agregar a csd** |
| Catalogos SAT         | `@cfdi/catalogos`    | `sat-micro-catalogs`     | Ambos             |
| XML a JSON            | `@cfdi/2json`        | `cfdi-to-json`           | Ambos             |
| Expresiones/QR        | `@cfdi/expresiones`  | `cfdi-expresiones`       | Ambos             |
| RFC                   | `@cfdi/rfc` (básico) | `rfc` (completo)         | **Mejorar**       |
| PDF                   | `@cfdi/designs`      | `cfdi-to-pdf`            | Ambos             |
| CSF (Constancia)      | `@cfdi/csf`          | `csf-pdf-scraper`        | Ambos             |
| XSD Validacion        | `@cfdi/xsd`          | `xml-schema-validator`   | Ambos             |
| Transform XSLT nativo | `@cfdi/transform`    | **NO EXISTE**            | **Ventaja @cfdi** |
| SAT Resources         | `@cfdi/sat`          | `xml-resource-retriever` | Similar           |
| CURP                  | `@cfdi/curp`         | **NO EXISTE**            | **Ventaja @cfdi** |
| Validador CFDI        | **NO**               | `cfdi-validator`         | **Crear**         |
| Estado CFDI (SAT)     | **NO**               | `sat-estado-cfdi`        | **Crear**         |
| Descarga masiva SAT   | **NO**               | `sat-ws-descarga-masiva` | **Crear**         |
| CFDI Cleaner          | **NO**               | `cfdi-cleaner`           | **Crear**         |
| Auth SAT (scrapers)   | **NO**               | `sat-scrapers-auth`      | **Crear**         |

---

## Paquetes NUEVOS que faltan (por prioridad)

### ALTA PRIORIDAD

#### `@cfdi/estado` — Consulta estado CFDI en SAT

- Consulta webservice SAT para verificar si CFDI es vigente/cancelado
- URL: `https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc`
- Solo fetch nativo, sin dependencias
- @nodecfdi tiene 663 descargas/mes → hay demanda

#### `@cfdi/validador` — Validador de CFDI completo

- Valida estructura XML contra XSD
- Valida reglas de negocio (montos, impuestos, fechas)
- Valida sello digital y certificado
- Valida timbre fiscal digital

### MEDIA PRIORIDAD

#### `@cfdi/descarga` — Descarga masiva del SAT

- Consume webservice de descarga masiva del SAT
- Autenticación con FIEL (necesita `@cfdi/csd` mejorado primero)
- Descarga XMLs de CFDIs emitidos/recibidos

#### `@cfdi/cleaner` — Limpiador de CFDI

- Elimina addendas, namespaces no estándar, nodos no-SAT
- Normaliza XML para validación
- Útil cuando recibes CFDIs de terceros

### BAJA PRIORIDAD

#### `@cfdi/auth` — Autenticación en sitios SAT

- Login en portal SAT con FIEL
- Scraping de información fiscal
- Necesita `@cfdi/csd` con soporte FIEL primero

---

## Lo que NO necesitamos crear

| No crear                | Porque                                  |
| ----------------------- | --------------------------------------- |
| Timbrado propio         | Requiere ser PAC certificado por el SAT |
| SDK Facturapi/Fiscalapi | Servicios de terceros                   |
| Base converter          | Trivial                                 |
| AdonisJS wrapper        | Framework-specific                      |
| Config packages         | Ya tenemos `@recreando/*`               |

---

## Ventajas competitivas de @cfdi

1. **`@cfdi/transform`** — Cadena original sin Java/Saxon. Único en el mercado
2. **`@cfdi/curp`** — Validación y consulta CURP. Nodecfdi no tiene
3. **`@cfdi/sat`** — Descarga recursos SAT con diff de complementos
4. **Monorepo unificado** — 1 repo vs 28 repos separados de nodecfdi
5. **Node 22 + Vite** — Stack más moderno
6. **Serverless-ready** — Sin Java/Saxon/OpenSSL CLI

---

## Plan de acción

### Fase 1: Consolidar (actual)

- Terminar `@cfdi/transform` ✅ (98 tests pasan)
- Terminar READMEs
- Quitar dependencia Saxon de `@cfdi/xml`

### Fase 2: Mejorar existentes

- **`@cfdi/rfc`** — Clase Rfc, RfcFaker, tests reales
- **`@cfdi/csd`** — Soporte FIEL, crypto nativo, Credential class, eliminar OpenSSL CLI

### Fase 3: Paquetes nuevos alta prioridad

- **`@cfdi/estado`** — Consulta estado CFDI en SAT
- **`@cfdi/validador`** — Validación completa

### Fase 4: Paquetes nuevos media prioridad

- **`@cfdi/descarga`** — Descarga masiva SAT (requiere FIEL de fase 2)
- **`@cfdi/cleaner`** — Limpiador XML

---

## Verificacion

- Cada paquete nuevo: agregar a rush.json, commitlint.config.js, semantic.yml, github-actions.js
- Tests: `rush test:ci`
- Publicar: `rush publish`

## Archivos a modificar por paquete nuevo

| Archivo                            | Acción                              |
| ---------------------------------- | ----------------------------------- |
| `rush.json`                        | Agregar entrada del proyecto        |
| `commitlint.config.js`             | Agregar scope                       |
| `.github/workflows/semantic.yml`   | Agregar a labels y scopes           |
| `common/scripts/github-actions.js` | Agregar a `getDependences` y `list` |
