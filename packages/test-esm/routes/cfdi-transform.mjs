import { Router } from 'express';
import * as transform from '@cfdi/transform';

const router = Router();

router.post('/normalize', (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'text is required' });
    }
    const normalized = transform.normalizeSpace(text);
    res.json({ original: text, normalized });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/', (_req, res) => {
  res.json({
    exports: Object.keys(transform),
  });
});

export default router;
