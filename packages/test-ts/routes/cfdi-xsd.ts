import { Router } from 'express';
import * as xsd from '@cfdi/xsd';

const router = Router();

router.get('/schema', (_req, res) => {
  try {
    const Schema = (xsd as any).Schema || (xsd as any).default;

    if (!Schema || typeof Schema.of !== 'function') {
      return res.status(500).json({ error: 'Schema.of() no disponible' });
    }

    const schema = Schema.of();
    const info: Record<string, unknown> = {
      type: typeof schema,
    };

    if (schema.cfdi) {
      info.cfdiValidators = Object.keys(schema.cfdi);
    }

    res.json(info);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

export default router;
