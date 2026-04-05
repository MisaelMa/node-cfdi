---
description: Scaffold a new publishable package in the cfdi-node Rush.js monorepo
user_invocable: true
---

# New Package Skill

Creates a new package in the cfdi-node monorepo with all required configuration.

## Arguments

The user must provide:
- **name**: Package short name (e.g., `mi-paquete`)
- **scope**: npm scope — one of `cfdi`, `sat`, `renapo`, `clir` (default: `cfdi`)

Parse from the user's input. Example: `/new-package mi-paquete sat` creates `@sat/mi-paquete`.

## Steps

### Step 1: Determine paths and names

```
PACKAGE_NAME = args[0]       # e.g. "mi-paquete"
SCOPE = args[1] || "cfdi"    # e.g. "sat"
NPM_NAME = @${SCOPE}/${PACKAGE_NAME}
PROJECT_FOLDER = packages/${SCOPE}/${PACKAGE_NAME}
FULL_PATH = <repo_root>/${PROJECT_FOLDER}
```

Validate that the folder does NOT already exist. If it does, abort with a message.

### Step 2: Create package files

Create the following files under `${FULL_PATH}/`:

#### `package.json`
```json
{
  "name": "${NPM_NAME}",
  "version": "0.0.1",
  "description": "",
  "homepage": "https://cfdi.recreando.dev",
  "license": "MIT",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "source": "./src/index.ts",
  "files": ["dist"],
  "publishConfig": {
    "registry": "https://registry.npmjs.org/",
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/MisaelMa/recreando"
  },
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "build": "vite build",
    "test": "vitest",
    "test:ci": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  },
  "dependencies": {},
  "devDependencies": {
    "@recreando/vite": "workspace:*",
    "@recreando/eslint-settings": "workspace:*",
    "@recreando/typescript-settings": "workspace:*",
    "@types/node": "^22",
    "eslint": "^8.57.0",
    "typescript": "^5.6.3",
    "vitest": "2.1.3",
    "vite-tsconfig-paths": "~4.2.1",
    "@vitest/coverage-v8": "2.1.3",
    "@vitest/ui": "2.1.3"
  },
  "author": {
    "name": "Amir Misael Marin Coh, Signati",
    "email": "amisael.amir.misae@gmail.com"
  }
}
```

#### `tsconfig.json`
```json
{
  "extends": "./node_modules/@recreando/typescript-settings/profiles/default/tsconfig-base.json",
  "compilerOptions": {
    "lib": ["dom", "esnext"],
    "types": ["node"],
    "importHelpers": true,
    "declaration": true,
    "sourceMap": true,
    "noUnusedLocals": false,
    "strict": true,
    "noUnusedParameters": false
  }
}
```

#### `vite.config.mts`
```typescript
import { defineConfig, mergeConfig } from 'vite';
import baseConfig from '@recreando/vite/lib';

export default mergeConfig(baseConfig, defineConfig({}));
```

#### `vitest.config.mts`
```typescript
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    reporters: ['default'],
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['**/node_modules/**', '**/test/**'],
    },
  },
  plugins: [
    tsconfigPaths(),
  ],
});
```

#### `src/index.ts`
```typescript
export {};
```

#### `test/${PACKAGE_NAME}.test.ts`
```typescript
import { describe, it, expect } from 'vitest';

describe('${PACKAGE_NAME}', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});
```

### Step 3: Register in `rush.json`

Add to the `projects` array in `rush.json`:

```json
{
  "packageName": "${NPM_NAME}",
  "projectFolder": "${PROJECT_FOLDER}",
  "versionPolicyName": "${PACKAGE_NAME}",
  "reviewCategory": "libraries",
  "shouldPublish": true
}
```

### Step 4: Add version policy

Add to `common/config/rush/version-policies.json`:

```json
{
  "policyName": "${PACKAGE_NAME}",
  "definitionName": "lockStepVersion",
  "version": "0.0.1",
  "nextBump": "patch"
}
```

### Step 5: Add commitlint scope

In `commitlint.config.js`, add `'${PACKAGE_NAME}'` to the `scope-enum` array.

### Step 6: Add to GitHub Actions script

In `common/scripts/github-actions.js`:

1. Add to `getDependences()`:
```javascript
'${PACKAGE_NAME}': {
  '${PACKAGE_NAME}': true
},
```

2. Add `'${PACKAGE_NAME}'` to the `list` array in `getScopes()`.

### Step 7: Summary output

After all files are created and configs updated, output:

```
Package ${NPM_NAME} created successfully!

Files created:
  - ${PROJECT_FOLDER}/package.json
  - ${PROJECT_FOLDER}/tsconfig.json
  - ${PROJECT_FOLDER}/vite.config.mts
  - ${PROJECT_FOLDER}/vitest.config.mts
  - ${PROJECT_FOLDER}/src/index.ts
  - ${PROJECT_FOLDER}/test/${PACKAGE_NAME}.test.ts

Configs updated:
  - rush.json (projects)
  - common/config/rush/version-policies.json
  - commitlint.config.js (scope-enum)
  - common/scripts/github-actions.js (getDependences + getScopes)

Next steps:
  1. Run: rush update
  2. Run: rush build --to ${NPM_NAME}
  3. First publish (manual): cd ${PROJECT_FOLDER} && npm publish --access public
  4. Configure Trusted Publishing on npmjs.com:
     - Settings > Trusted Publishing > Add GitHub Actions
     - Org: MisaelMa | Repo: node-cfdi | Workflow: publish.yml

Packages not yet published on npm:
  @cfdi/estado, @cfdi/descarga, @cfdi/designs, @cfdi/validador,
  @cfdi/cleaner, @cfdi/cancelacion, @cfdi/retenciones, @renapo/curp,
  @sat/recursos, @sat/auth, @sat/scraper, @sat/opinion,
  @sat/contabilidad, @sat/captcha, @sat/pacs, @sat/banxico, @sat/diot
```
