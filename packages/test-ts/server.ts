import express from 'express';
import { PORT } from './config';

import catalogosRouter from './routes/cfdi-catalogos';
import rfcRouter from './routes/cfdi-rfc';
import utilsRouter from './routes/cfdi-utils';
import xmlRouter from './routes/cfdi-xml';
import jsonRouter from './routes/cfdi-2json';
import csdRouter from './routes/cfdi-csd';
import complementosRouter from './routes/cfdi-complementos';
import elementsRouter from './routes/cfdi-elements';
import xsdRouter from './routes/cfdi-xsd';
import transformRouter from './routes/cfdi-transform';
import csfRouter from './routes/cfdi-csf';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    type: 'ts',
    endpoints: {
      '/catalogos': 'Catálogos del SAT (FormaPago, MetodoPago, etc.)',
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
  console.log(`[TS] Server running on http://localhost:${PORT}`);
});
