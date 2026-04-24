import express from 'express';
import { PORT } from './config.mjs';

import catalogosRouter from './routes/cfdi-catalogos.mjs';
import rfcRouter from './routes/cfdi-rfc.mjs';
import utilsRouter from './routes/cfdi-utils.mjs';
import xmlRouter from './routes/cfdi-xml.mjs';
import jsonRouter from './routes/cfdi-2json.mjs';
import csdRouter from './routes/cfdi-csd.mjs';
import complementosRouter from './routes/cfdi-complementos.mjs';
import elementsRouter from './routes/cfdi-elements.mjs';
import xsdRouter from './routes/cfdi-xsd.mjs';
import transformRouter from './routes/cfdi-transform.mjs';
import csfRouter from './routes/cfdi-csf.mjs';

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    type: 'esm',
    endpoints: {
      '/catalogos': 'Catalogos del SAT (FormaPago, MetodoPago, etc.)',
      '/rfc/validate/:rfc': 'Validar RFC',
      '/rfc/faker': 'Generar RFC de prueba',
      '/utils/numero-a-letras': 'POST { numero, moneda? }',
      '/xml/create': 'POST crear CFDI XML (json + xml)',
      '/xml/create-xml': 'POST crear CFDI XML (solo xml)',
      '/json/parse': 'POST { xml } convertir XML a JSON',
      '/json/samples': 'GET listar XMLs de ejemplo',
      '/json/sample/:filename': 'GET parsear XML de ejemplo',
      '/csd/info': 'GET info del certificado de prueba',
      '/csd/pem': 'GET certificado en PEM',
      '/csd/sign': 'POST { data } firmar con llave privada',
      '/csd/verify': 'POST verificar llave pertenece al certificado',
      '/complementos': 'GET listar complementos disponibles',
      '/complementos/pago20': 'POST crear complemento de pago',
      '/elements/constants': 'GET constantes de elementos CFDI',
      '/xsd/schema': 'GET info del schema XSD',
      '/transform/normalize': 'POST { text } normalizar espacios',
      '/csf/parse': 'POST { path } parsear constancia fiscal',
    },
  });
});

app.use('/catalogos', catalogosRouter);
app.use('/rfc', rfcRouter);
app.use('/utils', utilsRouter);
app.use('/xml', xmlRouter);
app.use('/json', jsonRouter);
app.use('/csd', csdRouter);
app.use('/complementos', complementosRouter);
app.use('/elements', elementsRouter);
app.use('/xsd', xsdRouter);
app.use('/transform', transformRouter);
app.use('/csf', csfRouter);

app.listen(PORT, () => {
  console.log(`[ESM] Server running on http://localhost:${PORT}`);
});
