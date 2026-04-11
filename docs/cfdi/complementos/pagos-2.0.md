# complementopago-2-0

# Pagos 2.0



Complemento para registrar información sobre la recepción de pagos.   
El emisor de este complemento para recepción de pagos debe ser quien las leyes le obligue a expedir  
comprobantes por los actos o actividades que realicen, por los ingresos que se perciban o por las retenciones de contribuciones que efectúen.



## **Pago RFC Genérico**



```typescript
  
import { CFDI,  CFDIAttributes, Concepto, Emisor, ObjetoImpEnum, Receptor } from '@cfdi/xml';  
import { Pago20, Pago20ImpuestosP, Pago20Relacionado, Pagos20 } from '@cfdi/complementos/4.0/pago20';  
  
const comprobanteAttribute: CFDIAttributes = {  
    Serie: 'E',  
    // eslint-disable-next-line  
    Folio: 'ACACUN-27',  
    Fecha: '2014-07-08T12:16:50',  
    Sello: '',  
    FormaPago: '01',  
    NoCertificado: '',  
    Certificado: '',  
    condicionesDePago: 'Contado',  
    SubTotal: '0',  
    Descuento: '645.92',  
    Moneda: 'MXN',  
    Total: '17207.35',  
    TipoDeComprobante: 'I',  
    MetodoPago: 'PUE',  
    LugarExpedicion: 'México',  
    Exportacion: '01',  
  };  
  
  const cfd = new CFDI(comprobanteAttribute, {  
    debug: true,  
    xslt: {  
      path: styleSheet,  
    },  
  });  
  cfd.setAttributesXml({ version: '1.0', encoding: 'utf-8' });  
  const emisor = new Emisor({  
    Rfc: 'TCM970625MB1',  
    Nombre: 'RECREANDO SA DE CV',  
    RegimenFiscal: 601,  
    FacAtrAdquirente: 'asdasd',  
  });  
  cfd.emisor(emisor);  
  
  const receptor = new Receptor({  
    Rfc: 'XAXX010101000',  
    Nombre: 'PUBLICO EN GENERAL',  
    UsoCFDI: 'CP01',  
    DomicilioFiscalReceptor: '75700',  
    RegimenFiscalReceptor: '22',  
  });  
  cfd.receptor(receptor);  
  
  const concepto = new Concepto({  
    ClaveProdServ: '84111506',  
    Cantidad: '1',  
    ClaveUnidad: 'ACT',  
    Descripcion: 'Pago',  
    ValorUnitario: '0',  
    Importe: '0',  
    ObjetoImp: ObjetoImpEnum.NoobjetoDeimpuesto,  
  });  
  cfd.concepto(concepto);  
    
  const pago20 = new Pagos20();  
  pago20.setTotales({  
    TotalTrasladosBaseIVA16: '5843.11',  
    TotalTrasladosImpuestoIVA16: '934.90',  
    TotalTrasladosBaseIVA0: '0.00',  
    MontoTotalPagos: '6778.00',  
  });  
  
  const pago = new Pago20();  
  pago.setAttribute({  
    FechaPago: '2022-09-09T17:33:38',  
    FormaDePagoP: '01',  
    MonedaP: 'MXN',  
    TipoCambioP: '1',  
    Monto: '6778.00',  
  });  
  
  const docRela = new Pago20Relacionado();  
  docRela.setRelacion({  
    doc: {  
      IdDocumento: 'b7c8d2bf-cb4e-4f84-af89-c68b6731206a',  
      Serie: 'FA',  
      Folio: 'N0000216349',  
      MonedaDR: 'MXN',  
      EquivalenciaDR: '1',  
      NumParcialidad: '2',  
      ImpSaldoAnt: '6777.41',  
      ImpPagado: '6777.41',  
      ImpSaldoInsoluto: '0.00',  
      ObjetoImpDR: '02',  
    },  
    trasladoDR: [  
      {  
        BaseDR: '5842.600000',  
        ImpuestoDR: '002',  
        TipoFactorDR: 'Tasa',  
        TasaOCuotaDR: '0.160000',  
        ImporteDR: '934.816000',  
      },  
    ],  
  });  
  pago.doctoRelacionado(docRela);  
  
    
  
  const docRela2 = new Pago20Relacionado();  
  docRela2.setRelacion({  
    doc: {  
      IdDocumento: '94f4e541-bb38-4355-b779-02d337dc9720',  
      Serie: 'FA',  
      Folio: 'SI000032690',  
      MonedaDR: 'MXN',  
      EquivalenciaDR: '1',  
      NumParcialidad: '1',  
      ImpSaldoAnt: '9610.81',  
      ImpPagado: '0.59',  
      ImpSaldoInsoluto: '9610.22',  
      ObjetoImpDR: '02',  
    },  
    trasladoDR: [  
      {  
        BaseDR: '0.510000',  
        ImpuestoDR: '002',  
        TipoFactorDR: 'Tasa',  
        TasaOCuotaDR: '0.160000',  
        ImporteDR: '0.081600',  
      },  
    ],  
  });  
  pago.doctoRelacionado(docRela2);  
  
  const impuestosP = new Pago20ImpuestosP();  
  
  impuestosP.setTrasladosP({  
    BaseP: '5843.110000',  
    ImpuestoP: '002',  
    TipoFactorP: 'Tasa',  
    TasaOCuotaP: '0.160000',  
    ImporteP: '934.897600',  
  });  
  pago.setImpuestosP(impuestosP);  
  pago20.setPago(pago);  
  cfd.complemento(pago20);  
  
  await cfd.certificar(cer);  
  await cfd.sellar(key, '12345678a');  
  const xml = await cfd.getXmlCdfi();
```



