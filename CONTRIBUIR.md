# Guía para agregar un nuevo paquete a cfdi-node

Este documento describe el proceso completo para agregar un nuevo paquete al monorepo, desde la creación del directorio hasta que el CI puede versionarlo y publicarlo automáticamente.

## Resumen del proceso

```
1. Crear el paquete (directorio + package.json + código)
2. Registrar en rush.json (projects)
3. Crear version policy (version-policies.json)
4. Registrar el scope en github-actions.js (dependencias + lista)
5. Registrar el scope en semantic.yml (labels + scopes)
6. rush update
```

---

## Paso 1: Crear el paquete

Elige el dominio correcto según la funcionalidad:

| Dominio | Directorio | Scope npm | Ejemplo |
|---|---|---|---|
| CFDI | `packages/cfdi/<nombre>/` | `@cfdi/` | `@cfdi/estado` |
| SAT | `packages/sat/<nombre>/` | `@sat/` | `@sat/auth` |
| CLI | `packages/clir/<nombre>/` | `@clir/` o custom | `@clir/openssl` |
| RENAPO | `packages/renapo/<nombre>/` | `@renapo/` | `@renapo/curp` |

### Estructura mínima

```
packages/cfdi/mi-paquete/
├── package.json
├── src/
│   └── index.ts
└── test/
    └── mi-paquete.test.ts
```

### package.json

```json
{
  "name": "@cfdi/mi-paquete",
  "version": "0.0.1",
  "license": "MIT",
  "main": "src/index.ts",
  "module": "src/index.ts",
  "types": "src/index.ts",
  "source": "src/index.ts",
  "files": ["dist"],
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "build": "vite build --config node_modules/@recreando/vite/vite.config.lib.mts",
    "test": "vitest",
    "test:ci": "vitest run"
  },
  "devDependencies": {
    "@recreando/eslint-settings": "workspace:*",
    "@recreando/vite": "workspace:*",
    "@recreando/typescript-settings": "workspace:*",
    "@types/node": "^22",
    "typescript": "^5.6.3",
    "vitest": "2.1.3"
  }
}
```

La versión inicial debe ser `0.0.1`. Rush la controlará después a través de la version policy.

---

## Paso 2: Registrar en rush.json

Agregar una entrada en el array `projects` de `rush.json`:

```json
{
  "packageName": "@cfdi/mi-paquete",
  "projectFolder": "packages/cfdi/mi-paquete",
  "versionPolicyName": "mi-paquete",
  "reviewCategory": "libraries",
  "shouldPublish": true
}
```

### Campos importantes

| Campo | Descripción |
|---|---|
| `packageName` | Nombre exacto del `package.json` (`@cfdi/mi-paquete`) |
| `projectFolder` | Ruta relativa desde la raíz del monorepo |
| `versionPolicyName` | Nombre de la policy en `version-policies.json` (el **scope** para commits) |
| `reviewCategory` | `"libraries"` para paquetes publicables, `"private"` para internos |
| `shouldPublish` | `true` para publicar a npm, `false` para paquetes internos |
| `tags` | Opcional. `["beta"]` marca el paquete como beta |
| `skipRushCheck` | Opcional. `true` para excluir de `rush check` (repos privados) |

### Paquetes privados / no publicables

Para paquetes internos que no van a npm:

```json
{
  "packageName": "@cfdi/mi-paquete-interno",
  "projectFolder": "packages/cfdi/mi-paquete-interno",
  "reviewCategory": "private",
  "shouldPublish": false,
  "skipRushCheck": true
}
```

Estos **no** necesitan version policy ni registro en `github-actions.js`.

---

## Paso 3: Crear version policy

Agregar una entrada en `common/config/rush/version-policies.json`:

```json
{
  "policyName": "mi-paquete",
  "definitionName": "lockStepVersion",
  "version": "0.0.1",
  "nextBump": "patch"
}
```

### El campo `policyName` es el scope

El `policyName` es la pieza central que conecta todo:

```
policyName = versionPolicyName en rush.json
           = scope en conventional commits: feat(mi-paquete): ...
           = clave en github-actions.js getDependences()
           = clave en github-actions.js getScopes() list
           = scope en semantic.yml
           = label en semantic.yml
```

### Opciones de `nextBump`

