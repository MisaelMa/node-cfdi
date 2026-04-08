import { Router } from 'express';
import * as complementos from '@cfdi/complementos';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    available: Object.keys(complementos),
  });
});

router.post('/pago20', (req, res) => {
  try {
    const body = req.body || {};
    const pagos = new complementos.Pagos20();
    const pago = new complementos.Pago20();

    pago.setAttributes({
      FechaPago:
        body.fechaPago || new Date().toISOString().slice(0, 19),
      FormaDePagoP: body.formaPago || '01',
      MonedaP: body.moneda || 'MXN',
      Monto: body.monto || '1000.00',
    });

    if (body.relacionado) {
      const relacionado = new complementos.Pago20Relacionado();
      relacionado.setAttributes({
        IdDocumento: body.relacionado.idDocumento,
        MonedaDR: body.relacionado.moneda || 'MXN',
        NumParcialidad: body.relacionado.numParcialidad || '1',
        ImpSaldoAnt: body.relacionado.impSaldoAnt || '1000.00',
        ImpPagado: body.relacionado.impPagado || '1000.00',
        ImpSaldoInsoluto:
          body.relacionado.impSaldoInsoluto || '0.00',
      });
      pago.addRelacionado(relacionado);
    }

    pagos.addPago(pago);

    res.json({
      pagos: pagos.toJSON ? pagos.toJSON() : pagos,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
