import { Router } from 'express';
import * as csfPkg from '@cfdi/csf';

const router = Router();

router.post('/parse', (req, res) => {
  try {
    const { path } = req.body;
    if (!path) {
      return res.status(400).json({ error: 'path is required' });
    }
    const csf = csfPkg.default || csfPkg.csf || csfPkg;
    const result = typeof csf === 'function' ? csf(path) : csf;
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