| Valor | Comportamiento de `rush version --bump` |
|---|---|
| `"patch"` | 0.0.1 → 0.0.2 → 0.0.3 |
| `"minor"` | 0.0.1 → 0.1.0 → 0.2.0 |
| `"major"` | 0.0.1 → 1.0.0 → 2.0.0 |
| `"prerelease"` | 0.0.1-beta.0 → 0.0.1-beta.1 → 0.0.1-beta.2 |

### Para paquetes beta desde el inicio

```json
{
  "policyName": "mi-paquete",
  "definitionName": "lockStepVersion",
  "version": "0.0.1-beta.0",
  "nextBump": "prerelease"
}
```

Y agregar el tag `"beta"` en `rush.json`:

```json
{
  "packageName": "@cfdi/mi-paquete",
  "projectFolder": "packages/cfdi/mi-paquete",
  "versionPolicyName": "mi-paquete",
  "reviewCategory": "libraries",
  "shouldPublish": true,
  "tags": ["beta"]
}
```

---

## Paso 4: Registrar en github-actions.js

El script `common/scripts/github-actions.js` controla qué paquetes se versionan automáticamente en CI cuando un PR se mergea. Funciona leyendo los commits del PR, extrayendo el scope de los conventional commits, y ejecutando `rush version --bump` para cada scope detectado.

### 4a. Agregar a la lista de scopes válidos

En la función `getScopes()`, agregar el nombre del scope al array `list`:

```js
const list = [
  'catalogs','csd','csf','curp','pdf','rfc','utils','xml',
  'complementos','openssl','saxon','xsd','2json','designs',
  'sat','estado','validador','cleaner','auth',
  'mi-paquete'  // ← agregar aquí
]
```

### 4b. Agregar el mapa de dependencias

En la función `getDependences()`, agregar una entrada con las dependencias del paquete:

```js
const dependencies = {
  // ... existentes ...
  'mi-paquete': {
    'mi-paquete': true,
  },
};
```

### Cómo funciona el mapa de dependencias

Cuando un commit tiene scope `(mi-paquete)`, el CI bumpeará todos los paquetes listados en su mapa de dependencias. Esto permite **cascading bumps**.

Ejemplo: cuando cambias `openssl`, también se bumpeean `csd` y `xml` porque openssl los necesita:

```js
openssl: {
  openssl: true,
  csd: true,      // openssl depende de csd
  xml: true,       // openssl depende de xml
},
```

Si tu paquete no depende de otros, solo se lista a sí mismo:

```js
'mi-paquete': {
  'mi-paquete': true,
},
```

Si tu paquete depende de `xml` y `utils`:

```js
'mi-paquete': {
  'mi-paquete': true,
  xml: true,
  utils: true,
},
```

### El scope `only-complementos`

Existe un scope especial `only-complementos` para cuando quieres bumpear complementos **sin** bumpear `xml`:

```js
'only-complementos': {
  complementos: true,
},
complementos: {
  complementos: true,
  xml: true,           // scope "complementos" normal también bumpea xml
},
```

Para usarlo: `feat(only-complementos): agregar nuevo complemento`

### Flujo completo en CI

```
PR mergeado con commit "feat(mi-paquete): nueva funcionalidad"
  ↓
github-actions.js lee los commits del PR
  ↓
getScopes() extrae "mi-paquete" del mensaje
  ↓
getDependences("mi-paquete") → { "mi-paquete": true }
  ↓
Para cada paquete en el resultado:
  rush version --version-policy mi-paquete --bump
  ↓
Si la branch es next/beta/alpha/dev:
  rush version --version-policy mi-paquete --bump
    --override-bump prerelease
    --override-prerelease-id <branch>
```

---

## Paso 5: Registrar en semantic.yml

El archivo `.github/workflows/semantic.yml` tiene dos validaciones que se corren en cada PR:

### 5a. Agregar el label

En el job `check-label`, agregar el nombre a la lista `any_of`:

```yaml
any_of: config,core,catalogs,csd,...,auth,mi-paquete
```

Esto requiere que cada PR tenga **al menos un label** que coincida. Hay que crear el label en GitHub:
- Ve a GitHub → Repository → Labels → New label
- Nombre: `mi-paquete`
- Color: a tu preferencia

### 5b. Agregar el scope válido

En el job `check-title`, agregar el scope a la lista de `scopes`:

