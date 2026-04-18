# Conceptos

# Concepto

```typescript
import { CFDI, Concepto } from '@cfdi/xml';

const cfd = new CFDI();
const concepto = new Concepto({
    ClaveProdServ: '50211503',
    NoIdentificacion: '1212',
    Cantidad: '2',
    ClaveUnidad: 'H87',
    Unidad: 'Pieza',
    Descripcion: 'audifonos',
    ValorUnitario: '1000',
    Importe: '2000',
    Descuento: '0.00',
    ObjetoImp: '02'
});

// Cuenta predial (opcional)
concepto.predial('000121231');

// Informacion aduanera (opcional)
concepto.InformacionAduanera('21 47 3807 8003832');

// Partes (opcional)
concepto.parte({
    ClaveProdServ: '51241200',
    NoIdentificacion: 'IM020',
    Cantidad: 1,
    Unidad: 'PIEZA',
    Descripcion: 'CREMA FUNGICIDA 35ML',
    ValorUnitario: '172.50',
    Importe: '172.50'
});

// Impuestos de traslado (encadenable)
concepto.traslado({
    Base: '1000',
    Impuesto: '002',
    TipoFactor: 'Tasa',
    TasaOCuota: '0.160000',
    Importe: '160.00',
});

// Impuestos de retencion (encadenable)
concepto.retencion({
    Base: '1000',
    Impuesto: '002',
    TipoFactor: 'Tasa',
    TasaOCuota: '0.160000',
    Importe: '160.00',
});

cfd.concepto(concepto);
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Conceptos>
  <cfdi:Concepto ClaveProdServ="50211503" NoIdentificacion="1212" Cantidad="2" ClaveUnidad="H87" Unidad="Pieza" Descripcion="audifonos" ValorUnitario="1000" Importe="2000" Descuento="0.00" ObjetoImp="02">
    <cfdi:CuentaPredial Numero="000121231"/>
    <cfdi:InformacionAduanera NumeroPedimento="21 47 3807 8003832"/>
    <cfdi:Parte ClaveProdServ="51241200" NoIdentificacion="IM020" Cantidad="1" Unidad="PIEZA" Descripcion="CREMA FUNGICIDA 35ML" ValorUnitario="172.50" Importe="172.50"/>
    <cfdi:Impuestos>
      <cfdi:Traslados>
        <cfdi:Traslado Base="1000" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="160.00"/>
      </cfdi:Traslados>
      <cfdi:Retenciones>
        <cfdi:Retencion Base="1000" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="160.00"/>
      </cfdi:Retenciones>
    </cfdi:Impuestos>
  </cfdi:Concepto>
</cfdi:Conceptos>
```

## A Cuenta de Terceros

```typescript
concepto.terceros({
    RfcACuentaTerceros: 'JUFA7608212V6',
    NombreACuentaTerceros: 'ADRIANA JUAREZ FERNANDEZ',
    RegimenFiscalACuentaTerceros: '601',
    DomicilioFiscalACuentaTerceros: '29133',
});
```

## Complemento de Concepto

### IEDU

```typescript
import { CFDI, Concepto } from '@cfdi/xml';
import { Iedu, XmlIeduAttribute } from '@cfdi/complementos';

const cfd = new CFDI();
const concepto = new Concepto({ /* ... */ });

const ieduObject: XmlIeduAttribute = {
  version: '1.0',
  autRVOE: '201587PRIM',
  CURP: 'EJEMPLOGH101004HQRRRN',
  nivelEducativo: 'Primaria',
  nombreAlumno: 'ejemplo garcia correa',
  rfcPago: 'XAXX010101000',
};
const iedu = new Iedu(ieduObject);
concepto.complemento(iedu);

cfd.concepto(concepto);
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Conceptos>
  <cfdi:Concepto ClaveProdServ="" NoIdentificacion="" Cantidad="" ClaveUnidad="" Unidad="" Descripcion="" ValorUnitario="" Importe="">
    <cfdi:ComplementoConcepto>
      <iedu:instEducativas version="1.0" nombreAlumno="ejemplo garcia correa" CURP="EJEMPLOGH101004HQRRRN" nivelEducativo="Primaria" autRVOE="201587PRIM" rfcPago="XAXX010101000"/>
    </cfdi:ComplementoConcepto>
  </cfdi:Concepto>
</cfdi:Conceptos>
```
