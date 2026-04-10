# @cfdi/complementos

Complementos fiscales para CFDI 3.3 y 4.0. Proporciona las clases necesarias para agregar complementos al comprobante fiscal conforme a las especificaciones del SAT.

## Instalacion

```bash
npm install @cfdi/complementos
```

## Uso

### Complemento de Pagos 2.0

```typescript
import { Pagos20, Pago20, Pago20Relacionado, Pago20Impuestos } from '@cfdi/complementos';

const pagos = new Pagos20();
const pago = new Pago20({
  FechaPago: '2024-01-15T12:00:00',
  FormaDePagoP: '01',
  MonedaP: 'MXN',
  Monto: '1000.00',
});

const relacionado = new Pago20Relacionado({
  IdDocumento: 'UUID-DEL-CFDI',
  MonedaDR: 'MXN',
  NumParcialidad: '1',
  ImpSaldoAnt: '1000.00',
  ImpPagado: '1000.00',
  ImpSaldoInsoluto: '0.00',
});

const complemento = pagos.getComplement();
```

### Complemento Carta Porte 2.0

```typescript
import { CartaPorte20 } from '@cfdi/complementos';

const cartaPorte = new CartaPorte20({
  TranspInternac: 'No',
  TotalDistRec: '100.00',
});

const complemento = cartaPorte.getComplement();
```

### Timbre Fiscal Digital (TFD)

```typescript
import { Tfd } from '@cfdi/complementos';

const tfd = new Tfd({
  Version: '1.1',
  UUID: 'DC2ED983-D108-402E-A2FD-C08EDDA23C47',
  FechaTimbrado: '2024-01-15T18:05:05',
  SelloCFD: '...',
  SelloSAT: '...',
  NoCertificadoSAT: '30001000000400002495',
});
```

### Clase base Complemento

Todos los complementos extienden de la clase abstracta `Complemento<T>`, que provee el metodo `getComplement()` para obtener la estructura XML del complemento.

```typescript
import { Complemento } from '@cfdi/complementos';

// getComplement() retorna:
// {
//   complement: T,           // Datos del complemento
//   key: string,             // Clave del nodo XML
//   schemaLocation: string[],// URLs del esquema XSD
//   xmlns: string,           // Namespace XML
//   xmlnskey: string,        // Prefijo del namespace
// }
```

## API

### Complementos CFDI 4.0

| Clase | Descripcion |
|-------|-------------|
| `Pagos20` / `Pago20` | Recepcion de pagos 2.0 |
| `CartaPorte20` | Carta porte 2.0 |
| `Aerolineas` | Aerolineas |
| `Ine` | Instituto Nacional Electoral |
| `Iedu` | Instituciones educativas |

### Complementos CFDI 3.3

| Clase | Descripcion |
|-------|-------------|
| `Tfd` | Timbre fiscal digital |
| `Cce11` | Comercio exterior 1.1 |
| `Nomina12` | Nomina 1.2 |
| `Divisas` | Divisas |
| `Donat` | Donatarias |
| `LeyendaFisc` | Leyendas fiscales |
| `VehiculoUsado` | Vehiculo usado |
| `Destruccion` | Certificado de destruccion |
| `ObrasArte` | Obras de arte |
| `ServicioParcial` | Servicios parciales de construccion |
| `Implocal` | Impuestos locales |
| `Hidrocarburos` | Gastos e ingresos de hidrocarburos |
| `Detallista` | Detallista |
| `Spei` | SPEI |
| `ValesDeDespensa` | Vales de despensa |
| `ConsumoDeCombustibles11` | Consumo de combustibles 1.1 |
| `VentaVehiculos` | Venta de vehiculos |

## Autor

**Amir Misael Marin Coh** — [@MisaelMa](https://github.com/MisaelMa)

## Licencia

[MIT](../../LICENSE)
