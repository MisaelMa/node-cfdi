const path = require('node:path');
const { Router } = require('express');
const { Certificate, PrivateKey } = require('@cfdi/csd');
const { FILES_DIR } = require('../config.cjs');

const CERT_PATH = path.join(FILES_DIR, 'certificados/LAN7008173R5.cer');
const KEY_PATH = path.join(FILES_DIR, 'certificados/LAN7008173R5.key');
const PASSWORD = '12345678a';

const router = Router();

router.get('/info', (req, res) => {
  try {
    const cert = Certificate.fromFile(CERT_PATH);
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
    res.status(500).json({ error: e.message });
  }
});

router.get('/pem', (req, res) => {
  try {
    const cert = Certificate.fromFile(CERT_PATH);
    res.set('Content-Type', 'text/plain');
    res.send(cert.toPem());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/sign', (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'Missing "data" in request body' });
    }
    const key = PrivateKey.fromFile(KEY_PATH, PASSWORD);
    const signature = key.sign(data);
    res.json({ data, signature });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/verify', (req, res) => {
  try {
    const cert = Certificate.fromFile(CERT_PATH);
    const key = PrivateKey.fromFile(KEY_PATH, PASSWORD);
    const keyBelongsToCert = key.belongsToCertificate(cert);
    res.json({
      certRfc: cert.rfc(),
      keyBelongsToCert,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
