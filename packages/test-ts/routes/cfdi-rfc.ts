import { Router } from 'express';
import { rfc, Rfc, RfcFaker } from '@cfdi/rfc';

const router = Router();

router.get('/validate/:rfc', (req, res) => {
  const input = req.params.rfc;

  try {
    const result = rfc.validate(input);
    const rfcObj = Rfc.of(input);

    res.json({
      ...result,
      isFisica: rfcObj.isFisica(),
      isMoral: rfcObj.isMoral(),
      isGeneric: rfcObj.isGeneric(),
      isForeign: rfcObj.isForeign(),
      date: rfcObj.obtainDate(),
    });
  } catch (e) {
    res.status(400).json({
      isValid: false,
      rfc: input,
      error: (e as Error).message,
    });
  }
});

router.get('/faker', (_req, res) => {
  res.json({
    personaFisica: RfcFaker.persona(),
    personaMoral: RfcFaker.moral(),
  });
});

export default router;
