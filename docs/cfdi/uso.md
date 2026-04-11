# Uso General

# USO

si vas a usarlo a javascript omite los tipados de datos.la mayoria del uso del codigo sigue siendo igual ```typescript
import {   
  CFDI, CFDIComprobante, Concepto, Emisor, Impuestos,   
  ObjetoImpEnum, Receptor, Relacionado,  
} from '@cfdi/xml';  
  
const styleSheet = '/home/dev/4.0/cadenaoriginal.xslt';  
  
const key = `/home/dev/certificados/LAN7008173R5.pem`;  
const cer = `/home/dev/certificados/LAN7008173R5.pem`;  
  
const comprobante: CFDIComprobante = {  
    Serie: 'E',  
    Folio: 'ACACUN-27',  
    Fecha: '2014-07-08T12:16:50',  
    .....  
};  
  
const cfdi = new CFDI({  
    debug: true,  
    xslt: {  
      path: styleSheet,  
    },  
});  
  
cfdi.comprobante(comprobante)  
  
cfdi.informacionGlobal({  
    Periodicidad: '1',  
    Meses: '1',  
    Año: '2',  
});  
  
const emisor = new Emisor({  
    Rfc: 'TCM970625MB1',  
    Nombre: 'FACTURACION MODERNA SA DE CV',  
    RegimenFiscal: 601,  
    FacAtrAdquirente: 'asdasd',  
});  
cfdi.emisor(emisor);  
  
const jsonToXml = cfdi.getXmlCdfi()
```

la salida en xml```xml
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" >  
<cfdi:CfdiRelacionados TipoRelacion="01">  
<cfdi:CfdiRelacionado UUID="asdasd-3234-asdasd-2332-asdas"/>  
<cfdi:CfdiRelacionado UUID="asdasd-3234-asdasd-2332-asdas"/>  
  
</cfdi:CfdiRelacionados>  
<cfdi:InformacionGlobal Periodicidad="1" Meses="1" Año="2"/>  
<cfdi:Emisor Rfc="TCM970625MB1" Nombre="FACTURACION MODERNA SA DE CV" RegimenFiscal="601" FacAtrAdquirente="asdasd"/>  
<cfdi:Receptor Rfc="XAXX010101000" Nombre="PUBLICO EN GENERAL" UsoCFDI="G01" DomicilioFiscalReceptor="112" RegimenFiscalReceptor="22"/>  
<cfdi:Conceptos>  
<cfdi:Concepto ClaveProdServ="001" NoIdentificacion="1212" Cantidad="2" ClaveUnidad="pieza" Unidad="Pieza" Descripcion="audifonos" ValorUnitario="1000" Importe="2000" Descuento="00.0" ObjetoImp="01">  
<cfdi:CuentaPredial Numero="000121231"/>  
<cfdi:InformacionAduanera NumeroPedimento="21 47 3807 8003832"/>  
<cfdi:Parte ClaveProdServ="51241200" NoIdentificacion="IM020" Cantidad="1" Unidad="PIEZA" Descripcion="25311FM00114 CREMA FUNGICIDA 35ML (ACIDO UNDECILENICO, ARBOL DEL TE VEHICULO EMOLIENTE)" ValorUnitario="172.50" Importe="172.50"/>  
<cfdi:Impuestos>  
<cfdi:Traslados>  
<cfdi:Traslado Base="369.83" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.16" Importe="59.17"/>  
<cfdi:Traslado Base="369.8aaaa3" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.16" Importe="59.17"/>  
  
</cfdi:Traslados>  
<cfdi:Retenciones>  
<cfdi:Retencion Base="369.83" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.16" Importe="59.17"/>  
  
</cfdi:Retenciones>  
  
</cfdi:Impuestos>  
  
</cfdi:Concepto>  
<cfdi:Concepto ClaveProdServ="001" NoIdentificacion="1212" Cantidad="2" ClaveUnidad="pieza" Unidad="Pieza" Descripcion="audifonos" ValorUnitario="1000" Importe="2000" Descuento="00.0" ObjetoImp="01">  
<cfdi:ACuentaTerceros RfcACuentaTerceros="JUFA7608212V6" NombreACuentaTerceros="ADRIANA JUAREZ FERNANDEZ" RegimenFiscalACuentaTerceros="601" DomicilioFiscalACuentaTerceros="29133"/>  
  
</cfdi:Concepto>  
  
</cfdi:Conceptos>  
<cfdi:Impuestos TotalImpuestosRetenidos="1000">  
<cfdi:Traslados>  
<cfdi:Traslado Base="1" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.16" Importe="59.17"/>  
  
</cfdi:Traslados>  
<cfdi:Retenciones>  
<cfdi:Retencion Impuesto="002" Importe="59.17"/>  
  
</cfdi:Retenciones>  
  
</cfdi:Impuestos>  
  
</cfdi:Comprobante>
```
