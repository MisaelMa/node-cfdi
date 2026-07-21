# Skill Registry — node-cfdi

This registry is auto-resolved by the SDD orchestrator and injected as `## Project Standards (auto-resolved)` into sub-agent prompts. Compact rules are pre-digested — sub-agents do NOT read SKILL.md files.

**Generated**: 2026-05-08 (refreshed)
**Stack**: TypeScript monorepo (Rush + pnpm), Vite, Vitest

---

## Project Conventions (always inject)

These rules apply to ALL code/documentation work in this project.

### Coding Standards (`.claude/rules/coding-standards.md`)

- **Formato**: Prettier — `singleQuote: true`, `trailingComma: 'es5'`, `printWidth: 80`, `arrowParens: 'avoid'`. Indentación: 2 espacios.
- **Nombres**:
  - Clases → `PascalCase` (`Comprobante`, `BaseImpuestos`)
  - Funciones/variables → `camelCase` (`setFile`, `getPem`)
  - Constantes → `UPPER_SNAKE_CASE` (`COMPROBANTE`, `EMISOR`)
  - Archivos de clases → `PascalCase.ts`; utilitarios → `camelCase.ts`
  - Interfaces → sufijo `.interface.ts` o carpeta `types/`
  - Propiedades privadas → prefijo `_` (`_cadenaOriginal`)
- **TypeScript**: `strict: true`. Tipos explícitos en parámetros/retornos públicos. `any` solo cuando es necesario. Usa `type` para unions, `interface` para objetos. Generics cuando el tipo varíe.
- **Patrones**: Singleton con `static of()` y constructor privado; clases base con prefijo `Base`; fluent interface `return this`; herencia para elementos XML compartidos.
- **Importaciones (orden)**: 1) librerías externas, 2) paquetes monorepo (`@cfdi/*`), 3) imports relativos.
- **Exportaciones**: barrel files (`index.ts`) con `export * from './modulo'`. Exportaciones nombradas (NO default).
- **Errores**: clases custom que extienden `Error`. Factory `CFDIError()` con `code`, `message`, `name`, `method`. Logging con `debug` condicional.
- **Async**: `Promise<T>` explícito. Try-catch en async con rethrow vía `CFDIError`. Separar sync/async claramente.

### CFDI Domain Rules (`.claude/rules/cfdi-domain.md`)

- Todo XML debe validar contra el esquema XSD oficial del SAT (CFDI 4.0 / Anexo 20).
- Namespaces obligatorios: `cfdi:`, `tfd:`, `xsi:`.
- RFC: 12 caracteres (PM) o 13 (PF) con dígito verificador.
- CURP: 18 caracteres con validación de entidad y dígito.
- Catálogos: SIEMPRE usar enums de `@cfdi/catalogos`, NO strings literales.
- Montos: 2 decimales mínimo, sin redondeo incorrecto.
- Fechas: formato ISO 8601 `YYYY-MM-DDTHH:mm:ss`.
- Paquetes workspace se consumen desde `src/` (NO `dist/`). NO compilar para uso interno.
- Firmas digitales: SHA-256.

### Security Rules (`.claude/rules/security.md`)

- NUNCA loguear contenido de llaves privadas (`.key`).
- NUNCA incluir contraseñas en logs ni respuestas de error.
- Sanitizar inputs antes de pasarlos a CLI de OpenSSL (prevenir command injection).
- Los `.cer`/`.key` de prueba del SAT son públicos — OK usarlos en tests.
- Validar que el certificado no esté expirado antes de firmar.

### Testing Rules (`.claude/rules/testing.md`)

- Framework: **Vitest** (cada paquete tiene su `vitest.config.mts` que extiende del rig).
- Comando CI: `rush test:ci` (a nivel monorepo) o `vitest run` (por paquete).
- Tests de XML deben validar estructura completa, NO solo fragmentos.
- Tests de certificados usan archivos de prueba del SAT en `packages/files/`.
- NO mockear DB ni filesystem para tests de integración.
- Warnings en stderr durante tests de error son **comportamiento esperado**.

### Project-level CLAUDE.md (top-level)

- Workspace packages se consumen desde `src/` directamente, NO `dist/`.
- `main`/`module` en `package.json` apuntan a `src/index.ts` para desarrollo.
- Tests deben pasar antes de cualquier merge.
- Dependencias del sistema: OpenSSL, Java JDK + Saxon-HE >= 9.9.

### Global User Rules (`~/.claude/CLAUDE.md`)

- **Commits**: NUNCA agregar `Co-Authored-By` ni atribución a IA. Conventional commits únicamente.
- **No build automático**: NO ejecutar `build` después de cambios.
- **Verificar antes de afirmar**: si dudas, investiga primero.
- **Idioma**: responder en el mismo idioma del usuario.

---

## User Skills (trigger-based injection)

Inject the matching skill's compact rules ONLY when the trigger condition is met.

| Skill | Path | Trigger |
|-------|------|---------|
| `branch-pr` | `~/.claude/skills/branch-pr/SKILL.md` | Creating a PR, opening a PR, preparing changes for review |
| `issue-creation` | `~/.claude/skills/issue-creation/SKILL.md` | Creating a GitHub issue, reporting a bug, requesting a feature |
| `judgment-day` | `~/.claude/skills/judgment-day/SKILL.md` | User says "judgment day", "review adversarial", "dual review", "doble review", "juzgar" |
| `skill-creator` | `~/.claude/skills/skill-creator/SKILL.md` | Creating a new skill, documenting patterns for AI |
| `skill-registry` | `~/.claude/skills/skill-registry/SKILL.md` | "update skills", "skill registry", "actualizar skills", after installing/removing skills |

Excluded (not relevant to this TypeScript project):
- `go-testing` — Go projects only

## Project Skills (`.claude/skills/`)

| Skill | Path | Trigger |
|-------|------|---------|
| `cfdi-complemento` | `.claude/skills/cfdi-complemento/SKILL.md` | Adding new SAT fiscal complement (Hidrocarburos, Nomina, CartaPorte, Pagos, etc.). Mention of "complemento", "addon fiscal", "XSD del SAT", or any `http://www.sat.gob.mx/...` namespace. |
| `new-package` | `.claude/skills/new-package.md` | Creating a new package in the monorepo |

---

## Project Agents (`.claude/agents/`)

Specialized agents available for delegation in this project:

| Agent | Path | Use When |
|-------|------|----------|
| `cfdi-developer` | `.claude/agents/cfdi-developer.md` | Implementing CFDI features (XML, validation, complementos, certificates, SAT) |
| `code-reviewer` | `.claude/agents/code-reviewer.md` | Reviewing PRs, code quality, security, project standards |
| `pdf-developer` | `.claude/agents/pdf-developer.md` | Invoice designs, PDF templates, rendering, document export |
| `test-runner` | `.claude/agents/test-runner.md` | Running tests, validating that the project compiles after changes |

---

## Compact Rules — Quick Reference Tables

### When sub-agent will touch `.ts`/`.tsx` files

Inject:
- Coding Standards (full block above)
- Project-level CLAUDE.md rules
- Global commit/build rules

### When sub-agent will touch XML / CFDI generation code

Inject ALSO:
- CFDI Domain Rules
- Security Rules (if certificates/CSD involved)

### When sub-agent will write tests

Inject ALSO:
- Testing Rules
- `vitest run` / `rush test:ci` commands
- Reminder: NO mockear DB ni filesystem en integración

### When sub-agent will create PR or issue

Inject the matching skill (`branch-pr` or `issue-creation`) compact rules.
