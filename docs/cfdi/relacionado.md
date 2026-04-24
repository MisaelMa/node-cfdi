# Relacionados

# Relacionado

```typescript
import { CFDI, Relacionado } from '@cfdi/xml';
const cfd = new CFDI();

const relation = new Relacionado({ TipoRelacion: '01' });
relation.addRelation('4A1B43E2-1183-4AD4-A3DE-C2DA787AE56A');
relation.addRelation('5B2C54F3-2294-5BE5-B4EF-D3EB898BF57B');
cfd.relacionados(relation);
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<cfdi:CfdiRelacionados TipoRelacion="01">
  <cfdi:CfdiRelacionado UUID="4A1B43E2-1183-4AD4-A3DE-C2DA787AE56A"/>
  <cfdi:CfdiRelacionado UUID="5B2C54F3-2294-5BE5-B4EF-D3EB898BF57B"/>
</cfdi:CfdiRelacionados>
```

## Tipos de relacion

| Clave | Descripcion |
|-------|-------------|
| 01 | Nota de credito |
| 02 | Nota de debito |
| 03 | Devolucion de mercancia |
| 04 | Sustitucion de CFDI previos |
| 05 | Traslados de mercancia facturados previamente |
| 06 | Factura por traslados previos |
| 07 | Aplicacion de anticipo |
| 08 | Pagos en parcialidades |
| 09 | Pagos diferidos |
