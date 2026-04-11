# Conceptos

# Concepto

```typescript
    import { CFDI, Concepto } from '@cfdi/xml';  
  
    const cfd = new CFDI();  
    const concepto = new Concepto({  
                ClaveProdServ: '001',  
                NoIdentificacion: '1212',  
                Cantidad: '2',  
                ClaveUnidad: 'pieza',  
                Unidad: 'Pieza',  
                Descripcion: 'audifonos',  
                ValorUnitario: '1000',  
                Importe: '2000',  
                Descuento: '00.0',  
                ObjetoImp: '01'  
            });  
            concepto.predial('000121231')  
            concepto.aduana('21  47  3807  8003832')  
            concepto.parte({  
                ClaveProdServ: '51241200',  
                NoIdentificacion: 'IM020',  
                Cantidad: 1,  
                Unidad: 'PIEZA',  
                Descripcion: '',  
                ValorUnitario: '172.50',  
                Importe: '172.50'  
            })  
            concepto.traslado({  
                Base: '369.83',  
                Impuesto: '002',  
                TipoFactor: 'Tasa',  
                TasaOCuota: '0.16',  
                Importe: '59.17',  
            });  
            concepto.traslado({  
                Base: '369.8aaaa3',  
                Impuesto: '002',  
                TipoFactor: 'Tasa',  
                TasaOCuota: '0.16',  
                Importe: '59.17',  
            });  
  
            concepto.retencion({  
                Base: '369.83',  
                Impuesto: '002',  
                TipoFactor: 'Tasa',  
                TasaOCuota: '0.16',  
                Importe: '59.17',  
            });  
  
    await cfd.concepto(concepto);  
    
```

```xml
  
<?xml version="1.0" encoding="UTF-8"?>  
 <cfdi:Conceptos>  
    <cfdi:Concepto ClaveProdServ="" NoIdentificacion="" Cantidad="" ClaveUnidad="" Unidad="" Descripcion="" ValorUnitario="" Importe="" Descuento="">  
      <cfdi:Impuestos>  
        <cfdi:Traslados>  
          <cfdi:Traslado Base="" Impuesto="" TipoFactor="" TasaOCuota="" Importe=""/>  
        </cfdi:Traslados>  
        <cfdi:Retenciones>  
          <cfdi:Retencion Base="" Impuesto="" TipoFactor="" TasaOCuota="" Importe=""/>  
        </cfdi:Retenciones>  
      </cfdi:Impuestos>  
    </cfdi:Concepto>  
  </cfdi:Conceptos>  
      
```

## Complemento 

### IEDU

```javascript
  
import { CFDI, Concepto,  } from '@cfdi/xml';  
import { Iedu,XmlIeduAttribute } from '@cfdi/complementos';  
const cfd = new CFDI();  
const concepto = new Concepto({ ...});  
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
  
    await cfd.concepto(concepto);
```



```xml
  
<?xml version="1.0" encoding="UTF-8"?>  
<cfdi:Conceptos>  
    <cfdi:Concepto ClaveProdServ="" NoIdentificacion="" Cantidad="" ClaveUnidad="" Unidad="" Descripcion="" ValorUnitario="" Importe="" Descuento="">  
        <cfdi:ComplementoConcepto>  
            <iedu:instEducativas version="1.0" nombreAlumno="ejemplo garcia correa" CURP="EJEMPLOGH101004HQRRRN" nivelEducativo="Primaria" autRVOE="201587PRIM" rfcPago="XAXX010101000"/>  
        </cfdi:ComplementoConcepto>  
    </cfdi:Concepto>  
</cfdi:Conceptos>  
    
```
