import { dirname, resolve } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';

import { execSync } from 'node:child_process';
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

function getVersions(name) {
  try {
    const raw = execSync(`npm view ${name} versions --json 2>/dev/null`, {
      encoding: 'utf-8',
    });
    const versions = JSON.parse(raw);
    return Array.isArray(versions) ? versions : [versions];
  } catch {
    return null;
  }
}

function getDeps(nameAtVersion) {
  try {
    const raw = execSync(
      `npm view ${nameAtVersion} dependencies --json 2>/dev/null`,
      { encoding: 'utf-8' }
    );
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// Step 1: Find latest version for each publishable package
const updated = {};
const allVersionsCache = {};
const errors = [];

for (const name of publishable) {
  const versions = getVersions(name);
  if (versions) {
    allVersionsCache[name] = versions;
    updated[name] = versions[versions.length - 1];
    console.log(`  ${name}: ${updated[name]}`);
  } else {
    errors.push(name);
    console.log(`  ${name}: NOT FOUND on npm (skipped)`);
  }
}

// Step 2: Check transitive deps for non-existent versions
console.log('\nChecking transitive dependencies...');
const overrides = {};

for (const [name, version] of Object.entries(updated)) {
  const deps = getDeps(`${name}@${version}`);
  if (!deps) continue;

  for (const [depName, depVersion] of Object.entries(deps)) {
    // Skip semver ranges — npm resolves those fine
    if (/^[~^>=<|*]/.test(depVersion)) continue;

    const versions = allVersionsCache[depName] || getVersions(depName);
    if (versions) {
      allVersionsCache[depName] = versions;
      if (!versions.includes(depVersion)) {
        const latest = updated[depName] || versions[versions.length - 1];
        overrides[depName] = latest;
        console.log(
          `  ${name} -> ${depName}@${depVersion} NOT FOUND, override to ${latest}`
        );
      }
    }
  }
}

// Step 3: Write package.json
pkgJson.dependencies = updated;
if (Object.keys(overrides).length > 0) {
  pkgJson.overrides = overrides;
} else {
  delete pkgJson.overrides;
}
writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');

console.log(`\nUpdated ${Object.keys(updated).length} dependencies`);
if (Object.keys(overrides).length > 0) {
  console.log(`Added ${Object.keys(overrides).length} overrides for missing transitive deps`);
}
if (errors.length) {
  console.log(`Skipped ${errors.length}: ${errors.join(', ')}`);
}
console.log('\nRun "npm install" to install the updated versions.');
