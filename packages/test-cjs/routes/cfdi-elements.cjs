const { Router } = require('express');
const elements = require('@cfdi/elements');

const router = Router();

router.get('/constants', (req, res) => {
  const constants = [
    'COMPROBANTE',
    'EMISOR',
    'RECEPTOR',
    'CONCEPTOS',
    'CONCEPTO',
    'IMPUESTOS',
    'TRASLADOS',
    'TRASLADO',
    'COMPLEMENTO',
  ];
  const result = {};
  for (const name of constants) {
    if (elements[name] !== undefined) {
      result[name] = elements[name];
    }
  }
  res.json(result);
});

router.get('/', (req, res) => {
  res.json({ exports: Object.keys(elements) });
});

module.exports = router;
