import { Router } from 'express';
import { rfc, Rfc, RfcFaker } from '@cfdi/rfc';

const router = Router();

router.get('/validate/:rfc', (req, res) => {
  try {
    const input = req.params.rfc;
    const validation = rfc.validate(input);
    const rfcInstance = Rfc.of(input);

    res.json({
      rfc: input,
      validation,
      isFisica: rfcInstance.isFisica(),
      isMoral: rfcInstance.isMoral(),
      isGeneric: rfcInstance.isGeneric(),
      isForeign: rfcInstance.isForeign(),
      date: rfcInstance.date(),
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/faker', (_req, res) => {
  try {
    res.json({
      persona: RfcFaker.persona(),
      moral: RfcFaker.moral(),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
