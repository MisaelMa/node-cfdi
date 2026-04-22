import { Router } from 'express';
import {
  FormaPago,
  MetodoPago,
  RegimenFiscal,
  TipoComprobante,
  UsoCFDI,
} from '@cfdi/catalogos';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    FormaPago,
    MetodoPago,
    RegimenFiscal,
    TipoComprobante,
    UsoCFDI,
  });
});

router.get('/forma-pago', (_req, res) => {
  res.json(FormaPago);
});

router.get('/metodo-pago', (_req, res) => {
  res.json(MetodoPago);
});

router.get('/regimen-fiscal', (_req, res) => {
  res.json(RegimenFiscal);
});

router.get('/tipo-comprobante', (_req, res) => {
  res.json(TipoComprobante);
});

router.get('/uso-cfdi', (_req, res) => {
  res.json(UsoCFDI);
});

export default router;
