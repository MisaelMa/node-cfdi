# Relacionados

# Relacionado

```typescript
  
import { CFDI, Relacionado } from '@cfdi/xml';  
const cfd = new CFDI();  
  
const relation = new Relacionado({ TipoRelacion: '01' });  
relation.addRelation('4A1B43E2-1183-4AD4-A3DE-C2DA787AE56A');  
relation.addRelation('4A1B43E2-1183-4AD4-A3DE-C2DA787AE56A');  
await cfd.relacionados(relation);
```



```xml
<?xml version="1.0" encoding="UTF-8"?>  
<cfdi:CfdiRelacionados TipoRelacion="01">  
  <cfdi:CfdiRelacionado UUID="4A1B43E2-1183-4AD4-A3DE-C2DA787AE56A"/>  
  <cfdi:CfdiRelacionado UUID="4A1B43E2-1183-4AD4-A3DE-C2DA787AE56A"/>  
</cfdi:CfdiRelacionados>
```

We are working on a new features coming soon.
