import path from 'path';
import { SatResources } from './SatResources';
import type { SatVersion } from './SatResources';

const args = process.argv.slice(2);
const version = (args.find(a => a === '3.3' || a === '4.0') ||
  '4.0') as SatVersion;

const filesDir = path.resolve(__dirname, '..', '..', '..', 'files');
const outputDir = path.join(filesDir, version === '4.0' ? '4.0' : '3.3');

console.log(`Descargando recursos del SAT v${version}...`);
console.log(`Directorio: ${outputDir}`);

const sat = new SatResources({ version, outputDir });

sat
  .download()
  .then(result => {
    console.log('\nRecursos descargados:');
    console.log(`  Schema: ${result.schema}`);
    console.log(`  XSLT:   ${result.xslt}`);
    if (result.catalogSchema) {
      console.log(`  Catalogo: ${result.catalogSchema}`);
    }
    if (result.tipoDatosSchema) {
      console.log(`  TipoDatos: ${result.tipoDatosSchema}`);
    }
    console.log(`  Complementos: ${result.complementos.length} archivos`);

    if (result.added.length > 0) {
      console.log(`\n  Nuevos complementos (no existian localmente):`);
      result.added.forEach(f => console.log(`    + ${f}`));
    }

    if (result.unused.length > 0) {
      console.log(`\n  Complementos sin uso (ya no estan en el XSLT del SAT):`);
      result.unused.forEach(f => console.log(`    - ${f}`));
    }

    if (result.unused.length === 0 && result.added.length === 0) {
      console.log('\n  Complementos al dia, sin cambios.');
    }

    console.log('\nListo!');
  })
  .catch(err => {
    console.error('Error descargando recursos:', err.message);
    process.exit(1);
  });
