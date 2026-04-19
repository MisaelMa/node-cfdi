# Impuestos

# Impuestos

```typescript
import { CFDI, Impuestos } from '@cfdi/xml';

const cfd = new CFDI();
const impuesto = new Impuestos({
  TotalImpuestosTrasladados: '160.00',
  TotalImpuestosRetenidos: '100.00',
});

impuesto.traslados({
    Base: '1000.00',
    Impuesto: '002',
    TipoFactor: 'Tasa',
    TasaOCuota: '0.160000',
    Importe: '160.00',
});

impuesto.retenciones({
    Impuesto: '002',
    Importe: '100.00',
});

cfd.impuesto(impuesto);
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Impuestos TotalImpuestosRetenidos="100.00" TotalImpuestosTrasladados="160.00">
  <cfdi:Traslados>
    <cfdi:Traslado Base="1000.00" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="160.00"/>
  </cfdi:Traslados>
  <cfdi:Retenciones>
    <cfdi:Retencion Impuesto="002" Importe="100.00"/>
  </cfdi:Retenciones>
</cfdi:Impuestos>
```

## Nota

Los metodos `traslados()` y `retenciones()` son encadenables (retornan `this`), se pueden agregar multiples impuestos:

```typescript
impuesto
  .traslados({ Base: '1000', Impuesto: '002', TipoFactor: 'Tasa', TasaOCuota: '0.160000', Importe: '160.00' })
  .traslados({ Base: '500', Impuesto: '003', TipoFactor: 'Tasa', TasaOCuota: '0.080000', Importe: '40.00' });
```

Para `retenciones()` los parametros requeridos son solo `Impuesto` e `Importe`.
