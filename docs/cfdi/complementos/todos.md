# Complementos soportados

# Complementos

## Complementos de comprobante

- [x] Pago 2.0
- [x] Carta Porte 2.0
- [x] Aerolineas
- [x] INE 1.1
- [ ] ~~Timbre fiscal digital (TFD)~~
- [ ] Estado de cuenta de combustibles de monederos electronicos
- [ ] Donatarias
- [ ] Compra venta de divisas
- [ ] Otros derechos e impuestos
- [ ] Leyendas fiscales
- [ ] Persona fisica integrante de coordinado
- [ ] Turista pasajero extranjero
- [ ] Spei de tercero a tercero
- [ ] Sector de ventas al detalle (Detallista)
- [ ] CFDI Registro fiscal
- [ ] Recibo de pago de nomina
- [ ] Vales de despensa
- [ ] Consumo de combustibles version 1.1
- [ ] Notarios Publicos
- [ ] Vehiculo usado
- [ ] Servicios parciales de construccion
- [ ] Renovacion y sustitucion de vehiculos
- [ ] Certificado de destruccion
- [ ] Obras de arte plasticas y antiguedades
- [ ] Comercio Exterior version 1.1
- [ ] Hidrocarburos
- [ ] IngresosHidrocarburos
- [ ] GastosHidrocarburos10

## Complementos de Concepto

- [x] Instituciones educativas privadas (IEDU)
- [ ] Venta de vehiculos
- [ ] Terceros
- [ ] Acreditamiento del IEPS

## Aerolineas

```typescript
import { Aerolineas } from '@cfdi/complementos';

const aerolineas = new Aerolineas({
    Version: '1.0',
    TUA: '50.00',
});

aerolineas.OtrosCargos({ TotalCargos: '150.00' });
aerolineas.Cargo({ CodigoCargo: 'YR', Importe: '100.00' });
aerolineas.Cargo({ CodigoCargo: 'XY', Importe: '50.00' });

cfdi.complemento(aerolineas);
```

```xml
<cfdi:Complemento>
  <aerolineas:Aerolineas Version="1.0" TUA="50.00">
    <aerolineas:OtrosCargos TotalCargos="150.00">
      <aerolineas:Cargo CodigoCargo="YR" Importe="100.00"/>
      <aerolineas:Cargo CodigoCargo="XY" Importe="50.00"/>
    </aerolineas:OtrosCargos>
  </aerolineas:Aerolineas>
</cfdi:Complemento>
```
