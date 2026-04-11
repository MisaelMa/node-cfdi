# Impuestos

# Impuestos

```typescript
import { CFDI, EmisImpuestosor } from '@cfdi/xml';  
const cfd = new CFDI();  
const impuesto = new Impuestos({TotalImpuestosRetenidos: ''});  
            impuesto.traslados({  
                Impuesto: '',  
                TipoFactor: '',  
                TasaOCuota: '',  
                Importe: '',  
            });  
            impuesto.retenciones({  
                Impuesto: '',  
                TipoFactor: '',  
                TasaOCuota: '',  
                Importe: '',  
            });  
await cfd.impuesto(impuesto);
```



```javascript
<?xml version="1.0" encoding="UTF-8"?>  
  <cfdi:Impuestos TotalImpuestosRetenidos="" TotalImpuestosTrasladados="">  
    <cfdi:Retenciones>  
      <cfdi:Retencion Impuesto="" Importe=""/>  
    </cfdi:Retenciones>  
    <cfdi:Traslados>  
      <cfdi:Traslado Impuesto="" TipoFactor="" TasaOCuota="" Importe=""/>  
    </cfdi:Traslados>  
  </cfdi:Impuestos>
```
