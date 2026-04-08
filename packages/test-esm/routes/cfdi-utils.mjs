import { Router } from 'express';
import { NumeroALetras } from '@cfdi/utils';

const router = Router();

router.post('/numero-a-letras', (req, res) => {
  try {
    const { numero, moneda } = req.body;
    const converter = new NumeroALetras();
    const options = moneda ? { moneda } : undefined;
    const letras = converter.NumeroALetras(numero, options);

    res.json({ numero, letras });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
