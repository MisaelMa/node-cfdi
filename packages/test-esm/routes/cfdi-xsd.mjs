import { Router } from 'express';
import * as xsd from '@cfdi/xsd';

const router = Router();

router.get('/schema', (_req, res) => {
  try {
    const schema = xsd.Schema.of();
    res.json({
      type: typeof schema,
      schema: schema,
      validators: schema.cfdi
        ? Object.keys(schema.cfdi)
        : Object.keys(schema),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
