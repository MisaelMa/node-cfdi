---
globs:
  - "packages/cfdi/**/*.ts"
  - "packages/cfdi/**/*.tsx"
---

# Reglas de dominio CFDI

- Todo XML debe validar contra el esquema XSD oficial del SAT (CFDI 4.0 / Anexo 20)
- Los namespaces obligatorios: `cfdi:`, `tfd:`, `xsi:`
- RFC: 12 caracteres (PM) o 13 (PF) con digito verificador
- CURP: 18 caracteres con validacion de entidad y digito
- Catalogos: siempre usar enums de `@cfdi/catalogos`, no strings literales
- Montos: siempre con 2 decimales minimo, sin redondeo incorrecto
- Fechas: formato ISO 8601 `YYYY-MM-DDTHH:mm:ss`
- Los paquetes se consumen desde `src/`, NO compilar para uso interno
