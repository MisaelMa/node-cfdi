# Emisor

# Emisor

```typescript
import { CFDI, Emisor } from '@cfdi/xml';

const cfd = new CFDI();
const emisor = new Emisor({
   Rfc: 'EKU9003173C9',
   Nombre: 'ESCUELA KEMPER URGATE',
   RegimenFiscal: '601',
   FacAtrAdquirente: '', // opcional
});
cfd.emisor(emisor);
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Emisor Rfc="EKU9003173C9" Nombre="ESCUELA KEMPER URGATE" RegimenFiscal="601"/>
```

## Metodos disponibles

```typescript
// Setters individuales
emisor.setRfc('EKU9003173C9');
emisor.setNombre('ESCUELA KEMPER URGATE');
emisor.setRegimenFiscal('601');
emisor.setFacAtrAdquirente('0001'); // opcional

// Obtener JSON
emisor.toJson(); // retorna { _attributes: { Rfc, Nombre, RegimenFiscal } }
```