```yaml
scopes: |
  config
  core
  catalogs
  ...
  auth
  mi-paquete
```

Esto valida que el **título del PR** siga el formato conventional commit con un scope válido.

---

## Paso 6: rush update

```bash
rush update
```

Esto:
- Registra el nuevo paquete en el workspace
- Instala sus dependencias
- Actualiza el `pnpm-lock.yaml`

Verificar que todo funciona:

```bash
rush build
rush test:ci
```

---

## Estrategia de ramas y release

El monorepo usa 4 ramas con roles distintos. Cada una dispara un flujo de versionamiento y publicación diferente.

### Las 4 ramas

```
dev          →  Desarrollo diario, versiones -dev.N
  ↓
next         →  Preview de próxima versión, versiones -next.N
  ↓
beta         →  Versiones beta públicas, versiones -beta.N
  ↓
main         →  Release estable, versiones limpias (patch/minor/major)
```

### Qué pasa cuando se mergea un PR a cada rama

#### `main` — Release estable

```
PR mergeado a main
  ↓
.github/actions/cfdi/action.yml ejecuta github-actions.js
  ↓
github-actions.js detecta branch = "main"
  → "main" NO está en ['next','beta','alpha','dev']
  → Usa el bump normal: rush version --version-policy <scope> --bump
  → El bump type viene del nextBump de version-policies.json (patch, minor, major)
  ↓
.github/workflows/publish.yml publica a npm
  → rush publish -p -b main --include-all --set-access-level=public
  → npm tag: "latest" (default)
```

**Resultado**: `4.0.17` → `4.0.18`

Los usuarios que hagan `npm install @cfdi/xml` obtendrán esta versión.

#### `beta` — Versiones beta

```
PR mergeado a beta
  ↓
github-actions.js detecta branch = "beta"
  → "beta" SÍ está en ['next','beta','alpha','dev']
  → Override del bump:
    rush version --version-policy <scope> --bump
      --override-bump prerelease
      --override-prerelease-id beta
  ↓
.github/workflows/development.yml publica a npm
  → rush publish --publish --tag beta --include-all --set-access-level=public --apply
  → npm tag: "beta"
```

**Resultado**: `4.0.18` → `4.0.19-beta.0` → `4.0.19-beta.1` → ...

Los usuarios instalan con `npm install @cfdi/xml@beta`.

#### `next` — Preview de próxima versión

```
PR mergeado a next
  ↓
github-actions.js detecta branch = "next"
  → Override: --override-prerelease-id next
  ↓
development.yml publica con --tag next
```

**Resultado**: `4.0.18` → `4.0.19-next.0` → `4.0.19-next.1` → ...

Los usuarios instalan con `npm install @cfdi/xml@next`.

#### `dev` — Desarrollo diario

```
PR mergeado a dev
  ↓
github-actions.js detecta branch = "dev"
  → Override: --override-prerelease-id dev
  ↓
development.yml publica con --tag dev
```

**Resultado**: `4.0.18` → `4.0.19-dev.0` → `4.0.19-dev.1` → ...

Los usuarios instalan con `npm install @cfdi/xml@dev`.

### Tabla resumen de ramas

| Rama | Workflow | Rush bump | npm tag | Versión ejemplo | Quién la usa |
|---|---|---|---|---|---|
| `main` | `publish.yml` | Normal (`nextBump`) | `latest` | `4.0.18` | Todos (producción) |
| `beta` | `development.yml` | `prerelease --id beta` | `beta` | `4.0.19-beta.1` | Usuarios que quieren probar antes de stable |
| `next` | `development.yml` | `prerelease --id next` | `next` | `4.0.19-next.0` | Preview de lo que viene |
| `dev` | `development.yml` | `prerelease --id dev` | `dev` | `4.0.19-dev.3` | Desarrollo interno |

### Flujo en github-actions.js

El script tiene esta lógica central:

```js
// 1. Detecta la rama
const branch = context.ref.split('/').slice(2).join('/')

// 2. Define ramas de prerelease
const branchs = ['next', 'beta', 'alpha', 'dev']

// 3. Lee commits del PR y extrae scopes
const scopes = getScopes(commits);

// 4. Para cada scope, ejecuta rush version
for (const scope of scopes) {
  const comands = ['version', '--version-policy', scope, '--bump']

  // 5. Si la rama es de prerelease, override el bump
  if (branchs.includes(branch)) {
    comands.push('--override-bump', 'prerelease');
    comands.push('--override-prerelease-id', branch);
  }

  await execa('rush', comands);
}
```

