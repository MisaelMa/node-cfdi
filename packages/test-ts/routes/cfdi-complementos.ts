import { Router } from 'express';
import * as complementos from '@cfdi/complementos';

const router = Router();

router.get('/', (_req, res) => {
  const available = Object.keys(complementos).filter(name => {
    try {
      return typeof (complementos as any)[name] === 'function'
        && (complementos as any)[name].prototype;
    } catch {
      return false;
    }
  });

  res.json({ available });
});

router.post('/pago20', (req, res) => {
  try {
    const {
      fechaPago,
      formaPago = '03',
      moneda = 'MXN',
      monto,
      doctoRelacionado,
    } = req.body;

    const Pagos20 = (complementos as any).Pagos20;
    const Pago20 = (complementos as any).Pago20;
    const Pago20Relacionado = (complementos as any).Pago20Relacionado;

    if (!Pagos20 || !Pago20) {
      return res.status(500).json({ error: 'Pago20/Pagos20 no disponible en @cfdi/complementos' });
    }

    const pagos = new Pagos20({ Version: '2.0' });

    const pago = new Pago20({
      FechaPago: fechaPago || new Date().toISOString().slice(0, 19),
      FormaDePagoP: formaPago,
      MonedaP: moneda,
      Monto: monto || '1000.00',
    });

    if (doctoRelacionado && Pago20Relacionado) {
      pago.doctoRelacionado(
        new Pago20Relacionado({
          IdDocumento: doctoRelacionado.uuid || '00000000-0000-0000-0000-000000000000',
          MonedaDR: moneda,
          NumParcialidad: doctoRelacionado.parcialidad || '1',
          ImpSaldoAnt: doctoRelacionado.saldoAnt || monto || '1000.00',
          ImpPagado: doctoRelacionado.pagado || monto || '1000.00',
          ImpSaldoInsoluto: doctoRelacionado.saldoInsoluto || '0.00',
          ObjetoImpDR: '02',
          EquivalenciaDR: '1',
        })
      );
    }

    pagos.setPago(pago);

    res.json({
      complemento: 'Pagos 2.0',
      pagos,
    });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

export default router;
