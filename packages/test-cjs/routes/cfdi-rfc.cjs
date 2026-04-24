const { Router } = require('express');
const { rfc, Rfc, RfcFaker } = require('@cfdi/rfc');

const router = Router();

router.get('/validate/:rfc', (req, res) => {
  try {
    const input = req.params.rfc;
    const validation = rfc.validate(input);
    const rfcObj = Rfc.of(input);
    res.json({
      rfc: input,
      validation,
      isFisica: rfcObj.isFisica(),
      isMoral: rfcObj.isMoral(),
      isGeneric: rfcObj.isGeneric(),
      isForeign: rfcObj.isForeign(),
      date: rfcObj.date(),
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/faker', (req, res) => {
  try {
    res.json({
      persona: RfcFaker.persona(),
      moral: RfcFaker.moral(),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
