import { Router } from 'express';
import { NumeroALetras } from '@cfdi/utils';

const router = Router();
const converter = new NumeroALetras();

router.post('/numero-a-letras', (req, res) => {
  const { numero, moneda } = req.body as {
    numero: number;
    moneda?: { plural?: string; singular?: string; centPlural?: string; centSingular?: string };
  };

  if (numero == null) {
    return res.status(400).json({ error: 'Se requiere "numero" en el body' });
  }

  const options = moneda ?? {
    plural: 'PESOS MEXICANOS',
    singular: 'PESO MEXICANO',
    centPlural: 'CENTAVOS',
    centSingular: 'CENTAVO',
  };

  const letras = converter.NumeroALetras(numero, options);
  res.json({ numero, letras });
});

export default router;