```xml
  
<?xml version="1.0" encoding="UTF-8"?>  
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" xmlns:pago20="http://www.sat.gob.mx/Pagos20" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="  http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd  http://www.sat.gob.mx/Pagos20 http://www.sat.gob.mx/sitio_internet/cfd/Pagos/Pagos20.xsd"   
Version="4.0" Serie="E" Folio="ACACUN-27" Fecha="2014-07-08T12:16:50"   
Sello="GJf3GSxaoi0kHPTHHnsS1z4rqQ6JRMDglzaRzpt8N7kNjlTKfMCFj9gRJonKJaxkibmsPci6A7MkKn8p76DXVfdNC/0lTsa9QePWtM/X17S2bJXY5h0+ewnu6VguHeZicOxgiw==..."  
 FormaPago="01" NoCertificado="20001000000300022815"  
  Certificado="MIyMTFaFw0TUVYIFNBIERFIENWMSUwIwYDVQQtExxMQU4...." condicionesDePago="Contado" SubTotal="0" Descuento="645.92" Moneda="MXN" Total="17207.35" TipoDeComprobante="I" MetodoPago="PUE" LugarExpedicion="México" Exportacion="01">  
   <cfdi:Emisor Rfc="TCM970625MB1" Nombre="RECREANDO SA DE CV" RegimenFiscal="601" FacAtrAdquirente="asdasd" />  
   <cfdi:Receptor Rfc="XAXX010101000" Nombre="PUBLICO EN GENERAL" UsoCFDI="CP01" DomicilioFiscalReceptor="75700" RegimenFiscalReceptor="22" />  
   <cfdi:Conceptos />  
   <cfdi:Complemento>  
      <pago20:Pagos Version="2.0">  
         <pago20:Totales TotalTrasladosBaseIVA16="5843.11" TotalTrasladosImpuestoIVA16="934.90" TotalTrasladosBaseIVA0="0.00" MontoTotalPagos="6778.00" />  
         <pago20:Pago FechaPago="2022-09-09T17:33:38" FormaDePagoP="01" MonedaP="MXN" TipoCambioP="1" Monto="6778.00">  
            <pago20:DoctoRelacionado IdDocumento="b7c8d2bf-cb4e-4f84-af89-c68b6731206a" Serie="FA" Folio="N0000216349" MonedaDR="MXN" EquivalenciaDR="1" NumParcialidad="2" ImpSaldoAnt="6777.41" ImpPagado="6777.41" ImpSaldoInsoluto="0.00" ObjetoImpDR="02">  
               <pago20:ImpuestosDR>  
                  <pago20:TrasladosDR>  
                     <pago20:TrasladoDR BaseDR="5842.600000" ImpuestoDR="002" TipoFactorDR="Tasa" TasaOCuotaDR="0.160000" ImporteDR="934.816000" />  
                  </pago20:TrasladosDR>  
               </pago20:ImpuestosDR>  
            </pago20:DoctoRelacionado>  
            <pago20:DoctoRelacionado IdDocumento="94f4e541-bb38-4355-b779-02d337dc9720" Serie="FA" Folio="SI000032690" MonedaDR="MXN" EquivalenciaDR="1" NumParcialidad="1" ImpSaldoAnt="9610.81" ImpPagado="0.59" ImpSaldoInsoluto="9610.22" ObjetoImpDR="02">  
               <pago20:ImpuestosDR>  
                  <pago20:TrasladosDR>  
                     <pago20:TrasladoDR BaseDR="0.510000" ImpuestoDR="002" TipoFactorDR="Tasa" TasaOCuotaDR="0.160000" ImporteDR="0.081600" />  
                  </pago20:TrasladosDR>  
               </pago20:ImpuestosDR>  
            </pago20:DoctoRelacionado>  
            <pago20:ImpuestosP>  
               <pago20:TrasladosP>  
                  <pago20:TrasladoP BaseP="5843.110000" ImpuestoP="002" TipoFactorP="Tasa" TasaOCuotaP="0.160000" ImporteP="934.897600" />  
               </pago20:TrasladosP>  
            </pago20:ImpuestosP>  
         </pago20:Pago>  
      </pago20:Pagos>  
   </cfdi:Complemento>  
</cfdi:Comprobante>  
  
```



