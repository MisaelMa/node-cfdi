---
globs:
  - "packages/cfdi/csd/**/*.ts"
  - "packages/clir/openssl/**/*.ts"
  - "**/*key*"
  - "**/*cer*"
  - "**/*certificate*"
---

# Reglas de seguridad para certificados

- NUNCA loguear contenido de llaves privadas (.key)
- NUNCA incluir contraseñas en logs o respuestas de error
- Sanitizar inputs antes de pasarlos a CLI de OpenSSL (prevenir inyeccion de comandos)
- Los archivos .cer y .key de prueba del SAT son publicos, OK usarlos en tests
- Las firmas digitales deben usar SHA-256
- Validar que el certificado no este expirado antes de firmar
