# Versionamiento - cfdi-node

Monorepo TypeScript gestionado con **Rush** (Microsoft Rush Stack).

## Setup

```bash
# Instalar Rush globalmente (si no lo tienes)
npm install -g @microsoft/rush

# Instalar dependencias del monorepo
rush install

# Build completo
rush build
```

## Estructura de Rush

```
cfdi-node/
├── rush.json                              # Configuración principal
├── common/config/rush/
│   ├── version-policies.json              # Políticas de versión por paquete
│   ├── command-line.json                   # Comandos personalizados
│   └── ...
└── packages/
    ├── cfdi/xml/                           # @cfdi/xml
    ├── sat/auth/                           # @sat/auth
    └── ...
```

## Version Policies

Cada paquete tiene una **version policy** definida en `common/config/rush/version-policies.json`. Todas usan `lockStepVersion` (la versión se controla centralmente).

### Políticas actuales

| Policy | Paquete | Versión actual | nextBump |
|---|---|---|---|
| `xml` | `@cfdi/xml` | 4.0.17 | patch |
| `complementos` | `@cfdi/complementos` | 4.0.16 | patch |
| `catalogs` | `@cfdi/catalogos` | 4.0.15 | patch |
| `csd` | `@cfdi/csd` | 4.0.15 | patch |
| `csf` | `@cfdi/csf` | 4.0.15 | patch |
| `utils` | `@cfdi/utils` | 4.0.16 | patch |
| `transform` | `@cfdi/transform` | 4.0.13 | patch |
| `xsd` | `@cfdi/xsd` | 4.0.16 | patch |
| `openssl` | `@clir/openssl` | 0.0.16 | patch |
| `saxon` | `@saxon-he/cli` | 12.5.1 | patch |
| `auth` | `@sat/auth` | 1.0.1 | patch |
| `pdf` | `@cfdi/pdf` | 0.0.10-beta.4 | prerelease |
| `curp` | `@renapo/curp` | 0.0.10-beta.2 | prerelease |
| `rfc` | `@cfdi/rfc` | 0.0.10-beta.2 | prerelease |

## Bump de versión

### Con `rush version`

```bash
# Bump según nextBump definido en version-policies.json
rush version --bump

# Bump de una policy específica
rush version --bump --version-policy xml

# Solo override del bump type
rush version --bump --override-bump minor --version-policy xml

# Override con versión prerelease
rush version --bump --override-bump prerelease --override-prerelease-id beta --version-policy rfc
```

### Bump manual en version-policies.json

Editar `common/config/rush/version-policies.json` directamente:

```json
{
    "policyName": "xml",
    "definitionName": "lockStepVersion",
    "version": "5.0.0",
    "nextBump": "patch"
}
```

Luego:

```bash
rush version --bump --version-policy xml
rush update
```

## Pre-release / Alpha / Beta

npm/SemVer usa el formato `<major>.<minor>.<patch>-<prerelease>.<number>`.

### Crear una versión alpha

```bash
# Opción 1: Override directo con rush
rush version --bump --override-bump prerelease --override-prerelease-id alpha --version-policy xml
# Resultado: 4.0.17 → 4.0.18-alpha.0

# Siguiente alpha
rush version --bump --version-policy xml
# Resultado: 4.0.18-alpha.0 → 4.0.18-alpha.1
```

### Pasar de alpha a beta

```bash
rush version --bump --override-bump prerelease --override-prerelease-id beta --version-policy xml
# Resultado: 4.0.18-alpha.3 → 4.0.18-beta.0
```

### Release candidate

```bash
rush version --bump --override-bump prerelease --override-prerelease-id rc --version-policy xml
# Resultado: 4.0.18-beta.2 → 4.0.18-rc.0
```

### Release estable

```bash
rush version --bump --override-bump patch --version-policy xml
# Resultado: 4.0.18-rc.1 → 4.0.18
```

### Orden de versiones SemVer/npm

```
4.0.18-alpha.0 < 4.0.18-alpha.1 < 4.0.18-beta.0 < 4.0.18-rc.0 < 4.0.18
```

### Configurar nextBump como prerelease

En `version-policies.json`, cambiar `nextBump` a `"prerelease"` para que `rush version --bump` auto-incremente el número de pre-release:

```json
{
    "policyName": "rfc",
    "definitionName": "lockStepVersion",
    "version": "0.0.10-beta.2",
    "nextBump": "prerelease"
}
```

Cada `rush version --bump --version-policy rfc` producirá:
- `0.0.10-beta.2` → `0.0.10-beta.3` → `0.0.10-beta.4` ...

## Instalar versiones pre-release (consumidores)

```bash
# npm solo instala estables por defecto
npm install @cfdi/rfc
# → instala la última versión estable

# Para instalar una pre-release específica
npm install @cfdi/rfc@0.0.10-beta.2

# Para instalar la última incluyendo pre-releases
npm install @cfdi/rfc@next
```

En `package.json`, para depender de pre-releases:

```json
{
    "dependencies": {
        "@cfdi/rfc": "^0.0.10-beta.0"
    }
}
```

## Tags de publicación (npm dist-tags)

```bash
# Publicar como latest (default para estables)
rush publish --apply --target-branch main

# Publicar con tag beta
rush publish --apply --target-branch main --tag beta

# Publicar con tag alpha
rush publish --apply --target-branch main --tag alpha

# Publicar con tag next
rush publish --apply --target-branch main --tag next
```

Los usuarios instalan por tag:

```bash
npm install @cfdi/xml@latest     # estable
npm install @cfdi/xml@beta       # última beta
npm install @cfdi/xml@alpha      # última alpha
```

## Comandos personalizados

Definidos en `common/config/rush/command-line.json`:

```bash
# Descargar recursos del SAT (XSD, XSLT)
rush sat:download

# Tests en modo CI
rush test:ci
```

## Flujo de release típico

```bash
# 1. Build y tests
rush build
rush test:ci

# 2. Preview del bump
rush version --bump --version-policy xml
# (revisar los cambios en version-policies.json y package.json)

# 3. Si todo está bien, commit
git add -A
git commit -m "chore: Bump versions [skip ci]"

# 4. Publicar a npm
rush publish --apply --target-branch main

# 5. Tag de git
git tag @cfdi/xml@4.0.18
git push --tags
```

## Flujo alpha completo (ejemplo)

```bash
# 1. Iniciar alpha
rush version --bump --override-bump prerelease --override-prerelease-id alpha --version-policy xml

# 2. Iterar alphas
rush version --bump --version-policy xml  # alpha.0 → alpha.1

# 3. Publicar alpha
rush publish --apply --target-branch main --tag alpha

# 4. Promover a beta
rush version --bump --override-bump prerelease --override-prerelease-id beta --version-policy xml
rush publish --apply --target-branch main --tag beta

# 5. RC
rush version --bump --override-bump prerelease --override-prerelease-id rc --version-policy xml
rush publish --apply --target-branch main --tag next

# 6. Release estable
rush version --bump --override-bump patch --version-policy xml
rush publish --apply --target-branch main
```

## Paquetes con shouldPublish: false

Estos paquetes no se publican a npm:

| Paquete | Razón |
|---|---|
| `@recreando/typescript-settings` | Rig interno |
| `@recreando/jest` | Rig interno |
| `@recreando/vite` | Rig interno |
| `@recreando/eslint-settings` | Rig interno |
| `@cfdi/schema` | Privado (skipRushCheck) |
| `@cfdi/pdf` | Beta, shouldPublish: false |
| `server` | App interna |
