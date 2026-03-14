# CFDI - Proyecto

Ecosistema de paquetes Node.js/TypeScript para generacion, validacion, firma y procesamiento de CFDI (Comprobantes Fiscales Digitales por Internet) en Mexico.

## Stack

- **Monorepo**: Rush + pnpm
- **Lenguaje**: TypeScript
- **Build**: Vite (migrando desde tsdx)
- **Tests**: Vitest
- **Node**: >= 22

## Comandos

```bash
rush install        # Instalar dependencias
rush update         # Actualizar dependencias
rush build          # Compilar todos los paquetes
rush test:ci        # Ejecutar tests
```

## Estructura

```
packages/
  cfdi/             # Paquetes core de facturacion
    xml/            # Generacion y sellado de XML CFDI 4.0
    csd/            # Certificados de Sello Digital (.cer/.key)
    catalogos/      # Catalogos del SAT (enums, tipos)
    complementos/   # Complementos fiscales (pagos, nomina, etc.)
    elements/       # Elementos estructurales del comprobante
    types/          # Interfaces TypeScript para CFDI
    schema/         # Procesamiento de esquemas XSD
    xsd/            # Validacion XSD con JSON Schema
    transform/      # Transformacion de datos CFDI
    expresiones/    # Expresiones impresas (QR)
    xml2json/       # Conversion XML a JSON
    csf/            # Lectura de Constancia de Situacion Fiscal
    curp/           # Validacion y consulta de CURP
    rfc/            # Validacion de RFC
    pdf/            # Opciones de generacion PDF
    designs/        # Plantillas y disenos PDF
    utils/          # Utilidades (numeros a letras, logos)
  clir/             # CLI wrappers
    openssl/        # Wrapper OpenSSL
    saxon-he/       # Wrapper Saxon-HE (XSLT)
  server/           # Aplicacion web Next.js
```

## Reglas del proyecto

- Los paquetes workspace se consumen desde `src/` directamente, NO desde `dist/`
- No compilar para compartir entre paquetes internos
- Los campos `main`/`module` en package.json apuntan a `src/index.ts` para desarrollo
- XML debe validar contra el esquema oficial CFDI 4.0 del SAT
- RFC: 12 caracteres (persona moral) o 13 (persona fisica)
- CURP: 18 caracteres
- Firmas digitales usan SHA-256
- Tests deben pasar antes de cualquier merge

## Dependencias del sistema

- OpenSSL (certificados digitales)
- Java JDK + Saxon-HE >= 9.9 (transformaciones XSLT para cadena original)
