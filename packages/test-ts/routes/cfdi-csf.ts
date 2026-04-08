import { Router } from 'express';
import * as csfPkg from '@cfdi/csf';

const router = Router();

router.post('/parse', async (req, res) => {
  try {
    const { path: pdfPath } = req.body as { path: string };

    if (!pdfPath) {
      return res.status(400).json({ error: 'Se requiere "path" al PDF de la constancia' });
    }

    const csfFn = (csfPkg as any).csf || (csfPkg as any).default;
    if (typeof csfFn !== 'function') {
      return res.status(500).json({ error: 'csf() no disponible' });
    }

    const data = await csfFn(pdfPath);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

export default router;
