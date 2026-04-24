import { Router } from 'express';
import * as elements from '@cfdi/elements';

const router = Router();

router.get('/constants', (_req, res) => {
  const constants = {};
  const knownConstants = [
    'COMPROBANTE',
    'EMISOR',
    'RECEPTOR',
    'CONCEPTO',
    'CONCEPTOS',
    'IMPUESTOS',
    'TRASLADO',
    'TRASLADOS',
    'RETENCION',
    'RETENCIONES',
    'COMPLEMENTO',
    'ADDENDA',
  ];

  for (const key of knownConstants) {
    if (elements[key] !== undefined) {
      constants[key] = elements[key];
    }
  }

  res.json(constants);
});

router.get('/', (_req, res) => {
  res.json({
    exports: Object.keys(elements),
  });
});

export default router;
