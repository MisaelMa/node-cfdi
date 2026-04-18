# Informacion Oficial

Recursos oficiales del SAT que respaldan la implementacion de `@cfdi/*`.

## 1. Anexo 20 (pagina oficial)

El Anexo 20 es la especificacion tecnica oficial del CFDI. A partir del 1 de enero de 2022 se actualizo a la **version 4.0** y desde el 1 de abril de 2023 es la unica version valida.

- Portal SAT: [Formato de Factura (Anexo 20)](https://www.sat.gob.mx/consultas/35025/formato-de-factura-electronica-\(anexo-20\))
- Guia de llenado CFDI 4.0 (PDF): [Anexo_20_Guia_de_llenado_CFDI.pdf](http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/Anexo_20_Guia_de_llenado_CFDI.pdf)
- Guia de llenado CFDI Global 4.0 (PDF): [Guia_llenado_CFDI_global.pdf](http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/Guia_llenado_CFDI_global.pdf)
- Guia de llenado Complemento de Pagos 4.0 (PDF): [Guia_llenado_pagos.pdf](http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/Guia_llenado_pagos.pdf)
- Preguntas y respuestas sobre Anexo 20 v4.0 (PDF): [PregFrecCFDIVer4_0.pdf](http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/PregFrecCFDIVer4_0.pdf)

## 2. Certificados de prueba

Para desarrollo y pruebas se usa la aplicacion **Certifica** (genera los archivos `.sdg` y `.key` de requerimiento) y **CertiSAT Web** para el envio de la solicitud y la descarga del `.cer`.

- Aplicacion Certifica: [Genera y descarga tus archivos a traves de Certifica](https://www.sat.gob.mx/aplicacion/16660/genera-y-descarga-tus-archivos-a-traves-de-la-aplicacion-certifica)
- CertiSAT Web: [Ingresa a CertiSAT Web](https://www.sat.gob.mx/tramites/43964/ingresa-a-certisat-web)
- Solicitud de CSD para emitir facturas: [Tramite 17507](https://www.sat.gob.mx/tramites/17507/envia-la-solicitud-para-tu-certificado-de-sello-digital-para-emitir-facturas-electronicas)
- Descarga directa del certificado de e.firma: [Aplicacion 44275](https://www.sat.gob.mx/aplicacion/44275/descarga-de-manera-directa-tu-certificado-de-e.firma)

> Nota: los `.cer` y `.key` de prueba que vienen en `packages/files/` de este repositorio son archivos publicos del SAT para pruebas, OK para usar en tests.

## 3. Catalogo de productos y servicios (`c_ClaveProdServ`)

La identificacion de la clave en el catalogo `c_ClaveProdServ` es responsabilidad del emisor, ya que conoce las caracteristicas del producto o servicio amparado.

- Portal SAT: [Catalogo de Productos y Servicios](https://www.sat.gob.mx/consultas/53693/catalogo-de-productos-y-servicios)
- Archivo descargable (XLS): [Catalogo_de_Productos.xls](http://m.sat.gob.mx/cifras_sat/Paginas/archivos/Catalogo_de_Productos.xls)
- Catalogo de Claves de Productos y Servicios (enero 2024): [descarga](https://wwwmat.sat.gob.mx/cs/Satellite?blobcol=urldata&blobkey=id&blobtable=MungoBlobs&blobwhere=1461176256875&ssbinary=true)
- Sugerencias de claves de productos y servicios (PDF): [SugerenciasVF.pdf](http://pys.sat.gob.mx/PyS/SugerenciasVF.pdf)

## 4. Catalogo de unidades de medida (`c_ClaveUnidad`)

- Portal SAT: [Catalogo de unidades de medida](http://pys.sat.gob.mx/PyS/catUnidades.aspx)

## 5. Complementos y complementos concepto

Los complementos permiten integrar informacion adicional regulada por la autoridad para un sector o actividad especifica. La informacion adicional queda protegida por el sello digital del comprobante.

- Portal SAT (minisitio): [Complementos de factura](https://www.sat.gob.mx/minisitio/Factura/emite_complementosdefactura.htm)
- Consulta de complementos y complementos concepto: [Consulta 49522](https://www.sat.gob.mx/consultas/49522/complementos-y-complementos-concepto-de-factura-)
- Portal de tramites: [Complementos](https://www.sat.gob.mx/portal/public/tramites/complementos-de-factura)
- Catalogos para emision de CFDI con complemento de Comercio Exterior: [omawww.sat.gob.mx/...](http://omawww.sat.gob.mx/tramitesyservicios/Paginas/catalogos_emision_cfdi_complemento_ce.htm)

## 6. Lista de complementos (PDF)

El SAT publica la relacion de complementos vigentes (TFD, Pagos, Nomina, Comercio Exterior, Donatarias, Leyendas Fiscales, INE, Notarios Publicos, Vehiculo Usado, etc.) en el minisitio de factura:

- [Minisitio de Factura — Complementos](https://www.sat.gob.mx/minisitio/Factura/emite_complementosdefactura.htm)
- [Complementos de Factura (omawww)](http://omawww.sat.gob.mx/informacion_fiscal/factura_electronica/Paginas/complementos_factura_cfdi.aspx)
