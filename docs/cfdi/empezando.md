# Empezando

# Recreando + CFDI

Este paquete genera el xml del CFDI a partir de clases TypeScript, lo que facilita la creacion de XML y sellarlo sin problemas de compatibilidad.

## Paquetes

Se crearon los siguientes paquetes para cubrir todo el ecosistema de facturacion electronica:

- [x] [`@cfdi/xml`](https://www.npmjs.com/package/@cfdi/xml) - Generacion y sellado de XML CFDI 4.0
- [x] [`@cfdi/complementos`](https://www.npmjs.com/package/@cfdi/complementos) - Complementos fiscales (Pagos 2.0, Carta Porte 2.0, INE, etc.)
- [x] [`@cfdi/catalogos`](https://www.npmjs.com/package/@cfdi/catalogos) - Catalogos del SAT (enums y tipos)
- [x] [`@cfdi/csd`](https://www.npmjs.com/package/@cfdi/csd) - Certificados de Sello Digital (Certificate, PrivateKey, Credential)
- [x] [`@cfdi/types`](https://www.npmjs.com/package/@cfdi/types) - Interfaces TypeScript para CFDI
- [x] [`@cfdi/xsd`](https://www.npmjs.com/package/@cfdi/xsd) - Validacion XSD con JSON Schema
- [x] `@cfdi/schema` - Procesamiento de esquemas
- [x] `@cfdi/elements` - Elementos estructurales del comprobante
- [x] `@cfdi/transform` - Transformacion XSLT y cadena original (reemplaza Saxon)
- [x] `@cfdi/xml2json` - Conversion XML a JSON
- [x] [`@cfdi/utils`](https://www.npmjs.com/package/@cfdi/utils) - Utilidades (numeros a letras, logos)
- [x] `@cfdi/csf` - Lectura de Constancia de Situacion Fiscal (PDF)
- [x] `@cfdi/rfc` - Validacion y generacion de RFC
- [x] `@cfdi/expresiones` - Expresiones impresas
- [x] `@cfdi/pdf` - Generacion PDF
- [x] `@cfdi/curp` - Validacion y consulta de CURP

## Instalacion

```bash
npm i @cfdi/xml --save
```

Si vas a ocupar complementos:

```bash
npm i @cfdi/complementos --save
```

## Soporte de archivos

El paquete `@cfdi/csd` soporta tanto archivos binarios del SAT como `.pem`:

```typescript
// Archivos binarios del SAT
const key = `/home/dev/certificados/LAN7008173R5.key`;
const cer = `/home/dev/certificados/LAN7008173R5.cer`;
```

```typescript
// Archivos PEM
const key = `/home/dev/certificados/LAN7008173R5.key.pem`;
const cer = `/home/dev/certificados/LAN7008173R5.cer.pem`;
```

## Cadena Original 4.0

El paquete `@cfdi/transform` reemplaza la dependencia de Saxon-HE para generar la cadena original. Ya no es necesario instalar Java ni Saxon.

```typescript
import { CFDI } from '@cfdi/xml';

const xslt_path = '/home/dev/files/4.0/cadenaoriginal.xslt';

const cfd = new CFDI({
  debug: false,
  xslt: {
    path: xslt_path,
  },
});
```

Si aun deseas usar Saxon-HE (opcional), puedes pasarlo en la configuracion:

```typescript
const cfd = new CFDI({
  xslt: { path: xslt_path },
  saxon: { binary: '/usr/local/bin/transform' },
});
```
