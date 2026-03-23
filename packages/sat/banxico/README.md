# @sat/banxico

This package is a small client for the **Banxico SIE API REST** (`SieAPIRest/service/v1/series`): it resolves the default **exchange-rate series id** per currency (e.g. USD → `SF43718`), fetches JSON with your **API token**, and returns the latest or a **specific-date** **tipo de cambio** (pesos per foreign currency unit).

## Installation

```bash
npm install @sat/banxico
```

## Usage

```typescript
import { BanxicoClient, Moneda, SERIE_BANXICO } from '@sat/banxico';

const client = new BanxicoClient({
  apiToken: process.env.BANXICO_TOKEN!,
  timeout: 30_000,
});

const hoy = await client.obtenerTipoCambioActual(Moneda.USD);
console.log(hoy.fecha, hoy.tipoCambio, hoy.moneda);

const historico = await client.obtenerTipoCambio(Moneda.USD, '2024-01-15');
```

## API

| Export | Kind | Description |
|--------|------|-------------|
| `BanxicoClient` | class | `obtenerTipoCambio(moneda, fecha?)`, `obtenerTipoCambioActual(moneda)`. |
| `BanxicoConfig` | interface | `apiToken` (required), optional `timeout`. |
| `TipoCambio` | interface | `fecha`, `moneda`, `tipoCambio`. |
| `Moneda` | enum | `USD`, `EUR`, `GBP`, `JPY`, `CAD`. |
| `SERIE_BANXICO` | const | `ReadonlyMap<Moneda, string>` of default series ids. |

## License

This package is released under the [MIT License](../../../LICENSE).
