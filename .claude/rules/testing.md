---
globs:
  - "**/*.test.ts"
  - "**/*.spec.ts"
  - "**/vitest.config.*"
---

# Reglas de testing

- Framework: Vitest
- Ejecutar tests: `rush test:ci`
- Tests de XML deben validar estructura completa, no solo fragmentos
- Tests de certificados usan archivos de prueba del SAT en `packages/files/`
- No mockear la base de datos ni el filesystem para tests de integracion
- Los warnings en stderr durante tests de error son comportamiento esperado
- Cada paquete tiene su propio `vitest.config.mts` que extiende del rig
