# @cfdi/csd — Certificados de Sello Digital

Manejo de **CSD** (Certificado de Sello Digital) y **FIEL** (eFirma) del SAT en Node.js. Parsea archivos `.cer` / `.key` del SAT, firma y verifica datos con RSA + SHA-256, y expone informacion fiscal del titular (RFC, numero de certificado, vigencia, etc.).

Usa `crypto` nativo de Node 22 para firma/verificacion y `node-forge` para parseo X.509.

## Contenido

- [Instalacion](#instalacion)
- [Conceptos](#conceptos)
- [Quick start](#quick-start)
- [`Certificate`](#certificate) — parseo de `.cer`
- [`PrivateKey`](#privatekey) — parseo de `.key`
- [`Credential`](#credential) — certificado + llave
- [Modo de operacion](#modo-de-operacion)
- [Errores comunes](#errores-comunes)

## Instalacion

```bash
npm i @cfdi/csd --save
# o
pnpm add @cfdi/csd
```

Requiere **Node >= 22**.

## Conceptos

- **`.cer`**: certificado X.509 en formato DER (binario). Tambien se acepta PEM.
- **`.key`**: llave privada RSA en PKCS#8 **cifrada con contrasena** (DER). Tambien se acepta PEM sin cifrar.
- **CSD**: se usa para sellar CFDI. No-repudio **no** habilitado.
- **FIEL / eFirma**: se usa para autenticacion ante el SAT. No-repudio habilitado.
- Todas las firmas usan **RSA con SHA-256** por defecto y se devuelven en **base64**.

## Quick start

```typescript
import { Credential } from '@cfdi/csd';

const cred = await Credential.create(
  '/ruta/LAN7008173R5.cer',
  '/ruta/LAN7008173R5.key',
  '12345678a'
);

if (!cred.isValid()) throw new Error('Certificado vencido');
if (!cred.keyMatchesCertificate()) throw new Error('La llave no corresponde al .cer');

const sello = cred.sign('||cadena|original||');   // base64
const ok    = cred.verify('||cadena|original||', sello); // true
```

---

## `Certificate`

Wrapper del certificado X.509 (`.cer` / `.pem`). Instanciado via factories estaticos (constructor privado).

### Carga

```typescript
import { Certificate } from '@cfdi/csd';

// Desde archivo (auto-detecta DER vs PEM por cabecera y extension)
const c1 = await Certificate.fromFile('/ruta/cert.cer');
const c2 = Certificate.fromFileSync('/ruta/cert.cer');

// Desde buffer o string
const c3 = Certificate.fromDer(derBuffer);
const c4 = Certificate.fromPem(pemString);
```

### API

| Metodo | Retorna | Descripcion |
|---|---|---|
| `serialNumber()` | `string` | Numero de serie en hex. |
| `noCertificado()` | `string` | Numero de certificado SAT (decimal ASCII, 20 digitos). |
| `rfc()` | `string` | RFC del titular (busca en OIDs `2.5.4.45`, `2.5.4.5`, `uid`). |
| `legalName()` | `string` | Nombre legal (`CN` o `givenName`). |
| `issuer()` | `Record<string,string>` | Atributos del emisor (SAT). |
| `subject()` | `Record<string,string>` | Atributos del titular. |
| `validFrom()` | `Date` | Inicio de vigencia. |
| `validTo()` | `Date` | Fin de vigencia. |
| `isExpired()` | `boolean` | Vencido respecto a `new Date()`. |
| `isFiel()` | `boolean` | Es eFirma. |
| `isCsd()` | `boolean` | Es Certificado de Sello Digital. |
| `publicKey()` | `string` | Llave publica en PEM. |
| `fingerprint()` | `string` | SHA-1 `AA:BB:CC:...`. |
| `fingerprintSha256()` | `string` | SHA-256 hex en mayusculas. |
| `toPem()` | `string` | Certificado en PEM. |
| `toDer()` | `Buffer` | Certificado en DER. |
| `toBase64()` | `string` | Contenido base64 del PEM (sin cabeceras ni saltos) — formato requerido por el atributo `Certificado` del CFDI. |

### Ejemplo

```typescript
const cert = await Certificate.fromFile('/ruta/LAN7008173R5.cer');

cert.rfc();            // 'LAN7008173R5'
cert.noCertificado();  // '30001000000400002434'
cert.isCsd();          // true
cert.validTo();        // 2026-12-31T23:59:59.000Z
cert.toBase64();       // 'MIIFuTCCA6GgAwIBAgIUM...' → atributo Certificado del CFDI
```

---

## `PrivateKey`

Llave privada RSA. El `.key` del SAT es PKCS#8 cifrado en DER, requiere contrasena.

### Carga

```typescript
import { PrivateKey } from '@cfdi/csd';

// Archivo (password obligatoria salvo PEM sin cifrar)
const k1 = await PrivateKey.fromFile('/ruta/cert.key', '12345678a');
const k2 = PrivateKey.fromFileSync('/ruta/cert.key', '12345678a');

// Buffer / string
const k3 = PrivateKey.fromDer(derBuffer, '12345678a');
const k4 = PrivateKey.fromPem(pemSinCifrar);
```

### API

| Metodo | Descripcion |
|---|---|
| `sign(data, algorithm?)` | Firma con RSA-SHA256 (default); retorna base64. |
| `belongsToCertificate(cert)` | `true` si la llave corresponde al certificado dado. |
| `toPem()` | Exporta PEM PKCS#8 **sin cifrar**. |
| `keyObject` | Getter al `crypto.KeyObject` nativo para usos avanzados. |

> **Seguridad**: nunca loguear `toPem()` ni el contenido de la llave. Ver [reglas de seguridad](../.claude/rules/security.md).

---

## `Credential`

Combina `Certificate` + `PrivateKey`. Es el objeto que normalmente se pasa al generador CFDI.

### Carga

```typescript
import { Credential } from '@cfdi/csd';

// Desde archivos (metodo recomendado)
const cred = await Credential.create(cerPath, keyPath, password);

// Desde PEM strings (p.ej. secretos en memoria)
const cred2 = Credential.fromPem(cerPem, keyPem);
```

### API

Delegados al certificado:

- `rfc()`, `legalName()`, `serialNumber()`, `noCertificado()`
- `isFiel()`, `isCsd()`, `isValid()` (no vencido)

Operaciones criptograficas:

- `sign(data, algorithm?='SHA256')` → base64
- `verify(data, signature, algorithm?='SHA256')` → `boolean`

Validaciones:

- `belongsTo(rfc)` — compara contra el RFC del subject (case-insensitive).
- `keyMatchesCertificate()` — verifica que llave y certificado hagan par.

Acceso directo:

- `cred.certificate` → `Certificate`
- `cred.privateKey` → `PrivateKey`

### Ejemplo completo: sellado de CFDI

```typescript
import { Credential } from '@cfdi/csd';

const cred = await Credential.create(cerPath, keyPath, password);

if (!cred.isCsd())                 throw new Error('Se requiere CSD, no FIEL');
if (!cred.isValid())               throw new Error('CSD vencido');
if (!cred.keyMatchesCertificate()) throw new Error('Par cer/key invalido');
if (!cred.belongsTo('LAN7008173R5')) throw new Error('RFC no coincide');

const cadenaOriginal = '||4.0|FOLIO|2026-04-15T12:00:00|...||';
const sello = cred.sign(cadenaOriginal);

// Atributos listos para <cfdi:Comprobante>
const attrs = {
  NoCertificado: cred.noCertificado(),
  Certificado:   cred.certificate.toBase64(),
  Sello:         sello,
};
```

---

## Modo de operacion

```typescript
import { setMode, getMode, type CsdMode } from '@cfdi/csd';

setMode('node');    // default — usa crypto nativo de Node 22
getMode();          // 'node' | 'binary'
```

El modo `'binary'` existe para compatibilidad con flujos que delegan en `openssl` via CLI. El modo recomendado es **`'node'`**.

---

## Errores comunes

| Sintoma | Causa probable |
|---|---|
| `error:... bad decrypt` al cargar `.key` | Contrasena incorrecta. |
| `cred.rfc()` regresa `''` | Certificado con OIDs no estandar; revisar `cert.subject()`. |
| `keyMatchesCertificate()` es `false` | El `.cer` y el `.key` no son par (archivos mezclados). |
| `isCsd()` es `false` en un CSD valido | OU del subject no contiene marcadores esperados; validar contra `cert.subject().OU` y reportar. |
| Firma rechazada por el PAC/SAT | Cadena original mal generada (no problema de `@cfdi/csd`); verificar con `cred.verify(cadena, sello)`. |
