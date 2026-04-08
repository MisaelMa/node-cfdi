const { Router } = require('express');
const complementos = require('@cfdi/complementos');

const router = Router();

router.get('/', (req, res) => {
  try {
    const available = Object.keys(complementos).filter(name => {
      try {
        return (
          typeof complementos[name] === 'function' &&
          complementos[name].prototype
        );
      } catch {
        return false;
      }
    });
    res.json({ available });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/pago20', (req, res) => {
  try {
    const body = req.body || {};
    const { Pagos20, Pago20, Pago20Relacionado } = complementos;

    const pagos = new Pagos20();
    const pago = new Pago20();

    if (body.pago) {
      pago.setAttributes(body.pago);
    }

    if (body.relacionados && Array.isArray(body.relacionados) && Pago20Relacionado) {
      for (const rel of body.relacionados) {
        const relacionado = new Pago20Relacionado();
        relacionado.setAttributes(rel);
        pago.addRelacionado(relacionado);
      }
    }

    pagos.addPago(pago);

    res.json({
      pagos: pagos.json ? pagos.json() : pagos,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
