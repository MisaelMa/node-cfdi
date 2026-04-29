#!/usr/bin/env tsx
import { generate } from '../src/generate';

const args = process.argv.slice(2);
const forceDownload = args.includes('--force-download');
const skipDownload = args.includes('--skip-download');
const xlsxUrlArg = args.find(a => a.startsWith('--xlsx-url='));
const xlsxUrl = xlsxUrlArg ? xlsxUrlArg.slice('--xlsx-url='.length) : undefined;

generate({ forceDownload, skipDownload, xlsxUrl })
  .then(result => {
    console.log(`Catálogos generados en ${result.outDir}:`);
    for (const file of result.written) {
      console.log(`  ${file}`);
    }
    console.log('\nListo!');
  })
  .catch(err => {
    console.error('Error generando catálogos:');
    console.error(err.stack ?? err.message);
    if (err.cause) console.error('Cause:', err.cause);
    process.exit(1);
  });