**En `main`**: ejecuta `rush version --version-policy xml --bump`
- Usa el `nextBump` de `version-policies.json` (normalmente `patch`)
- `4.0.17` → `4.0.18`

**En `beta`**: ejecuta `rush version --version-policy xml --bump --override-bump prerelease --override-prerelease-id beta`
- Ignora el `nextBump`, fuerza prerelease con id "beta"
- `4.0.18` → `4.0.19-beta.0`
- Siguiente merge: `4.0.19-beta.0` → `4.0.19-beta.1`

**En `dev`**: ejecuta `rush version --version-policy xml --bump --override-bump prerelease --override-prerelease-id dev`
- `4.0.18` → `4.0.19-dev.0`

### Workflows involucrados

```
.github/workflows/
├── semantic.yml      → Valida PR (labels + título conventional commit)
│                       Se ejecuta en: cualquier PR, cualquier rama
│
├── test.yml          → Corre build + tests
│                       Se ejecuta en: cualquier PR, cualquier rama
│
├── prerelease.yml    → Ejecuta .github/actions/cfdi (instala + github-actions.js)
│                       Se ejecuta en: cualquier PR
│                       Aquí se hace el bump de versión
│
├── publish.yml       → Publica a npm con tag "latest"
│                       Se ejecuta en: PR cerrado → main
│
└── development.yml   → Publica a npm con tag = nombre de rama
                        Se ejecuta en: PR cerrado → next, beta, alpha, dev
```

### Diferencia entre publish.yml y development.yml

**`publish.yml`** (solo `main`):
```bash
rush publish -p -b main --include-all --set-access-level=public
```
- `-p` = publish
- `-b main` = branch main
- Sin `--tag` → usa `latest` por default

**`development.yml`** (next, beta, alpha, dev):
```bash
rush publish --publish --tag $BRANCH_NAME --include-all --set-access-level=public --apply
```
- `--tag $BRANCH_NAME` → publica con el tag de la rama (beta, next, dev, alpha)
- `--apply` → aplica los cambios de versión al package.json

### Ciclo de vida de un feature

```
1. Crear feature branch desde dev
   git checkout dev && git checkout -b feature/mi-cosa

2. Desarrollar con commits conventional
   git commit -m "feat(xml): agregar soporte para addenda"

3. PR a dev → CI corre tests + bump + publish con tag "dev"
   @cfdi/xml: 4.0.18 → 4.0.19-dev.0
   npm install @cfdi/xml@dev  ← ya disponible

4. Cuando dev está listo, PR de dev → next
   @cfdi/xml: 4.0.19-dev.0 → 4.0.19-next.0
   npm install @cfdi/xml@next

5. Cuando next está listo, PR de next → beta
   @cfdi/xml: 4.0.19-next.0 → 4.0.19-beta.0
   npm install @cfdi/xml@beta

6. Cuando beta está probada, PR de beta → main
   @cfdi/xml: 4.0.19-beta.0 → 4.0.19 (estable)
   npm install @cfdi/xml  ← latest
```

### Orden de versiones en npm

```
4.0.19-dev.0 < 4.0.19-dev.1 < 4.0.19-next.0 < 4.0.19-beta.0 < 4.0.19
```

npm no ordena por el nombre del prerelease-id (dev/next/beta son alfabéticos por coincidencia), pero los npm dist-tags (`@dev`, `@next`, `@beta`, `@latest`) permiten a los usuarios elegir qué canal quieren.

### Cómo instalan los usuarios

```bash
# Producción (default)
npm install @cfdi/xml

# Probar la beta
npm install @cfdi/xml@beta

# Lo más reciente que viene
npm install @cfdi/xml@next

# Bleeding edge de desarrollo
npm install @cfdi/xml@dev

# Versión específica
npm install @cfdi/xml@4.0.19-beta.2
```

### Paquetes con nextBump: "prerelease"

Algunos paquetes tienen `"nextBump": "prerelease"` en su version policy. Esto significa que **incluso en `main`** se bumpeean como prerelease:

```json
{
  "policyName": "rfc",
  "version": "0.0.10-beta.2",
  "nextBump": "prerelease"
}
```

