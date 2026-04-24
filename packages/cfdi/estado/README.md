# @cfdi/estado

This package calls the SAT **ConsultaCFDIService** SOAP endpoint with the printed-invoice expression (issuer RFC, receiver RFC, formatted total, UUID) and returns structured status fields plus convenience booleans (`activo`, `cancelado`, `noEncontrado`). No certificate is required for this public consultation service.

## Installation

```bash
npm install @cfdi/estado
```

## Usage

```typescript
import { consultarEstado } from '@cfdi/estado';

const result = await consultarEstado({
  rfcEmisor: 'AAA010101AAA',
  rfcReceptor: 'BBB020202BBB',
  total: '1000.00',
  uuid: 'a3d08a33-d0d8-4f36-a857-ab4b2a5edc7c',
});

if (result.activo) {
  console.log('Vigente', result.codigoEstatus);
}
if (result.cancelado) {
  console.log('Cancelado', result.estatusCancelacion);
}
```

Building or parsing SOAP manually (for example custom `fetch`):

```typescript
import { formatTotal, buildSoapRequest, parseSoapResponse } from '@cfdi/estado';

const tt = formatTotal('1000.00'); // '0000001000.000000' — SAT total format

const envelope = buildSoapRequest({
  rfcEmisor: 'AAA010101AAA',
  rfcReceptor: 'BBB020202BBB',
  total: '1000.00',
  uuid: 'a3d08a33-d0d8-4f36-a857-ab4b2a5edc7c',
});

// POST `envelope` to WEBSERVICE_URL, then:
const parsed = parseSoapResponse(responseBodyXml);
```

## API

| Export | Kind | Description |
| --- | --- | --- |
| `consultarEstado` | function | `POST` SOAP to SAT; returns `ConsultaResult` |
| `ConsultaParams` | interface | `rfcEmisor`, `rfcReceptor`, `total`, `uuid` |
| `ConsultaResult` | interface | Raw strings from SAT + `activo`, `cancelado`, `noEncontrado` |
| `formatTotal` | function | Format `total` to SAT’s 17-character pattern |
| `buildSoapRequest` | function | Build SOAP envelope XML from `ConsultaParams` |
| `parseSoapResponse` | function | Parse SOAP XML into `ConsultaResult`; throws on Fault |
| `WEBSERVICE_URL` | const | SAT WCF endpoint URL |
| `SOAP_ACTION` | const | SOAPAction header value for Consulta |

## Author

**Amir Misael Marin Coh** — [@MisaelMa](https://github.com/MisaelMa)

## License

This package is released under the [MIT License](https://opensource.org/licenses/MIT).
