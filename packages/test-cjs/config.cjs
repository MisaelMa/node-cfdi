const path = require('node:path');
const FILES_DIR = path.resolve(__dirname, '../files');
const PORT = process.env.PORT || 3001;
module.exports = { FILES_DIR, PORT };