Un merge a `main` con `feat(rfc):` producirá `0.0.10-beta.3` (no una versión estable). Para promover a estable hay que cambiar manualmente `nextBump` a `"patch"` y la versión a `"1.0.0"`.

Paquetes actualmente en este estado:

| Paquete | Versión actual | nextBump |
|---|---|---|
| `@cfdi/pdf` | 0.0.10-beta.4 | prerelease |
| `@renapo/curp` | 0.0.10-beta.2 | prerelease |
| `@cfdi/rfc` | 0.0.10-beta.2 | prerelease |

---

## Conventional commits

Todos los commits y títulos de PR deben seguir el formato:

```
<tipo>(<scope>): <descripción>
```

### Tipos válidos

| Tipo | Uso |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `refactor` | Reestructuración sin cambio de comportamiento |
| `docs` | Documentación |
| `test` | Tests |
| `chore` | Mantenimiento, CI, deps |
| `perf` | Mejora de rendimiento |
| `style` | Formato, espacios, etc. |

### El scope determina qué se versiona

El scope entre paréntesis **debe coincidir exactamente** con el `policyName` de `version-policies.json`:

```bash
# Estos son equivalentes y correctos:
feat(xml): agregar soporte para CFDI 4.1
fix(csd): corregir lectura de certificados expirados
refactor(mi-paquete): simplificar API pública

# Estos NO dispararán ningún bump:
feat: cambio sin scope           # sin scope → no se bumpeará nada
feat(typo): algo                 # "typo" no existe en la lista
```

### Commits con múltiples paquetes

Si un PR toca varios paquetes, cada commit debe tener su propio scope:

```bash
git commit -m "feat(xml): agregar nuevo método toXml"
git commit -m "feat(complementos): soporte para carta porte 3.0"
```

El CI procesará ambos scopes y bumpeará ambos paquetes (más sus dependencias).

---

## Versiones independientes por paquete

Cada paquete tiene **su propia version policy** y por lo tanto **su propia versión**. No hay versión global del monorepo.

### Ejemplo actual

| Paquete | Versión | Policy |
|---|---|---|
| `@cfdi/xml` | 4.0.17 | xml |
| `@cfdi/complementos` | 4.0.16 | complementos |
| `@sat/auth` | 1.0.1 | auth |
| `@clir/openssl` | 0.0.16 | openssl |
| `@saxon-he/cli` | 12.5.1 | saxon |
| `@cfdi/rfc` | 0.0.10-beta.2 | rfc |
| `@renapo/curp` | 0.0.10-beta.2 | curp |

Un `feat(xml): ...` solo bumpeará `@cfdi/xml` (y los paquetes que dependen de él según `getDependences`). No tocará `@sat/auth` ni ningún otro.

### Dependencias entre paquetes

Cuando el paquete A depende del paquete B, debes registrar esa relación en `getDependences` de `github-actions.js` para que al cambiar B también se bumpeé A:

```
@cfdi/complementos depende de @cfdi/xml
→ getDependences("complementos") = { complementos: true, xml: true }
→ Un commit feat(complementos) bumpeará ambos: complementos y xml
```

```
@cfdi/xsd depende de @cfdi/xml y @cfdi/complementos
→ getDependences("xsd") = { xsd: true, xml: true, complementos: true }
```

Pero la inversa **no** aplica: un cambio en `xml` **no** bumpeará `complementos` automáticamente, a menos que `getDependences("xml")` lo incluya.

---

## Checklist para agregar un paquete

```
[ ] 1. Crear directorio packages/<dominio>/<nombre>/
[ ] 2. Crear package.json con name, version 0.0.1, scripts
[ ] 3. Crear src/index.ts con exports
[ ] 4. Crear test/<nombre>.test.ts con al menos un test
[ ] 5. Agregar entry en rush.json → projects
[ ] 6. Agregar entry en version-policies.json
[ ] 7. Agregar scope a github-actions.js → getScopes() list
[ ] 8. Agregar dependencias a github-actions.js → getDependences()
[ ] 9. Agregar scope a .github/workflows/semantic.yml → check-title scopes
[ ] 10. Agregar label a .github/workflows/semantic.yml → check-label any_of
[ ] 11. Crear label en GitHub
[ ] 12. rush update && rush build && rush test:ci
```
