import { Router } from 'express';
import * as elements from '@cfdi/elements';

const router = Router();

router.get('/constants', (_req, res) => {
  const constants = [
    'COMPROBANTE', 'EMISOR', 'RECEPTOR', 'CONCEPTOS',
    'CONCEPTO', 'IMPUESTOS', 'TRASLADOS', 'TRASLADO', 'COMPLEMENTO',
  ];

  const result: Record<string, string> = {};
  for (const name of constants) {
    if ((elements as any)[name] !== undefined) {
      result[name] = (elements as any)[name];
    }
  }

  res.json(result);
});

router.get('/', (_req, res) => {
  res.json({ exports: Object.keys(elements) });
});

export default router;
