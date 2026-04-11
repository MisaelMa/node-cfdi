# Empezando

# Recreando + CFDI

Este paquete genera el xml del cfdi, la contribucion fue con platicas para mejoras y exposicion de  funciones internas, gracias a esto se planteo realizar mas paquetes para ayudar a las integraciones de factura de terceros.  
  
Por lo cual se crearon lo siguientes paquetes, algunos estan en proceso de desarollo para  llegar a ser estables.- [x] [`@cfdi/xml`](https://www.npmjs.com/package/@cfdi/xml)
- [x] `@cfdi/xsd`
- [x] `@cfdi/schema`
- [x] [`@cfdi/complementos`](https://www.npmjs.com/package/@cfdi/complementos)
- [x] [`@cfdi/catalogos`](https://)
- [x] [`@cfdi/csd`](https://www.npmjs.com/package/@cfdi/csd)
- [x] `@cfdi/csf`
- [x] [`@cfdi/utils`](https://)
- [x] `@cfdi/2json`
- [ ] `@cfdi/transform`
- [x] `@cfdi/types`
- [x] `@cfdi/elements`
- [ ] @cfdi/expresiones
14. @cfdi/pdf
15. @cfdi/curp
16. @cfdi/rfc

Los cambios que se realizaron al paquete fueron muy pocos y no se realizaran muchos cambios al codigo que ya  tenia de [`@signati/core`](https://www.npmjs.com/package/@signati/core).  
El Nombre del paquete principal cambio mas al contexto de que se trabaja pasando de [`@signati/core`](https://www.npmjs.com/package/@signati/core) a [`@cfdi/xml`](https://www.npmjs.com/package/@cfdi/xml).```bash
npm i @cfdi/xml --save
```

otro de los cambios que si afectan si esta usando TypeScript es el renombreado de la interface `Comprobante` a `CFDIAttributes`  
![](https://ik.imagekit.io/gky5zgkgy/article/amir_afBB7bJgCZ)

## Soporte a extension **`.pem`**

otras de la novedades que se encuentra es la integracion del paquete [`@cfdi/csd`](https://www.npmjs.com/package/@cfdi/csd). que nos permite la obtencion de datos de los certitificados de sellos digital (**`CSD`**), con esta adiccion a la lista ya se puede ocupar las extenciones `pem`  
para poder generar los sellos del xml o obtecion del numero del certificado.  
```typescript
const key = `/home/dev/certificados/LAN7008173R5.key`;  
const cer = `/home/dev/certificados/LAN7008173R5.cer`;
```

o```typescript
const key = `/home/dev/certificados/LAN7008173R5.pem`;  
const cer = `/home/dev/certificados/LAN7008173R5.pem`;
```

## Cadena Original 4.0

El ultimo cambio echo fue el siguiente. link del archivo [cadenaoriginal.xslt](https://github.com/MisaelMa/cfdi/releases/download/4.0.2/4.0.zip)```typescript
import path from 'path';  
const files_path = path.resolve(__dirname, '..', '..', '..', '..', 'files');  
const xslt_path = files_path + '/4.0/cadenaoriginal.xslt';  
  
//@cfdi/xml  
const cfd = new CFDI(comprobanteAttribute, {  
      debug: false,  
      xslt: {   
          path: xslt_path   
     },  
});
```
