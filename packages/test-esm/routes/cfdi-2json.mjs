import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { XmlToJson } from '@cfdi/2json';
import { FILES_DIR } from '../config.mjs';

const router = Router();

router.post('/parse', (req, res) => {
  try {
    const { xml } = req.body;
    if (!xml) {
      return res.status(400).json({ error: 'xml is required' });
    }
    const result = XmlToJson(xml);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/samples', (_req, res) => {
  try {
    const xmlDir = path.join(FILES_DIR, 'xml');
    const files = fs.readdirSync(xmlDir).filter(f => f.endsWith('.xml'));
    res.json({ files });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/sample/:filename', (req, res) => {
  try {
    const filePath = path.join(FILES_DIR, 'xml', req.params.filename);
    const result = XmlToJson(filePath);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
