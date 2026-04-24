const { Router } = require('express');
const csfPkg = require('@cfdi/csf');

const router = Router();

router.post('/parse', (req, res) => {
  try {
    const { path } = req.body;
    if (!path) {
      return res.status(400).json({ error: 'Missing "path" in request body' });
    }
    const csf = csfPkg.csf || csfPkg.default || csfPkg;
    const result = csf(path);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
