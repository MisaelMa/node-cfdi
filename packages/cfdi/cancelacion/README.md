# @cfdi/cancelacion

This package provides a TypeScript client for the Mexican SAT CFDI cancellation web services: it signs SOAP requests with your CSD or FIEL-compatible credential and a SAT session token, calls **CancelaCFD** to cancel invoices, **AceptacionRechazo** to accept or reject pending cancellation requests as the receiver, and **ConsultaPendientes** to list cancellations awaiting your response.

## Installation

```bash
npm install @cfdi/cancelacion
```

## Usage

You need a SAT authentication token (`SatTokenLike`) and a signing credential (`CredentialLike`) compatible with packages such as `@cfdi/csd` (certificate with `toPem` / `toDer` / `serialNumber`, `sign`, and `rfc`).

```typescript
import {
  CancelacionCfdi,
  MotivoCancelacion,
  RespuestaAceptacionRechazo,
} from '@cfdi/cancelacion';

// token: { value, created, expires } from your SAT auth flow
// credential: FIEL/CSD wrapper that implements CredentialLike
const client = new CancelacionCfdi(token, credential);

// CancelaCFD — cancel a CFDI
const cancelacion = await client.cancelar({
  rfcEmisor: 'AAA010101AAA',
  uuid: 'a3d08a33-d0d8-4f36-a857-ab4b2a5edc7c',
  motivo: MotivoCancelacion.SinRelacion,
  // folioSustitucion: required when motivo === MotivoCancelacion.ConRelacion ('01')
});

// Aceptacion / Rechazo — respond as receptor (within SAT deadline)
const respuesta = await client.aceptarRechazar({
  rfcReceptor: 'BBB020202BBB',
  uuid: 'a3d08a33-d0d8-4f36-a857-ab4b2a5edc7c',
  respuesta: RespuestaAceptacionRechazo.Aceptacion,
});

// Consulta pendientes — list UUIDs waiting for accept/reject
const pendientes = await client.consultarPendientes();
```

Lower-level SOAP helpers are re-exported for testing or custom integrations:

```typescript
import {
  buildCancelacionXml,
  buildCancelarRequest,
  parseCancelarResponse,
  buildAceptacionRechazoRequest,
  parseAceptacionRechazoResponse,
  buildConsultaPendientesRequest,
  parsePendientesResponse,
} from '@cfdi/cancelacion';
```

## API

| Export | Kind | Description |
| --- | --- | --- |
| `CancelacionCfdi` | class | Client: `cancelar`, `aceptarRechazar`, `consultarPendientes` |
| `MotivoCancelacion` | enum | SAT cancellation reason codes (`01`–`04`) |
| `EstatusCancelacion` | enum | Parsed cancellation status bucket |
| `RespuestaAceptacionRechazo` | enum | `Aceptacion` / `Rechazo` |
| `CancelacionParams` | interface | `rfcEmisor`, `uuid`, `motivo`, optional `folioSustitucion` (required if motivo `01`) |
| `CancelacionResult` | interface | `uuid`, `estatus`, `codEstatus`, `mensaje` |
| `AceptacionRechazoParams` | interface | `rfcReceptor`, `uuid`, `respuesta` |
| `AceptacionRechazoResult` | interface | `uuid`, `codEstatus`, `mensaje` |
| `PendientesResult` | interface | `uuid`, `rfcEmisor`, `fechaSolicitud` |
| `CredentialLike` | interface | Duck type for CSD/FIEL used by the client |
| `SatTokenLike` | interface | Duck type for SAT token (`value`, `created`, `expires`) |
| `buildCancelacionXml` | function | Build signed `<Cancelacion>` payload XML |
| `buildCancelarRequest` | function | Build SOAP envelope for CancelaCFD |
| `parseCancelarResponse` | function | Parse CancelaCFD SOAP response |
| `buildAceptacionRechazoRequest` | function | Build SOAP for ProcesarRespuesta |
| `parseAceptacionRechazoResponse` | function | Parse accept/reject response |
| `buildConsultaPendientesRequest` | function | Build SOAP for ConsultaPendientes |
| `parsePendientesResponse` | function | Parse pending cancellations list |

## Author

**Amir Misael Marin Coh** — [@MisaelMa](https://github.com/MisaelMa)

## License

This package is released under the [MIT License](https://opensource.org/licenses/MIT).
