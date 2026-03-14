# @cfdi/xml

Generacion y sellado de comprobantes fiscales digitales (CFDI 4.0) en formato XML. Permite crear, certificar y sellar facturas electronicas conforme a los lineamientos del SAT.

## Instalacion

```bash
npm install @cfdi/xml
```

## Uso

```typescript
import { CFDI, Emisor, Receptor, Concepto, Impuestos, Relacionado } from '@cfdi/xml';

// Crear instancia del CFDI con configuracion de XSLT y Saxon
const cfdi = new CFDI({
  xslt: { path: '/ruta/cadenaoriginal_4_0.xslt' },
  saxon: { binary: '/ruta/saxon-he' },
  debug: false,
});

// Certificar con el archivo .cer
cfdi.certificar('/ruta/certificado.cer');

// Configurar emisor
cfdi.setEmisor({
  Rfc: 'AAA010101AAA',
  Nombre: 'Empresa SA de CV',
  RegimenFiscal: '601',
});

// Configurar receptor
cfdi.setReceptor({
  Rfc: 'BBB020202BBB',
  Nombre: 'Cliente SA de CV',
  UsoCFDI: 'G03',
  DomicilioFiscalReceptor: '12345',
  RegimenFiscalReceptor: '601',
});

// Agregar conceptos
cfdi.addConcepto({
  ClaveProdServ: '01010101',
  Cantidad: '1',
  ClaveUnidad: 'E48',
  Descripcion: 'Servicio de consultoria',
  ValorUnitario: '1000.00',
  Importe: '1000.00',
  ObjetoImp: '02',
});

// Sellar con el archivo .key y contrasena
await cfdi.sellar('/ruta/llave.key', 'contrasena123');

// Obtener el XML generado
const xml = cfdi.getXmlCdfi();

// Obtener la representacion JSON
const json = cfdi.getJsonCdfi();

// Guardar archivo
cfdi.saveFile(xml, '/ruta/salida/', 'factura');
```

### Agregar CFDI relacionados

```typescript
cfdi.addRelacionado('04', 'UUID-DEL-CFDI-RELACIONADO');
```

### Acceder a la cadena original y sello

```typescript
const cadena = cfdi.cadenaOriginal;
const sello = cfdi.sello;
```

## API

### Clase `CFDI`

Extiende de `Comprobante`. Clase principal para generar facturas electronicas.

| Metodo | Descripcion |
|--------|-------------|
| `certificar(cerpath)` | Carga el certificado .cer y establece NoCertificado y Certificado |
| `sellar(keyfile, password)` | Genera la cadena original y el sello digital |
| `getXmlCdfi()` | Retorna el XML del CFDI como string |
| `getJsonCdfi()` | Retorna la estructura JSON del CFDI |
| `saveFile(file, path, name)` | Guarda el XML en disco |
| `generarCadenaOriginal()` | Genera la cadena original usando XSLT |
| `generarSello(cadena, keyfile, password)` | Genera el sello digital a partir de la cadena original |
| `setDebug(debug)` | Activa o desactiva el modo debug |

### Configuracion (`Config`)

```typescript
interface Config {
  debug?: boolean;
  compact?: boolean;
  xslt?: { path: string };
  saxon?: { binary: string };
  schema?: { path: string };
}
```

### Exports adicionales

- `Emisor` - Elemento del emisor
- `Receptor` - Elemento del receptor
- `Concepto` / `Concepts` - Elemento de conceptos
- `Impuestos` - Elemento de impuestos
- `Relacionado` - Elemento de CFDI relacionados

## Licencia

[MIT](../../LICENSE)