## **Pago Solo Retenciones**



```javascript
  
import { CFDI,  CFDIAttributes, Concepto, Emisor, ObjetoImpEnum, Receptor } from '@cfdi/xml';  
import { Pago20, Pago20ImpuestosP, Pago20Relacionado, Pagos20 } from '@cfdi/complementos/4.0/pago20';  
  
 const comprobanteAttribute: CFDIAttributes = {  
    Serie: 'E',  
    // eslint-disable-next-line  
    Folio: 'ACACUN-27',  
    Fecha: '2014-07-08T12:16:50',  
    Sello: '',  
    FormaPago: '01',  
    NoCertificado: '',  
    Certificado: '',  
    condicionesDePago: 'Contado',  
    SubTotal: '0',  
    Descuento: '645.92',  
    Moneda: 'MXN',  
    Total: '17207.35',  
    TipoDeComprobante: 'I',  
    MetodoPago: 'PUE',  
    LugarExpedicion: 'México',  
    Exportacion: '01',  
  };  
  
  const cfd = new CFDI(comprobanteAttribute, {  
    debug: true,  
    xslt: {  
      path: styleSheet,  
    },  
  });  
  cfd.setAttributesXml({ version: '1.0', encoding: 'utf-8' });  
  const emisor = new Emisor({  
    Rfc: 'TCM970625MB1',  
    Nombre: 'RECREANDO SA DE CV',  
    RegimenFiscal: 601,  
    FacAtrAdquirente: 'asdasd',  
  });  
  cfd.emisor(emisor);  
  
  const receptor = new Receptor({  
    Rfc: 'XAXX010101000',  
    Nombre: 'PUBLICO EN GENERAL',  
    UsoCFDI: 'CP01',  
    DomicilioFiscalReceptor: '75700',  
    RegimenFiscalReceptor: '22',  
  });  
  cfd.receptor(receptor);  
  
  const concepto = new Concepto({  
    ClaveProdServ: '84111506',  
    Cantidad: '1',  
    ClaveUnidad: 'ACT',  
    Descripcion: 'Pago',  
    ValorUnitario: '0',  
    Importe: '0',  
    ObjetoImp: ObjetoImpEnum.NoobjetoDeimpuesto,  
  });  
  cfd.concepto(concepto);  
  
  const pago20 = new Pagos20();  
  pago20.setTotales({  
    MontoTotalPagos: '100.00',  
    TotalRetencionesIVA: '16.00',  
    TotalRetencionesIEPS: '34.40',  
    TotalRetencionesISR: '35.00',  
  });  
  
  const pago = new Pago20();  
  pago.setAttribute({  
    FechaPago: '2022-06-06T00:00:00',  
    FormaDePagoP: '01',  
    MonedaP: 'MXN',  
    Monto: '100.00',  
    TipoCambioP: '1',  
  });  
  
  const docRela = new Pago20Relacionado();  
  docRela.setRelacion({  
    doc: {  
      IdDocumento: 'bfc36522-4b8e-45c4-8f14-d11b289f9eb7',  
      MonedaDR: 'MXN',  
      NumParcialidad: '1',  
      ImpSaldoAnt: '100.00',  
      ImpPagado: '100.00',  
      ImpSaldoInsoluto: '0.00',  
      ObjetoImpDR: '02',  
      EquivalenciaDR: '1',  
    },  
    retencionDR: [  
      {  
        BaseDR: '100.00',  
        ImpuestoDR: '001',  
        TipoFactorDR: 'Tasa',  
        TasaOCuotaDR: '0.000000',  
        ImporteDR: '00.00',  
      },  
      {  
        BaseDR: '100.00',  
        ImpuestoDR: '001',  
        TipoFactorDR: 'Tasa',  
        TasaOCuotaDR: '0.350000',  
        ImporteDR: '35.00',  
      },  
      {  
        BaseDR: '100.00',  
        ImpuestoDR: '002',  
        TipoFactorDR: 'Tasa',  
        TasaOCuotaDR: '0.000000',  
        ImporteDR: '0.00',  
      },  
      {  
        BaseDR: '100.00',  
        ImpuestoDR: '002',  
        TipoFactorDR: 'Tasa',  
        TasaOCuotaDR: '0.160000',  
        ImporteDR: '16.00',  
      },  
      {  
        BaseDR: '100.00',  
        ImpuestoDR: '003',  
        TipoFactorDR: 'Cuota',  
        TasaOCuotaDR: '0.000000',  
        ImporteDR: '0.00',  
      },  
      {  
        BaseDR: '100.00',  
        ImpuestoDR: '003',  
        TipoFactorDR: 'Tasa',  
        TasaOCuotaDR: '0.304000',  
        ImporteDR: '30.40',  
      },  
      {  
        BaseDR: '100.00',  
        ImpuestoDR: '003',  
        TipoFactorDR: 'Cuota',  
        TasaOCuotaDR: '0.040000',  
        ImporteDR: '4.00',  
      },  
    ],  
  });  
  pago.doctoRelacionado(docRela);  
  
  const impuestosP = new Pago20ImpuestosP();  
  
  impuestosP.setRetencionesP({  
    ImpuestoP: '001',  
    ImporteP: '35.00',  
  });  
  impuestosP.setRetencionesP({  
    ImpuestoP: '002',  
    ImporteP: '16.00',  
  });  
  impuestosP.setRetencionesP({  
    ImpuestoP: '003',  
    ImporteP: '34.40',  
  });  
  
  pago.setImpuestosP(impuestosP);  
  pago20.setPago(pago);  
  cfd.complemento(pago20);  
  
  await cfd.certificar(cer);  
  await cfd.sellar(key, '12345678a');  
  const xml = await cfd.getXmlCdfi();
```



