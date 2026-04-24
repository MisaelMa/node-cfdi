import { Router } from 'express';
import * as transform from '@cfdi/transform';

const router = Router();

router.post('/normalize', (req, res) => {
  const { text } = req.body as { text: string };

  if (!text) {
    return res.status(400).json({ error: 'Se requiere "text" en el body' });
  }

  const normalizeSpace = (transform as any).normalizeSpace;
  if (typeof normalizeSpace !== 'function') {
    return res.status(500).json({ error: 'normalizeSpace no disponible' });
  }

  res.json({
    original: text,
    normalized: normalizeSpace(text),
  });
});

router.get('/', (_req, res) => {
  res.json({ exports: Object.keys(transform) });
});

export default router;
