const path = require('node:path');
const { Router } = require('express');
const { CFDI, Emisor, Receptor, Concepto, Impuestos } = require('@cfdi/xml');
const { FormaPago, MetodoPago, TipoComprobante } = require('@cfdi/catalogos');
const { FILES_DIR } = require('../config.cjs');

const CERT_PATH = path.join(FILES_DIR, 'certificados/LAN7008173R5.cer');
const KEY_PATH = path.join(FILES_DIR, 'certificados/LAN7008173R5.key');
const PASSWORD = '12345678a';

const router = Router();

function buildCFDI(body) {
  const cfdi = new CFDI();

  cfdi.setAttributes({
    Serie: body.serie || 'A',
    Folio: body.folio || '1',
    Fecha: body.fecha || new Date().toISOString().slice(0, 19),
    FormaPago: body.formaPago || FormaPago['01'],
    MetodoPago: body.metodoPago || MetodoPago.PUE,
    TipoDeComprobante: body.tipoComprobante || TipoComprobante.I,
    LugarExpedicion: body.lugarExpedicion || '06600',
    Moneda: body.moneda || 'MXN',
    SubTotal: body.subTotal || '1000.00',
    Total: body.total || '1160.00',
  });

  const emisor = new Emisor();
  emisor.setAttributes({
    Rfc: body.emisorRfc || 'LAN7008173R5',
    Nombre: body.emisorNombre || 'EMPRESA DE PRUEBA SA DE CV',
    RegimenFiscal: body.emisorRegimen || '601',
  });
  cfdi.comprobante(emisor);

  const receptor = new Receptor();
  receptor.setAttributes({
    Rfc: body.receptorRfc || 'XAXX010101000',
    Nombre: body.receptorNombre || 'PUBLICO EN GENERAL',
    UsoCFDI: body.receptorUsoCfdi || 'G03',
    DomicilioFiscalReceptor: body.receptorDomicilio || '06600',
    RegimenFiscalReceptor: body.receptorRegimen || '616',
  });
  cfdi.comprobante(receptor);

  const conceptos = body.conceptos || [
    {
      ClaveProdServ: '01010101',
      Cantidad: '1',
      ClaveUnidad: 'ACT',
      Descripcion: 'Producto de prueba',
      ValorUnitario: '1000.00',
      Importe: '1000.00',
      ObjetoImp: '02',
    },
  ];

  for (const c of conceptos) {
    const concepto = new Concepto();
    concepto.setAttributes(c);
    cfdi.comprobante(concepto);
  }

  const impuestos = new Impuestos();
  impuestos.setAttributes({
    TotalImpuestosTrasladados: body.totalImpuestos || '160.00',
  });
  impuestos.traslado({
    Base: body.subTotal || '1000.00',
    Impuesto: '002',
    TipoFactor: 'Tasa',
    TasaOCuota: '0.160000',
    Importe: body.totalImpuestos || '160.00',
  });
  cfdi.comprobante(impuestos);

  cfdi.certificar(CERT_PATH);
  cfdi.sellar(KEY_PATH, PASSWORD);

  return cfdi;
}

router.get('/', (req, res) => {
 const cfdi = new CFDI();

 cfdi.setAttributes({

 })

 cfdi.comprobante(
   {
     Rfc: 'XAXX010101000',
     Nombre: 'PUBLICO EN GENERAL',
     UsoCFDI: 'G03',
     DomicilioFiscalReceptor: '06600',
     RegimenFiscalReceptor: '616',
   }
 )
 res.json({ exports: cfdi.getJsonCdfi() });
})
router.post('/create', (req, res) => {
  try {
    const cfdi = buildCFDI(req.body || {});
    res.json({
      xml: cfdi.xml(),
      json: cfdi.json(),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/create-xml', (req, res) => {
  try {
    const cfdi = buildCFDI(req.body || {});
    res.set('Content-Type', 'application/xml');
    res.send(cfdi.xml());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
