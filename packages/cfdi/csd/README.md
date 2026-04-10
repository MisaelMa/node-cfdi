# @cfdi/csd

Manejo de Certificados de Sello Digital (CSD) del SAT. Permite leer archivos `.cer` y `.key`, extraer informacion del certificado y firmar cadenas originales.

## Instalacion

```bash
npm install @cfdi/csd
```

## Uso

### Certificado (.cer)

```typescript
import { cer } from '@cfdi/csd';

// Cargar archivo de certificado
cer.setFile('/ruta/al/certificado.cer');

// Obtener PEM
const pem = cer.getPem();
const pemSinHeaders = cer.getPem({ begin: true }); // Sin BEGIN/END

// Informacion del certificado
const noCertificado = cer.getNoCer();    // Numero de certificado
const serial = cer.serial();              // Numero de serie hex
const fechas = cer.date();                // { startDate, endDate }
const vigencia = cer.validity();          // { notBefore, notAfter }
const sujeto = cer.subject();             // Datos del titular
const emisor = cer.issuer();              // Datos del emisor
const llave = cer.pubkey();               // Llave publica PEM
const huella = cer.fingerPrint();         // Huella digital

// Verificar si el certificado expira en N segundos
const expira = cer.checkend(86400); // Verificar si expira en 24 horas
```

### Llave privada (.key)

```typescript
import { key } from '@cfdi/csd';

// Cargar archivo de llave con contrasena
key.setFile('/ruta/a/llave.key', 'contrasena123');

// Obtener PEM
const pem = key.getPem();

// Firmar cadena original
const firma = key.signatureHexForge('cadena original');    // Firma con node-forge
const firma2 = key.signatureHexCripto('cadena original');  // Firma con crypto nativo
```

## API

### Modulo `cer`

| Funcion | Descripcion |
|---------|-------------|
| `setFile(path)` | Carga un archivo .cer o .pem |
| `getPem(options?)` | Retorna el certificado en formato PEM |
| `getNoCer()` | Retorna el numero de certificado |
| `serial()` | Retorna el numero de serie hexadecimal |
| `date(format?)` | Retorna fechas de inicio y fin de vigencia |
| `validity()` | Retorna `{ notBefore, notAfter }` como objetos Date |
| `checkend(seconds)` | Verifica si el certificado expira en N segundos |
| `subject()` | Retorna los datos del titular del certificado |
| `issuer()` | Retorna los datos del emisor del certificado |
| `pubkey(options?)` | Retorna la llave publica en formato PEM |
| `fingerPrint()` | Retorna la huella digital del certificado |

### Modulo `key`

| Funcion | Descripcion |
|---------|-------------|
| `setFile(path, password?)` | Carga un archivo .key con contrasena |
| `getPem(options?)` | Retorna la llave privada en formato PEM |
| `signatureHexForge(message)` | Firma SHA256 usando node-forge, retorna base64 |
| `signatureHexCripto(message)` | Firma SHA256 usando crypto nativo, retorna base64 |

## Autor

**Amir Misael Marin Coh** — [@MisaelMa](https://github.com/MisaelMa)

## Licencia

[MIT](../../LICENSE)
