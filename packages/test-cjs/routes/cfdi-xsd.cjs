const { Router } = require('express');
const xsd = require('@cfdi/xsd');

const router = Router();

router.get('/schema', (req, res) => {
  try {
    const Schema = xsd.Schema || xsd.default;
    const schema = Schema.of();
    const result = {
      type: typeof schema,
    };
    if (schema.cfdi) {
      result.cfdiValidators = Object.keys(schema.cfdi);
    }
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
