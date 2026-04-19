# Uso General

# USO

Si vas a usarlo en JavaScript omite los tipados de datos.

```typescript
import {
  CFDI, CFDIComprobante, Concepto, Emisor, Impuestos,
  ObjetoImpEnum, Receptor, Relacionado,
} from '@cfdi/xml';

const styleSheet = '/home/dev/4.0/cadenaoriginal.xslt';

const key = `/home/dev/certificados/LAN7008173R5.key`;
const cer = `/home/dev/certificados/LAN7008173R5.cer`;

const comprobante: CFDIComprobante = {
    Serie: 'E',
    Folio: 'ACACUN-27',
    Fecha: '2024-07-08T12:16:50',
    FormaPago: '01',
    MetodoPago: 'PUE',
    Moneda: 'MXN',
    SubTotal: '2000',
    Total: '2320',
    TipoDeComprobante: 'I',
    Exportacion: '01',
    LugarExpedicion: '45610',
};

// Crear instancia con configuracion
const cfdi = new CFDI({
    debug: true,
    xslt: {
      path: styleSheet,
    },
});

// Atributos del comprobante
cfdi.comprobante(comprobante);

// Informacion global (opcional, para CFDI global)
cfdi.informacionGlobal({
    Periodicidad: '01',
    Meses: '01',
    Año: '2024',
});

// Relacionados (opcional)
const relation = new Relacionado({ TipoRelacion: '01' });
relation.addRelation('asdasd-3234-asdasd-2332-asdas');
cfdi.relacionados(relation);

// Emisor
const emisor = new Emisor({
    Rfc: 'TCM970625MB1',
    Nombre: 'FACTURACION MODERNA SA DE CV',
    RegimenFiscal: '601',
});
cfdi.emisor(emisor);

// Receptor
const receptor = new Receptor({
    Rfc: 'XAXX010101000',
    Nombre: 'PUBLICO EN GENERAL',
    UsoCFDI: 'G01',
    DomicilioFiscalReceptor: '45610',
    RegimenFiscalReceptor: '616',
});
cfdi.receptor(receptor);

// Conceptos
const concepto = new Concepto({
    ClaveProdServ: '50211503',
    NoIdentificacion: '1212',
    Cantidad: '2',
    ClaveUnidad: 'H87',
    Unidad: 'Pieza',
    Descripcion: 'audifonos',
    ValorUnitario: '1000',
    Importe: '2000',
    ObjetoImp: '02',
});
concepto.traslado({
    Base: '2000',
    Impuesto: '002',
    TipoFactor: 'Tasa',
    TasaOCuota: '0.160000',
    Importe: '320.00',
});
cfdi.concepto(concepto);

// Impuestos globales
const impuesto = new Impuestos({
    TotalImpuestosTrasladados: '320.00',
});
impuesto.traslados({
    Base: '2000',
    Impuesto: '002',
    TipoFactor: 'Tasa',
    TasaOCuota: '0.160000',
    Importe: '320.00',
});
cfdi.impuesto(impuesto);

// Certificar y sellar
cfdi.certificar(cer);
await cfdi.sellar(key, '12345678a');

// Obtener XML
const xml = cfdi.getXmlCdfi();

// O obtener JSON
const json = cfdi.getJsonCdfi();
```

La salida en XML:

```xml
<?xml version="1.0" encoding="utf-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"
                  Version="4.0"
                  Serie="E"
                  Folio="ACACUN-27"
                  Fecha="2024-07-08T12:16:50"
                  FormaPago="01"
                  MetodoPago="PUE"
                  Moneda="MXN"
                  SubTotal="2000"
                  Total="2320"
                  TipoDeComprobante="I"
                  Exportacion="01"
                  LugarExpedicion="45610"
                  Sello="..."
                  NoCertificado="..."
                  Certificado="...">
  <cfdi:CfdiRelacionados TipoRelacion="01">
    <cfdi:CfdiRelacionado UUID="asdasd-3234-asdasd-2332-asdas"/>
  </cfdi:CfdiRelacionados>
  <cfdi:InformacionGlobal Periodicidad="01" Meses="01" Año="2024"/>
  <cfdi:Emisor Rfc="TCM970625MB1" Nombre="FACTURACION MODERNA SA DE CV" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="XAXX010101000" Nombre="PUBLICO EN GENERAL" UsoCFDI="G01" DomicilioFiscalReceptor="45610" RegimenFiscalReceptor="616"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="50211503" NoIdentificacion="1212" Cantidad="2" ClaveUnidad="H87" Unidad="Pieza" Descripcion="audifonos" ValorUnitario="1000" Importe="2000" ObjetoImp="02">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado Base="2000" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="320.00"/>
        </cfdi:Traslados>
      </cfdi:Impuestos>
    </cfdi:Concepto>
  </cfdi:Conceptos>
  <cfdi:Impuestos TotalImpuestosTrasladados="320.00">
    <cfdi:Traslados>
      <cfdi:Traslado Base="2000" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="320.00"/>
    </cfdi:Traslados>
  </cfdi:Impuestos>
</cfdi:Comprobante>
```
