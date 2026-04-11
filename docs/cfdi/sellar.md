# Sellar Xml

# Sellar Xml CFDI 4.0

La funcion certificar extra la informacion del cer y decodifica el numero del certificado y las anexa en la propiesades del xml para poder ser sellada. La funcion sellar anexa un sello unico en base a todo el xml y la key



```javascript
 import { CFDI } from '@cfdi/xml';  
 //const key = 'CSD_Pruebas_CFDI_TCM970625MB1.key';  
 //const cer = 'CSD_Pruebas_CFDI_TCM970625MB1.cer';  
 const key = 'CSD_Pruebas_CFDI_TCM970625MB1.key.pem';  
 const cer = 'CSD_Pruebas_CFDI_TCM970625MB1.cer.pem';  
 const cfd = new CFDI();  
 await cfd.certificar(cer);  
 await cfd.sellar(key, '12345678a');  
 const xml = await cfd.getXmlCdfi();  
    
```



```javascript
<?xml version="1.0" encoding="utf-8"?>  
<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
                  xmlns:cfdi="http://www.sat.gob.mx/cfd/3"  
                  xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd"  
                  Version="4.0"  
                  Serie=""  
                  Folio=""  
                  Fecha=""  
                  Sello="Vj/X/ZUWxL6DJOEXflMAVwfotRU5uZ4....."  
                  FormaPago=""  
                  NoCertificado="20001000000300022762"  
                  Certificado="MIIF8DCCA9igAwIBAgIUMjAwMDEwMDAwMDAzMDAwMjI3NjIwDQ....."  
                  condicionesDePago=""  
                  SubTotal=""  
                  Descuento=""  
                  Moneda=""  
                  Total=""  
                  TipoDeComprobante=""  
                  MetodoPago=""  
                  LugarExpedicion="">  
    
```

# Saxon



> este depende de saxon, es necesario instalar lo  [https://cfdi.recreando.dev/es/getting-started/installation#Saxon](https://cfdi.recreando.dev/es/getting-started/installation#Saxon)



si deseas hacer el sello de un xml sin ocupar la libreria puedes usar   


```bash
npm i @signati/saxon --save  
npm i @cfdi/csd --save
```



```javascript
  
import { Transform, saxon } from '@signati/saxon';  
import { key } from '@cfdi/csd';  
  
const xmlPath = '/home/dev/app/cfdi.xml'  
const xslt = '/home/dev/app/v4/cadenaOriginal.xslt'  
const filkey = '/home/dev/app/csd/LAN7008173R5.key.pem';  
  
// si estas ocupando la extension .pem no necesitas pasar la contraña  
  
key.setFile(filkey, '12345678a');  
  
const transform = new Transform();  
const cadenaOriginal = transform.s(xmlPath).xsl(xslt).warnings('silent').run();  
  
// console.log(cadenaOriginal)  
//cadena original => ||4.0|E|ACACUN-27|2014-07-08T12:16:50|01|20001000000300022815|16148.04|645.92|MXN|17207.35  
//|I|01|PUE|México|1|1|2|01|asdasd-3234-asdasd-2332-asdas|asdasd-3234-asdasd-2332-asdas|TCM970625MB1|  
//FACTURACION MODERNA SA DE CV|601|asdasd|XAXX010101000|PUBLICO EN GENERAL|112|22|G01|001|1212|2|pieza|Pieza|  
//audifonos|1000|2000|00.0|01|369.83|002|Tasa|0.16|59.17|369.8aaaa3|002|Tasa|0.16|59.17|369.83|002|  
//Tasa|0.16|59.17|21 47 3807 8003832|000121231|51241200|IM020|1|PIEZA|25311FM00114  
//CREMA FUNGICIDA 35ML (ACIDO UNDECILENICO, ARBOL DEL TE VEHICULO EMOLIENTE)  
//|172.50|172.50|001|1212|2|pieza|Pieza|audifonos|1000|2000|00.0|01|  
// JUFA7608212V6|ADRIANA JUAREZ FERNANDEZ|601|29133|002|59.17|1000|1|002|Tasa|0.16|59.17||  
  
const sello = key.signatureHexForge(cadenaOriginal);  
  
```

la varible sello lo debes colocar en el atributo Sello dell xml 



          ![](https://ik.imagekit.io/gky5zgkgy/article/amir_hmcf-WndU)
