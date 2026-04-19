# Receptor 

# Receptor

```typescript
import { CFDI, Receptor } from '@cfdi/xml';

const cfd = new CFDI();
const receptor = new Receptor({
     Rfc: 'XAXX010101000',
     Nombre: 'PUBLICO EN GENERAL',
     UsoCFDI: 'G01',
     DomicilioFiscalReceptor: '45610',
     RegimenFiscalReceptor: '616',
});

cfd.receptor(receptor);
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Receptor Rfc="XAXX010101000" Nombre="PUBLICO EN GENERAL" UsoCFDI="G01" DomicilioFiscalReceptor="45610" RegimenFiscalReceptor="616"/>
```

## Metodos disponibles

```typescript
// Setters individuales
receptor.setRFC('XAXX010101000');
receptor.setNombre('PUBLICO EN GENERAL');
receptor.setUsoCFDI('G01');
receptor.setDomicilioFiscalReceptor('45610');
receptor.setRegimenFiscalReceptor('616');
receptor.setResidenciaFiscal('');     // opcional, para extranjeros
receptor.setNumRegIdTrib('');         // opcional, para extranjeros

// Obtener JSON
receptor.toJson(); // retorna { _attributes: { Rfc, Nombre, UsoCFDI, ... } }
```
