# @cfdi/descarga

This package implements the SAT **descarga masiva** (bulk CFDI download) flow over SOAP: **solicitar** registers a request and returns `IdSolicitud`, **verificar** polls until packages are ready and returns `idsPaquetes`, and **descargar** fetches each package as a ZIP buffer. Requests are signed with a FIEL-compatible credential; the session token is supplied as a `SatTokenLike` (for example from your SAT authentication package).

## Installation

```bash
npm install @cfdi/descarga
```

## Usage

```typescript
import {
  DescargaMasiva,
  TipoSolicitud,
  TipoDescarga,
  EstadoSolicitud,
  ESTADO_DESCRIPCION,
} from '@cfdi/descarga';

// token: SatTokenLike from SAT auth; credential: CredentialLike (FIEL)
const dm = new DescargaMasiva(token, credential);

// 1) Solicitar
const solicitud = await dm.solicitar({
  rfcSolicitante: 'AAA010101AAA',
  fechaInicio: '2024-01-01',
  fechaFin: '2024-01-31',
  tipoSolicitud: TipoSolicitud.CFDI,
  tipoDescarga: TipoDescarga.Emitidos,
  // optional: rfcEmisor, rfcReceptor, estadoComprobante
});

// 2) Verificar (poll until EstadoSolicitud.Terminada)
const verificacion = await dm.verificar(solicitud.idSolicitud);
console.log(ESTADO_DESCRIPCION[verificacion.estado], verificacion.mensaje);

if (verificacion.estado === EstadoSolicitud.Terminada) {
  // 3) Descargar each package
  for (const idPaquete of verificacion.idsPaquetes) {
    const zipBuffer: Buffer = await dm.descargar(idPaquete);
    // write or unzip zipBuffer
  }
}
```

Advanced: SOAP builders, parsers, and signing helpers are exported from the package entry:

```typescript
import {
  buildSolicitarRequest,
  parseSolicitarResponse,
  NS_DM_SOLICITUD,
  signSoapBody,
} from '@cfdi/descarga';
```

## API

| Export | Kind | Description |
| --- | --- | --- |
| `DescargaMasiva` | class | `solicitar`, `verificar`, `descargar` |
| `TipoSolicitud` | enum | `CFDI`, `Metadata` |
| `TipoDescarga` | enum | Emitidos (`RfcEmisor`) / Recibidos (`RfcReceptor`) |
| `EstadoSolicitud` | enum | SAT request state codes (`1`–`6`) |
| `EstadoComprobante` | enum | Optional filter: cancelado / vigente |
| `SolicitudParams` | interface | RFC, date range, types, optional filters |
| `SolicitudResult` | interface | `idSolicitud`, `codEstatus`, `mensaje` |
| `VerificacionResult` | interface | `estado`, `idsPaquetes`, `numeroCfdis`, messages |
| `ESTADO_DESCRIPCION` | const | Human-readable labels for `EstadoSolicitud` |
| `CredentialLike` | interface | FIEL duck type (`certificate`, `sign`, `rfc`) |
| `SatTokenLike` | interface | Token duck type (`value`, `created`, `expires`) |
| `buildSolicitarRequest` | function | SOAP body for SolicitaDescarga |
| `parseSolicitarResponse` | function | Parse solicitud response |
| `buildVerificarRequest` | function | SOAP body for VerificaSolicitudDescarga |
| `parseVerificarResponse` | function | Parse verification response |
| `buildDescargarRequest` | function | SOAP body for Descargar |
| `parseDescargarResponse` | function | Parse ZIP payload from SOAP |
| `NS_DM_SOLICITUD` | const | XML namespace used in solicitud SOAP |
| `canonicalize` | function | XML canonicalization helper (signer) |
| `digestSha256` | function | SHA-256 digest helper |
| `SoapSignatureComponents` | interface | Components for SOAP signing |
| `signSoapBody` | function | Sign SOAP body content |
| `buildSecurityHeader` | function | Build WS-Security header fragment |

## License

This package is released under the [MIT License](https://opensource.org/licenses/MIT).
