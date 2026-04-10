# @sat/scraper

This package provides an HTTP client for the SAT **Portal CFDI** (`portalcfdi.facturaelectronica.sat.gob.mx`): it logs in with **CIEC** (RFC + password) or **FIEL** (PEM certificate and private key), keeps session **cookies**, and can **query issued/received CFDIs** for a date range by posting the portal form and parsing the HTML result table.

## Installation

```bash
npm install @sat/scraper
```

## Usage

```typescript
import { SatPortal, TipoAutenticacion } from '@sat/scraper';

const portal = new SatPortal({
  timeout: 30_000,
  // baseUrl: 'https://portalcfdi.facturaelectronica.sat.gob.mx', // default
});

// CIEC
const sesion = await portal.login({
  tipo: TipoAutenticacion.CIEC,
  rfc: 'AAA010101AAA',
  password: 'your-ciec',
});

// FIEL (PEM strings)
const sesionFiel = await portal.login({
  tipo: TipoAutenticacion.FIEL,
  certificatePem: '-----BEGIN CERTIFICATE-----...',
  privateKeyPem: '-----BEGIN PRIVATE KEY-----...',
  password: '',
});

const cfdis = await portal.consultarCfdis(sesion, {
  fechaInicio: '2024-01-01',
  fechaFin: '2024-01-31',
  rfcReceptor: 'BBB010101BBB', // optional
});

await portal.logout(sesion);
```

## API

| Export | Kind | Description |
|--------|------|-------------|
| `SatPortal` | class | Portal client: `login`, `consultarCfdis`, `logout`. |
| `TipoAutenticacion` | enum | `CIEC` (`'ciec'`), `FIEL` (`'fiel'`). |
| `CredencialCIEC` | interface | RFC + password for CIEC login. |
| `CredencialFIEL` | interface | PEM cert/key (+ password field on type). |
| `CredencialPortal` | type | Union of CIEC and FIEL credentials. |
| `SesionSAT` | interface | Session state: `cookies`, `rfc`, `authenticated`, `expiresAt`, optional `csrfToken`. |
| `ConsultaCfdiParams` | interface | Date range and optional RFC / filters for CFDI query. |
| `CfdiConsultaResult` | interface | One row of parsed CFDI metadata from the portal. |
| `ScraperConfig` | interface | Optional `timeout`, `userAgent`, `baseUrl`. |

## Author

**Amir Misael Marin Coh** — [@MisaelMa](https://github.com/MisaelMa)

## License

This package is released under the [MIT License](../../../LICENSE).
