import { Router } from 'express';
import path from 'node:path';
import { XmlToJson } from '@cfdi/2json';
import { FILES_DIR } from '../config';

const router = Router();

router.post('/parse', (req, res) => {
  try {
    const { xml } = req.body as { xml: string };

    if (!xml) {
      return res.status(400).json({ error: 'Se requiere "xml" en el body (string XML)' });
    }

    const result = XmlToJson(xml);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

router.get('/sample/:filename', (req, res) => {
  try {
    const filePath = path.join(FILES_DIR, 'xml', req.params.filename);
    const result = XmlToJson(filePath);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

router.get('/samples', (_req, res) => {
  const fs = require('node:fs');
  const xmlDir = path.join(FILES_DIR, 'xml');
  try {
    const files = fs.readdirSync(xmlDir).filter((f: string) => f.endsWith('.xml'));
    res.json({ files });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

export default router;
