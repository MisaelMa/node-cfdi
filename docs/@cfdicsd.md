# Certificados de sellos digital

# CSD

Certificados de Sello Digital

Instalacion

```bash
npm i @cfdi/csd --save
```

## cer

```typescript
import { cer } from '@cfdi/csd';  
// .cer || .pem  
const fileCer = '/home/dev/LAN7008173R5.pem'  
cer.setFile(fil);  
// all data  
cer.getData(),  
cer.version()  
cer.serial()  
cer.getNoCer()  
cer.pubkey({ begin: true })  
cer.issuer()  
cer.subject()  
cer.date()  
// module  
cer.modulu();  
// subjectHash  
cer.subjectHash();  
// issuerHash  
cer.issuerHash();  
// ocspid  
cer.ocspid();  
// hash:  
cer.hash();  
// subjectHashOld  
cer.subjectHashOld();  
// issuerHashOld  
cer.issuerHashOld();
```

## Key

```javascript
import { cer, key } from '@cfdi/csd';  
// .key || .pem  
const fileCer = '/home/dev/LAN7008173R5.key.pem';  
key.setFile(filkey, '12345678a');  
  
// all data key  
key.getData()  
  
// genera firma con node forge  
key.signatureHexForge('texto a firmar')  
// genera firma con cripto js   
key.signatureHexCripto('texto a firmar')
```
