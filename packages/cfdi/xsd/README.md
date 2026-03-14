# @cfdi/xsd

Validacion de CFDI contra esquemas XSD del SAT usando JSON Schema (AJV). Proporciona validadores para cada seccion del comprobante fiscal digital.

## Instalacion

```bash
npm install @cfdi/xsd
```

## Uso

```typescript
import Schema from '@cfdi/xsd';

// Obtener instancia singleton
const schema = Schema.of();

// Configurar ruta a los esquemas JSON
schema.setConfig({
  path: '/ruta/a/schemas',
  debug: false,
});

// Validar secciones del comprobante
const validadorComprobante = schema.cfdi.comprobante;
const validadorEmisor = schema.cfdi.emisor;
const validadorReceptor = schema.cfdi.receptor;
const validadorImpuestos = schema.cfdi.impuestos;
const validadorTraslado = schema.cfdi.traslado;
const validadorRetencion = schema.cfdi.retencion;
const validadorInfoGlobal = schema.cfdi.informacionGlobal;
const validadorRelacionados = schema.cfdi.relacionados;
const validadorRelacionado = schema.cfdi.relacionado;

// Validar conceptos
const validadorConcepto = schema.concepto.concepto;
const validadorParte = schema.concepto.parte;
const validadorPredial = schema.concepto.predial;
const validadorInfoAduanera = schema.concepto.informacionAduanera;
const validadorTrasladoConcepto = schema.concepto.traslado;
const validadorRetencionConcepto = schema.concepto.retencion;
```

## API

### `Schema`

Clase singleton que gestiona los esquemas de validacion.

| Metodo/Propiedad | Descripcion |
|------------------|-------------|
| `Schema.of()` | Retorna la instancia singleton |
| `setConfig({ path, debug })` | Configura la ruta a los archivos de esquema JSON y modo debug |
| `cfdi` | Acceso a validadores del comprobante (comprobante, emisor, receptor, impuestos, etc.) |
| `concepto` | Acceso a validadores de conceptos (concepto, parte, predial, traslado, retencion, etc.) |

Los archivos de esquema deben estar en formato JSON generados a partir de los XSD oficiales del SAT.

## Licencia

[MIT](../../LICENSE)
