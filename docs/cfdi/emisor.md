# Emisor

# Emisor

```typescript
import { CFDI, Emisor } from '@cfdi/xml';  
  
const cfd = new CFDI();  
const emisor = new Emisor({  
   Rfc: '',  
   Nombre: '',  
   RegimenFiscal: 601  
});  
await cfd.emisor(emisor);
```



```xml
 <?xml version="1.0" encoding="UTF-8"?>  
 <cfdi:Emisor Rfc="" Nombre="" RegimenFiscal="601"/>    
```
