import { Router } from 'express';
import path from 'node:path';
import { Certificate, PrivateKey } from '@cfdi/csd';
import { FILES_DIR } from '../config';

const router = Router();

const CERT_PATH = path.join(FILES_DIR, 'certificados/LAN7008173R5.cer');
const KEY_PATH = path.join(FILES_DIR, 'certificados/LAN7008173R5.key');
const KEY_PASSWORD = '12345678a';

router.get('/info', async (_req, res) => {
  try {
    const cert = await Certificate.fromFile(CERT_PATH);

    res.json({
      rfc: cert.rfc(),
      noCertificado: cert.noCertificado(),
      serialNumber: cert.serialNumber(),
      legalName: cert.legalName(),
      isExpired: cert.isExpired(),
      expiresAt: cert.expiresAt(),
      isCsd: cert.isCsd(),
      isFiel: cert.isFiel(),
    });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

router.get('/pem', async (_req, res) => {
  try {
    const cert = await Certificate.fromFile(CERT_PATH);
    res.set('Content-Type', 'text/plain');
    res.send(cert.toPem());
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

router.post('/sign', async (req, res) => {
  try {
    const { data } = req.body as { data: string };

    if (!data) {
      return res.status(400).json({ error: 'Se requiere "data" en el body' });
    }

    const key = await PrivateKey.fromFile(KEY_PATH, KEY_PASSWORD);
    const signature = key.sign(data);

    res.json({ data, signature });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const cert = await Certificate.fromFile(CERT_PATH);
    const key = await PrivateKey.fromFile(KEY_PATH, KEY_PASSWORD);

    const belongs = key.belongsToCertificate(cert);

    res.json({
      certRfc: cert.rfc(),
      keyBelongsToCert: belongs,
    });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

export default router;
