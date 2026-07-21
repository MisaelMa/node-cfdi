// Entrypoint BROWSER-SAFE de @cfdi/xml.
//
// Expone SOLO la construcción del CFDI 4.0: la clase base `Comprobante`
// (comprobante/emisor/receptor/concepto/impuesto/informacionGlobal/relacionados
// + getJsonCdfi/getXmlCdfi) y los elements. NO exporta `./cfdi` (clase `CFDI`),
// que arrastra `fs`, `@cfdi/csd` y `@saxon-he/cli` — Node-only.
//
// Uso típico en el front:
//
//   import { Comprobante, Emisor, Receptor, Concepto } from '@cfdi/xml/browser';
//   const cfdi = new Comprobante();        // sin Config → no toca fs/cert
//   cfdi.comprobante({ Serie, Folio, ... });
//   cfdi.emisor(new Emisor({ ... }));
//   const json = cfdi.getJsonCdfi();       // se envía al server para timbrar
//
// La VALIDACIÓN XSD (AJV) queda como no-op aquí (los schemas se cargan desde
// disco). La autoridad de validación es el server.
export * from './elements/Comprobante';
export * from './elements/Relacionado';
export * from './elements/Emisor';
export * from './elements/Receptor';
export * from './elements/Concepto';
export { Concepto as Concepts } from './elements/Concepto';
export * from './elements/Impuestos';
export * from './types';
