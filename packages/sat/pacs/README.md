# @sat/pacs

This package defines a common **PAC** (Proveedor Autorizado de Certificación) contract for **timbrado**, **cancelación**, and **estatus** queries, and ships a **Finkok** client that speaks SOAP to the public **stamp** and **cancel** WSDL endpoints (production and demo).

## Installation

```bash
npm install @sat/pacs
```

## Usage

```typescript
import { FinkokProvider } from '@sat/pacs';

const pac = new FinkokProvider({
  user: 'usuario',
  password: 'secret',
  sandbox: true,
  // optional: full stamp WSDL URL or origin override
  // baseUrl: 'https://demo-facturacion.finkok.com/servicios/soap/stamp.wsdl',
});

const timbrado = await pac.timbrar({
  xmlCfdi: '<cfdi:Comprobante ...>...</cfdi:Comprobante>',
});

console.log(timbrado.uuid, timbrado.xmlTimbrado);

const cancel = await pac.cancelar(
  timbrado.uuid,
  'AAA010101AAA',
  '02',
  'uuid-sustitucion-opcional',
);

const estatus = await pac.consultarEstatus(timbrado.uuid);
```

## API

| Export | Kind | Description |
|--------|------|-------------|
| `FinkokProvider` | class | Implements `PacProvider` for Finkok SOAP services. |
| `PacProvider` | interface | `timbrar`, `cancelar`, `consultarEstatus`. |
| `PacConfig` | interface | `user`, `password`, `sandbox`, optional `baseUrl`. |
| `TimbradoRequest` | interface | `xmlCfdi` string to stamp. |
| `TimbradoResult` | interface | UUID, sellos, SAT certificate fields, full stamped XML. |
| `CancelacionPacResult` | interface | `uuid`, `estatus`, `acuse`. |
| `ConsultaEstatusResult` | interface | `uuid`, `estatus`, optional `xml`. |
| `PacProviderType` | enum | Identifiers (`Finkok`, `SW`, …) for the ecosystem. |

## Author

**Amir Misael Marin Coh** — [@MisaelMa](https://github.com/MisaelMa)

## License

This package is released under the [MIT License](../../../LICENSE).
