const express = require('express');
const { PORT } = require('./config.cjs');

const catalogosRouter = require('./routes/cfdi-catalogos.cjs');
const rfcRouter = require('./routes/cfdi-rfc.cjs');
const utilsRouter = require('./routes/cfdi-utils.cjs');
const xmlRouter = require('./routes/cfdi-xml.cjs');
const jsonRouter = require('./routes/cfdi-2json.cjs');
const csdRouter = require('./routes/cfdi-csd.cjs');
const complementosRouter = require('./routes/cfdi-complementos.cjs');
const elementsRouter = require('./routes/cfdi-elements.cjs');
const xsdRouter = require('./routes/cfdi-xsd.cjs');
const transformRouter = require('./routes/cfdi-transform.cjs');
const csfRouter = require('./routes/cfdi-csf.cjs');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    type: 'cjs',
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
  console.log(`[CJS] Server running on http://localhost:${PORT}`);
});
