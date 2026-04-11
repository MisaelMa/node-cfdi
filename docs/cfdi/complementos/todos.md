# Complementos

# Complementos



```bash
npm i @cfdi/complementos --save
```



## INE 

```typescript
  
import {Destruccion} from '@cfdi/complementos'  
const destruccion = new Destruccion({ Version: '1.0', NumFolDesVeh: '0221', Serie: '012' });  
destruccion.InformacionAduanera({ Aduana: 'ADUANA', Fecha: '129283', NumPedImp: 'ASAS' });  
destruccion.VehiculoDestruido({  
      Año: '2019',  
      Marca: 'Nissan',  
      Modelo: 'ASAD',  
      TipooClase: 'ASDSA',  
      NumFolTarjCir: 'ASSA',  
      NumPlacas: 'QRR0',  
});  
this.cfd.complemento(destruccion)  
        
```



```xml
  
<?xml version="1.0" encoding="UTF-8"?>  
  
<cfdi:Complemento>  
 <destruccion:certificadodedestruccion Version="1.0" NumFolDesVeh="0221" Serie="012">  
  <destruccion:InformacionAduanera Aduana="ADUANA" Fecha="129283" NumPedImp="ASAS"/>  
  <destruccion:VehiculoDestruido Año="2019" Marca="Nissan" Modelo="ASAD" TipooClase="ASDSA" NumFolTarjCir="ASSA" NumPlacas="QRR0"/>  
 </destruccion:certificadodedestruccion>  
</cfdi:Complemento
```

## PAGO10(Deprecated)

En la version `CFDI 4.0` se ocupa el [pago 2.0](https://cfdi.recreando.dev/es/complemento/pago-2-0)

```javascript
import {Pago10} from '@cfdi/complementos'  
const pago = new Pago10({  
      Version: '1.0',  
    });  
    const docRela = new Pago10Relacionado();  
    docRela.relacion({  
      IdDocumento: 'hasd',  
      MonedaDR: 'MMX',  
      MetodoDePagoDR: 'PUE',  
    });  
    docRela.relacion({  
      IdDocumento: 'hasd',  
      MonedaDR: 'MMX',  
      MetodoDePagoDR: 'PUE',  
    });  
    const impuesto = new Pago10Impuestos({  
      TotalImpuestosRetenidos: '12',  
      TotalImpuestosTrasladados: '234z ',  
    });  
    impuesto.traslados({  
      Importe: '100',  
      Impuesto: '1201',  
      TasaOCuota: '123',  
      TipoFactor: '%',  
    });  
    impuesto.retenciones({ Importe: '10', Impuesto: '10' });  
    const impuesto2 = new Pago10Impuestos({  
      TotalImpuestosRetenidos: '12',  
      TotalImpuestosTrasladados: '234z ',  
    });  
    impuesto2.traslados({  
      Importe: '100',  
      Impuesto: '1201',  
      TasaOCuota: '123',  
      TipoFactor: '%',  
    });  
    impuesto2.retenciones({ Importe: '10', Impuesto: '10' });  
    pago.pago({  
      data: {  
        FechaPago: '2019-11-27T00:00:00',  
        FormaDePagoP: '03',  
        MonedaP: 'MXN',  
        Monto: '5220.00',  
        NumOperacion: '1',  
        RfcEmisorCtaOrd: 'SEQ920520ME3',  
        NomBancoOrdExt: 'BBVA Bancomer',  
        RfcEmisorCtaBen: 'WSI1503194J6',  
        CtaBeneficiario: '0101255614',  
      },  
      relacionado: docRela.getRelations(),  
      impuestos: [impuesto.getImpuesto(), impuesto2.getImpuesto()],  
    });  
  
    this.cfd.complemento(pago);
```
