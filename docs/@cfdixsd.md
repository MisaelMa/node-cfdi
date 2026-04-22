# cfdi XSD

# @cfdi/xsd

Validacion de datos del CFDI contra esquemas JSON Schema derivados de los XSD del SAT.

```bash
npm i @cfdi/xsd --save
```

## Uso

```typescript
import Schema from '@cfdi/xsd';

const schema = Schema.of();  // Singleton
schema.setConfig({ path: '/path/to/schemas', debug: false });

// Validar comprobante
const isValid = schema.cfdi.comprobante.validate(comprobanteData);
if (!isValid) {
  console.log(schema.cfdi.comprobante.errors);
}

// Validar emisor
schema.cfdi.emisor.validate(emisorData);

// Validar receptor
schema.cfdi.receptor.validate(receptorData);

// Validar impuestos
schema.cfdi.impuestos.validate(impuestosData);
schema.cfdi.traslado.validate(trasladoData);
schema.cfdi.retencion.validate(retencionData);

// Validar concepto
schema.concepto.concepto.validate(conceptoData);
schema.concepto.parte.validate(parteData);
schema.concepto.predial.validate(predialData);
schema.concepto.terceros.validate(tercerosData);
schema.concepto.informacionAduanera.validate(aduaneraData);
```

## Validators disponibles

### cfdi (nivel comprobante)

| Validator | Descripcion |
|-----------|-------------|
| `schema.cfdi.comprobante` | Atributos del comprobante |
| `schema.cfdi.emisor` | Datos del emisor |
| `schema.cfdi.receptor` | Datos del receptor |
| `schema.cfdi.relacionado` | CFDI relacionado individual |
| `schema.cfdi.relacionados` | Grupo de CFDI relacionados |
| `schema.cfdi.impuestos` | Totales de impuestos |
| `schema.cfdi.traslado` | Impuesto trasladado |
| `schema.cfdi.retencion` | Impuesto retenido |
| `schema.cfdi.informacionGlobal` | Informacion global |

### concepto (nivel concepto)

| Validator | Descripcion |
|-----------|-------------|
| `schema.concepto.concepto` | Atributos del concepto |
| `schema.concepto.parte` | Parte del concepto |
| `schema.concepto.predial` | Cuenta predial |
| `schema.concepto.terceros` | A cuenta de terceros |
| `schema.concepto.informacionAduanera` | Informacion aduanera |
| `schema.concepto.traslado` | Impuesto trasladado del concepto |
| `schema.concepto.retencion` | Impuesto retenido del concepto |

## Cadena Original

Anteriormente se requeria Saxon (Java) para generar la cadena original via XSLT. Ahora el paquete `@cfdi/transform` lo hace de forma nativa en Node.js:

```typescript
import Transform from '@cfdi/transform';

const transform = new Transform();
const cadenaOriginal = transform
  .s('/path/to/comprobante.xml')
  .xsl('/path/to/cadenaoriginal.xslt')
  .run();

// Resultado: ||4.0|E|ACACUN-27|2014-07-08T12:16:50|01|...||
```

### Que es la cadena original?

Son todos los valores del XML concatenados con `|` (pipe) que hacen unico el comprobante. Esta cadena es la que se firma digitalmente para generar el sello del CFDI.
