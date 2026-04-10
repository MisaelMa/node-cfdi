# @clir/openssl

Wrapper de la CLI de OpenSSL para operaciones con certificados digitales. Proporciona una interfaz fluida (builder pattern) para construir y ejecutar comandos `x509` y `pkcs8`.

## Instalacion

```bash
npm install @clir/openssl
```

## Uso

### x509 - Operaciones con certificados

```typescript
import { x509 } from '@clir/openssl';

// Convertir certificado DER a PEM
const pem = x509.inform('DER').in('certificado.cer').outform('PEM').run();

// Obtener informacion del certificado
const texto = x509.inform('DER').in('certificado.cer').noout().text().run();

// Obtener llave publica
const pubkey = x509.inform('DER').in('certificado.cer').noout().pubkey().run();

// Obtener numero de serie
const serial = x509.inform('DER').in('certificado.cer').noout().serial().run();

// Obtener huella digital
const fingerprint = x509.inform('DER').in('certificado.cer').noout().fingerprint().run();

// Verificar si expira en N segundos
const check = x509.inform('DER').in('certificado.cer').noout().checkend(86400).run();

// Obtener solo el comando como string (sin ejecutar)
const cmd = x509.inform('DER').in('certificado.cer').noout().text().cli();
```

### pkcs8 - Operaciones con llaves privadas

```typescript
import { pkcs8 } from '@clir/openssl';

// Convertir llave privada DER a PEM con contrasena
const pem = pkcs8
  .inform('DER')
  .in('llave.key')
  .outform('PEM')
  .passin('pass:contrasena123')
  .run();

// Convertir a formato tradicional sin cifrado
const trad = pkcs8.topk8().traditional().nocrypt().run();

// Obtener el comando sin ejecutar
const cmd = pkcs8.inform('DER').in('llave.key').cli();
```

## API

### `x509`

Instancia con interfaz fluida para comandos OpenSSL x509.

| Metodo | Descripcion |
|--------|-------------|
| `inform(format)` | Formato de entrada: `'DER'`, `'PEM'` |
| `in(file)` | Archivo de entrada |
| `outform(format)` | Formato de salida: `'DER'`, `'PEM'` |
| `noout()` | No imprimir el certificado |
| `text()` | Imprimir certificado en texto legible |
| `pubkey()` | Extraer llave publica |
| `serial()` | Obtener numero de serie |
| `fingerprint()` | Obtener huella digital |
| `checkend(seconds)` | Verificar expiracion |
| `subject()` | Obtener subject del certificado |
| `issuer()` | Obtener issuer del certificado |
| `startdate()` | Fecha de inicio de validez |
| `enddate()` | Fecha de fin de validez |
| `run()` | Ejecutar el comando y retornar resultado |
| `cli()` | Retornar el comando como string sin ejecutar |

### `pkcs8`

Instancia con interfaz fluida para comandos OpenSSL pkcs8.

| Metodo | Descripcion |
|--------|-------------|
| `inform(format)` | Formato de entrada |
| `in(file)` | Archivo de entrada |
| `outform(format)` | Formato de salida |
| `passin(pass)` | Contrasena de entrada (ej: `'pass:123'`) |
| `topk8()` | Convertir a formato PKCS#8 |
| `traditional()` | Usar formato tradicional |
| `nocrypt()` | Sin cifrado |
| `run()` | Ejecutar el comando y retornar resultado |
| `cli()` | Retornar el comando como string sin ejecutar |

## Autor

**Amir Misael Marin Coh** — [@MisaelMa](https://github.com/MisaelMa)

## Licencia

[MIT](../../LICENSE)
