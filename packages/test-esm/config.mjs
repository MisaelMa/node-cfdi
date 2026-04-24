import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const FILES_DIR = path.resolve(__dirname, '../files');
export const PORT = process.env.PORT || 3002;
