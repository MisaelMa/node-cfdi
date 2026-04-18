# Sellar Xml

# Sellar Xml CFDI 4.0

La funcion `certificar` extrae la informacion del certificado (.cer), decodifica el numero del certificado y lo anexa en las propiedades del xml. La funcion `sellar` genera un sello unico en base a todo el xml y la llave privada (.key).

## Uso con @cfdi/xml

```typescript
import { CFDI } from '@cfdi/xml';

// Soporta .cer/.key (binario SAT) y .pem
const key = 'CSD_Pruebas_CFDI_TCM970625MB1.key';
const cer = 'CSD_Pruebas_CFDI_TCM970625MB1.cer';

const cfd = new CFDI({
  xslt: { path: '/home/dev/4.0/cadenaoriginal.xslt' },
});

// ... configurar comprobante, emisor, receptor, conceptos, impuestos ...

// Certificar: extrae NoCertificado y Certificado del .cer
cfd.certificar(cer);

// Sellar: genera cadena original y firma con la llave privada
await cfd.sellar(key, '12345678a');

// Obtener XML sellado
const xml = cfd.getXmlCdfi();
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
                  xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"
                  Version="4.0"
                  Sello="Vj/X/ZUWxL6DJOEXflMAVwfotRU5uZ4....."
                  NoCertificado="20001000000300022762"
                  Certificado="MIIF8DCCA9igAwIBAgIUMjAwMDEwMDAwMDAzMDAwMjI3NjIwDQ....."
                  ...>
```

## Uso independiente con @cfdi/transform y @cfdi/csd

Si deseas generar la cadena original y el sello por separado sin usar `@cfdi/xml`:

```bash
npm i @cfdi/transform --save
npm i @cfdi/csd --save
```

```typescript
import Transform from '@cfdi/transform';
import { PrivateKey } from '@cfdi/csd';

const xmlPath = '/home/dev/app/cfdi.xml';
const xslt = '/home/dev/app/v4/cadenaOriginal.xslt';
const keyPath = '/home/dev/app/csd/LAN7008173R5.key';

// Cargar llave privada
const pk = PrivateKey.fromFileSync(keyPath, '12345678a');

// Generar cadena original
const transform = new Transform();
const cadenaOriginal = transform.s(xmlPath).xsl(xslt).run();

// cadenaOriginal => ||4.0|E|ACACUN-27|2014-07-08T12:16:50|01|...||

// Firmar cadena original
const sello = pk.sign(cadenaOriginal);  // retorna base64
```

La variable `sello` se coloca en el atributo `Sello` del xml.

## Tambien disponible: generateCadenaOriginal

```typescript
import { parseXslt, generateCadenaOriginal } from '@cfdi/transform';

const registry = parseXslt('/home/dev/4.0/cadenaoriginal.xslt');
const cadena = generateCadenaOriginal(xmlString, registry);
```
