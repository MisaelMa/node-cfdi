const { Router } = require('express');
const {
  FormaPago,
  MetodoPago,
  RegimenFiscal,
  TipoComprobante,
  UsoCFDI,
} = require('@cfdi/catalogos');

const router = Router();

router.get('/', (req, res) => {
  res.json({
    FormaPago,
    MetodoPago,
    RegimenFiscal,
    TipoComprobante,
    UsoCFDI,
  });
});

router.get('/forma-pago', (req, res) => {
  res.json(FormaPago);
});

router.get('/metodo-pago', (req, res) => {
  res.json(MetodoPago);
});

router.get('/regimen-fiscal', (req, res) => {
  res.json(RegimenFiscal);
});

router.get('/tipo-comprobante', (req, res) => {
  res.json(TipoComprobante);
});

router.get('/uso-cfdi', (req, res) => {
  res.json(UsoCFDI);
});

module.exports = router;
