# @sat/auth

This package authenticates against the Mexican SAT **Descarga Masiva** web service using your **FIEL** (e.firma): it builds a WS-Security SOAP envelope with an X.509 `BinarySecurityToken`, signs the canonicalized `Timestamp` with RSA-SHA256, posts it to the SAT authentication endpoint, and returns the session **SOAP token** (`AutenticaResult`) used as a bearer for subsequent mass-download calls.

## Installation

```bash
npm install @sat/auth
```

## Usage

```typescript
import { SatAuth } from '@sat/auth';
import { Credential } from '@cfdi/csd'; // or any object matching CredentialLike

const fiel = await Credential.create('certificado.cer', 'llave.key', 'password');
const auth = new SatAuth(fiel);
const token = await auth.authenticate();

console.log(token.value); // SOAP token
console.log(token.expires);
```

Lower-level helpers are available if you assemble or test the SOAP payload yourself:

```typescript
import {
  buildAuthToken,
  buildTimestampFragment,
  buildSignedInfoFragment,
  canonicalize,
  sha256Digest,
  signRsaSha256,
} from '@sat/auth';
import crypto from 'crypto';
```

## API

| Export | Kind | Description |
|--------|------|-------------|
| `SatAuth` | class | Authenticates with the SAT and returns a `SatToken`. |
| `SatToken` | interface | `{ value, created, expires }` session token from the SAT. |
| `CredentialLike` | interface | Duck type for a FIEL credential (certificate + `sign`). |
| `buildAuthToken` | function | Builds the full SOAP envelope for `Autentica`. |
| `BuildAuthTokenParams` | interface | Parameters for `buildAuthToken`. |
| `buildTimestampFragment` | function | XML fragment for the WS-Security `Timestamp`. |
| `buildSignedInfoFragment` | function | XML fragment for `SignedInfo` (XMLDSig). |
| `canonicalize` | function | Simplified exclusive C14N for the SAT auth `Timestamp`. |
| `sha256Digest` | function | SHA-256 digest in base64. |
| `signRsaSha256` | function | RSA-SHA256 signature in base64 using a Node `KeyObject`. |

## Author

**Amir Misael Marin Coh** — [@MisaelMa](https://github.com/MisaelMa)

## License

This package is released under the [MIT License](../../../LICENSE).
