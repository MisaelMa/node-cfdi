# Complemento INE

# Ine



```typescript
import { Ine } from '@cfdi/complementos/4.0/ine';  
const ine11 = new Ine({  
   Version: '1.1',  
   TipoProceso: 'Ordinario',  
   TipoComite: 'Ejecutivo Nacional',  
});  
  
ine11.Entidad({ ClaveEntidad: 'AGU', Ambito: 'Local' });  
ine11.Contabilidad({ IdContabilidad: '1' });  
cfdi.complemento(ine11);  
  
```



```xml
<cfdi:Complemento>  
 <ine:INE Version="1.1" TipoProceso="Ordinario" TipoComite="Ejecutivo Nacional">  
   <ine:Entidad ClaveEntidad="AGU" Ambito="Local">  
     <ine:Contabilidad IdContabilidad="1"/>  
   </ine:Entidad>  
 </ine:INE>  
</cfdi:Complemento>
```
