import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rushJsonPath = resolve(__dirname, '../../rush.json');
const pkgJsonPath = resolve(__dirname, 'package.json');

const rush = JSON.parse(readFileSync(rushJsonPath, 'utf-8'));
const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));

const publishable = rush.projects
  .filter(p => p.shouldPublish)
  .map(p => p.packageName);

console.log(`Found ${publishable.length} publishable packages in rush.json\n`);

const updated = {};
const errors = [];

for (const name of publishable) {
  try {
    const raw = execSync(`npm view ${name} versions --json 2>/dev/null`, {
      encoding: 'utf-8',
    });
    const versions = JSON.parse(raw);
    const arr = Array.isArray(versions) ? versions : [versions];
    const latest = arr[arr.length - 1];
    updated[name] = latest;
    console.log(`  ${name}: ${latest}`);
  } catch {
    errors.push(name);
    console.log(`  ${name}: NOT FOUND on npm (skipped)`);
  }
}

pkgJson.dependencies = updated;
writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');

console.log(`\nUpdated ${Object.keys(updated).length} dependencies in package.json`);
if (errors.length) {
  console.log(`Skipped ${errors.length}: ${errors.join(', ')}`);
}
console.log('\nRun "npm install" to install the updated versions.');
