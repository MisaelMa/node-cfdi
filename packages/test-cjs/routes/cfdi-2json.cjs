const fs = require('node:fs');
const path = require('node:path');
const { Router } = require('express');
const { XmlToJson } = require('@cfdi/2json');
const { FILES_DIR } = require('../config.cjs');

const router = Router();

router.post('/parse', (req, res) => {
  try {
    const { xml } = req.body;
    if (!xml) {
      return res.status(400).json({ error: 'Missing "xml" in request body' });
    }
    const result = XmlToJson(xml);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/samples', (req, res) => {
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
    const xml = fs.readFileSync(filePath, 'utf-8');
    const result = XmlToJson(xml);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
