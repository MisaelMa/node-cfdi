# A cerca de las facturas

# Acerca Dé

# **¿Qué es un CFDI?**

El CFDI, o Comprobante Fiscal Digital por Internet, es un documento electrónico con validez legal que actúa como prueba de transacciones en México, y es más que una simple factura electrónica. La versión vigente, CFDI 4.0, comenzó el 1 de enero de 2022, conviviendo por un año y trimestre con la versión anterior (3.3) para facilitar la adaptación de los contribuyentes a los cambios fiscales. Desde el 1 de abril de 2023, el uso de la versión 4.0 es obligatorio, salvo para los Comprobantes de Nómina, cuya actualización a esta versión fue obligatoria a partir del 1 de julio de 2023.### Elementos del CFDI 4.0

El Comprobante Fiscal Digital por Internet (CFDI) incluye elementos esenciales para su validez fiscal en México. Debe contener información del emisor y receptor, como nombres, direcciones fiscales y números de registro tributario, así como una descripción detallada de los bienes o servicios, incluyendo cantidad, unidad de medida, precio unitario y monto total. También se requieren el monto total de la transacción, impuestos aplicables (como el IVA), forma de pago, método de recepción, un sello digital y un número de folio para garantizar su autenticidad.### Características del Comprobante Fiscal

Para que un CFDI sea válido, debe:1. Cumplir con las especificaciones del Servicio de Administración Tributaria (SAT).
2. Generarse, transmitirse y resguardarse electrónicamente.
3. Ser timbrado por un Proveedor Autorizado de Certificación (PAC).

### Tipos de CFDI en México

Existen diversas clases de CFDI, tales como:1. **Tipo “I”**: Comprobantes de ingreso (facturas, recibos de honorarios, arrendamiento).
2. **Tipo “E”**: Notas de crédito.
3. **Tipo “T”**: CFDI de traslado para validar la posesión de mercancías.
4. **Tipo “N”**: Comprobantes de nómina para sueldos y salarios.
5. **Tipo “P”**: Complementos de pago.

### Para qué sirve el Comprobante Fiscal Digital por Internet

Los CFDI tienen varios propósitos, entre ellos:1. Validar operaciones comerciales entre proveedor y cliente.
2. Establecer compromisos entre contribuyentes.
3. Comprobar ingresos y egresos de personas físicas y morales.
4. Servir de base para la declaración de impuestos.

### Ventajas del CFDI

Las facturaciones electrónicas ofrecen múltiples ventajas, tales como:1. Garantizar la legalidad del emisor, asegurando que el vendedor esté constituido como empresa o persona física con actividad empresarial.
2. Vincular la identidad de un contribuyente con su Certificado de Sello Digital (CSD) para prevenir la defraudación fiscal.
3. Permitir el reembolso de impuestos a los contribuyentes.

# **¿Qué necesitamos para generar un xml y ser validado por el PAC?**

1. Anexo 20
2. Datos del comprobante  
* Sello  
* NoCertificado  
* Certificado
3. Datos Emisor
4. Datos Receptor
5. Datos Conceptos
6. Datos de los Impuestos

## Anexo 20

[SAT](http://omawww.sat.gob.mx/tramitesyservicios/Paginas/anexo_20.htm)## Datos del comprobante

```javascript
 FormaPago: '01',  
 Serie: 'RC',  
 Folio: '123456',  
 Fecha: '2024-04-29T00:00:00',  
 MetodoPago: 'PUE',  
 Sello: '',  
 NoCertificado: '',  
 Certificado: '',  
 CondicionesDePago: 'Contado',  
 SubTotal: '10.00',  
 Descuento: '0.00',  
 Moneda: 'MXN',  
 Total: '10.00',  
 TipoDeComprobante: 'I',  
 Exportacion: '01',  
 LugarExpedicion: '45610',
```

## Datos Emisor

```javascript
Rfc: 'EKU9003173C9',  
Nombre: 'ESCUELA KEMPER URGATE',  
RegimenFiscal: '603',
```

## Datos Receptor 

```javascript
 Rfc: 'XAXX010101000',  
 Nombre: 'CLIENTE',  
 DomicilioFiscalReceptor: '45610',  
 RegimenFiscalReceptor: '616',  
 UsoCFDI: UseCFDI
```

## Datos Conceptos e Impuestos

```javascript
 ClaveProdServ: '50211503',  
 NoIdentificacion: 'None',  
 Cantidad: '1.0',  
 ClaveUnidad: 'H87',  
 Unidad: 'Pieza',  
 Descripcion: 'Cigarros',  
 ValorUnitario: '10.00',  
 Importe: '10.00',  
 Descuento: '0.00',  
 ObjetoImp: ObjetoImpEnum  
  
// Retencion  
 Base: '1',  
 Importe: '1',  
 Impuesto: '002',  
 TasaOCuota: '0.160000',  
 TipoFactor: 'Tasa',  
  
// Traslados  
  
 Base: '1.00',  
 Importe: '1.00',  
 Impuesto: '002',  
 TasaOCuota: '0.04000',  
 TipoFactor: 'Tasa',
```

## Datos de los Impuestos

```javascript
TotalImpuestosTrasladados: '1.00',  
TotalImpuestosRetenidos: '1.00',  
  
  
//Retenciones  
  
Importe: '1.00',  
Impuesto: '002',  
  
  
// Traslados      
Base: '1.00',  
Importe: '1.00',  
Impuesto: '002',  
TasaOCuota: '0.160000',  
TipoFactor: 'Tasa',  
    
```

##   
Certificados de Sello Digital

## 

certificados para realizar pruebas del [SAT](http://omawww.sat.gob.mx/tramitesyservicios/Paginas/certificado_sello_digital.htm)### NoCertificado

Es el número que identifica al certificado de sello digital del emisor, el cual lo incluye en el comprobante fiscal el sistema que utiliza el contribuyente para la emisión.### Certificado

Es el contenido del certificado del sello digital del emisor y lo integra el sistema que utiliza el contribuyente para la emisión del comprobante fiscal.###   
Sello

Es el sello digital del comprobante fiscal generado con el certificado de sello digital del contribuyente emisor del comprobante; éste funge como la firma del emisor del comprobante y lo integra el sistema que utiliza el contribuyente para la emisión del comprobante.