```xml
<?xml version="1.0" encoding="utf-8"?>  
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="  http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd  http://www.sat.gob.mx/Pagos20 http://www.sat.gob.mx/sitio_internet/cfd/Pagos/Pagos20.xsd" Version="4.0" Serie="E" Folio="ACACUN-27" Fecha="2014-07-08T12:16:50"   
Sello="IO6CqIBeiUR9gb2ZR7FsZQ+yfduO4RaiVT0EeezOW..." FormaPago="01" NoCertificado="20001000000300022815"   
Certificado="MIIFxTCCA62gAwIBAgIUMjAwMDEwMDAwMDAzMDAwMjI4MTUw..." condicionesDePago="Contado" SubTotal="0" Descuento="645.92" Moneda="MXN" Total="17207.35" TipoDeComprobante="I" MetodoPago="PUE" LugarExpedicion="México" Exportacion="01" xmlns:pago20="http://www.sat.gob.mx/Pagos20">  
    <cfdi:Emisor Rfc="TCM970625MB1" Nombre="RECREANDO SA DE CV" RegimenFiscal="601" FacAtrAdquirente="asdasd"/>  
    <cfdi:Receptor Rfc="XAXX010101000" Nombre="PUBLICO EN GENERAL" UsoCFDI="CP01" DomicilioFiscalReceptor="75700" RegimenFiscalReceptor="22"/>  
    <cfdi:Conceptos>  
        <cfdi:Concepto ClaveProdServ="84111506" Cantidad="1" ClaveUnidad="ACT" Descripcion="Pago" ValorUnitario="0" Importe="0" ObjetoImp="01"/>  
    </cfdi:Conceptos>  
    <cfdi:Complemento>  
        <pago20:Pagos Version="2.0">  
            <pago20:Totales MontoTotalPagos="100.00" TotalRetencionesIVA="16.00" TotalRetencionesIEPS="34.40" TotalRetencionesISR="35.00"/>  
            <pago20:Pago FechaPago="2022-06-06T00:00:00" FormaDePagoP="01" MonedaP="MXN" Monto="100.00" TipoCambioP="1">  
                <pago20:DoctoRelacionado IdDocumento="bfc36522-4b8e-45c4-8f14-d11b289f9eb7" MonedaDR="MXN" NumParcialidad="1" ImpSaldoAnt="100.00" ImpPagado="100.00" ImpSaldoInsoluto="0.00" ObjetoImpDR="02" EquivalenciaDR="1">  
                    <pago20:ImpuestosDR>  
                        <pago20:RetencionesDR>  
                            <pago20:RetencionDR BaseDR="100.00" ImpuestoDR="001" TipoFactorDR="Tasa" TasaOCuotaDR="0.000000" ImporteDR="00.00"/>  
                            <pago20:RetencionDR BaseDR="100.00" ImpuestoDR="001" TipoFactorDR="Tasa" TasaOCuotaDR="0.350000" ImporteDR="35.00"/>  
                            <pago20:RetencionDR BaseDR="100.00" ImpuestoDR="002" TipoFactorDR="Tasa" TasaOCuotaDR="0.000000" ImporteDR="0.00"/>  
                            <pago20:RetencionDR BaseDR="100.00" ImpuestoDR="002" TipoFactorDR="Tasa" TasaOCuotaDR="0.160000" ImporteDR="16.00"/>  
                            <pago20:RetencionDR BaseDR="100.00" ImpuestoDR="003" TipoFactorDR="Cuota" TasaOCuotaDR="0.000000" ImporteDR="0.00"/>  
                            <pago20:RetencionDR BaseDR="100.00" ImpuestoDR="003" TipoFactorDR="Tasa" TasaOCuotaDR="0.304000" ImporteDR="30.40"/>  
                            <pago20:RetencionDR BaseDR="100.00" ImpuestoDR="003" TipoFactorDR="Cuota" TasaOCuotaDR="0.040000" ImporteDR="4.00"/>  
                        </pago20:RetencionesDR>  
                    </pago20:ImpuestosDR>  
                </pago20:DoctoRelacionado>  
                <pago20:ImpuestosP>  
                    <pago20:RetencionesP>  
                        <pago20:RetencionP ImpuestoP="001" ImporteP="35.00"/>  
                        <pago20:RetencionP ImpuestoP="002" ImporteP="16.00"/>  
                        <pago20:RetencionP ImpuestoP="003" ImporteP="34.40"/>  
                    </pago20:RetencionesP>  
                </pago20:ImpuestosP>  
            </pago20:Pago>  
        </pago20:Pagos>  
    </cfdi:Complemento>  
</cfdi:Comprobante>
```
