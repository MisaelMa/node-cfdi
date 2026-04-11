# Receptor 

# Receptor

```javascript
  
import { CFDI, Receptor } from '@cfdi/xml';  
  
const cfd = new CFDI();  
const receptor = new Receptor({  
     Rfc: 'XAXX010101000',  
     Nombre: 'PUBLICO EN GENERAL',  
     UsoCFDI: 'G01',  
     DomicilioFiscalReceptor: '112',  
     RegimenFiscalReceptor: '22'  
});  
  
await cfd.receptor(receptor);
```



```xml
  
<?xml version="1.0" encoding="UTF-8"?>  
<cfdi:Receptor Rfc="XAXX010101000" Nombre="PUBLICO EN GENERAL" UsoCFDI="G01" DomicilioFiscalReceptor="112" RegimenFiscalReceptor="22"/>
```
