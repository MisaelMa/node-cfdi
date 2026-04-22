# @sat/opinion

This package fetches the SAT **Opinión de cumplimiento** (often associated with format **32-D**) from the Portal CFDI: given an **authenticated portal session** (cookies), it requests the HTML page, parses resultado, folio, fecha, obligaciones, and can download the **PDF** bytes.

## Installation

```bash
npm install @sat/opinion
```

## Usage

```typescript
import {
  OpinionCumplimientoService,
  ResultadoOpinion,
} from '@sat/opinion';
import { SatPortal, TipoAutenticacion } from '@sat/scraper';

const portal = new SatPortal();
const sesion = await portal.login({
  tipo: TipoAutenticacion.CIEC,
  rfc: 'AAA010101AAA',
  password: '...',
});

const opinion = new OpinionCumplimientoService();
const data = await opinion.obtener(sesion);

if (data.resultado === ResultadoOpinion.Positivo) {
  console.log('Al corriente', data.folioOpinion, data.obligaciones);
}

const pdf = await opinion.descargarPdf(sesion);
```

## API

| Export | Kind | Description |
|--------|------|-------------|
| `OpinionCumplimientoService` | class | `obtener(sesion)`, `descargarPdf(sesion, urlPdf?)`. |
| `OpinionCumplimiento` | interface | Parsed opinion: RFC, nombre, resultado, folio, fecha, obligaciones, optional `urlPdf`. |
| `ResultadoOpinion` | enum | `Positivo`, `Negativo`, `EnSuspenso`, `Inscrito`, `NoInscrito`. |
| `ObligacionFiscal` | interface | One obligation row: descripción, fechas, estado. |
| `OpinionConfig` | interface | Optional `timeout`, `baseUrl`. |
| `SesionPortalLike` | interface | Minimal session: `cookies`, `rfc`, `authenticated`. |

## Author

**Amir Misael Marin Coh** — [@MisaelMa](https://github.com/MisaelMa)

## License

This package is released under the [MIT License](../../../LICENSE).
